---
title: Java下载网络文件到指定目录
pin: false
toc: true
icons: []
tags: [Java,工具类]
categories: [Java,工具类]
keywords: [Java,网络文件,目录]
abbrlink: 611a48d3
date: 2020-12-09 11:43:05
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/java.png
description: Java下载网络文件到指定目录
---

工具类代码如下：
```
import lombok.extern.slf4j.Slf4j;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;

/**
 * @author xuxu
 * @date 2020/12/9 12:55
 */
@Slf4j
public class FileUtil {
    /**
     * 说明：根据指定URL将文件下载到指定目标位置
     *
     * @param urlPath     下载路径
     * @param downloadDir 文件存放目录
     * @return 返回下载文件
     */
    public static File downloadFile(String urlPath, String downloadDir) {
        File file = null;
        try {
            // 统一资源
            URL url = new URL(urlPath);
            // 连接类的父类，抽象类
            URLConnection urlConnection = url.openConnection();
            // http的连接类
            HttpURLConnection httpUrlConnection = (HttpURLConnection) urlConnection;
            //设置超时
            httpUrlConnection.setConnectTimeout(1000 * 5);
            //设置请求方式，默认是GET
            httpUrlConnection.setRequestMethod("GET");
            // 设置字符编码
            httpUrlConnection.setRequestProperty("Charset", "UTF-8");
            // 打开到此 URL引用的资源的通信链接（如果尚未建立这样的连接）。
            httpUrlConnection.connect();
            // 文件大小
            int fileLength = httpUrlConnection.getContentLength();

            // 控制台打印文件大小
            log.info("您要下载的文件大小为:" + fileLength / (1024 * 1024) + "MB");

            // 建立链接从请求中获取数据
            BufferedInputStream bin = new BufferedInputStream(httpUrlConnection.getInputStream());
            // 指定文件名称(有需求可以自定义)
            String fileFullName = urlPath.substring(urlPath.lastIndexOf("/") + 1);
            // 指定存放位置(有需求可以自定义)
            File filePath = new File(downloadDir);
            // 是否是文件夹
            if (!filePath.exists() && !filePath.isDirectory()) {
                log.info("目录不存在，创建目录:" + filePath);
                filePath.mkdir();
            }
            file = new File(downloadDir + File.separatorChar + fileFullName);
            OutputStream out = new FileOutputStream(file);
            int size;
            int len = 0;
            byte[] buf = new byte[2048];
            while ((size = bin.read(buf)) != -1) {
                len += size;
                out.write(buf, 0, size);
            }
            // 关闭资源
            bin.close();
            out.close();
            log.info("文件下载成功！");
        } catch (MalformedURLException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            log.info("文件下载失败！");
        }
        return file;
    }

    /**
     * 测试
     *
     * @param args
     */
    public static void main(String[] args) {
        // 指定资源地址，下载文件测试
        File file = downloadFile("http://192.168.80.97:9090/artifactory/DEV/ipipe/pipeline/1607175965084_15.tar", "E:\\down");
        System.out.println(file.getName());
    }
}
```