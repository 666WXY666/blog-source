---
title: 基于 TravisCI 实现 Hexo 在 Github 和 Coding 的同步部署
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/hexo.png
abbrlink: 3e5a3bb6
date: 2019-10-12 14:43:34
tags: [Hexo,Github,Coding,TravisCI]
categories: [Hexo]
keywords: [HEXO,TravisCI,Github,Coding]
description: 关于TravisCI我这里简单介绍一下，TravisCI是一个在线的、分布式的持续集成服务，可以用来构建和测试托管在Github上的代码，并且其本身就是开源的。TravisCI提供了主流编程语言如C#、Java、JavaScript、Ruby、PHP、Node.js等的支持，相比Jenkins而言，它是一个轻量级的持续集成平台，它会在每次提交代码后，根据配置文件来创建一个虚拟机，并执行用户定义的Build任务，这个虚拟机提供版本控制(Git)、项目构建(Node.js)等，在此前提下，我们下面着手Hexo的自动化部署。
---

关于TravisCI我这里简单介绍一下，TravisCI是一个在线的、分布式的持续集成服务，可以用来构建和测试托管在Github上的代码，并且其本身就是开源的。TravisCI提供了主流编程语言如C#、Java、JavaScript、Ruby、PHP、Node.js等的支持，相比Jenkins而言，它是一个轻量级的持续集成平台，它会在每次提交代码后，根据配置文件来创建一个虚拟机，并执行用户定义的Build任务，这个虚拟机提供版本控制(Git)、项目构建(Node.js)等，在此前提下，我们下面着手Hexo的自动化部署。

其原理就是Github和Coding（`小插曲：Coding现在已经被腾讯收购了`）各为TravisCI分配一个token，当我们向 Github 推送新的代码以后，TravisCI就会从代码仓库中拉取代码，并通过 npm 安装依赖生成静态页面，我们将这些静态页面推送到 master 分支，即可完成对Hexo的部署操作。

对于我个人博客是以 Github 作为代码的主仓库，其上面的 blog-source 分支存放博客的源代码，master 分支存放博客的静态页面，在此基础上，我们同时推送静态页面到 Github 和 Coding 的代码仓库，这样就可以实现两个平台的同步部署，这里的部署自然是指由 Travis 完成的自动化部署。整体的流程如下图所示：

![Travis自动构建流程图](https://s2.ax1x.com/2019/10/21/KlNiCR.png)

## Github相关操作

1、按规定仓库名称为 `XXXXX.github.io`，其中 `XXXXX` 为你的用户名，进行创建仓库。

![Github建库](https://s2.ax1x.com/2019/10/21/Kl0wjI.png)

2、建好仓库以后我们在仓库中新建一个分支放博客源码，我这里命名为 `blog-source`，建好以后将源码提交到该分支下即可。
   
![blog-source](https://s2.ax1x.com/2019/10/22/K3szy4.png)

3、为了使 Travis 能够将编译好的文件 push 回咱们的 Github，我们需要生成 `token`，步骤如下：
1. 在 Github 上 Setting 中找到 [Personal access tokens](https://github.com/settings/tokens) 设置。
2. 点 Generate new token，为 `token` 起一个名字，勾选 repo，然后点击生成一个新的 `token` ，并复制下来记录好，待会下面 Travis 配置会用到。（这个只会出现一次！！）

## Coding相关操作

1、因为腾讯云已经收购了 [Coding](https://coding.net) ，所以我们直接在 [腾讯云开发者平台](https://dev.tencent.com/production) 注册账号来管理我们的仓库。

2、注册完毕后我们新建一个名为 `XXXXX.coding.me` 的项目，其中 `XXXXX` 为你的用户名，基本操作与 Github 一致，实在不会的可以留言。

3、Coding可以和 Github 一样可以生成一个 `token` 如下图，成功以后将 `token` 保存好，一会下面会用到。

![blog-source](https://s2.ax1x.com/2019/10/22/K34SXV.png)

## Travis相关操作

1、使用 `github ` 帐号登录 [TravisCI](https://travis-ci.org) ，左上方按钮点击同步项目，下方打开需要集成的项目，最后点击齿轮进入项目配置页面

![Travis-首页](https://s2.ax1x.com/2019/10/24/KN4q56.png)

2、具体 `Travis` 配置如下图

![Travis-配置页](https://s2.ax1x.com/2019/10/24/KN5IW8.png)

3、配置好 `Travis` 后，回到终端，进入 `blog` 所在的文件夹下，新建 `.travis.yml` 文件，并添加以下内容

``` bash
sudo: false
language: node_js
node_js:
  - 10 # use nodejs v10 LTS

# 指定缓存模块，可选。缓存可加快编译速度。
cache:
  directories:
    - node_modules

# 指定博客的仓库地址
env:
 global:
   # Github Pages
   - GH_REF: github.com/XuxuGood/XuxuGood.github.io
   # Coding Pages
   - CO_REF: git.dev.tencent.com/XuxuGood/XuxuGood.coding.me.git

# 指定博客分支
branches:
  only:
    - blog-source # build master branch only

before_install:
  - npm install -g hexo-cli

# Start: Build Lifecycle
install:
  - npm install
  - npm install hexo-deployer-git --save


# 执行清缓存，生成网页操作
script:
  - hexo clean
  - hexo generate
  #gulp压缩文件
  - gulp

# 设置git提交名，邮箱；替换真实token到_config.yml文件，最后depoy部署
after_script:
  - cd ./public
  - git init
  - git config user.name "xuxu"
  - git config user.email "22476705@qq.com"
  - git add .
  - git commit -m "TravisCI 自动部署"

  # Github Pages
  - git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:master
  # Coding Pages
  - git push --force --quiet "https://XuxuGood:${CO_TOKEN}@${CO_REF}" master:master
  - git tag v0.0.$TRAVIS_BUILD_NUMBER -a -m "Auto Taged By TravisCI With Build $TRAVIS_BUILD_NUMBER"
  # Github Pages
  - git push --quiet "https://${GH_TOKEN}@${GH_REF}" master:master --tags
  # Coding Pages
  - git push --quiet "https://XuxuGood:${CO_TOKEN}@${CO_REF}" master:master --tags

  # Build Salver Repository(Github Pages)
  #- git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:master
  # Build Salver Repository(Github Pages)
  #- git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:master

# End: Build LifeCycle
```

4、然后，准备 `push` 该项目到 `github` ，看下是否成功，最终成功则会看到 `Travis` 构建页面显示如下图

![Travis-构建页面](https://s2.ax1x.com/2019/10/24/KNo94P.png)

以上就是基于 TravisCI 实现 Hexo 在 Github 和 Coding 同步部署的全部介绍，如有不明白的地方欢迎下方留言 o(^▽^)o ，谢谢阅读。
