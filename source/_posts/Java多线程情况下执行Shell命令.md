---
title: Java多线程情况下执行Shell命令
pin: false
toc: true
icons: []
tags: [Java,线程,Shell]
categories: [Java,线程,Shell]
keywords: [Java,线程,Shell命令,命令]
abbrlink: c4fc7445
date: 2020-12-26 15:56:16
headimg:
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/thread.png
description: 记录一下Java多线程情况下如何执行Shell命令。
---

因为代码太多，所以我放入折叠框了，点击就能查看。相信各位都能看懂代码。

### :fire: 命令执行入口
{% folding green, IExecCommandServer %}
```
import java.util.List;

/**
 * @author xuxu
 * @date 2020/12/23 12:17
 */
public interface IExecCommandServer {

    /**
     * 执行command
     *
     * @param job
     * @param cmd
     * @param dir
     * @return
     */
    List<String> execCommand(ShellJob job, List<String> cmd, String dir);

}
```
{% endfolding %}

## :fire: 命令执行入口的实现
{% folding green, ExecCommandServerImpl %}
```
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

/**
 * @author xuxu
 * @date 2020/12/23 12:18
 */

@Slf4j
@Service
public class ExecCommandServerImpl implements IExecCommandServer {

    @Override
    public List<String> execCommand(ShellJob job, List<String> cmd, String dir) {
        Process process;
        try {
            log.info("当前执行cmd为：{}", cmd.toString());
            ProcessBuilder processBuilder = new ProcessBuilder(cmd);
            // 设置此进程生成器的工作目录
            if (StringUtils.isNotEmpty(dir)) {
                processBuilder.directory(new File(dir));
            }
            processBuilder.redirectErrorStream(true);
            // 此进程生成器是否合并标准错误和标准输出
            process = processBuilder.start();
            if (job != null) {
                job.setProcess(process);
            }
            // 读流
            List<String> lineString = readFromStream(process.getInputStream());
            if (process.waitFor() == 0) {
                return lineString;
            }
        } catch (Exception e) {
            log.error("执行命令异常：{}", e);
        }
        return null;
    }

    /**
     * 从流中读取数据，防止进程僵死
     *
     * @param inputStream
     */
    private static List<String> readFromStream(InputStream inputStream) {
        List<String> lineList = new ArrayList<>();
        InputStreamReader isr = null;
        BufferedReader br = null;
        try {
            isr = new InputStreamReader(inputStream);
            br = new BufferedReader(isr);
            String line;
            while ((line = br.readLine()) != null) {
                if (StringUtils.isEmpty(line)) {
                    try {
                        log.info("读取输出只是为了防止进程僵死");
                    } catch (Exception ex) {
                        log.error("读取shell输出流错误");
                    }
                }
                lineList.add(line);
            }
            return lineList;
        } catch (IOException e) {
            // do nothing，当进程被kill时，会报IOException
        } catch (Exception e) {
            log.error("读取shell输出流异常：{}", e);
        } finally {
            try {
                if (inputStream != null) {
                    inputStream.close();
                }
                if (isr != null) {
                    isr.close();
                }
                if (br != null) {
                    br.close();
                }
            } catch (Exception ex) {
                log.error("关闭输入流异常：{}", ex);
            }
        }
        return null;
    }

}
```
{% endfolding %}

