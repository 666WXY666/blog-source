---
title: Hexo+Next7.8.0 引入 Folding 容器
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/hexo.png
abbrlink: d0bc4f5d
date: 2020-04-27 13:46:25
tags: [Hexo,Folding容器]
categories: [Hexo]
keywords: [折叠式容器,Folding,Next7.8.0]
description: 分享一下如何将折叠式容器封装到 Next 主题中。
---

偶然间看到了html5的  `<summary>` 标签，可以将内容展开折叠，感觉很棒，就将其封装到 Next 主题中使用。

本文介绍的文件路径及方法都是基于 `Next7.8.0` 版本实现的，小伙伴采用且考虑兼容性。

## :sun_with_face: 使用方法

{% tabs folding介绍%}
<!-- tab 语法格式-->
```BASH
{% folding 参数（可选）, 标题 %}

![](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/resume/resumeBg.jpg)

{% endfolding %}
```
<!-- endtab -->

<!-- tab 参数列表-->
参数位置可以填写颜色和状态，多个参数用空格隔开。

<span style="font-weight: bold;color: #2196f3;">颜色</span>
```BASH
blue, cyan, green, yellow, red
```
<span style="font-weight: bold;color: #2196f3;">状态</span>

状态填写 open 代表默认打开。
<!-- endtab -->

<!-- tab 示例写法-->
```
{% folding 查看图片测试 %}

![](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/resume/resumeBg.jpg)

{% endfolding %}

{% folding cyan open, 查看默认打开的折叠框 %}

这是一个默认打开的折叠框。

{% endfolding %}

{% folding green, 查看代码测试 %}

{% endfolding %}

{% folding yellow, 查看列表测试 %}

- haha
- hehe

{% endfolding %}

{% folding red, 查看嵌套测试 %}

{% folding blue, 查看嵌套测试2 %}

{% folding 查看嵌套测试3 %}

hahaha

{% endfolding %}

{% endfolding %}

{% endfolding %}
```
<!-- endtab -->

<!-- tab 示例效果-->

{% folding 查看图片测试 %}

![](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/resume/resumeBg.jpg)

{% endfolding %}

{% folding cyan open, 查看默认打开的折叠框 %}

这是一个默认打开的折叠框。

{% endfolding %}

{% folding green, 查看代码测试 %}

```
查看代码测试
```

{% endfolding %}

{% folding yellow, 查看列表测试 %}

- haha
- hehe

{% endfolding %}

{% folding red, 查看嵌套测试 %}

{% folding blue, 查看嵌套测试2 %}

{% folding 查看嵌套测试3 %}

吼吼 :v:

{% endfolding %}

{% endfolding %}

{% endfolding %}
<!-- endtab -->
{% endtabs %}

## :sun_with_face: 配置
### :tada: 引入js

在  `\next\scripts\tags` 目录下新建文件 `folding.js`，并添加以下内容：
```BASH
'use strict';

/**
 * Usage:
 * {% folding [args], title %}
 * content
 * {% endfolding %}
 *
 * args:
 *   - color: blue, cyan, green, yellow, red
 *   - status: open # means open by default
 *
 * example:
 * {% folding cyan open, view the default folding box %}
 * This is a folding box that opens by default
 * {% endfolding %}
 */
function postFolding(args, content) {
  args = args.join(' ').split(',');
  let style = ''
  let title = ''
  if (args.length > 1) {
    style = args[0].trim()
    title = args[1].trim()
  } else if (args.length > 0) {
    title = args[0].trim()
  }
  if (style != undefined) {
    return `<details ${style}><summary> ${hexo.render.renderSync({text: title, engine: 'markdown'}).split('\n').join('')} </summary>
              <div class='content'>
              ${hexo.render.renderSync({text: content, engine: 'markdown'}).split('\n').join('')}
              </div>
            </details>`;
  } else {
    return `<details><summary> ${hexo.render.renderSync({text: title, engine: 'markdown'}).split('\n').join('')} </summary>
              <div class='content'>
              ${hexo.render.renderSync({text: content, engine: 'markdown'}).split('\n').join('')}
              </div>
            </details>`;
  }

}

hexo.extend.tag.register('folding', postFolding, {ends: true});
```

### :tada: 引入css

