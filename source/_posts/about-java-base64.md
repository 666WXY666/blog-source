---
title: Java base64加密解密
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/java.png
abbrlink: c4782247
date: 2019-11-19 13:35:23
tags: [Java,Base64]
categories: [Java,加密安全]
keywords: [Java,Base64,Base64加密解密]
description: Base 64主要用途不是加密，而是把一些二进制数转成普通字符，方便在网络上传输。 由于一些二进制字符在传输协议中属于控制字符，不能直接传送，所以需要转换一下才可以。由于某些系统中只能使用ASCII字符，Base64就是用来将非ASCII字符的数据转换成ASCII字符的一种方法，Base64特别适合在http，mime协议下快速传输数据。比如网络中图片的传输。
---

## 为什么要使用Base64

Base 64主要用途不是加密，而是把一些二进制数转成普通字符，方便在网络上传输。 由于一些二进制字符在传输协议中属于控制字符，不能直接传送，所以需要转换一下才可以。由于某些系统中只能使用ASCII字符，Base64就是用来将非ASCII字符的数据转换成ASCII字符的一种方法，Base64特别适合在http，mime协议下快速传输数据。比如网络中图片的传输。

Base64并非安全领域下的加密解密算法。虽然经常遇到所谓的base64的加密解密。但base64只能算是一个编码算法，对数据内容进行编码来适合传输。虽然base64编码过后原文也变成不能看到的字符格式，但是方式初级又简单。

## Base64原理

Base64编码方法，要求把每三个8Bit的字节转换为四个6Bit的字节，其中，转换之后的这四个字节中每6个有效bit为是有效数据，空余的那两个 bit用0补上成为一个字节。因此Base64所造成数据冗余不是很严重，Base64是当今比较流行的编码方法，因为它编起来速度快而且简单。

举个例子，有三个字节的原始数据：aaaaaabb　bbbbccccc　ccdddddd（这里每个字母表示一个bit位）

那么编码之后会变成：00aaaaaa　00bbbbbb　00cccccc　00dddddd

所以可以看出base64编码简单，虽然编码后不是明文，看不出原文，但是解码也很简单。

## 实现方式

```JAVA
package com.scaffolding.demo.utils;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * @author: Xuxu
 * @date: 2019-11-19 11:49
 **/
public class Base64Util {

    /**
     * 加密
     */
    public static String asBase64(String str) {
        return Base64.getEncoder().encodeToString(str.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * 解密
     */
    public static String asString(String base64) {
        return new String(Base64.getDecoder().decode(base64), StandardCharsets.UTF_8);
    }

    public static void main(String[] args) {
        String str = "123456";
        //加密
        System.out.println(Base64Util.asBase64(str));
        //解密后
        System.out.println(Base64Util.asString(Base64Util.asBase64(str)));
    }
}
```