## :fire: 利用以下实现每次Job调起都会向线程池提交一个对应的Job
{% folding green, ShellJob %}
```
import com.scaffolding.example.utils.SpringUtils;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * 可以是任何一个Job，每次Job调起都会向线程池提交一个对应的Job
 *
 * @author xuxu
 * @date 2020/12/26 10:22
 */
@Slf4j
@Data
public class ShellJob implements Runnable {

    private IExecCommandServer commandServer;

    /**
     * 设置进程生成器的工作目录
     */
    private final String workspace;

    /**
     * 执行的命令
     */
    private final List<String> cmd;

    /**
     * Job标识
     */
    private final Long jobId;

    /**
     * 终止线程使用
     */
    private volatile Process process;

    /**
     * 记录线程状态
     */
    private static AtomicBoolean killed = new AtomicBoolean(false);

    /**
     * 构造方法
     *
     * @param workspace
     * @param cmd
     * @param jobId
     */
    public ShellJob(String workspace, List<String> cmd, Long jobId) {
        this.workspace = workspace;
        this.cmd = cmd;
        this.jobId = jobId;
        this.commandServer = SpringUtils.getBean(IExecCommandServer.class);
    }

    @Override
    public void run() {
        log.info("Job开始执行，Job标识为：{}", jobId);
        Thread.currentThread().setName("shell-job-" + this.jobId);
        List<String> printString = new ArrayList<>();
        try {
            printString = commandServer.execCommand(this, cmd, workspace);
            log.info("Job执行结束, 执行结果：{}", printString.toString());
        } catch (Exception e) {
            log.info("Job执行异常：{}", e.toString() + "：" + e.getMessage());
            JobManager.removeJob(this.getJobId());
            // 回调的操作
            callback("Fail");
        }
        // 根据需求执行自己的逻辑
        if (!killed.get()) {
            if (CollectionUtils.isNotEmpty(printString)) {
                // 回调的操作
                callback("Success");
            } else {
                // 回调的操作
                callback("Fail");
            }
        }
        // 无论执行失败还是成功都要移除Job
        JobManager.removeJob(this.getJobId());
    }

    /**
     * 停止进程
     */
    public synchronized void stop() {
        killed.set(true);
        process.destroy();
        JobManager.removeJob(this.getJobId());
    }

    /**
     * 回调方法，可根据需求自行实现。
     */
    private void callback(String msg) {
        log.info("Job执行状态：{}", msg);
        // 可以写点回调的逻辑
    }

}
```
{% endfolding %}

## :fire: Job管理器
{% folding green, JobManager %}
```
import lombok.extern.slf4j.Slf4j;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Job管理器
 *
 * @author xuxu
 * @date 2020/12/26 10:55
 */
@Slf4j
public class JobManager {
    /**
     * 记录Job
     */
    private static final Map<Long, ShellJob> JOB_MAP = new ConcurrentHashMap<>();

    /**
     * 添加Job
     *
     * @param job
     * @return
     */
    public static boolean addJob(ShellJob job) {
        if (JOB_MAP.containsKey(job.getJobId())) {
            log.warn("添加Job失败, Job已经存在, Job标识：{}", job.getJobId());
            return false;
        }
        log.info("添加Job成功, Job标识：{}", job.getJobId());
        JOB_MAP.put(job.getJobId(), job);
        return true;
    }

    /**
     * 删除Job
     *
     * @param jobId
     * @return
     */
    public static void removeJob(Long jobId) {
        if (!JOB_MAP.containsKey(jobId)) {
            log.warn("删除Job失败, Job不存在, Job标识：{}", jobId);
            return;
        }
        log.info("删除Job成功, Job标识：{}", jobId);
        JOB_MAP.remove(jobId);
    }

    /**
     * Kill Job
     *
     * @param jobId
     * @return
     */
    public static boolean killJob(Long jobId) {
        log.info("开始终止Job, Job标识：{}", jobId);
        if (JOB_MAP.containsKey(jobId)) {
            JOB_MAP.get(jobId).stop();
            log.info("终止Job成功, Job标识：{}", jobId);
            return true;
        }
        log.info("终止Job失败, Job不存在, Job标识：{}", jobId);
        return false;
    }

    /**
     * 停止所有Job
     */
    public static void stopAll() {
        for (Map.Entry<Long, ShellJob> entry : JOB_MAP.entrySet()) {
            entry.getValue().stop();
        }
    }

}
```
{% endfolding %}

