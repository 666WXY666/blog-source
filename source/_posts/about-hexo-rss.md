---
title: 为Hexo添加RSS订阅
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/hexo.png
abbrlink: 19c94341
date: 2019-11-29 16:04:03
tags: [Hexo,Rss]
categories: [Hexo]
keywords: [Hexo,Rss订阅]
description: 本篇介绍一下自己的博客如何添加 RSS 订阅功能。
---

## 配置

首先添加功能插件，在 hexo 项目根目录下执行该命令
```BASH
npm install hexo-generator-feed --save
```

然后在 hexo 根目录下的 `_config.yml` 文件中添加配置
```BASH
#订阅RSS
feed:
  type: atom
  path: atom.xml
  limit: false
```

配置含义：
1.  `type`: RSS的类型(atom/rss2)
2.  `path`: 文件路径，默认是 atom.xml/rss2.xml
3.  `limit`: 展示文章的数量,使用 0 或则 false 代表展示全部
4.  `hub`: URL of the PubSubHubbub hubs (如果使用不到可以为空)
5.  `content`: （可选）设置 `true` 可以在 RSS 文件中包含文章全部内容，默认：`false`
6.  `content_limit`: （可选）摘要中使用的帖子内容的默认长度。 仅在内容设置为false且未显示自定义帖子描述时才使用。
7.  `content_limit_delim`: （可选）如果content_limit用于缩短post内容，则仅在此分隔符的最后一次出现时进行剪切，然后才达到字符限制。默认不使用。
8.  `icon`: （可选）自定义订阅图标，默认设置为主配置中指定的图标。
9.  `order_by`: 订阅内容的顺序。 (默认: -date)

然后在 theme 目录下的 _config.yml 文件中添加配置
```BASH
rss: /atom.xml
```

随后重新生成博客静态文件
```BASH
$ hexo clean && hexo g
```

在 `public` 文件夹中就会生成 `atom.xml` 文件，部署后直接在根目录中访问该文件即可
```BASH
https://hasaik.com/atom.xml
```

## 订阅

下面以我博客为例子

订阅地址为：[https://hasaik.com/atom.xml](https://hasaik.com/atom.xml)（PS：订阅地址改为自己的博客）

![新建订阅](https://s2.ax1x.com/2019/11/29/QAuHOO.png)

![订阅成功](https://s2.ax1x.com/2019/11/29/QAKg3t.png)

![查看邮箱中的博文](https://s2.ax1x.com/2019/11/29/QAKqg0.png)

以上就是关于博客 RSS 订阅的全部介绍，如果您喜欢我发布的文章，亦可订阅[小站](https://mailchi.mp/3ca18a2a9749/xuxuy)，小站将第一时间为您奉上新发布的文章。
