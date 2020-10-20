---
title: 异常：java.security.InvalidKeyException:Illegal key size
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/java.png
abbrlink: 2b56997e
date: 2020-01-07 10:13:18
tags: [BUG]
categories: [Java,BUG]
keywords: [Illegal key size,InvalidKeyException]
description: 异常：java.security.InvalidKeyException:Illegal key size.
---

今天在做接口测试的时候遇到个异常：

**java.security.InvalidKeyException: Illegal key size**

```
KeyGenerator kgen = KeyGenerator.getInstance("aes");
//此处解决mac，linux报错
SecureRandom random = SecureRandom.getInstance("SHA1PRNG");
random.setSeed(key.getBytes());    //mac笔记本当代码运行到这一行时就报错了。爆出上面的异常
kgen.init(type.value, random);
SecretKey secretKey = kgen.generateKey();
```

感到一脸懵逼，还好网络是万能的，百度一下，简单对比一下，就找到了解决方案。然后测试之后发现也是没有问题的。

异常原因：如果密钥大于128, 会抛出java.security.InvalidKeyException: Illegal key size 异常. 因为密钥长度是受限制的, java运行时环境读到的是受限的policy文件. 文件位于${java_home}/jre/lib/security, 这种限制是因为美国对软件出口的控制.

解决方案：去官方下载JCE无限制权限策略文件。

JDK5的下载地址: [http://www.oracle.com/technetwork/java/javasebusiness/downloads/java-archive-downloads-java-plat-419418.html#jce_policy-1.5.0-oth-JPR](http://www.oracle.com/technetwork/java/javasebusiness/downloads/java-archive-downloads-java-plat-419418.html#jce_policy-1.5.0-oth-JPR)

JDK6的下载地址: [http://www.oracle.com/technetwork/java/javase/downloads/jce-6-download-429243.html](http://www.oracle.com/technetwork/java/javase/downloads/jce-6-download-429243.html)

JDK7的下载地址: [http://www.oracle.com/technetwork/java/javase/downloads/jce-7-download-432124.html](http://www.oracle.com/technetwork/java/javase/downloads/jce-7-download-432124.html)

JDK8的下载地址: [http://www.oracle.com/technetwork/java/javase/downloads/jce8-download-2133166.html](http://www.oracle.com/technetwork/java/javase/downloads/jce8-download-2133166.html)

下载后解压，可以看到local_policy.jar和US_export_policy.jar以及readme.txt

如果安装了JRE，将两个jar文件放到%JRE_HOME%\lib\security目录下覆盖原来的文件

如果安装了JDK，还要将两个jar文件也放到%JDK_HOME%\jre\lib\security目录下覆盖原来文件。

然后DuangDuangDuangDuang，就ok了。
