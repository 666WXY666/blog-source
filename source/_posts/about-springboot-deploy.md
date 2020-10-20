---
title: SpringBoot两种打包方式
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/spring.png
abbrlink: b4831a5e
date: 2019-11-29 10:00:38
tags: [SpringBoot,SpringBoot打包]
categories: [SpringBoot]
keywords: [SpringBoot部署,Maven插件打包,IDEA自带打包]
description: SpringBoot自带Tomcat，所以我们的项目可以单独部署，不需要依赖Window、Linux系统中的服务器，所以打包出来的 Jar 包是可以直接运行的。
---

相信所有人都喜欢简洁的打包方式，不需要去敲命令来执行打包，所以今天介绍两种常用的打包方式。

## Maven插件打包

在项目 `pom.xml` 文件中 build 标签的代码为朋友们奉上，其中的注意的点都有注释
```BASH
<build>
    <!--打包项目名（根据自己项目定）-->
    <finalName>contests</finalName>
    <plugins>
        <!-- 设置jdk版本为1.8 -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <configuration>
                <source>1.8</source>
                <target>1.8</target>
                <compilerArguments>
                    <!--如果是在Windows下面开发，${java.home}/lib/rt.jar ; ${java.home，这里中间是；号隔开，Linux中则是：号隔开，这是个很坑的地方我提一下。-->
                    <bootclasspath>${java.home}/lib/rt.jar;${java.home}/lib/jce.jar</bootclasspath>
                </compilerArguments>
            </configuration>
        </plugin>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <fork>true</fork> <!-- 如果没有该配置，devtools不会生效 -->
                <outputDirectory>${project.build.directory}/${project.name}</outputDirectory>
                <addResources>false</addResources>
                <includeSystemScope>true</includeSystemScope>
            </configuration>
        </plugin>

        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-resources-plugin</artifactId>
            <executions>
                <execution>
                    <id>copy-resources</id>
                    <phase>package</phase>
                    <goals>
                        <goal>copy-resources</goal>
                    </goals>
                    <configuration>
                        <encoding>UTF-8</encoding>
                        <outputDirectory>
                            ${project.build.directory}/${project.name}
                        </outputDirectory>   <!-- 表示把配置文件拷到和jar包同一个路径下 -->
                        <resources>
                            <resource>
                                <directory>src/main/resources/</directory>
                            </resource>
                        </resources>
                    </configuration>
                </execution>
                <execution>
                    <id>copy-resources-classes</id>
                    <phase>package</phase>
                    <goals>
                        <goal>copy-resources</goal>
                    </goals>
                    <configuration>
                        <encoding>UTF-8</encoding>
                        <outputDirectory>
                            ${project.build.directory}/classes
                        </outputDirectory>   <!-- 表示把配置文件拷到和jar包同一个路径下 -->
                        <resources>
                            <resource>
                                <directory>src/main/resources/</directory>
                            </resource>
                        </resources>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

在 `pom.xml` 中有一个这样的地方：
```BASH
<properties>
    <java.version>1.8</java.version>
    <!-- maven打包跳过测试阶段（有的数据库连接的是本地的，不是服务器的，打包过程会出现连接数据库失败的错误，设置跳过测试阶段就解决了，不影响发布） -->
    <skipTests>true</skipTests>
</properties>
```

在 `pom.xml` 中 `<packaging>war</packaging>` 是选择打包的类型（war，jar）

配置好 `pom.xml` 之后，一定要是 Jdk1.8 ，在IDEA的右上角，有个 Maven Project。

![maven打包](https://s2.ax1x.com/2019/11/29/Qk8gWd.png)

先点Clean，然后点package然后项目目录多了个target文件夹，里面就生成了你要的jar包了，现在就可以去部署在服务器啦。

![target文件](https://s2.ax1x.com/2019/11/29/Qk8LSs.png)

## IDEA自带打包

先在你项目的启动类中加入以下代码：
```BASH
/**
 * springboot打包发布到tomcat需要
 *
 * @param application
 * @return
 */
@Override
protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
    return application.sources(DemoApplication.class);
}
```

接下来快捷键 Ctrl+Alt+Shift+S 同时按会出现下图页面

![idea自带打包](https://s2.ax1x.com/2019/11/29/QkG2AU.png)

点击 + 号！！！然后选择如图所示的 Empty

![idea](https://s2.ax1x.com/2019/11/29/QkGqAO.png)

出现如下界面

![idea](https://s2.ax1x.com/2019/11/29/QkJG8J.png)

设置完成后点击 OK。

接下来执行 Bulid ，选择你新建的打包方式名执行就 OK 啦。

![打包](https://s2.ax1x.com/2019/11/29/QkJfVf.png)

![idea打包](https://s2.ax1x.com/2019/11/29/QkYis1.png)

以上就是介绍的两种打包方式，自行选择使用。
