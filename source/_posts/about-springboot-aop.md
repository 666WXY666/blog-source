---
title: 使用SpringBoot AOP 记录操作日志、异常日志
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/spring.png
tags: [SpringBoot,AOP]
categories: [SpringBoot]
keywords: [SpringBoot Aop,记录操作日志,异常日志]
abbrlink: 4598d3ed
date: 2020-02-25 15:22:53
description: 使用SpringBoot AOP 记录操作日志、异常日志。
---

平时我们在做项目时经常需要对一些重要功能操作记录日志，方便以后跟踪是谁在操作此功能；我们在操作某些功能时也有可能会发生异常，但是每次发生异常要定位原因我们都要到服务器去查询日志才能找到，而且也不能对发生的异常进行统计，从而改进我们的项目，要是能做个功能专门来记录操作日志和异常日志那就好了， 当然我们肯定有方法来做这件事情，而且也不会很难，我们可以在需要的方法中增加记录日志的代码，和在每个方法中增加记录异常的代码，最终把记录的日志存到数据库中。听起来好像很容易，但是我们做起来会发现，做这项工作很繁琐，而且都是在做一些重复性工作，还增加大量冗余代码，这种方式记录日志肯定是不可行的。

我们以前学过Spring 三大特性，IOC（控制反转），DI（依赖注入），AOP（面向切面），那其中AOP的主要功能就是将日志记录，性能统计，安全控制，事务处理，异常处理等代码从业务逻辑代码中划分出来。今天我们就来用SpringBoot Aop 来做日志记录，好了，废话说了一大堆还是上货吧。

## :boom: 创建日志记录表、异常日志表，表结构如下：
异常日志表