## :fire: 测试
{% folding green, ExecCommandController %}
```
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;

import static java.util.concurrent.Executors.newFixedThreadPool;

/**
 * @author xuxu
 * @date 2020/12/26 15:12
 */
@Slf4j
@RestController
@RequestMapping("/linux")
public class ExecCommandController {

    private final static ExecutorService EXECUTE = newFixedThreadPool(Runtime.getRuntime().availableProcessors() + 1);

    /**
     * 执行命令
     */
    @GetMapping("/exec")
    public void exec() {
        // 具体业务场景根据自己情况而定，我这里只举了个例子。
        for (int j = 1; j <= 3; j++) {
            List<String> cmd = new ArrayList<>();
            cmd.add("D:\\Software\\Git\\bin\\bash.exe");
            cmd.add("-c");
            cmd.add("curl -u admin:Xu19960211 -T \"C:/test/1607428204749_" + j + ".tar\" -X PUT \"http://localhost:8081/artifactory/DEV/TEST/1607428204749_" + j + ".tar\"");
            // 这里我用for循环的下标作为Job的标识
            ShellJob job = new ShellJob(System.getProperty("user.dir"), cmd, (long) j);
            if (JobManager.addJob(job)) {
                // 执行线程
                EXECUTE.execute(job);
            }
        }
    }

    /**
     * 停止执行命令
     */
    @GetMapping("/kill")
    public void kill(Long jobId) {
        boolean result = JobManager.killJob(jobId);
        if (result) {
            log.info("Kill job success");
        } else {
            log.info("Kill job fail");
        }
    }
}
```
{% endfolding %}

## :fire: Spring工具类，方便在非spring管理环境中获取bean
{% folding green, SpringUtils %}
```
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
 * spring工具类 方便在非spring管理环境中获取bean
 *
 * @author xuxu
 * @date 2020/12/26 12:28
 */

@Component
public final class SpringUtils implements BeanFactoryPostProcessor, ApplicationContextAware {
    /**
     * Spring应用上下文环境
     */
    private static ConfigurableListableBeanFactory beanFactory;
    private static ApplicationContext applicationContext = null;

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        SpringUtils.beanFactory = beanFactory;
    }

    /**
     * 获取对象
     *
     * @param name
     * @return Object 一个以所给名字注册的bean的实例
     * @throws org.springframework.beans.BeansException
     */
    @SuppressWarnings("unchecked")
    public static <T> T getBean(String name) throws BeansException {
        return (T) beanFactory.getBean(name);
    }

    /**
     * 获取类型为requiredType的对象
     *
     * @param clz
     * @return
     * @throws org.springframework.beans.BeansException
     */
    public static <T> T getBean(Class<T> clz) throws BeansException {
        T result = (T) beanFactory.getBean(clz);
        return result;
    }

    /**
     * 如果BeanFactory包含一个与所给名称匹配的bean定义，则返回true
     *
     * @param name
     * @return boolean
     */
    public static boolean containsBean(String name) {
        return beanFactory.containsBean(name);
    }

    /**
     * 判断以给定名字注册的bean定义是一个singleton还是一个prototype。 如果与给定名字相应的bean定义没有被找到，将会抛出一个异常（NoSuchBeanDefinitionException）
     *
     * @param name
     * @return boolean
     * @throws org.springframework.beans.factory.NoSuchBeanDefinitionException
     */
    public static boolean isSingleton(String name) throws NoSuchBeanDefinitionException {
        return beanFactory.isSingleton(name);
    }

    /**
     * @param name
     * @return Class 注册对象的类型
     * @throws org.springframework.beans.factory.NoSuchBeanDefinitionException
     */
    public static Class<?> getType(String name) throws NoSuchBeanDefinitionException {
        return beanFactory.getType(name);
    }

    /**
     * 如果给定的bean名字在bean定义中有别名，则返回这些别名
     *
     * @param name
     * @return
     * @throws org.springframework.beans.factory.NoSuchBeanDefinitionException
     */
    public static String[] getAliases(String name) throws NoSuchBeanDefinitionException {
        return beanFactory.getAliases(name);
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        if (SpringUtils.applicationContext == null) {
            SpringUtils.applicationContext = applicationContext;
        }

    }

    /**
     * 获取applicationContext
     *
     * @return
     */
    public static ApplicationContext getApplicationContext() {
        return applicationContext;
    }

}
```
{% endfolding %}