在 `\next\source\css\_common\scaffolding\tags` 目录下新建文件 `folding.styl`,并添加以下内容：
```BASH
// gap
$fd-gap = 16px // base gap
$fd-gap-paragraph = 1rem // block spacing
$fd-gap-row = .5rem // line spacing
$fd-gap-card = $fd-gap
// border radius
$fd-border-codeblock = 4px
// common
$fd-color-card = white
$fd-color-block =  #f6f6f6
// font size
$fd-fontsize-meta = .875rem   // 14px
$fd-fontsize-list = .9375rem // 15px
//color
$fd-color-p = #555
$fd-color-md-blue = #e8f4fd
$fd-color-md-blue1 = rgba(33,150,243,0.3)

$fd-color-mac-cyan = #e8fafe
$fd-color-mac-cyan1 = rgba(27,205,252,0.3)
$fd-color-mac-green = #ebf9ed
$fd-color-mac-green1 =rgba(61,197,80,.3)
$fd-color-mac-yellow = #fff8e9
$fd-color-mac-yellow1 = rgba(255,189,43,0.3)
$fd-color-mac-red = #feefee
$fd-color-mac-red1 = rgba(254,95,88,0.3)
// transition time
$fd-time = 0.28s

details
  display: block
  padding: $fd-gap
  margin: $fd-gap-row 0
  border-radius: $fd-border-codeblock
  background: $fd-color-card
  font-size: $fd-fontsize-list
  transition: all $fd-time ease
  -moz-transition: all $fd-time ease
  -webkit-transition: all $fd-time ease
  -o-transition: all $fd-time ease

  summary
    cursor: pointer;
    padding: $fd-gap
    outline:none;
    margin: 0 - $fd-gap
    border-radius: $fd-border-codeblock
    color: alpha($fd-color-p, .7)
    font-size: $fd-fontsize-meta
    font-weight: bold
    position: relative
    line-height: normal


    >p, h1, h2, h3, h4, h5, h6
      display: inline !important
      border-bottom: none !important
      cursor: pointer;

    &:hover
      color: $fd-color-p

      &:after
        position: absolute
        content: '+'
        text-align: center
        top: 50%
        transform: translateY(-50%)
        right: $fd-gap

  border: 1px solid $fd-color-block

  > summary
    background: $fd-color-block

  &[blue]
    border-color: $fd-color-md-blue

    > summary
      background:$fd-color-md-blue

  &[cyan]
    border-color:$fd-color-mac-cyan

    > summary
      background:$fd-color-mac-cyan

  &[green]
    border-color:$fd-color-mac-green

    > summary
      background:$fd-color-mac-green

  &[yellow]
    border-color:$fd-color-mac-yellow

    > summary
      background:$fd-color-mac-yellow

  &[red]
    border-color:$fd-color-mac-red

    > summary
      background:$fd-color-mac-red

details[open]
  border-color: alpha($fd-color-p, .2)

  > summary
    border-bottom: 1px solid alpha($fd-color-p, .2)
    border-bottom-left-radius: 0
    border-bottom-right-radius: 0

  &[blue]
    border-color: alpha($fd-color-md-blue1, .3)

    > summary
      border-bottom-color: alpha($fd-color-md-blue1, .3)

  &[cyan]
    border-color: alpha($fd-color-mac-cyan1, .3)

    > summary
      border-bottom-color: alpha($fd-color-mac-cyan1, .3)

  &[green]
    border-color: alpha($fd-color-mac-green1, .3)

    > summary
      border-bottom-color: alpha($fd-color-mac-green1, .3)

  &[yellow]
    border-color: alpha($fd-color-mac-yellow1, .3)

    > summary
      border-bottom-color: alpha($fd-color-mac-yellow1, .3)

  &[red]
    border-color: alpha($fd-color-mac-red1, .3)

    > summary
      border-bottom-color: alpha($fd-color-mac-red1, .3)

  > summary
    color: $fd-color-p
    margin-bottom: 0

    &:hover
      &:after
        content: '-'

  > div.content
    padding: $fd-gap
    margin: 0 - $fd-gap
    margin-top: 0

    p > a:hover
      text-decoration: underline

    >
    p, .tabs, ul, ol, .highlight, .note, .fancybox, details
      &:first-child
        margin-top: 0

      &:last-child
        margin-bottom: 0
```

最后在目录 `\next\source\css\_common\scaffolding\tags` 下有一个文件 `tags.styl`，添加以下内容：
```
@import 'folding';
```

配上完以上内容，素质三连 `hexo clean && hexo g && hexo s` 就可以在 Markdown 中使用啦！
