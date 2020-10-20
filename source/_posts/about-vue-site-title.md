---
title: vue、react等单页应用在微信浏览器中修改标题
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/vue.png
abbrlink: a63fb3ae
date: 2020-02-05 12:07:51
tags: [Vue]
categories: [Vue]
keywords: [vue,react,微信浏览器修改标题]
description: 分享单页应用在微信浏览器中修改标题
---

由于单页应用是通过路由切换展示不同页面的，而不是真正的跳转链接，然后在IOS系统，微信浏览器中直接用修改title的值不会有效果，所以需要使用特殊方式来修改微信标题，一言不合就上代码：

```BASH
/**
* 微信浏览器中设置对应页面的标题
* 解决：IOS微信浏览器中用document.title 设置标题无效
* */
export const setTitle = (title) => {
   var body = document.getElementsByTagName('body')[0];
   document.title = title;
   var iframe = document.createElement("iframe");
   iframe.setAttribute("src", "logo.png");
   iframe.setAttribute("style", "display:none");
   iframe.addEventListener('load', function() {
       setTimeout(function() {
           try{
               iframe.removeEventListener('load');
           }catch (err){}
           document.body.removeChild(iframe);
       }, 0);
   });
   document.body.appendChild(iframe);
};
```
