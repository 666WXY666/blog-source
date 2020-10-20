---
title: Hexo博客Valine评论样式美化
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/hexo.png
abbrlink: 89ea6c8b
date: 2019-11-14 15:36:50
tags: [Hexo,Valine]
categories: [Hexo]
keywords: [Hexo,Hexo,Valine评论样式美化]
description: Valine 是一款比较轻量级的纯前端的评论系统，目前很多个人博客都在使用 Valine 评论系统，并且支持匿名留言。
---

Valine 是一款比较轻量级的纯前端的评论系统，目前很多个人博客都在使用 Valine 评论系统，并且支持匿名留言。

{% linkCard https://github.com/xCss/Valine,Valine的Github地址 %}

我个人也是很喜欢这一款评论系统的，之前用过来必力、Gitalk 等评论系统，都觉得很难用，尤其是来必力，这款韩国人做的评论系统在国内使用很容易出现加载非常慢的情况，往往博客内容都加载完成评论系统还需要好久才加载完，在国内体验比较差吧。

那么 Valine 默认的样式其实比较素，当然不同人喜欢的风格都不一样，如果有喜欢我这种评论样式的，不妨留个言并且在文章末尾给个五星好评吧~

<div class="note danger">

注意：本Valine美化目前只适应于 `valine1.3.4` 版本的，如果是其它版本的可能css样式会错乱。
</div>

具体更改 Valine 版本的话，主要是更改Valine的js版本，比如我的是next主题，那么就在主题目录下 `next\layout\_third-party\comments\valine.swig` 中找到引入 `valine.js` 的 `<script></script>` 语句，我是将 Valine 的 `1.3.4` 版本的 `js` 放到目录本地的，所以将引入 `js` 的语句改成了：`<script src="/js/src/valine1.3.4.js"></script>`

当然不同版本的next主题中 `valine.swig` 中内容也不同。

比如next6主题的 `valine.swig` 中代码是这样的：
```BASH
{% set valine_uri = '//unpkg.com/valine/dist/Valine.min.js' %}
{% if theme.vendors.valine %}
  {% set valine_uri = theme.vendors.valine %}
{% endif %}
<script src="{{ valine_uri }}"></script>
```
而next5主题的就在valine.swig开头，内容如下：
```BASH
{% if theme.valine.enable and theme.valine.appid and theme.valine.appkey %}
  <script src="//cdn1.lncld.net/static/js/3.0.4/av-min.js"></script>
  <script src="//unpkg.com/valine/dist/Valine.min.js"></script>
```
而url中 `//unpkg.com/valine/dist/Valine.min.js` 默认是引入最新的 `valine.js` 文件，所以不管是next5还是next6主题都是修改这个url地址，只要修改成 `valine1.3.4` 版本的js文件即可。

然后打开主题目录下 `next\source\css\_custom\custom.styl` ，在文件末尾添加如下代码：
```BASH
/*valine 评论系统样式*/
div#comments.comments.v{
  margin-top: 0px !important;
  margin-left: 0px !important;
  margin-right: 0px !important;
}

div.vheader.item2{
  border-bottom: 1px solid #5f5f5f;
  height: 35px !important;
}

.v .vwrap .vheader.item2 .vinput{
  height: 30px !important;
  border: 0px !important;
  width: 25% !important;
  margin: 0px !important;
}

input.vnick.vinput{
  border-right: 2px solid #a4d8fa !important;
}

div.vcontrol{
  padding-top: 0px !important;
}

div#comments.comments.v{
  border: 0px;
}


.v .vwrap{
  border: 2px solid black !important;
  height: 250px !important;
  border-radius: 6px !important;
  overflow: visible !important;
  counter-reset: avater;
}

.v .vwrap .vedit .vemojis{
  width: 600px !important;
  background-color: #fff !important;
  border-radius: 5px !important;
}

.v .vwrap .vedit .vpreview {
  width: 600px !important;
  background-color: #fff !important;
  border-radius: 5px !important;
}

.v .vbtn{
  background-color: #971212 !important;
  color: #fff !important;
}

.v .vwrap .vedit .vctrl{
  text-align: left !important;
}

.v .vwrap .vedit .vctrl span{
  background-color: #7f7f7f !important;
  color: #fff !important;
  border-radius: 3px !important;
  padding: 3px !important;
}

.v .vwrap .vedit .vctrl{
  padding: 0px !important;
  margin: 0px !important;
}

.v .vlist .vcard .vquote .vcontent {
  font-size: 15px;
  font-weight: 200;
}

div.vedit{
  height: 120px;
}
div.vcontrol{
	margin-top: 30px;
}

.v .veditor{
  min-height: 70px !important;
  height: 100px !important;
}

.v .vlist .vcard {
  border: 1px solid #ccc !important;
  padding-left: 14px !important;
  padding-right: 14px !important;
  margin-bottom: 20px !important;
  border-radius: 10px !important;
}
.v .vlist  .vquote .vcard{
  border: 0px !important;
  margin-bottom: 0px !important;
  border-radius: 0px !important;
  padding: 0px !important;
}

.v .vlist .vcard .vhead .vsys{
  display:none !important;
  background-color: #fff !important;
}
.v .vlist .vcard .vh .vmeta .vat{
  background-color: #177714 !important;
  color: #fff !important;
  border-radius: 3px !important;
  padding-left: 10px !important;
  padding-right: 10px !important;
}

.v .vlist .vcard .vimg{
  margin: 0 12px 0 0;
  counter-increment: avater;
}

/*设置评论头像旋转*/
.v .vlist .vcard .vimg:hover {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -transform: rotate(360deg);
}

.v .vlist .vcard .vquote{
  margin-left: 40px; 
}

.v .vlist .vcard .vquote{
  counter-reset: avaters;
}

.v .vlist .vcard .vquote .vimg{
  display: avaters !important;
}

.v .vlist .vcard .vquote  .vhead:before{
    display: block;
    float: left;
    width: 38px;
    height: 38px;
    line-height: 38px;
    margin: 0 12px 0 0;
    color: #fff;
    font-size: 15px;
    font-weight: bold;
    font-style: normal;
    background-color: #2d4e41;
    border: 3px solid #60a1e5;
    border-radius: 50%;
    text-align: center;

    /*content: counter(avater)'.'counter(avaters);
    counter-increment: avaters;*/
}

.v .vlist .vcard p {
  top: -1.5em;
  position: relative;
  z-index: 1;
  margin: unset;
}

.v .vlist .vcard .vquote a.at {
  font-size: 13px;
  color: #bea124;
  text-decoration: none;
  border: unset;
  position: relative;
  top: -40px;
}
.v .vlist .vcard .vquote .vcontent{
  font-size: 15px;
  font-weight: 200;
}

.v .vlist .vcard .vcontent {
  margin-top: 58px !important;
  font-size: 15px !important;
  font-weight: 500 !important;
  padding-top: 0 !important;
  margin-bottom: unset !important;
}

.v .vlist .vcard .vquote .vhead .vnick {
  color: #5af !important;
  font-weight: 300 !important;
  font-size: 15px !important;
}
.v .vlist .vcard .vhead .vnick {
  font-size: 18px !important;
  font-weight: 500 !important;
  color: #5b6b68 !important;
}

.v .vlist .vcard{
  padding-top: 8px !important;
}

.v .vlist .vcard .vhead{
  float: left !important;
}

.v .vlist .vcard .vh .vmeta{
  float: right !important;
}

.v .vlist .vcard .vcontent.expand:after{
  content: "点击查看全部" !important;
  font-weight: 400 !important;
}
/**/
```
其中有需要自己修改的地方可以在浏览器中F12自行修改css样式即可。
