---
title: SpringBoot 使用 Allatori 进行代码混淆
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/spring.png
abbrlink: 7fabafee
date: 2020-04-29 12:55:35
tags: [SpringBoot,Allatori]
categories: [SpringBoot]
keywords: [SpringBoot,Allatori,代码混淆]
description: Allatori是一个Java 混淆器，它属于第二代混淆器，因此它能够全方位地保护你的知识产权。
---

## :sun_with_face: Allatori介绍
Allatori是一个 Java 混淆器，它属于第二代混淆器，因此它能够全方位地保护你的知识产权。 Allatori具有以下几种保护方式：命名混淆，流混淆，调试信息混淆，字符串混淆，以及水印技术。对于教育和非商业项目来说这个混淆器是免费的。支持war和jar文件格式，并且允许对需要混淆代码的应用程序添加有效日期。 有项目需要对代码进行保护，比较初级的方案就是对代码进行混淆，打包之后的文件进行反编译后，就可以看到效果。此外，使用Allatori打的包体积也会小一点。

{% linkCard https://github.com/Lovnx/confusion,GitHub地址 %}

## :sun_with_face: 使用原因
在很多企业中，代码管理是非常重要的，每个企业都有自己的私有机制，生产出一好的产品，又不想让别人知道自己的技术是如何实现的，就会让搞编程的人，或者是安全师对代码进行保护，这里就是运用Allatori技术对class文件中的代码进行混淆，继而使得其他人即便获取到程序，反编译程序也是徒劳无功、无功而返，这就保证了自己代码的专利性。

## :sun_with_face: 配置步骤

### :tada: 项目目录结构

![项目目录结构](https://s1.ax1x.com/2020/04/29/JTuUWn.png)

### :tada: 准备资源
下载 `allatori.jar` 和 `allatori-annotations.jar` ，下载地址：[http://www.allatori.com/](http://www.allatori.com/)，将下载好的文件放到上面项目目录的 `lib` 下。

### :tada: 创建allatori.xml文件

在创建的文件中放入一下内容：
```BASH
<config>
    <input>
        <!-- in中是待混淆的war包，out是混淆后的war包 -->
        <jar in="AIReminder-0.0.1-SNAPSHOT.war" out="AIReminder-0.0.1-SNAPSHOT-obfuscated.war"/>
    </input>
    <ignore-classes>
        <!-- 配置了启动相关类不被混淆，保证springboot可以正常启动 -->
        <!-- 以下请根据自己项目的实际需求进行配置 -->
        <class template="class com.scaffolding.demo.sys.controller.UploadFileController" />
        <class template="class *model*" />
        <class template="class *service*" />
        <class template="class *utils*" />
        <class template="class *config*" />
    </ignore-classes>
    <keep-names>
        <class access="protected+">
            <field access="protected+"/>
            <method access="protected+"/>
        </class>
    </keep-names>
    <property name="log-file" value="log.xml"/>
</config>
```
还有很多配置可以参考官方文档：[官网文档](http://www.allatori.com/doc.html)

### :tada: 修改pom.xml文件
{% folding green,查看pom.xml代码 %}
```BASH
<build>
    <plugins>
        <plugin>
            <!-- springboot打包插件 -->
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
        <plugin>
            <!-- resouces拷贝文件插件 -->
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-resources-plugin</artifactId>
            <version>2.6</version>
            <executions>
                <!-- 执行这个插件的时候执行申明的所有phase -->
                <execution>
                    <id>copy-and-filter-allatori-config</id>
                    <phase>package</phase>
                    <goals>
                        <goal>copy-resources</goal>
                    </goals>
                    <configuration>
                        <!-- 这个地方需要注意拷贝的文件位置需要是target目录，target目录是最终打jar包存放的位置 -->
                        <outputDirectory>${basedir}/target</outputDirectory>
                        <resources>
                            <resource>
                                <!-- 这个地方的文件目录需要注意，网上很多目录都是${basedir}/allatori这个，所以才会需要手动拷贝allatori.xml文件到target目录下，有了这个mvn会自动帮我们拷贝了 -->
                                <directory>src/main/resources</directory>
                                <includes>
                                    <!-- 配置文件文件名 -->
                                    <include>allatori.xml</include>
                                </includes>
                                <filtering>true</filtering>
                            </resource>
                        </resources>
                    </configuration>
                </execution>
            </executions>
        </plugin>
        <plugin>
            <!-- 代码混淆打包插件 -->
            <groupId>org.codehaus.mojo</groupId>
            <artifactId>exec-maven-plugin</artifactId>
            <version>1.2.1</version>
            <executions>
                <execution>
                    <id>run-allatori</id>
                    <phase>package</phase>
                    <goals>
                        <goal>exec</goal>
                    </goals>
                </execution>
            </executions>
            <configuration>
                <executable>java</executable>
                <arguments>
                    <argument>-Xms128m</argument>
                    <argument>-Xmx512m</argument>
                    <argument>-jar</argument>
                    <!-- 指定引用的allatori的jar包位置，这里把jar包放在了根目录下的lib目录里 -->
                    <argument>${basedir}/lib/allatori.jar</argument>
                    <!-- 指定代码混淆时的配置文件，因为是混淆指定的是jar包，jar包位置在target下,所以我们的allatori.xml也需要拷贝到该目录下 -->
                    <argument>${basedir}/target/allatori.xml</argument>
                </arguments>
            </configuration>
        </plugin>
    </plugins>
</build>
```
{% endfolding %}

### :tada: 打包
1. 在控制台中执行 `mvn clean`
2. 再执行 `mvn package -DskipTests`
3. 执行成功以后，在项目的target目录下会生成你想要的war包

![](https://s1.ax1x.com/2020/04/29/JTGMbq.png)

打包好的war包放到 tomcat 下就可以直接部署啦！

如果在部署过程中报错，看一下错误信息，可能是某个类或者方法不能做混淆，就需要在 `allatori.xml` 中配置相关类不被混淆。
