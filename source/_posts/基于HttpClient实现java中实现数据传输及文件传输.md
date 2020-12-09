---
title: 基于HttpClient实现java中实现数据传输及文件传输
pin: false
toc: true
tags:
  - Java
  - 工具类
categories:
  - Java
  - 工具类
keywords:
  - Java
  - HttpClient
  - 文件传输
  - 数据传输
thumbnail: >-
  https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/java.png
description: 基于HttpClient实现java中实现数据传输及文件传输
abbrlink: b85c80d5
date: 2020-12-09 10:56:53
---

## :fire: 在pom文件中引入相关jar
```
<dependency>
	<groupId>commons-httpclient</groupId>
	<artifactId>commons-httpclient</artifactId>
	<version>3.1</version>
</dependency>
<dependency>
	<groupId>org.apache.commons</groupId>
	<artifactId>commons-lang3</artifactId>
	<version>3.8</version>
</dependency>
<dependency>
	<groupId>org.apache.httpcomponents</groupId>
	<artifactId>httpclient</artifactId>
	<version>4.5</version>
</dependency>
<dependency>
	<groupId>org.apache.httpcomponents</groupId>
	<artifactId>httpmime</artifactId>
	<version>4.5</version>
</dependency>
```

## :fire: 创建HttpClientRequestUtil工具类
```
import net.sf.json.JSONObject;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author xuxu
 * @date 2020/12/9 10:31
 */
public class HttpClientRequestUtil {
    private static final HttpClient client = HttpClientBuilder.create().build();

    /**
     * 使用POST请求
     *
     * @param urlParameters
     * @param url
     * @return
     */
    public static String doPost(List<NameValuePair> urlParameters, String url) {
        String result = "";
        // 创建默认的httpClient实例.
        CloseableHttpClient httpclient = HttpClients.createDefault();
        // 创建httpPost
        HttpPost httppost = new HttpPost(url);
        RequestConfig requestConfig = RequestConfig.custom().setConnectTimeout(3000)
                .setSocketTimeout(3000).setConnectionRequestTimeout(3000)
                .setRedirectsEnabled(true).build();
        UrlEncodedFormEntity uefEntity;
        try {
            uefEntity = new UrlEncodedFormEntity(urlParameters, "UTF-8");
            httppost.setEntity(uefEntity);
            httppost.setConfig(requestConfig);
            System.out.println("executing request " + httppost.getURI());
            CloseableHttpResponse response = httpclient.execute(httppost);
            if (response.getStatusLine().getStatusCode() == 200) {
                try {
                    HttpEntity entity = response.getEntity();
                    if (entity != null) {
                        result = EntityUtils.toString(entity, "UTF-8");
                        System.out.println("--------------------------------------");
                        System.out.println("Response content: " + result);
                        System.out.println("--------------------------------------");
                    }
                } finally {
                    response.close();
                }
            } else {
                System.out.println("******************************************请求失败+++++++++++++++++++++++++++++====");
            }

        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e1) {
            e1.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            // 关闭连接,释放资源
            try {
                httpclient.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return result;
    }

    /**
     * GET请求方式
     *
     * @param URL
     * @return
     */
    public static String doGet(String URL) {
        try {
            HttpClient client = new DefaultHttpClient();
            // 发送get请求
            HttpGet request = new HttpGet(URL);
            HttpResponse response = client.execute(request);
            // 请求发送成功，并得到响应
            if (response.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
                // 读取服务器返回过来的json字符串数据
                String strResult = EntityUtils.toString(response.getEntity());

                return strResult;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * POST请求application/json
     *
     * @param jsonStr
     * @param url
     * @return
     * @throws Exception
     */
    public static String doPostJson(String jsonStr, String url) throws Exception {
        StringEntity sEntity = new StringEntity(JSONObject.fromObject(jsonStr).toString(), "utf-8");
        sEntity.setContentType("application/json");
        HttpPost post = new HttpPost(url);
        post.setEntity(sEntity);
        HttpResponse response = client.execute(post);
        HttpEntity entity = response.getEntity();
        return EntityUtils.toString(entity, "UTF-8");
    }

    /**
     * POST请求发送MultipartFile文件参数
     *
     * @param url
     * @param multipartFiles
     * @param fileParName
     * @param params
     * @param headers
     * @param timeout
     * @return
     */
    public static Map<String, String> doPostFile(String url, List<MultipartFile> multipartFiles, String fileParName,
                                                 Map<String, Object> params, Map<String, String> headers, int timeout) {
        Map<String, String> resultMap = new HashMap<>();
        CloseableHttpClient httpClient = HttpClients.createDefault();
        String result;
        try {
            HttpPost httpPost = new HttpPost(url);
            // 设置请求头
            for (Map.Entry<String, String> entry : headers.entrySet()) {
                if (entry.getValue() == null) {
                    continue;
                }
                httpPost.setHeader(entry.getKey(), entry.getValue());
            }
            MultipartEntityBuilder builder = MultipartEntityBuilder.create();
            builder.setCharset(java.nio.charset.Charset.forName("UTF-8"));
            builder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
            for (MultipartFile item : multipartFiles) {
                // 文件流
                builder.addBinaryBody(fileParName, item.getInputStream(), ContentType.MULTIPART_FORM_DATA, item.getOriginalFilename());
            }
            //解决中文乱码
            ContentType contentType = ContentType.create(HTTP.PLAIN_TEXT_TYPE, HTTP.UTF_8);
            for (Map.Entry<String, Object> entry : params.entrySet()) {
                if (entry.getValue() == null) {
                    continue;
                }
                // 类似浏览器表单提交，对应input的name和value
                builder.addTextBody(entry.getKey(), entry.getValue().toString(), contentType);
            }
            HttpEntity entity = builder.build();
            httpPost.setEntity(entity);
            // 执行提交
            HttpResponse response = httpClient.execute(httpPost);

            // 设置连接超时时间
            RequestConfig requestConfig = RequestConfig.custom().setConnectTimeout(timeout)
                    .setConnectionRequestTimeout(timeout).setSocketTimeout(timeout).build();
            httpPost.setConfig(requestConfig);

            HttpEntity responseEntity = response.getEntity();
            resultMap.put("code", String.valueOf(response.getStatusLine().getStatusCode()));
            resultMap.put("data", "");
            if (responseEntity != null) {
                // 将响应内容转换为字符串
                result = EntityUtils.toString(responseEntity, java.nio.charset.Charset.forName("UTF-8"));
                resultMap.put("data", result);
            }
        } catch (Exception e) {
            resultMap.put("code", "error");
            resultMap.put("data", "HTTP请求出现异常: " + e.getMessage());

            Writer w = new StringWriter();
            e.printStackTrace(new PrintWriter(w));
        } finally {
            try {
                httpClient.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return resultMap;
    }
}
```