![异常日志表](https://s2.ax1x.com/2020/02/25/3YajRx.png)

操作日志表

![操作日志表](https://s2.ax1x.com/2020/02/25/3YdQoj.png)

## :boom: 添加Maven依赖
```BASH
<!-- Spring Boot 面向切面AOP -->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-aop</artifactId>
</dependency>
<dependency>
    <groupId>org.aspectj</groupId>
    <artifactId>aspectjweaver</artifactId>
    <version>1.8.13</version>
</dependency>
```

## :boom: 创建操作日志注解类Log.java
```JAVA
package com.scaffolding.demo.annotation;

import java.lang.annotation.*;

/**
 * 自定义操作日志注解
 *
 * @author: Xuxu
 * @date: 2020-02-17 18:35项目日志
 **/
@Target(ElementType.METHOD) //注解放置的目标位置,METHOD是可注解在方法级别上
@Retention(RetentionPolicy.RUNTIME) //注解在哪个阶段执行
@Documented
public @interface Log {
    String operationModule() default ""; // 操作模块

    String operationType() default "";   // 操作类型

    String operationDesc() default "";   // 操作说明
}
```

## :boom: 创建切面类记录操作日志和异常日志

```JAVA
package com.scaffolding.demo.config;

import com.alibaba.fastjson.JSON;
import com.scaffolding.demo.annotation.Log;
import com.scaffolding.demo.common.BaseController;
import com.scaffolding.demo.sys.model.ExceptionLog;
import com.scaffolding.demo.sys.model.OperationLog;
import com.scaffolding.demo.sys.service.ExceptionLogService;
import com.scaffolding.demo.sys.service.OperationLogService;
import com.scaffolding.demo.sys.service.UserService;
import com.scaffolding.demo.utils.IPUtil;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.DefaultParameterNameDiscoverer;
import org.springframework.core.ParameterNameDiscoverer;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * 切面处理类，操作日志 异常日志记录处理
 *
 * @author: Xuxu
 * @date: 2020-02-17 18:46
 **/
@Slf4j
@Aspect
@Component
public class OperationLogAspect extends BaseController {
    /**
     * 操作版本号
     */
    @Value("${app.version}")
    private String version;
    @Autowired
    private OperationLogService operationLogService;
    @Autowired
    private ExceptionLogService exceptionLogService;
    @Autowired
    private UserService userService;

    /**
     * 设置操作日志切入点 记录操作日志 在注解的位置切入代码
     */
    @Pointcut("@annotation(com.scaffolding.demo.annotation.Log)")
    public void operationLogPointCut() {
    }

    /**
     * 设置操作异常切入点记录异常日志 扫描所有controller包下操作
     */
    @Pointcut("execution(* com.scaffolding.demo.sys.controller..*.*(..))")
    public void operationExceptionLogPointCut() {
    }

    /**
     * 正常返回通知，拦截用户操作日志，连接点正常执行完成后执行， 如果连接点抛出异常，则不会执行
     *
     * @param joinPoint 切入点
     * @param results   返回结果
     */
    @AfterReturning(value = "operationLogPointCut()", returning = "results")
    public void saveOperationLog(JoinPoint joinPoint, Object results) {
        log.info("开始执行拦截用户操作日志");
        // 获取RequestAttributes
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
        // 从获取RequestAttributes中获取HttpServletRequest的信息
        HttpServletRequest request = (HttpServletRequest) Objects.requireNonNull(requestAttributes)
                .resolveReference(RequestAttributes.REFERENCE_REQUEST);

        OperationLog operationLog = new OperationLog();
        try {
            // 从切面织入点处通过反射机制获取织入点处的方法
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            // 获取切入点所在的方法
            Method method = signature.getMethod();
            // 获取操作
            Log log = method.getAnnotation(Log.class);
            if (log != null) {
                // 操作模块
                operationLog.setModule(log.operationModule());
                // 操作类型
                operationLog.setType(log.operationType());
                // 操作描述
                operationLog.setDescription(log.operationDesc());
            }
            // 获取请求的类名
            String className = joinPoint.getTarget().getClass().getName();
            // 获取请求的方法名
            String methodName = method.getName();
            // 请求方法
            operationLog.setMethod(className + "." + methodName);
            // 请求的参数
            Map<String, Object> rtnMap = convertMap(joinPoint, method);
            // 将参数所在的数组转换成json
            String params = JSON.toJSONString(rtnMap);
            // 请求参数
            operationLog.setRequestParam(params);
            // 返回结果
            operationLog.setResponseParam(JSON.toJSONString(results));
            // 请求用户ID
            operationLog.setUserId(getUserId());
            // 请求用户名称
            operationLog.setUserName(userService.getById(getUserId()).getNickName());
            // 请求IP
            operationLog.setIp(IPUtil.getRequestIpAddress(request));
            // 请求URI
            operationLog.setUri(request.getRequestURI());
            // 创建时间
            operationLog.setCreateTime(LocalDateTime.now());
            // 操作版本
            operationLog.setVersion(version);
            operationLogService.save(operationLog);
        } catch (Exception e) {
            log.error("拦截用户操作日志异常");
            e.printStackTrace();
        }
    }

    /**
     * 异常返回通知，用于拦截异常日志信息 连接点抛出异常后执行
     *
     * @param joinPoint 切入点
     * @param exception 异常信息
     */
    @AfterThrowing(pointcut = "operationExceptionLogPointCut()", throwing = "exception")
    public void saveExceptionLog(JoinPoint joinPoint, Throwable exception) {
        log.info("开始拦截异常日志信息");
        // 获取RequestAttributes
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
        // 从获取RequestAttributes中获取HttpServletRequest的信息
        HttpServletRequest request = (HttpServletRequest) Objects.requireNonNull(requestAttributes)
                .resolveReference(RequestAttributes.REFERENCE_REQUEST);

        ExceptionLog exceptionLog = new ExceptionLog();
        try {
            // 从切面织入点处通过反射机制获取织入点处的方法
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            // 获取切入点所在的方法
            Method method = signature.getMethod();
            // 获取请求的类名
            String className = joinPoint.getTarget().getClass().getName();
            // 获取请求的方法名
            String methodName = method.getName();
            // 请求的参数
            Map<String, Object> rtnMap = convertMap(joinPoint, method);
            // 将参数所在的数组转换成json
            String params = JSON.toJSONString(rtnMap);

            // 请求参数
            exceptionLog.setRequestParam(params);
            // 请求方法名
            exceptionLog.setMethod(className + "." + methodName);
            // 异常名称
            exceptionLog.setName(exception.getClass().getName());
            // 异常信息
            exceptionLog.setMessage(stackTraceToString(exception.getClass().getName(), exception.getMessage(), exception.getStackTrace()));
            // 操作员ID
            exceptionLog.setUserId(getUserId());
            // 操作员名称
            exceptionLog.setUserName(userService.getById(getUserId()).getNickName());
            // 操作URI
            exceptionLog.setUri(request.getRequestURI());
            // 操作员IP
            exceptionLog.setIp(IPUtil.getRequestIpAddress(request));
            // 操作版本号
            exceptionLog.setVersion(version);
            // 发生异常时间
            exceptionLog.setCreateTime(LocalDateTime.now());

            exceptionLogService.save(exceptionLog);
        } catch (Exception e) {
            log.error("拦截异常日志信息发生异常");
            e.printStackTrace();
        }
    }

    /**
     * 转换request 请求参数
     *
     * @param joinPoint
     * @param method
     * @return
     */
    private Map<String, Object> convertMap(JoinPoint joinPoint, Method method) {
        // 参数值
        Object[] args = joinPoint.getArgs();
        ParameterNameDiscoverer parameterNameDiscoverer = new DefaultParameterNameDiscoverer();
        String[] parameterNames = parameterNameDiscoverer.getParameterNames(method);
        Map<String, Object> paramMap = new HashMap<>();
        for (int i = 0; i < Objects.requireNonNull(parameterNames).length; i++) {
            paramMap.put(parameterNames[i], args[i].toString());
        }
        return paramMap;
    }

    /**
     * 转换异常信息为字符串
     *
     * @param exceptionName    异常名称
     * @param exceptionMessage 异常信息
     * @param elements         堆栈信息
     */
    private String stackTraceToString(String exceptionName, String exceptionMessage, StackTraceElement[] elements) {
        StringBuffer stringBuffer = new StringBuffer();
        for (StackTraceElement stet : elements) {
            stringBuffer.append(stet + "\n");
        }
        return exceptionName + ":" + exceptionMessage + "\n\t" + stringBuffer.toString();
    }
}
```

附上获取IP地址Util类：

```JAVA
package com.scaffolding.demo.utils;

import org.apache.commons.lang3.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * @author: Xuxu
 * @date: 2020-02-17 20:05
 **/
public class IPUtil {
    /**
     * 获取请求IP
     *
     * @param request
     * @return
     */
    public static String getRequestIpAddress(HttpServletRequest request) {
        String ipAddress = null;
        ipAddress = request.getHeader("X-Real_IP");
        if (StringUtils.isEmpty(ipAddress) || StringUtils.isBlank(ipAddress) || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("x-forwarded-for");
        }
        if (StringUtils.isEmpty(ipAddress) || StringUtils.isBlank(ipAddress) || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("Proxy-Client-IP");
        }
        if (StringUtils.isEmpty(ipAddress) || StringUtils.isBlank(ipAddress) || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("WL-Proxy-Client-IP");
        }
        if (StringUtils.isEmpty(ipAddress) || StringUtils.isBlank(ipAddress) || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr();
            if (ipAddress.equals("127.0.0.1")) {
                // 根据网卡取本机配置的IP
                InetAddress inet = null;
                try {
                    inet = InetAddress.getLocalHost();
                } catch (UnknownHostException e) {
                    e.printStackTrace();
                }
                ipAddress = inet.getHostAddress();
            }

        }
        // 对于通过多个代理的情况，第一个IP为客户端真实IP,多个IP按照','分割
        if (ipAddress != null && ipAddress.length() > 15) {
            if (ipAddress.indexOf(",") > 0) {
                ipAddress = ipAddress.substring(0, ipAddress.indexOf(","));
            }
        }
        return ipAddress;
    }
}
```

## :boom: 在Controller层方法添加@Log注解

![@Log注解](https://s2.ax1x.com/2020/02/25/3Y0Vr8.png)

## :boom: 操作日志、异常日志查询功能

![操作日志](https://s2.ax1x.com/2020/02/25/3YBEWR.png)

![异常日志](https://s2.ax1x.com/2020/02/25/3YBpLT.png)
