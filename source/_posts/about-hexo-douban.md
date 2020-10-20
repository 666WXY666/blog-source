---
title: Hexo博客中加入豆瓣读书页面
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/hexo.png
abbrlink: 7fbe9500
date: 2019-11-14 15:08:54
tags: [Hexo,豆瓣]
categories: [Hexo]
keywords: [Hexo,豆瓣]
description: 在Hexo博客个性化定制中，加入豆瓣读书界面是一个很不错的功能，可以进入我的个人阅读界面查看效果，那么我是怎么做到的呢？其实很简单，我们只需要加入一个 hexo-douban 模块即可。
---
在Hexo博客个性化定制中，加入豆瓣读书界面是一个很不错的功能，[可以进入我的个人阅读界面查看效果](https://hasaik.com/books/)，那么我是怎么做到的呢？其实很简单，我们只需要加入一个 `hexo-douban` 模块即可。

{% linkCard https://github.com/mythsman/hexo-douban,hexo-douban的Github地址 %}

# 安装模块依赖

我们使用时可以先安装依赖模块，在GitBash中使用以下命令：
```BASH
$ npm install hexo-douban --save
```

## 站点配置文件中添加配置

然后我们再在Hexo站点根目录配置文件 `_config.xml` 中的末尾添加如下配置：
```BASH
douban:
  user: mythsman
  builtin: false
  book:
    title: 'This is my book title'
    quote: 'This is my book quote'
  movie:
    title: 'This is my movie title'
    quote: 'This is my movie quote'
  game:
    title: 'This is my game title'
    quote: 'This is my game quote'
  timeout: 10000
```
上面参数说明：

* user: 你的豆瓣ID.打开豆瓣，登入账户，然后在右上角点击 “个人主页” ，这时候地址栏的URL大概是这样：`https://www.douban.com/people/xxxxxx/` ，其中的 `xxxxxx` 就是你的个人ID了。
* builtin: 是否将生成页面的功能嵌入hexo s和hexo g中，默认是false,另一可选项为true(1.x.x版本新增配置项)。
* title: 该页面的标题.
* quote: 写在页面开头的一段话,支持html语法.
* timeout: 爬取数据的超时时间，默认是 10000ms ,如果在使用时发现报了超时的错(ETIMEOUT)可以把这个数据设置的大一点。

由于 `hexo-douban` 是默认抓取豆瓣读书、豆瓣电影以及豆瓣游戏的，如果只想要其中一部分，可以把其它部分在上述配置文件中去掉即可。

## 启动

那么我们如何去使用这个呢？

我们只需要在 `GitBash` 中输入以下命令：`hexo clean && hexo douban -bgm && hexo g && hexo s` 即可，注意其中开启hexo-douban的命令中，`-bgm` 代表的是book、game、movie三个参数，如果只需要其中的一部分就只带你想要的那些参数。

<div class="note danger">

另外注意的是，由于 `hexo douban` 的简写也是 `hexo d` ，与 `hexo deploy` 的简写指令 `hexo d` 冲突，因此在进行二者部署的时候，只能都打全名而不能打简写形式。
</div>

## 测试

上面都没问题之后，我们只需要在站点目录下测试 `http://localhost:4000/books` 或者 `http://localhost:4000/movies` 等，如果看到页面了就说明成功了。

## 部署

如果上述都没有问题，我们就可以在菜单栏中添加按钮了，打开主题配置文件 `_config.xml` ，找到菜单按钮，可以选择性的添加下面内容：
```BASH
menu:
  home: /
  archives: /archives
  books: /books     # 这是链接到books页面
  movies: /movies   #  这是链接到movies页面
  games: /games   # 这是链接到games页面
```
注意添加完成之后按钮并不是中文的，这是由于在 `languages` 文件夹下面的 `zh-CN`（中文语言配置文件）没有添加上述对应的中文参数信息，所以我们需要主动添加。

语言文件夹在你的主题配置文件夹下面，比如我的是使用的next主题，则是在 `E:\blog\hexo\themes\next\languages` 目录下，找到 `zh-CN` 文件，在menu菜单下添加：
```BASH
menu:
  books: 阅读
  movies: 电影
  games: 游戏
```
即可完成中文化自定义菜单。
