---
title: Hexo NexT主题之代码块Mac Panel特效
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/hexo.png
abbrlink: d7399e80
date: 2019-10-14 14:45:29
tags: [Hexo,代码块]
categories: [Hexo]
keywords: [代码块,Next]
description: 偶然间发现一款不错的文章代码块样式，类似Mac的面板效果。能设置阴影效果和实现文本编辑功能，不过文本只存在浏览器页面上，不会真正保存。配置的方式也很简单，觉得不错的朋友可以试一下。
---

偶然间发现一款不错的文章代码块样式，类似Mac的面板效果。能设置阴影效果和实现文本编辑功能，不过文本只存在浏览器页面上，不会真正保存。配置的方式也很简单，觉得不错的朋友可以试一下。

## 引入 JS

这里需要新建两个 js 文件 `events.js` 和 `codeblock.js` ，路径位于 `/themes/next/scripts/` 包下。

<div class="note success">

***events.js 代码：***
</div>

```
// mac Panel效果代码块相关
var exec = require('child_process').exec;

// new 后自动打开编辑器
hexo.on('new', function(data){
  exec('open -a MacDown ' + data.path);
});
```

这个js会在你敲 `hexo new xxx` 命令后，调用本地的MarkDown编辑器打开新建的md文件 `xxx`

<div class="note success">

***codeblock.js 代码：***
</div>

```
// mac Panel效果代码块相关
var attributes = [
  'autocomplete="off"',
  'autocorrect="off"',
  'autocapitalize="off"',
  'spellcheck="false"',
  'contenteditable="true"'
]

var attributesStr = attributes.join(' ')

hexo.extend.filter.register('after_post_render', function (data) {
  while (/<figure class="highlight ([a-zA-Z]+)">.*?<\/figure>/.test(data.content)) {
    data.content = data.content.replace(/<figure class="highlight ([a-zA-Z]+)">.*?<\/figure>/, function () {
      var language = RegExp.$1 || 'plain'
      var lastMatch = RegExp.lastMatch
      lastMatch = lastMatch.replace(/<figure class="highlight /, '<figure class="iseeu highlight /')
      return '<div class="highlight-wrap"' + attributesStr + 'data-rel="' + language.toUpperCase() + '">' + lastMatch + '</div>'
    })
  }
  return data
})
```

## 引入 CSS

在 `/themes/next/source/css/_common/components/highlight/` 目录下新建 `macPanel.styl` 文件，内容如下：

```
/*mac Panel效果代码块相关*/
.highlight-wrap[data-rel] {
  position: relative;
  overflow: hidden;
  border-radius: 5px;
  /*box-shadow: 0 10px 30px 0px rgba(0, 0, 0, 0.4);*/
  box-shadow:18px 18px 15px 0px rgba(0,0,0,.4);
  margin: 35px 0;
  margin-top: 10px;
  margin-bottom: 25px;
  ::-webkit-scrollbar {
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  }

  &::before {
    content: attr(data-rel);
    height: 38px;
    line-height: 38px;
    background: #21252b;
    /*background: #108414de;*/
    color: #fff;
    font-size: 16px;
    /*position: absolute;*/
    top: 0;
    left: 0;
    width: 100%;
    /*font-family: 'Source Sans Pro', sans-serif;*/
    font-weight: bold;
    padding: 0px 80px;
    text-indent: 15px;
    float: left;
  }
  &::after {
    content: ' ';
    position: absolute;
    -webkit-border-radius: 50%;
    border-radius: 50%;
    background: #fc625d;
    width: 12px;
    height: 12px;
    top: 0;
    left: 20px;
    margin-top: 13px;
    -webkit-box-shadow: 20px 0px #fdbc40, 40px 0px #35cd4b;
    box-shadow: 20px 0px #fdbc40, 40px 0px #35cd4b;
    z-index: 3;
  }
}
```

此css是根据我本地的样式做过调整，注释的代码为原有的，根据需要调整样式即可。

## 配置引用

在 `/themes/next/source/css/_common/components/highlight/highlight.styl` 中引入刚才新建的 `macPanel.styl`：

```
@require "macPanel"
```

配置在文件的顶部位置即可。

到此Mac Panel配置完成，根据需要可调整主题配置文件中的 `highlight_theme` 的值，选择自己喜欢的样式。
