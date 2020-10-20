---
title: Java实现MD5加盐加密和MD5与SHA-1混合加盐加密两种方式
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/java.png
abbrlink: a7df3b40
date: 2019-11-18 12:53:11
tags: [Java,MD5,SHA-1]
categories: [Java,加密安全]
keywords: [MD5,SHA-1,Java加密]
description: 介绍两种加密方式，防止网站轻松破解我们的密码。
---
现在一般的MD5加密在网上随随便便就能够解密，解密的网站有以下几个：

{% linkCard http://pmd5.com/,PMD5 %}

{% linkCard http://www.cmd5.com/,CMD5 %}

{% linkCard http://tool.chinaz.com/tools/md5.aspx,站长工具 %}

好了介绍了这么多密码解密的网站，现在我们来介绍如何提高密码的安全性，来防止上面的网站轻松破解我们的密码。

## MD5加盐加密

```JAVA
package com.scaffolding.demo.utils;

import java.security.MessageDigest;
import java.util.Random;

/**
 * @author: Xuxu
 * @date: 2019-11-18 11:20
 **/
public class MD5Util {
    /**
     * byte[]字节数组 转换成 十六进制字符串
     *
     * @param arr 要转换的byte[]字节数组
     * @return String 返回十六进制字符串
     */
    private static String hex(byte[] arr) {
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < arr.length; ++i) {
            sb.append(Integer.toHexString((arr[i] & 0xFF) | 0x100).substring(1, 3));
        }
        return sb.toString();
    }

    /**
     * MD5加密,并把结果由字节数组转换成十六进制字符串
     *
     * @param str 要加密的内容
     * @return String 返回加密后的十六进制字符串
     */
    private static String md5Hex(String str) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(str.getBytes());
            return hex(digest);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.toString());
            return "";
        }
    }

    /**
     * 生成含有随机盐的密码
     *
     * @param password 要加密的密码
     * @return String 含有随机盐的密码
     */
    public static String getSaltMD5(String password) {
        // 生成一个16位的随机数
        Random random = new Random();
        StringBuilder sBuilder = new StringBuilder(16);
        sBuilder.append(random.nextInt(99999999)).append(random.nextInt(99999999));
        int len = sBuilder.length();
        if (len < 16) {
            for (int i = 0; i < 16 - len; i++) {
                sBuilder.append("0");
            }
        }
        // 生成最终的加密盐
        String salt = sBuilder.toString();
        password = md5Hex(password + salt);
        char[] cs = new char[48];
        for (int i = 0; i < 48; i += 3) {
            cs[i] = password.charAt(i / 3 * 2);
            char c = salt.charAt(i / 3);
            cs[i + 1] = c;
            cs[i + 2] = password.charAt(i / 3 * 2 + 1);
        }
        return String.valueOf(cs);
    }


    /**
     * 验证加盐后是否和原密码一致
     *
     * @param password 原密码
     * @param password 加密之后的密码
     * @return boolean true表示和原密码一致   false表示和原密码不一致
     */
    public static boolean getSaltverifyMD5(String password, String md5str) {
        char[] cs1 = new char[32];
        char[] cs2 = new char[16];
        for (int i = 0; i < 48; i += 3) {
            cs1[i / 3 * 2] = md5str.charAt(i);
            cs1[i / 3 * 2 + 1] = md5str.charAt(i + 2);
            cs2[i / 3] = md5str.charAt(i + 1);
        }
        String Salt = new String(cs2);
        return md5Hex(password + Salt).equals(String.valueOf(cs1));
    }


    public static void main(String[] args) {
        // 原密码
        String plaintext = "123456";

        // 获取加盐后的MD5值
        String ciphertext = MD5Util.getSaltMD5(plaintext);
        System.out.println("加盐后MD5：" + ciphertext);
        System.out.println("是否是同一字符串:" + MD5Util.getSaltverifyMD5(plaintext, ciphertext));
    }

}
```
输出结果为：

加盐后MD5：e9a97f49db0f20911ab1d815624b33e75a3236e76040f509

是否是同一字符串：true

这时，我们可以把加盐后的 加密密码 拿到 MD5加密网上去验证是否能够解密（这里我只列举其中一个网站进行验证，你们也可以自行拿去各个MD5加密网站上去验证）

![md5](https://s2.ax1x.com/2019/11/19/Mgdtjs.png)

我们可以看到，MD5加密网站已经无法破解我们加密的密码了，所以MD5加盐加密的密码相对来说还是比较安全的。

## MD5和SHA-1混合加盐加密 

```JAVA
package com.scaffolding.demo.utils;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Random;

/**
 * @author: Xuxu
 * @date: 2019-11-18 13:15
 **/
public class MD5Utils {
    /**
     * md5和sha-1混合加密
     *
     * @param inputText 要加密的内容
     * @return String md5和sha-1混合加密之后的密码
     */
    public static String md5AndSha(String inputText) {
        return sha(md5(inputText));
    }

    /**
     * md5加密
     *
     * @param inputText 要加密的内容
     * @return String  md5加密之后的密码
     */
    public static String md5(String inputText) {
        return encrypt(inputText, "md5");
    }

    /**
     * sha-1加密
     *
     * @param inputText 要加密的内容
     * @return sha-1加密之后的密码
     */
    public static String sha(String inputText) {
        return encrypt(inputText, "sha-1");
    }

    /**
     * md5或者sha-1加密
     *
     * @param inputText     要加密的内容
     * @param algorithmName 加密算法名称：md5或者sha-1，不区分大小写
     * @return String  md5或者sha-1加密之后的结果
     */
    private static String encrypt(String inputText, String algorithmName) {
        if (inputText == null || "".equals(inputText.trim())) {
            throw new IllegalArgumentException("请输入要加密的内容");
        }
        if (algorithmName == null || "".equals(algorithmName.trim())) {
            algorithmName = "md5";
        }
        String encryptText = null;
        try {
            MessageDigest m = MessageDigest.getInstance(algorithmName);
            m.update(inputText.getBytes("UTF8"));
            byte s[] = m.digest();
            return hex(s);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return encryptText;
    }


    /**
     * byte[]字节数组 转换成 十六进制字符串
     *
     * @param arr 要转换的byte[]字节数组
     * @return String 返回十六进制字符串
     */
    private static String hex(byte[] arr) {
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < arr.length; ++i) {
            sb.append(Integer.toHexString((arr[i] & 0xFF) | 0x100).substring(1, 3));
        }
        return sb.toString();
    }

    /**
     * 生成含有随机盐的密码
     *
     * @param password 要加密的密码
     * @return String 含有随机盐的密码
     */
    public static String getSaltMd5AndSha(String password) {
        // 生成一个16位的随机数
        Random random = new Random();
        StringBuilder sBuilder = new StringBuilder(16);
        sBuilder.append(random.nextInt(99999999)).append(random.nextInt(99999999));
        int len = sBuilder.length();
        if (len < 16) {
            for (int i = 0; i < 16 - len; i++) {
                sBuilder.append("0");
            }
        }
        // 生成最终的加密盐
        String salt = sBuilder.toString();
        password = md5AndSha(password + salt);

        char[] cs = new char[48];
        for (int i = 0; i < 48; i += 3) {
            cs[i] = password.charAt(i / 3 * 2);
            char c = salt.charAt(i / 3);
            cs[i + 1] = c;
            cs[i + 2] = password.charAt(i / 3 * 2 + 1);
        }
        return String.valueOf(cs);
    }

    /**
     * 验证加盐后是否和原密码一致
     *
     * @param password 原密码
     * @param password 加密之后的密码
     * @return boolean true表示和原密码一致   false表示和原密码不一致
     */
    public static boolean getSaltverifyMd5AndSha(String password, String md5str) {
        char[] cs1 = new char[32];
        char[] cs2 = new char[16];
        for (int i = 0; i < 48; i += 3) {
            cs1[i / 3 * 2] = md5str.charAt(i);
            cs1[i / 3 * 2 + 1] = md5str.charAt(i + 2);
            cs2[i / 3] = md5str.charAt(i + 1);
        }
        String salt = new String(cs2);
        String encrypPassword = md5AndSha(password + salt);

        // 加密密码去掉最后8位数
        encrypPassword = encrypPassword.substring(0, encrypPassword.length() - 8);

        return encrypPassword.equals(String.valueOf(cs1));
    }

    public static void main(String[] args) {
        // 原密码
        String plaintext = "123456";

        // 获取加盐后的MD5值
        String ciphertext = MD5Utils.getSaltMd5AndSha(plaintext);
        System.out.println("加盐后MD5：" + ciphertext);
        System.out.println("是否是同一字符串:" + MD5Utils.getSaltverifyMd5AndSha(plaintext, ciphertext));
    }

}

```
眼睛比较明亮的朋友，可能会发现 MD5 和 SHA-1 混合加盐加密 与 MD5 加盐加密 的 getSaltverifyMD5(String password, String md5str) 方法有些不同，是的，MD5和SHA-1混合加盐加密 的 getSaltverifyMD5(String password, String md5str) 多了下面这一行代码：

```JAVA
// 加密密码去掉最后8位数
encrypPassword = encrypPassword.substring(0 , encrypPassword.length() - 8);
```

就会有人问了，为什么要去掉加密密码的最后8位数，而MD5加盐加密却不要？其实这是有原因的

我们可以看到密码为 123456 经过 MD5、MD5和SHA-1 混合加密的结果：

&emsp;&emsp;MD5 ：e10adc3949ba59abbe56e057f20f883e （32位数）

&emsp;&emsp;MD5和SHA-1 ：10470c3b4b1fed12c3baac014be15fac67c6e815  （40位数）

发现有什么不同了没？两种加密之后的密码长度是不是 不一样了 经过MD5加密之后的密码长度为32，而MD5和SHA-1的为40

而我们在 getSaltMd5AndSha （与getSaltMD5代码相同，只是方法名称不一样）中定义的

盐长度为 16位数（即 StringBuilder sBuilder = new StringBuilder(16) ;）

加盐加密后的密码长度为 48位数 (即  char[] cs = new char[48]; )

加盐加密后的密码长度 =  盐长度 + MD5加密的密码长度 (即  48 = 16 + 32 )  

长度刚刚等于48位数，所以char[] cs 刚好可以把 密码和盐全部都存储起来，可是MD5和SHA-1 加密的密码长度为40，即 

48 < 40 + 16，还会有八位数不能够存储到char[] cs 中, 这也就意味着 char[] cs 只能够存储 MD5和SHA-1 加密密码的前32位数 和 16位数的盐，MD5和SHA-1 加密密码的最后八位会丢失，而在验证加盐后是否和原密码一致的getSaltverifyMd5AndSha(String password, String md5str)方法中，我们定义的 char[] cs1 = new char[32];（即去掉盐之后的MD5和SHA-1 加密密码）只有32位数，而MD5和SHA-1 加密密码实际位数有40位数，那么在进行encrypPassword.equals(String.valueOf(cs1) ) 时，就会返回false，即原密码与加密密码验证不一致。

所以要解决这个问题，就是把MD5和SHA-1 加密的密码结果 去掉最后8位数，再进行比较，这样就可以验证原密码是否与加密密码一致了。
