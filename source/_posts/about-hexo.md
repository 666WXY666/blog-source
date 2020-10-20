---
title: Hexo博客+Next主题深度优化与定制
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/hexo.png
abbrlink: ab21860c
date: 2019-10-17 16:17:56
tags: [Hexo]
categories: [Hexo]
keywords: [HEXO,HEXO 优化]
description: 本教程只适用于 Next5 或者 Next6 主题，Next7 开始做了大量修改，并删除了 custom.styl 文件，同时增加了很多在 Next7 之前需要手动配置的功能，请随个人喜好进行版本选择。
---

## 写在前面
{% note warning,本教程只适用于 Next5 或者 Next6 主题，Next7 开始做了大量修改，并删除了 custom.styl 文件，同时增加了很多在 Next7 之前需要手动配置的功能，请随个人喜好进行版本选择。%}

{% note info,我的个人博客就是使用 Hexo 博客框架 + Next 主题搭建而来的，之前也使用过CSDN、博客园等，最后都放弃了，一方面是因为广告多，另外一方面样式我也不是很喜欢，而如果自己从零开始写博客源代码的话，比较复杂而且麻烦。后来偶然看到了 hexo 博客框架，并经过推荐使用了 Next 主题，这才正式入了 hexo 博客的坑！不得不说 Next 主题能够魔改并且自身集成了很多优秀的第三方插件是这款主题具有如此强大活力的根本原因😘。%}

本文下面主要先介绍 Hexo 博客和 Next 主题的搭建，如果你已经搭建好了博客框架，但是想进一步地修改博客样式，可以直接跳转到最下面[优化定制部分](#Next主题进阶优化配置)😄，本文参考的博客链接也会直接在文中插入或者在文末标明，如果有遗漏，欢迎指出。

Next 主题最新版本已经更新到 v7.5.0，以下很多内容都已经在新主题中做出了适配或者直接无法使用，愿意更新到最新版本的小伙伴请关注[官方文档更新](https://theme-next.org/)。不愿意更新的小伙伴或者目前使用的是旧版本（比如我还是 Next5 版本）可以继续进行一定的参考。

## 环境准备
在安装 hexo 框架之前，我们需要先安装该框架的依赖环境：

1. Node.js
2. Git

因为 Hexo 博客框架就是基于 Node.js 渲染的，所以必须要先安装 Node.js 环境，我们可以去[Node.js中文官网](http://nodejs.cn/download/)下载，如图

{% linkCard http://nodejs.cn/download/,安装地址 %}

![node.js](https://s2.ax1x.com/2019/11/13/MG5ZcV.png)

一般我们是在 windows 或者 macOS 环境下作为本机操作的，所以下载对应的安装包就可以了，下载好后一路点 next 下一步就完成了，这个没什么问题。

然后我们需要安装一下 Git，Git 主要是帮助我们部署到 Github Pages 静态仓库上以域名形式访问。

安装 Git 的话，如果是 windows 系统，可以直接去[Windows的Git下载地址](https://gitforwindows.org/)去下载，如果是 macOS 的话，也可以在[这里下载](https://www.git-scm.com/download/)。当这些环境都部署好之后，就可以开始我们的 hexo 博客安装啦！

{% linkCard https://gitforwindows.org/,Windows的Git下载地址 %}

{% linkCard https://www.git-scm.com/download/,MacOS的Git下载地址 %}

## 安装 Hexo 和 Next

### 安装 hexo
本文安装环境为 windows10，所以以下都以 windows 操作系统下安装为例。

{% note danger,安装之前需要说明几个注意事项：<br>- 很多命令既可以使用 windows 的 cmd 命令行来完成，也可以使用刚才安装好的 Git 命令行工具 Git Bash 来完成，但是在 cmd 中部分命令会出现一些问题，建议只使用 Git Bash 来执行命令。<br>- Hexo 不同版本之间有差别，要注意自己安装的版本是哪个版本（跟着本文走就没问题啦），如果修改样式的话注意网上教程的 Hexo 版本差异。<br>- Hexo 安装好后有 2 种<code>_config.xml</code>文件，一个是 hexo 站点根目录下的全局<code>_config.xml</code>文件，还有一种是每个主题 theme 下的各自的<code>_config.xml</code>文件，注意区分二者，后面会详细说到。<br>%}

#### 安装 hexo
依然是在 GitBash 中操作，输入以下命令，等待安装完成。
```BASH
$ npm install -g hexo-cli
```

#### 创建 hexo 文件夹
在电脑某个位置创建一个名为 hexo 的文件夹（当然名字可以随便取），比如我个人的就是 `E:\blog\hexo` ，由于这个文件夹是你以后存放博客代码和文章的地方，所以最好不要乱放，然后我们在 GitBash 中使用 cd 命令移动到创建好的文件夹中。
```BASH
$ cd /e/blog/hexo
```

#### 初始化 hexo
在上面 cd 到创建的文件夹后，输入以下命令进行初始化
```BASH
$ hexo init
```

这个命令执行的时间非常长，主要是初始化 hexo 博客中的文件夹，包括 hexo 博客内置的各种 node_modules 组件等等，所以耐心的稍等一下！如果初始化失败建议删除文件夹内容后重试。

初始化完成后，我们打开刚才创建的文件夹，会发现里面包含如下文件夹：

![](https://s2.ax1x.com/2019/10/21/Klkwa4.png)

注意，其中有一个_config.xml文件，这个我们叫做<font color="red">站点根目录配置文件</font>，里面的初始内容如下：（附上中文介绍）
```
# Hexo Configuration
## Docs: https://hexo.io/docs/configuration.html
## Source: https://github.com/hexojs/hexo/

# Site 站点主配置
title: Hexo  # 网站标题
subtitle:    # 网站副标题
description:   # 网站描述
keywords:      # 可以不填写保持默认
author: John Doe  # 网站拥有者昵称
language:    # 网站语言设置，一般根据依赖的主题而定
timezone:    # 网站时区设置，一般不填写保持默认

# URL地址链接设置
url: http://yoursite.com   # 网站url设置
root: /                    # 网站根目录链接
permalink: :year/:month/:day/:title/   # 文章链接，默认是按照 /年/月/日/文章标题 设置的链接
permalink_defaults:                    # 默认链接形式

# Directory  网站主要目录，这里一般不做改动
source_dir: source
public_dir: public
tag_dir: tags
archive_dir: archives
category_dir: categories
code_dir: downloads/code
i18n_dir: :lang
skip_render:

# Writing  网站文章设置，同样一般不做改动
new_post_name: :title.md  # File name of new posts
default_layout: post
titlecase: false # Transform title into titlecase
external_link: true # Open external links in new tab
filename_case: 0
render_drafts: false
post_asset_folder: false
relative_link: false
future: true
highlight:
  enable: true
  line_number: true
  auto_detect: false
  tab_replace:
  
# Home page setting  主页设置，一般不做改动
index_generator:
  path: ''
  per_page: 10
  order_by: -date  # 首页文章排序，默认是按照文章日期递减
  
# Category & Tag  分类设置，一般不做改动
default_category: uncategorized
category_map:
tag_map:

# Date / Time format  日期设置，一般不做改动
date_format: YYYY-MM-DD
time_format: HH:mm:ss

# Pagination  导航页设置，一般不做改动
per_page: 10   # 设置每页展示多少文章
pagination_dir: page

# Extensions  使用的主题名称，可以在这里切换
theme: next  # 此处切换主题名称

# Deployment  部署，一般选择部署到Github上
deploy:
  type:
```

其实到这里来说，我们的 hexo 博客已经做好了！不信？我们执行下面命令看看：
```BASH
//cd到根目录执行
$ hexo g
$ hexo s
```
然后我们打开浏览器，输入 `http://localhost:4000` ，是不是惊奇的发现已经完成了？

![首页](https://s2.ax1x.com/2019/10/21/KlAJFH.png)

等….等一下，页面怎么是英文的😫？？？！

别慌，上面提到配置文件的时候已经说到是语言没有修改了，我们可以打开 hexo 目录下的 themes 文件夹，发现里面有一个 landscape 文件夹，没错，你刚才看到的默认主题就是这个名叫 `landscape` 的主题，这个主题是 hexo 博客自带的默认主题，当然我们可以下载其它主题来代替它，具体方式在后面会介绍。

然后我们先来分析一下这个 landscape 主题文件夹：

![](https://s2.ax1x.com/2019/11/13/MGH9Fe.png)

注意这里面有一个 `_config.xml` 配置文件，其实上面已经强调过，这个跟前面的站点根目录下配置文件同名，但是这个配置文件是在主题目录下的，那么这个配置文件我们一般就叫做<font color="red">主题配置文件，基本每个 hexo 博客第三方主题下面都会有这个配置文件，所以主题配置文件是一种统称。</font>

里面的初始内容我们暂时不管（因为不同主题的配置文件内容不一样，反正我们又不使用这个主题~）。

先来看看上面的 languages 文件夹，一看就懂，都知道这就是网站语言配置文件，好，我们进去看一下，噢~里面的 zh-CN 和 zh-TW 可不就是中文吗。其中 zh-CN 指的是简体中文，zh-TW（湾湾）是繁体中文，欧克。然后我们再去站点根目录下，注意这里是 <font color="red">站点根目录下（hexo/_config.xml）</font>的配置文件中（千万别懵逼了），将这里：
```DIFF
# Site 站点主配置
title: sanarous教你搭建Hexo博客  //网站标题修改
subtitle: so easy~  //副标题修改
description:  //网站描述
keywords: hexo,next,Java,博客    //网站关键字,用英文逗号分开
author: Sanarous   //此处填写你自己的昵称  
+ language: zh-CN    //这里改成上面在主题配置文件中看到的语言名字，注意英文冒号:后面有一个空格
timezone:   //网站时区，保持默认就可以了
```
更改完后，我们回 GitBash 命令行，输入以下命令：
```BASH
$ hexo g && hexo s
```
再重新打开浏览器刷新，是不是页面语言变成中文的了！

好吧，现在先说一下上面的命令中的 `hexo s && hexo g` 是什么东西，`hexo s` 是启动 hexo 服务的，可以理解为是 `hexo serve` 或者 `hexo start` ，一般都是简写为 `hexo s` ，而 `hexo g` 是重新生成 public 文件夹的命令，全称是 `hexo generator` ，那么 public 文件夹是什么呢？

别慌，我们回头看一下 hexo 文件夹目录：

![文件夹](https://s2.ax1x.com/2019/11/13/MGb6vn.png)

看到这个 public 文件夹嘛，这个里面就是生成的所有静态文件，包括 html，css，js 文件以及图片等，稍微懂一些前端的人就知道这个文件夹就是你的博客被 node.js 渲染后生成的最终文件夹，这个文件夹中点开 index.html 就能看到你的博客页面了😄！简单点来说如果在本地修改了什么文件内容，可以使用 `hexo g` 命令重新生成一下public文件夹，那么这个文件夹只要修改了，再使用 `hexo s` 启动服务就可以看到页面变化了，当然 `hexo s` 本身就具有在线调试的功能，如果 `hexo s` 无法刷新页面修改内容，那么使用 `hexo g && hexo s` 就可以看到更改内容啦~

#### 第一篇博客文章
博客基本框架完成后，我们做的第一件事就是创建第一篇个人博客啦！可以在 Gitbash 中 cd 到 hexo 根目录，使用如下命令：
```BASH
hexo new "我的第一篇博客"

//或者可以简写为

hexo n "我的第一篇博客"
```
就可以在 `hexo/source/_posts` 文件下面新建一个 `.md` 文件，这个 `.md` 文件就是 Markdown 文件，所以我们写博客只要在本地编辑这个 Markdown 文件就可以了。Markdown 语法可以 Google 一下使用教程，比较简单并且实用。

### 将 Hexo 博客部署到 Github 上
1. 为什么要部署到 Github上呢，当然是有以下原因：
2. 因为 Hexo 博客都是静态文件，GithubPages 自身就支持静态文件。
3. 免费方便，不用花一分钱就可以自己搭建一个自由的个人博客，并且没有服务器没有后台。
4. 可以随意绑定自己的域名，并且可以一键开启 HTTPS，很方便。
5. 数据绝对安全，github 可以恢复任意版本。
6. 博客内容可以轻松打包、转移以及发布到其它平台。
7. ……

在部署到 Github 之前，我们需要准备好自己的 Github 账号，Github 账号可以在 Github 官网注册。

{% linkCard https://github.com,Github官网 %}

#### 创建 Github 仓库
首先我们需要在 Github 上创建一个 repository，就是创建一个仓库的意思，在登录账号后首页就有一个显眼的 create new repository，点进去就可以看到了，注意名字必须为你的 `Github用户名.github.io` ，如下图：

![github](https://s2.ax1x.com/2019/10/21/Kl0wjI.png)

不能设置为其它名字，只能用这个仓库名。这样设置以后，我们在不绑定域名的前提下，可以直接使用 `http://Sanarous.github.io` 来访问自己的个人博客，这样就相当于有一个个人域名，并且是永久免费的！

#### 配置 SSH Key
如果是第一次在自己的本机上使用 Git 上传到 Github 上，那么必须配置 `SSH key` ，表示 Github 允许这台机器有权限使用 Git 上传代码到远端仓库。

我们可以在 GitBash 中使用 `$ cd ~/.ssh` 命令来查看本机已经存在的 ssh 密钥，如果是第一次使用会显示 `No such file or directory` ，如果不是的话，就需要用已经存在的密钥或者重新生成一份了。

然后输入
```BASH
$ ssh-keygen -t rsa -C "邮件地址"
```
上面的邮件地址就是你的 Github 注册邮箱地址，在提示后连续回车，最终会生成一个文件在 C 盘用户目录下面

![ssh](https://s2.ax1x.com/2019/11/13/MGOE9g.png)

打开这个 .ssh 文件，里面存放了密钥，然后我们打开自己的 Github 个人主页，进入 `个人设置 -> SSH and GPG keys -> New SSH key`

![ssh1](https://s2.ax1x.com/2019/11/13/MGOrCD.png)

上面的 Title 可以任意填写，下面的 key 注意要打开 .ssh 文件，将密钥复制进去

#### 测试是否成功

使用如下命令：
```BASH
$ ssh -T git@github.com # 注意邮箱地址不用改
```
如果提示 `Are you sure you want to continue connecting (yes/no)?` 点击yes，会显示

`Hi Sanarous! You've successfully authenticated, but GitHub does not provide shell access.`

看到这个信息就说明 SSH 已经配置成功！

#### 配置 Git 提交的用户信息
上面配置成功后，我们就可以设置 Git 的全局用户信息了，这个信息设置当前 Git 命令上传代码的用户信息。

使用以下命令：
```BASH
$ git config --global user.name "XuxuGood" // 你的github用户名，非昵称
$ git config --global user.email  "xxx@qq.com" // 填写你的github注册邮箱
```
配置完成后以后提交代码都是使用的这个用户信息进行提交的。

#### 将 Hexo 博客部署到 Github 上
首先打开 hexo 站点的配置文件，找到 deloy 并填写如下配置：

文件位置：`hexo/_config.xml`
```BASH
deploy:
  type: git
  repository: git@github.com:XuxuGood/XuxuGood.github.io.git # 用户名改成你自己的
  branch: master
```
或者也可以写成这样：
```BASH
deploy:
  type: github
  repository: https://github.com/XuxuGood/XuxuGood.github.io.git
  branch: master
```
无论是哪种写法，此时直接执行 `hexo d` 的话一般会报如下错误：`Deployer not found: github` 或者 `Deployer not found: git`

原因是还需要安装一个插件 `hexo-deployer-git` ，我们可以在 Git 中 cd 到 hexo 根目录，并输入以下命令：
```BASH
cd /e/hexo/
npm install hexo-deployer-git --save
```
然后我们可以使用 `hexo clean && hexo g && hexo deploy` 命令来完成一键部署到 Github 上。

### 安装 Next 主题
由于默认的主题 landscape 界面比较丑（当然魔改也是可以的），我们可以使用 Hexo 官方推荐的主题：[https://hexo.io/themes](https://hexo.io/themes) ，如果喜欢这里面的某些主题，可以直接去上面主题对应的界面中的 Github 中下载（下载方式与稍后介绍的下载 Next 主题一样）。

目前在 Github 上 star 数量比较多的有 Next 主题、yillia 主题等，Next 主题基本占据了 Hexo 博客的半壁江山，并且 Next 主题集成功能较多，因此我下面只介绍 Next 主题的使用方式。

首先我们可以打开 Github，全局搜索 `hexo-next` ，我们会发现是有两个 star 数量比较高的：

![hexo-next](https://s2.ax1x.com/2019/11/13/MGjatK.png)

{% note info,其中第一个是 Next5 版本的，而第二个是 Next6 版本的。2019/7/27 更新：第二个 Github 仓库目前一直是 Next 主题更新最新版本的的仓库，目前已经更新到 v7.2.0，以下内容仅供参考。%}

注意上面说的版本关系，在 Next6 版本上其实增加了很多 Next5 需要手动配置的东西，并且 Next5 已经停止维护了，如果不太喜欢自己手动去配置的话，建议使用 Next6 版本。当然本博客使用的仍然是 Next5 版本，如果需要我的个性化设置的话也可以留言。

下面我们来安装 Next 主题。

#### 下载 Next 主题
以下均以 Next6 版本为例，Next5 版本操作基本一样。

进入[https://github.com/theme-next/hexo-theme-next](https://github.com/theme-next/hexo-theme-next)

我们安装 Next6 版本的话，有两种方式：
1. 在 GitBash 中 cd 到博客根目录下，然后使用 git clone 命令将 Next 仓库克隆到 hexo 目录下的 `themes/next` ，即命令是 `git clone https://github.com/theme-next/hexo-theme-next.git themes/next`
2. 直接在 Github 页面上选择绿色的按钮 `Clone or Download` ，点击下载 zip 压缩包。

如果第一种方式比较慢的话，可以直接选择第二种方式直接下载，然后将下载好的压缩包解压后放在 `E:\blog\hexo\themes\` 下面，`git clone` 的话也是在这个下面，下载好后的名字可以任取。

#### 设置 hexo 博客为 Next 主题
在站点根目录下_config.xml配置文件中，找到如下代码并进行配置：

文件位置：hexo/_config.xml
```DIFF
# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
- theme: landscape      # 更改原始默认的主题名称，修改为如下
+ theme: hexo-theme-next   # 此处填入你在themes目录下的next主题文件名
```

#### 测试 Next 主题
在 `GitBash` 中输入
```BASH
$ hexo clean && hexo g && hexo s
```
等待启动完成在浏览器中输入http://localhost:4000即可查看安装好的 Next 主题！

## Next 主题基本功能配置
Next 主题安装好后的初始界面也是很简洁的，我们可以先设置一些常用功能😊。

首先为了防止懵逼，再次友情提醒：在这里修改的一律是主题配置文件 `_config.xml` ，目录是 `hexo/themes/next/_config.xml` ，千万不要走错地方了！

我们打开 `_config.xml` 主题配置文件对应一一修改。

{% note danger,由于配置文件是 yml，如果对 yml 语法不太熟的小伙伴，注意每个配置之间都必须有空格，不然报错。如 <code>override: false</code> ，注意英文冒号 <code>:</code> 后面有一个空格，所有 yml 语法都是这样。%}

以下默认使用的文本编辑器为 notepad++、WebStorm 或者 sublime，主题使用的是 Next6 版本（注意 Next 官方会不断进行更新，所以下面的不一定都有效，因为官方正在不断集成更多功能，具体地可以自行在配置文件中探索~）

以下均在 `hexo s` 在线调试环境中进行修改~

### 网站favicon图标设置

![favicon](https://s2.ax1x.com/2019/11/13/MJSy28.png)

favicon 图标相当于是网站的 logo 简化版，所以我们也可以给自己的网站添加一个 favicon 图标，使用notepad++、WebStorm 或者 sublime 打开配置文件后，使用 `Ctrl+F` 搜索 `favicon`

文件位置：hexo/themes/next/_config.xml
```BASH
favicon:
  small: /images/favicon-16x16-next.png  # 网站小图标
  medium: /images/favicon-32x32-next.png   # 中等图标
  apple_touch_icon: /images/apple-touch-icon-next.png  # app_touch上显示图标   
  safari_pinned_tab: /images/logo.svg   # 在Safari浏览器中显示图标
  #android_manifest: /images/manifest.json  # 安卓默认显示同普通情况下
  #ms_browserconfig: /images/browserconfig.xml
```
网站 favicon 图标可以放到你的 next 主题目录下面的 `source/images` 中，然后按照上述相对路径方式引用，这里 favicon 图标不需要非得是 ico 格式的，也可以是 png 或其它图片格式。

如果是有第三方图床放图片链接的，也可以直接改成图片链接。

### 网站页脚小心心定义

![heart](https://s2.ax1x.com/2019/11/13/MJ9RNn.png)

在 Next5 版本中需要手动修改设置，但是在 Next6 中已经集成好这个功能了，搜索 footer，设置如下，就可以在页脚看到跳动的小心心啦

文件位置：hexo/themes/next/_config.xml
```BASH
footer:
  # 指定网站开始运行的年份，如果不指定，则默认为当前年份
  since: 2019

  # 在页脚年份和版权信息中间显示的图标
  icon:
    # 图标形状显示，可以参考 https://fontawesome.com/v4.7.0/icons 中的名字
    # 官方建议使用 heart 图标，颜色设置为 #ff0000，这也显示的是跳动的心
    name: heart
    # 如果想要图标跳动，下面设置为 true
    animated: true
    # 改变图标颜色
    color: "#ff0000"
```

### 关闭底部由 hexo 强力驱动的广告

![HEXO-驱动](https://s2.ax1x.com/2019/11/13/MJiCtA.png)

由于默认的页面中 hexo 会在网页底部居中位置打个广告（要恰饭的嘛），但是官方还是很良心的在配置文件中设置了广告开关，还是在上面 footer 中，如下配置全部设置为 false 就可以关闭广告了。
```DIFF
  powered:
    # Hexo link (Powered by Hexo).
-    enable: false
    # Version info of Hexo after Hexo link (vX.X.X).
-    version: false

  theme:
    # Theme & scheme info link (Theme - NexT.scheme).
-    enable: false
    # Version info of NexT after scheme info (vX.X.X).
-    version: false
```

### 菜单栏设置

在配置文件中搜索 menu，找到如下：
```BASH
menu:
  home: / || home
  #about: /about/ || user
  #tags: /tags/ || tags
  #categories: /categories/ || th
  archives: /archives/ || archive
  #schedule: /schedule/ || calendar
  #sitemap: /sitemap.xml || sitemap
  #commonweal: /404/ || heartbeat

# Enable/Disable menu icons.
menu_icons:
  enable: true  #表示是否显示菜单图标icons
  badges: false  # 显示每个菜单下面有多少个内容
```
其中 `||` 后面表示的 Fontawesome 中的图标名称，如果想要修改图标，可以去[FontAwesome官网](http://www.fontawesome.com.cn/)找自己喜欢的图标样式，前面部分 `/about/` 是表示该菜单的相对链接，比如网站主页访问是 `https://bestzuo.cn` ，那么点击这个菜单栏的链接就变成了 `https://bestzuo.cn/about/` 这种形式。

如果需要增加菜单栏的话，可以在 Gitbash 中输入以下命令：
```BASH
hexo new page "photos"

//或者可以间写为如下形式

hexo n page "photos"
```

这样就会自动在 `hexo/source` 目录下生成一个文件夹，而且里面是一个 `index.md` 文件，Node.js 最终会把这个 md 文件渲染成 html 文件，所以菜单栏中内容就在这个 md 文件中写就可以，并且文章内支持 html 写法，所以具有很强的扩展性🤣，创建之后，就需要在配置文件这个地方添加上新增菜单的名称以及链接格式和 FontAwesome 图标，然后打开 `hexo/themes/next/languages/zh-CN.yml` 文件，在 menu 下面按照格式汉化你的菜单栏名称~

### Next主题四种风格设置
Next 主题支持四种内置风格，每个人喜欢的风格都不同，可以在基础风格上继续进行魔改。搜索 schema，找到如下代码：
```BASH
# Schemes
scheme: Muse
#scheme: Mist
#scheme: Pisces
#scheme: Gemini
```
四种风格样式可以自己进行切换，可以在本地 `hexo g && hexo s` 后在线调试这个地方的代码，喜欢哪个就选哪个吧~

### 社交链接设置
社交链接主要是在侧边栏中展示的，一般都是自己的各种网站主页。搜索 social，找到如下代码：
```BASH
#social:
  #GitHub: https://github.com/yourname || github
  #E-Mail: mailto:yourname@gmail.com || envelope
  #Google: https://plus.google.com/yourname || google
  #Twitter: https://twitter.com/yourname || twitter
  #FB Page: https://www.facebook.com/yourname || facebook
  #VK Group: https://vk.com/yourname || vk
  #StackOverflow: https://stackoverflow.com/yourname || stack-overflow
  #YouTube: https://youtube.com/yourname || youtube
  #Instagram: https://instagram.com/yourname || instagram
  #Skype: skype:yourname?call|chat || skype
```
后面的 yourname 改成你自己在对应网站的 ID，然后将前面的 # 注释去掉。其中 `||` 后面还是表示该链接前面的图标在 FontAwesome 中的名称，可以进行自定义修改。

### 友情链接设置

友情链接也是处于侧边栏中的，这里可以完全自定义内容，一般可以用来放社交圈子链接（不过一般博客都会单独做一个页面放其它人的博客友链）。搜索 links，找到如下配置
```BASH
# Blog rolls
links_icon: link
links_title: Links
links_layout: block
#links_layout: inline
#links:
  #Title: http://example.com/
```
这里可以添加你想要的友情链接，比如可以添加百度链接：
```BASH
# Blog rolls
links_icon: link  # 链接对应的Fontawesome图标名称
links_title: Links # 设置链接标题，可以自定义
links_layout: block   # 图标布局方式，有inline和block两种
#links_layout: inline
links:
  Baidu: https://www.baidu.com/
  Github: https://github.com/
```

### 侧边栏设置

搜索 sidebar，找到如下配置
```BASH
sidebar:
  # Sidebar Position, available value: left | right (only for Pisces | Gemini).
  # 此处设置只适用于Pisces或者Gemini风格
  position: left
  #position: right

  # 侧边栏如何展示
  display: post    # 侧边栏在打开文章的时候显示
  #display: always  # 侧边栏不管在哪都显示
  #display: hide    # 隐藏侧边栏
  #display: remove  # 移除侧边栏

  # Sidebar offset from top menubar in pixels (only for Pisces | Gemini).
  offset: 12

  # 设置返回页面顶部设置，只适用于Pisces或者Gemini风格，建议开启
  b2t: true

  # 显示浏览百分比，建议开启
  scrollpercent: true

  # Enable sidebar on narrow view (only for Muse | Mist).
  onmobile: false
```

### 文章开启阅读更多按钮
如果不开启阅读更多按钮的话，默认是展示文章中所有内容的，这显然体验不好。

一般都会在文章中插入 `<!--more-->` 这种注释形式表示首页展示到注释处为止。或者会使用如下官方配置文件中自带的方式。一般都推荐使用注释的方式，因为下面这种 `auto_excerpt` 方式不会保留前面的行文样式，但是注释方式会保留样式。

搜索 auto_excerpt，找到如下：
```BASH
auto_excerpt:
  enable: true
  length: 150 #到多少字数后不显示
```
默认是关闭的，也就是首页上默认显示整篇文章，而为了显示阅读更多按钮，我们可以开启这个服务。

### 文章元数据设置

![元数据](https://s2.ax1x.com/2019/11/14/MY7yJe.png)

元数据就是显示在 home 页的文章创建于、更新于、阅读次数之类的数据，搜索 post_meta，找到如下配置：
```BASH
post_meta:
  item_text: true  # 是否显示对应的文字
  created_at: true  # 是否显示 创建于
  updated_at:       # 是否显示 更新于
    enabled: false
    # 更新日期显示规则，只有更新日期与创建日期不同时，才会显示
    another_day: true
  categories: true # 是否显示分类信息
```
上面应该已经说明的很详细了吧~

### 文章字数统计设置

由于上面元数据中没有带统计文章字数功能，所以需要利用插件来生成，搜索 post_wordcount，找到如下配置：
```BASH
# Post wordcount display settings
# Dependencies: https://github.com/theme-next/hexo-symbols-count-time
symbols_count_time:
  separated_meta: true
  item_text_post: true
  item_text_total: false
  awl: 4
  wpm: 275
```
注意开启上述设置必须要添加 `hexo-symbols-count-time` 模块依赖，即在 hexo 站点根目录下使用

`npm install hexo-symbols-count-time --save` 命令安装模块后开启上述功能使用。

### 侧边栏头像设置

侧边栏中没有博主头像是没有灵魂的。Next6 主题中自带鼠标放在头像上能旋转 360度的功能，如果是 Next5 的话需要自己手动配置。

搜索 avatar，找到如下配置
```BASH
# Sidebar Avatar
avatar:
  # 如果放在本地(source/images): /images/avatar.gif
  # 如果第三方图床，直接写地址
  url:  # 此处是头像的地址
  rounded: true   # 设置头像是否为圆形
  opacity: 1    # 设置不透明度，1为完全不透明，0为完全透明
  rotated: true   # 设置鼠标放到头像上是否旋转
```

### 代码块设置

Next6 中自带了复制代码按钮，Next5 需要自己手动配置。

搜索 codeblock，找到如下配置：
```BASH
codeblock:
	border_radius: 8   # 按钮圆滑度
	copy_button:  # 设置是否开启代码块复制按钮
		enable: true
		show_result: true  # 是否显示复制成功信息
```

### 开启文章打赏按钮
一篇辛辛苦苦敲出来的文章，不妨开启一下文章打赏功能，万一真有人给你棒棒糖呢😆 ~

搜索 reward，找到如下配置并修改：
```BASH
# Reward
reward_comment: 坚持原创技术分享，感谢您的支持和鼓励！
wechatpay: # 微信收款图片地址
alipay:  # 支付宝收款图片地址
#bitcoin: /images/bitcoin.png  # 比特币
```

### 开启相关文章推荐功能

![相关文章](https://s2.ax1x.com/2019/11/14/MYbnH0.png)

要优化读者体验的话，可以在读者阅读完一篇文章后，能自动推荐相关内容的文章，不仅能考虑读者感受，还能给自己博客文章带来阅读量，岂不是一举两得😆 ？

搜索 related_posts，找到如下配置：
```BASH
related_posts:
  enable: true  # 是否开启
  title: 相关文章推荐    # 标题
  display_in_home: false # 是否在首页显示，建议为false
  params:
    maxCount: 5   # 相关文章的最大数量
    #PPMixingRate: 0.0
    #isDate: false
    #isImage: false
    #isExcerpt: false
```
开启相关文章推荐需要安装 `hexo-related-popular-posts` 模块，即在 hexo 站点根目录下使用 `npm install hexo-related-popular-posts --save` 安装模块，然后开启上面的相关文章功能就可以啦~

### 开启文章版本信息
搜索 post_copyright，找到配置
```BASH
post_copyright:
  enable: false
  license: CC BY-NC-SA 3.0
  license_url: https://creativecommons.org/licenses/by-nc-sa/3.0/
```
设置为 true 可以打开，这样在每篇文章最后都会有版权提示。

### 代码块风格设置
搜索 highlight_theme，有以下多种风格：
```BASH
# Code Highlight theme
# Available values: normal | night | night eighties | night blue | night bright
# https://github.com/chriskempson/tomorrow-theme
highlight_theme: night eighties
```
可以自己修改上面 normal 、night 、 night eighties 、 night blue 、night bright 在线调试选择自己喜欢的风格。

### 添加valine评论系统
没有评论系统的博客是没有灵魂的，不仅如此，当前免费开源的评论系统中，valine 因为简洁并且支持匿名留言得到很多博主的喜爱，而像其它的来必力（韩国的）、Gitalk（Github的）等都有这样那样的缺点，不太建议使用。

需要注意的是valine后台评论保存是依赖于 leancloud的，leancloud 是一个面向个人用户免费的存储系统（当然不止是提供存储功能，还有其它服务），我们需要在 leancloud 官网注册，具体步骤可以看[valine的官方文档](https://valine.js.org/)介绍。

搜索 valine，找到如下配置：
```BASH
valine:
  enable: true
  appid:   # your leancloud application appid
  appkey:  # your leancloud application appkey
  notify: false # mail notifier , https://github.com/xCss/Valine/wiki
  verify: false # Verification code
  placeholder: 留下邮箱，有回复时你将收到提醒，邮箱不会被公开。 # comment box placeholder
  avatar: wavatar # gravatar style https://valine.js.org/avatar/
  guest_info: nick,mail # custom comment header default: nick,mail,link
  pageSize: 10 # pagination size
```
注意由于 valine 依赖于 leancloud 存储服务，因此要先去 [https://leancloud.cn](https://leancloud.cn) 网站注册，获取到 appid 和 appkey 后放到这里就 ok 了。其中 avatar 是设置默认头像，可以去 [https://valine.js.org/avatar](https://valine.js.org/avatar) 选择默认头像，然后在这里设置名字即可。具体使用可以参考[valine的官方文档](https://valine.js.org/)。

### 开启分享按钮

百度分享对国内网站来说更友好一些，搜索 baidushare，找到如下代码：
```BASH
baidushare:
  type: button  # 设置分享按钮的风格，有button何slide形式
```
将注释去掉打开即可，虽然说是默认不支持 https 格式，但是网上有解决方案，可以 Google 一下。

如果嫌麻烦的话，也可以使用下面支持 https 的 needmoreshare。如果要开启 needmoreshare 的话，可以搜索 needmoreshare2，找到如下代码：
```BASH
needmoreshare2:
  enable: false
  postbottom:
    enable: false
    options:
      iconStyle: box
      boxForm: horizontal
      position: bottomCenter
      networks: Weibo,Wechat,Douban,QQZone,Twitter,Facebook
  float:
    enable: false
    options:
      iconStyle: box
      boxForm: horizontal
      position: middleRight
      networks: Weibo,Wechat,Douban,QQZone,Twitter,Facebook
```
注意 needmoreshare2 是依赖 theme-next-needmoreshare2 模块的，可以去 [https://github.com/theme-next/theme-next-needmoreshare2](https://github.com/theme-next/theme-next-needmoreshare2) 找到使用方法。

### 设置文章阅读量

搜索 leancloud_visitors，并进行如下配置：
```BASH
leancloud_visitors:
  enable: true
  app_id: 
  app_key: 
  # Dependencies: https://github.com/theme-next/hexo-leancloud-counter-security
  # If you don't care about security in lc counter and just want to use it directly
  # (without hexo-leancloud-counter-security plugin), set the `security` to `false`.
  security: false
  betterPerformance: true
```
这个功能依赖 hexo-leancloud-counter-security 模块，需要安装该插件。

注意这个 appid 和 appkey 跟上面开启 valine 评论使用的 leanCloud 是一样的，但是需要在 leancloud 中创建 classes 对象存储，具体方式可以 Google 一下。

### 开启不蒜子统计功能

目前不蒜子统计网站统计做的还可以，网站访问量主要是分为 pv 和 uv 两种，pv 是指页面访问量，每访问一次或者刷新一次页面后该页面的 pv+1，而 uv 是指独立 ip 访问量，就是说一天内同一 ip 访问一个页面 N 次，uv 都只是 + 最开始的那一次。一般用 pv 作为页面的访问量，uv 作为页面的访客量。

搜索 busuanzi_count，可以配置如下，也可以使用默认设置。
```BASH
# Show Views/Visitors of the website/page with busuanzi.
# Get more information on http://ibruce.info/2015/04/04/busuanzi/
busuanzi_count:
  enable: true
  site_uv: true #total visitors
  site_uv_icon:  #user-circle
  site_uv_header: 你是来访的第
  site_uv_footer: 位小伙伴
  site_pv: false #total views
  site_pv_icon: eye
  site_pv_header: 访问次数：
  site_pv_footer: 次
  post_views: false
  post_views_icon: eye
```
注意其中的 post_views 与上面的 leanCloud_visitors 冲突，两者都是显示文章阅读量，只开启一个就可以了。

### 开启本地博客搜索功能

提升读者用户体验，博客内肯定是需要一个全局搜索按钮的。当然hexo已经集成了几款开源的搜索插件，一般都使用的是 local_search。

搜索 local_search，设置代码如下：
```BASH
# Local search
# Dependencies: https://github.com/theme-next/hexo-generator-searchdb
local_search:
  enable: true
  # if auto, trigger search by changing input
  # if manual, trigger search by pressing enter key or search button
  trigger: auto
  # show top n results per article, show all results by setting to -1
  top_n_per_article: 1
  # unescape html strings to the readable one
  unescape: false`
```
注意该搜索功能需要依赖 `hexo-generator-searchdb` 插件，依然还是使用命令 `npm install hexo-generator-searchdb --save` 来进行安装。然后 在 hexo 站点根目录配置文件 _config.xml 的末尾，加入以下代码即可。
```BASH
search:
  path: search.xml
  field: post
  format: html
  limit: 10000
```

### 修改加载特效

由于网页不可能一直都秒进，总会等待一段时间的，所以可以修改一下加载的特效。Next 已经集成了很多加载特效，可以在下面选项中在线调试测试一下。

搜索 pace，找到如下代码：
```BASH
# Progress bar in the top during page loading.
pace: false
# Themes list:
#pace-theme-big-counter
#pace-theme-bounce
#pace-theme-barber-shop
#pace-theme-center-atom
#pace-theme-center-circle
#pace-theme-center-radar
#pace-theme-center-simple
#pace-theme-corner-indicator
#pace-theme-fill-left
#pace-theme-flash
#pace-theme-loading-bar
#pace-theme-mac-osx
#pace-theme-minimal
# For example
# pace_theme: pace-theme-center-simple
pace_theme: pace-theme-center-radar #默认设置，可以修改为上述任何一个
```
可以自己修改后使用 `hexo s` 本地调试挑选自己喜欢的加载样式。

### 开启3D背景

给博客添加 3D 背景特效，说实话我只在最开始折腾博客的时候开过，后来为了提升响应速度，这些不必要的东西都给关闭了。

配置文件中代码如下：
```BASH
# Canvas-nest
canvas_nest: false

# three_waves
three_waves: false

# canvas_lines
canvas_lines: false

# canvas_sphere
canvas_sphere: false
```
默认为 false，可以自己逐一设置为 true 然后在本地调试查看3D效果。

## Next主题进阶优化配置

在介绍完 Next 主题的基本配置后，下面才是本文的重头戏，在 Next 进阶配置时，一定需要你懂一些 CSS 和基本的前端知识，不然报错了可能你根本无从寻找问题原因，或者在进行大面积修改前先将主题备份一份，这样出错后找不到原因还能及时止损😂 。

### 学会使用浏览器F12定位样式

发现页面有大量留白？颜色不合自己口味？那就 F12 开始吧，大换装开始！空白区？颜色？背景？圆角矩形？阴影？透明度？超链接样式？侧栏头像圆形并旋转？文章标题前面的竖线和颜色？只需按下 F12，改到自己想要的样式，然后 Copy 到 `custom.styl` 文件即可。感觉这是 NexT 主题非常棒的设计，因为这让我们能够很方便自定义博客的样式。怎么知道要修改这个文件呢？ 强烈推荐阅读[这篇文章](http://www.cduyzh.com/hexo-settings-3/)。

#### 怎么修改？

浏览器按 F12 即可，建议用 [Google Chrome 浏览器](http://down.tech.sina.com.cn/content/40975.html)（有梯子的直接去 Google 下载😂），或者[火狐浏览器](http://www.firefox.com.cn/download/)。因为这两个浏览器属于标准浏览器，如果你按下 F12 后简直特么一脸懵逼，那么别急，硬着头皮慢慢折腾吧哈哈哈嗝～

#### 快速懵逼到熟悉

首先按下 F12 后的操作流程图，就是[这篇文章](https://yangbingdong.com/2017/build-blog-hexo-advanced/#%E5%AE%9A%E4%BD%8D%E5%85%83%E7%B4%A0)中的三步骤，点小箭头定位元素，调试 CSS 代码，最后 Copy 到 `custom.styl` 。然后懵逼的地方，应该有下面两点：

1. 按下 F12 后弹出的界面是什么鬼？！
2. 界面中的 `{}` 前面的和里面的英文是什么鬼？！

第一点：弹出的界面是为调试设计的，如果你知道调试的是啥，也许就自然了解弹出的界面，所以我不多说，不过还是给一份 Google 官方的资料——[Chrome 开发者工具](https://developers.google.com/web/tools/chrome-devtools/)。第二点：`{}` 前面的是 HTML 的元素名，`{}` 里面的是这个元素的 CSS 样式。

社交要先有自己原则，一段代码要先声明变量，一个数学问题有前提，一篇论文要先定义名词，到这里我们也必须要先了解一些 HTML 和 CSS 的基本语法知识了，才能继续折腾下去。建议先浏览下 MDN 的 [HTML](https://developer.mozilla.org/zh-CN/docs/Web/HTML) 和 [CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) 的页面，但没必要记住里面的每一个语法知识，因为这样的记忆是不够深刻也并不高效的，只要浏览下留个印象（为了能找准元素）就行，而记忆是要在实践中记忆的。

#### 附上我的cutom.styl
由于原代码比较长，我在[另外一篇博客](https://hasaik.com/posts/dff7e11c.html)中已经有专门分享，注意千万不要照搬到你的 `custom.styl` ！一定要先找对应元素再修改，为了方便大家查看我已经做了一定的注释，仅供大家参考！

### 修改博客字体

博客影响美观的除了样式，就是直接映入读者眼睛的字体了，因此选择一款优雅的字体对博客美感的提升是非常大的，当然，博客字体大小是可以直接修改的：

文件位置：hexo/themes/next/source/css/_variables/base.styl
```BASH
$font-size-base = 16px
```
如果你对字体的选择比较感兴趣，推荐阅读：

1. [Web 中文字体排版指南](https://www.voyax.me/posts/59710/)
2. [Web 字体的选择和运用](https://blog.coding.net/blog/Web-Fonts)
3. [如何优雅的选择默认字体（font-family）](https://segmentfault.com/a/1190000006110417)
4. [中文字体网页开发指南](http://www.ruanyifeng.com/blog/2014/07/chinese_fonts.html)
5. [在 Web 内容中使用系统字体](https://csspod.com/using-the-system-font-in-web-content/)

首先对于汉字来说，因为其字体库太大，通常都是调用本地中文字体库。然而，不同设备有不同默认中文字体和中文字体库，想要尽可能在不同设备上有较好的显示效果，就要在调用不同设备的本地字体库中显示效果较好的中文字体。下面附上我参考的大佬的字体选择：

文件位置：hexo/themes/next/source/css/_variables/base.styl
```BASH
// Font families.
$font-family-chinese      = "Noto Serif SC"

$font-family-base         = $font-family-chinese, sans-serif
$font-family-base         = get_font_family('global'), $font-family-chinese, sans-serif if get_font_family('global')

$font-family-logo         = $font-family-base
$font-family-logo         = get_font_family('logo'), $font-family-base if get_font_family('logo')

$font-family-headings     = $font-family-base
$font-family-headings     = get_font_family('headings'), $font-family-base if get_font_family('headings')

$font-family-posts        = $font-family-base
$font-family-posts        = get_font_family('posts'), $font-family-base if get_font_family('posts')

$font-family-monospace    = consolas, Menlo, $font-family-chinese, monospace
$font-family-monospace    = get_font_family('codes'), consolas, Menlo, $font-family-chinese, monospace if get_font_family('codes')
```
注意：要想 NexT 主题的简体中文字体配置生效，站点配置文件中的 language 必须为 zh-CN。然后对于英文字体，因为其字体库很小，所以想要个性化就简单多了。首先去 [Google Fonts](https://fonts.google.com/) 找自己喜欢的英文字体，然后编辑主题配置文件，可以查看一下 NexT [官方文档](http://theme-next.iissnan.com/theme-settings.html#fonts-customization)（[最新版](https://theme-next.org/docs/theme-settings/#Fonts-Customization)）。下面附上我参考的大佬的英文字体选择：

文件位置：hexo/themes/next/_config.yml
```BASH
font:
  enable: true

  # Uri of fonts host. E.g. //fonts.googleapis.com (Default).
  # Google 字体 国内镜像
  host:

  # Font options:
  # `external: true` will load this font family from `host` above.
  # `family: Times New Roman`. Without any quotes.
  # `size: xx`. Use `px` as unit.

  # Global font settings used on <body> element.
  global:
    external: true
#    family: Lato
    family: EB Garamond # 字体参考：https://io-oi.me/tech/noto-serif-sc-added-on-google-fonts/#main
    size: 16

  # Font settings for Headlines (h1, h2, h3, h4, h5, h6).
  # Fallback to `global` font settings.
  headings:
    external: true
    family:
    size:

  # Font settings for posts.
  # Fallback to `global` font settings.
  posts:
    external: true
    family:

  # Font settings for Logo.
  # Fallback to `global` font settings.
  logo:
    external: true
    family:
    size:

  # Font settings for <code> and code blocks.
  codes:
    external: true
    family:
    size:
```
其它字体设置可以参考[这篇文章](https://io-oi.me/tech/noto-serif-sc-added-on-google-fonts.html)。

### 博客推广及优化

想要自己写的博客能被别人看到？希望能得到别人的评论肯定？渴望分享技术？那么博客推广肯定是必不可少了😙。

#### 手动推广

大概就是在其它博客或者视频等信息流下面留下自己的博客地址，比如第一件事咱们可以去 next 主题[专门的博客分享的issue区](https://github.com/iissnan/hexo-theme-next/issues/119)留下自己的爪印，或者在搜索引擎中搜索使用 hexo+next 搭建博客的热门教程中，在评论区留下地址，这样就可以手动引流啦。

#### 搜索引擎SEO收录

当然手动引流不是长久之计，搜索引擎是互联网上寻找资源的重要手段，而要让别人能够在搜索结果中看到自己的博客文章链接，就必须让搜索引擎收录，怎么操作呢？

可以直接参考[这篇文章](http://www.ehcoo.com/seo.html)，写的很详细，学会自己使用站长工具抓取自己的网页，然后请求搜索引擎收录 ，查看收录量可以在百度或者 Google 中使用 `site:hasaik.com` 即site:后面加上域名的方式，如果你是使用 Github Pages，由于百度是默认不抓取 Github 的，所以也需要使用上述方式进行提交。

其它优化可以看我的[另外一篇博客](https://hasaik.com/posts/495d0b23.html)。

#### 间接影响

除了直接被搜索引擎收录之外，如果有其它被搜索引擎收录的文章中，引用你的某篇文章的链接地址，那么同样可以引流到你的博客，这种称为间接影响，不要小看间接影响，如果你的博客写的很好，经常被引用的话，那么间接影响带来的流量是非常巨大的，但是其中会有一个问题，通过“引流”到达的流量，你需要尽可能地将用户留在自己的博客上，那么如何吸引用户呢？当然是有两个方面：

1. 博客装饰美观
2. 文章质量高

读者的第一印象往往是读者需要阅读的内容的质量，如果质量达到要求，那么读者会注意到博客的界面，如果界面很特别的话，那么读者肯定是马上加入了标签，并且选择多停留一下继续浏览博客的其它内容，那么这里就会引出另外一个问题，就是博客的响应速度，如果读者点击某篇文章或者按钮后响应了半天空白，那么你猜他会怎么做？肯定是直接右上角了啊，所以博客的响应速度一定要优化好。

如果做到上面三点，那么就算好不容易「骗」到一个浏览量，但是这个读者马上被博客和文章惊呆了，看完文章后，这读者心里美滋滋，认为这么好的文章（博客）必须分享啊🌚，于是可能马上来了一大批满怀期待的读者，然后这批读者又……这时文章的读者数（博客的访问量）就不是简单的加法了～

#### 知识平台

直接或间接因为 Google 这样的搜索引擎而来的读者，绝大部分都是技术人员，而他们只希望尽快解决自己的技术问题，这也是他们的目的，这就意味着博客上的一首诗还是很难被欣赏。而要想照亮他人，他人必须要能懂自己的文章，这样也才可能有更强的交互——评论。所以为了不浪费自己的光能，能把自己的光能完完整整地贡献给文明，那就必须也让一首诗也有评论，怎么做呢？让读者的类型多样化，不限于技术人员。还好现在大部分读者也不用搜索引擎了，谁在吞食搜索引擎的用户？移动端。智能手机的迅速普及导致搜索引擎已经不是人们获取知识的主要途径，大部分人已经将手机 APP 上的知识平台作为自己获取知识的主要途径，比如：知乎、简书、微信订阅号……所以，你还可以将自己的文章发布在这些知识平台上的相应分类上，然后留个博客链接，吸引更多类型的读者😄～

#### 谷歌分析

你怎么知道自己推广的效果？你怎么知道有没有人看了自己的博客？哪篇文章最受欢迎？此时有没有人正浏览着自己的博客？自己的文章有没有被引用？这时最常用的就是强大免费的 [Google Analytics](https://analytics.google.com/)，推荐博客建好后，就立即使用。

如何使用？请务必自备梯子查看 [Google 官方的教程](https://analytics.google.com/analytics/academy/course/6)，开始使用后一定要按照里面的设置，先添加多份 view（数据视图）。

### 文章底部加上评分小星星

淘宝买东西，作为消费者的我们，看评价很重要。现在作为博主，写了一篇文章，很期待读者的反馈。而与淘宝一样，确认收货后，相比评论，更愿意五星好评。那么博客文章怎么加上呢？首先打开主题配置文件：

文件位置：hexo/themes/next/_config.yml
```BASH
# Star rating support to each article.
# To get your ID visit https://widgetpack.com
rating:
  enable: true
  id:     
  color: f79533
```
先去注释中的[网站](https://widgetpack.com)，首页点 Rating，然后注册个帐号，填一下自己博客的信息，左上角有个 ID，填进主题配置文件中就行，`color` 改成自己喜欢的即可。另：

1. 可以配置评分方式，侧栏 > Rating > Setting，建议用 IP address 或 Device(cookie)，免登录，毕竟 Socials 里面的选项几乎都被墙，不适合国内网络环境。
2. 建议在侧栏 > Site > Setting 中勾选 Private 选项。
3. 上面两步勾选后别忘了点击页面右下方的 SAVE SETTING 绿色按钮保存。

如果感觉上下留白太多，咋整？浏览器 F12 找元素，调成自己喜欢的值，然后 Copy 到 `custom.styl` 即可。经过上面的配置，默认最下面只会显示 5 颗小星星，简洁但不明了😂，怎么加上文字说明呢？编辑下面这个文件，Ctrl + F 搜索 `rating` ，找到这段，对比我给出的，在绿色这行所示的位置，加上自己想要的说明和样式即可。

文件位置：hexo/themes/next/layout/_macro/post.swig
```DIFF
{% if theme.rating.enable %}
	<div class="wp_rating">
+            <div style="color: rgba(0, 0, 0, 0.75); font-size:13px; letter-spacing:3px">(&gt;看完记得五星好评哦亲&lt;)</div>
			<div id="wpac-rating"></div>
	</div>
{% endif %}
```

### 为站点添加标题崩溃特效

该特效为：当用户离开站点相关的页面时，网页的标题会变成已崩溃，网站图标也会改变；当用户重新回到站点页面时才会恢复正常。

实现方式：

在 `/themes/next/source/js/src/` 目录下新建 `crash_cheat.js` ，代码如下：
```BASH
$(window).load(function () {
//整合页面欺骗特效 window.onload有冲突
    var OriginTitile = document.title;
    var titleTime;
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            $('[rel="icon"]').attr('href', "../../images/failure.png");
            $('[rel="shortcut icon"]').attr('href', "../../images/failure.png");
            document.title = '(つェ⊂) 我藏好了哦~ ';
            clearTimeout(titleTime);
        } else {
            $('[rel="icon"]').attr('href', "../../images/favicon.png");
            $('[rel="shortcut icon"]').attr('href', "../../images/favicon.png");
            document.title = 'o(^▽^)o 被你发现啦~ ';
            titleTime = setTimeout(function () {
                document.title = OriginTitile;
            }, 2000);
        }
    });
});
```

在 `/themes/next/layout/_layout.swig` 文件末尾（ps：我相信各位引入js的位置应该都知道），添加引用：
```BASH
<!--崩溃欺骗-->
<script type="text/javascript" src="/js/src/crash_cheat.js"></script>
```

上面的图片放在 `/themes/next/source/images/` 目录下，自行选择喜欢的图片即可。


### 每篇文章末尾添加致谢

![致谢](https://s2.ax1x.com/2019/11/14/MtQLeH.png)

在 `hexo/themes/next/layout/_macro` 中新建一个 `passage-end-tag.swig` 文件，并添加如下内容：
```BASH
<div>
    {% if not is_index %}
        <div class="read-over">-------------------本文结束 <i class="fa fa-paw"></i> 感谢您的阅读-------------------</div>
    {% endif %}
</div>
```

接着打开 `\themes\next\layout\_macro\post.swig` 文件，在 `post-body` 之后， `post-footer` 之前添加如下画绿色部分代码（post-footer 之前两个 div）：
```DIFF
+ <div>
+  {% if not is_index %}
+    {% include 'passage-end-tag.swig' %}
+  {% endif %}
+ </div>

<footer class="post-footer">
```

最后，在主题配置文件下，在末尾添加：

文件位置：hexo/themes/next/_config.xml
```BASH
# 文章末尾添加"本文结束"标记
passage_end_tag:
  enabled: true
```

### 新增文章时自动打开Markdown编辑器
由于每次在 GitBash 中使用 `hexo n "文章名称"` 时还要自己去本地目录中打开编辑器，这对于懒癌患者来说实在是太麻烦了😂，那么不如实现一个监听的 js 代码监听新建文章的命令，只要监听到了就自动打开相应的 Markdown编辑器，这样不就方便多了嘛！

首先在 `hexo/scripts` 下新建一个 `newpost.js` 文件，如果没有 `scripts` 文件可以手动创建一个。

如果你是 windows 用户，在这个文件中写入如下代码：
```JS
var spawn = require('child_process').exec;
hexo.on('new', function(data){
  spawn('start  "markdown编辑器绝对路径.exe" ' + data.path);
});
```
如果是 mac 用户，就写入如下代码：
```JS
var exec = require('child_process').exec;
hexo.on('new', function(data){
    exec('open -a "markdown编辑器绝对路径.app" ' + data.path);
});
```
注意里面要修改的是 Markdown 编辑器的绝对路径，我使用的是 Typora ，所以我的绝对路径是 `E:\\Typora\\bin\\Typora.exe` ，大家可以对应进行修改。

### 使用hexo-admin在线发布文章

最近有不少小伙伴问我这个博客如何在线发布文章，毕竟大多数人都是程序小白，不想使用 GitBash 命令行敲各种命令。所以也有大神做一个 hexo-admin 管理工具，虽然这个东西没有适配完全，但是对于文章管理的基本功能够用。

{% linkCard https://github.com/jaredly/hexo-admin,hexo-admin官方地址 %}

官方在线演示地址：[https://jaredforsyth.com/hexo-admin/admin/#/](https://jaredforsyth.com/hexo-admin/admin/#/)

要使用这个工具，首先需要安装插件：
```BASH
npm install --save hexo-admin
```

安装完成后，要启动的话，使用 `hexo s -d` 命令，然后打开网址 `localhost:4000/admin/` 进行登录就可以管理后台了。

{% note warning,注意，安装 hexo-admin 插件后，启动后台页面时 GitBash 可能还是会报错，这是由于 hexo-admin 自身还依赖很多个插件，报错信息上只要提示缺少 module “xxx”时，你只要继续使用上面的命令安装缺少的那个插件xxx就可以了，我当时好像连续装了十几个插件才最终启动成功🌚…%}

安装好后，还需要设置登录的账号密码，不然谁都可以使用你的后台管理。第一次登录后，进入 `setting` 菜单，点击 `Setup authentification here` 进入用户名密码设置项，按照提示设置后，把生成的代码添加到 `hexo/_config.xml` 中，如：

安装好后，还需要设置登录的账号密码，不然谁都可以使用你的后台管理。第一次登录后，进入 `setting` 菜单，点击 `Setup authentification here` 进入用户名密码设置项，按照提示设置后，把生成的代码添加到 `hexo/_config.xml` 中，如：

文件位置：hexo/_config.xml
```BASH
# hexo-admin authentification
admin:
  username: xuxu
  password_hash: $2a$10$anOUoIka5uKSupfpNtu6IOSPvsj2OTPOXC2qpewkP1DmrTZr39Va6
  secret: my blog
```
其中密码是在你设置后进行加密的。

最后在线 deploy 时，可以打开 `Deploy` 菜单，第一次点击 Deploy 时会提示 `Error: Config value "admin.deployCommand" not found` ，这个问题作者已经解决，在上面的配置中添加一行配置：
```BASH
admin:
  deployCommand: './hexo-deploy.sh'
```
就可以在线部署到 Github 了！

### Hexo-abbrlink生成唯一文章链接

一个 [Hexo插件](https://hexo.io/plugins/) ，用于根据帖子标题生成静态帖子链接。

首先需要安装插件，博客站点下执行下面命令：
```BASH
npm install hexo-abbrlink --save
```
{% note danger,执行此命令可能会不成功，提示你缺少相应的依赖，比如babel-eslint、mini-css-extract-plugin、webpack-cli…<br>使用npm命令安装即可，比如 `npm install eslint@4.x babel-eslint@8 --save-dev`%}

修改站点配置文件 `config.yml` 文件中的永久链接：
```DIFF
- permalink: year/:month/:day/:title/
+ permalink: posts/:abbrlink.html
```

在 permalink 下面写入下面的内容：
```BASH
# abbrlink config
abbrlink:
  alg: crc32  # 算法：crc16(default) and crc32
  rep: hex    # 进制：dec(default) and hex
```

示例：https://hasaik.com/posts/ab21860c.html ，其中 `ab21860c.html` 就是生成的永链。

### 修改侧栏滚动条样式

默认的侧栏滚动条其实挺丑的，添加如下代码重新渲染页面就可以修改侧栏滚动条了。

文件位置：hexo/themes/next/source/css/_custom/custom.styl
```CSS
/*更好的侧边滚动条*/
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-button {
  width: 0;
  height: 0;
}
::-webkit-scrollbar-button:start:increment,::-webkit-scrollbar-button:end:decrement {
  display: none;
}
::-webkit-scrollbar-corner {
  display: block;
}
::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: rgba(0,0,0,.2);
}
::-webkit-scrollbar-thumb:hover {
  border-radius: 8px;
  background-color: rgba(0,0,0,.5);
}
::-webkit-scrollbar-track,::-webkit-scrollbar-thumb {
  border-right: 1px solid transparent;
  border-left: 1px solid transparent;
}
::-webkit-scrollbar-track:hover {
  background-color: rgba(0,0,0,.15);
}
::-webkit-scrollbar-button:start {
  width: 10px;
  height: 10px;
  /*background: url(../images/scrollbar_arrow.png) no-repeat 0 0;*/  /*可以添加滚动条样式*/
}
```

### 侧栏加入已运行的时间

我们都有自己的生日，都知道自己的岁数，那为什么不给博客加上，让读者知道博客的年纪呢？操作很简单，而且不是精确到年而是精确到秒，233333～

首先加入以下代码：

文件位置：hexo/themes/next/layout/_custom/sidebar.swig
```BASH
<div id="days"></div>
<script>
function show_date_time(){
    window.setTimeout("show_date_time()", 1000);
    BirthDay=new Date("05/27/2017 15:13:14");
    today=new Date();
    timeold=(today.getTime()-BirthDay.getTime());
    sectimeold=timeold/1000
    secondsold=Math.floor(sectimeold);
    msPerDay=24*60*60*1000
    e_daysold=timeold/msPerDay
    daysold=Math.floor(e_daysold);
    e_hrsold=(e_daysold-daysold)*24;
    hrsold=setzero(Math.floor(e_hrsold));
    e_minsold=(e_hrsold-hrsold)*60;
    minsold=setzero(Math.floor((e_hrsold-hrsold)*60));
    seconds=setzero(Math.floor((e_minsold-minsold)*60));
    document.getElementById('days').innerHTML="已运行 "+daysold+" 天 "+hrsold+" 小时 "+minsold+" 分 "+seconds+" 秒";
}
function setzero(i) {
    if (i<10) {
        i="0" + i
    };
    return i;
}
show_date_time();
</script>
```
上面 `Date` 的值记得改为你自己的，且按上面格式，然后修改：

文件位置：hexo/themes/next/layout/_macro/sidebar.swig
```DIFF
        {# Blogroll #}
        {% if theme.links %}
          <div class="links-of-blogroll motion-element {{ "links-of-blogroll-" + theme.links_layout | default('inline') }}">
            <div class="links-of-blogroll-title">
              <i class="fa  fa-fw fa-{{ theme.links_icon | default('globe') | lower }}"></i>
              {{ theme.links_title }}&nbsp;
              <i class="fa  fa-fw fa-{{ theme.links_icon | default('globe') | lower }}"></i>
            </div>
            <ul class="links-of-blogroll-list">
              {% for name, link in theme.links %}
                <li class="links-of-blogroll-item">
                  <a href="{{ link }}" title="{{ name }}" target="_blank">{{ name }}</a>
                </li>
              {% endfor %}
            </ul>
+        {% include '../_custom/sidebar.swig' %}
          </div>
         {% endif %}

-        {% include '../_custom/sidebar.swig' %}
```
这样就可以了！当然，要是不喜欢颜色，感觉不好看，就可以在上文所提的 `custom.styl` 加入：

文件位置：hexo/themes/next/source/css/_custom/custom.styl

```CSS
/*自定义的侧栏时间样式*/
#days {
    display: block;
    color: rgb(7, 179, 155);
    font-size: 13px;
    margin-top: 15px;
}
```
里面的值 F12 调成自己喜欢的，然后更改即可。要是不想放在侧栏，想放在页脚，自己应该能折腾了吧😄～

### 添加博客热门文章页面

博客已有的分类，如 categories 和 tags，都是基于博主的，那么有没有一种分类是基于读者的呢？有，一种是搜索，另一种就是这里的文章阅读量排行榜。前提是在主题配置文件中配置了 leancloud_visitors，配置方法在基础配置中已经介绍过了。首先新建页面：

所在目录：hexo/
```BASH
hexo new page "top"
```
然后在主题配置文件中加上菜单 top 和它的 icon：

文件位置：hexo/themes/next/_config.yml
```BASH
menu:
  top: /top/ || signal
```
接着在语言翻译文件中加上菜单 top：

文件位置：hexo/themes/next/languages/zh_Hans.yml
```BASH
menu:
  home: 首页
  archives: 归档
  categories: 分类
  tags: 标签
  about: 关于
  search: 搜索
  schedule: 日程表
  sitemap: 站点地图
  commonweal: 公益404
  top: 热门排行 /* 可以不为 热门排行，随便取 */
```
注意：如果你的站点配置文件中的 languages 写的不是 zh-CN，那么这里请更改相应语言配置文件。最后，编辑第一步新建页面生成的文件：

文件位置：hexo/source/top/index.md
```BASH
title: 文章热度排行
comments: false
date: 2019-11-03 14:37:48
type:
---

<div id="top" style="margin-top:30px;"></div>

<script src="//cdn1.lncld.net/static/js/3.0.4/av-min.js"></script>
<!-- <script src="https://cdn1.lncld.net/static/js/av-core-mini-0.6.4.js"></script> -->
<script>AV.initialize("app_id", "app_key");</script>
<script type="text/javascript">
    var time = 0
    var title = ""
    var url = ""
    var query = new AV.Query('Counter');
    query.notEqualTo('id', 0);
    query.descending('time');
    query.limit(1000);
    query.find().then(function (todo) {
        for (var i = 0; i < 1000; i++) {
            var result = todo[i].attributes;
            time = result.time;
            title = result.title;
            url = result.url;
            var content = "<p class='my-article-top'>" + "<font color='#a7a7e5'>" + "➤【热度: " + "</font>" + "<font color='#f1a8ce'>" + time + " ℃】" + "</font>" + "<a href='" + url + "'>" + title + "</a>" + "</p>";
            document.getElementById("top").innerHTML += content
        }
    }, function (error) {
        console.log("error");
    });
</script>

<style>.post-description {
        display: none;
    }
</style>

```
必须将里面的里面的 `app_id` 和 `app_key` 替换为你的主题配置文件中的值，必须替换里面博客的链接，1000是显示文章的数量，其它可以自己看情况更改。最后，修改样式可以在 `custom.styl` 中加入自定义代码，不过还有几点需要注意：

1. 如果在设置 > 安全中心中，没有将http://localhost:4000加入 Web 安全域名，那么本地调试将看不到，可以先将之加入，调试完后删除。
2. 如果你发现文章标题显示不对，这是由于更改过文章标题导致的，在存储 > Counter 双击title修改即可。

注意：如果你的博客使用了 Valine 评论系统，那么可能会有代码冲突问题，解决方法可 Google ~

### 文章置顶功能

由于博客的首页可能是被浏览最多的页面，所以首页的前几篇文章被阅读的可能性比较大。可以利用这个特点，通过将自己认为重要的文章放在首页，从而让重要的文章被阅读的可能性增大😄。但是，默认的排序只有一个维度——时间，两种选择——正序和倒序，这就造成自己的得意之作被埋没了，怎么办呢，如何实现文章的置顶？

NexT 主题以前有过这个功能，然而由于一些 bugs（[issue](https://github.com/iissnan/hexo-theme-next/issues/415)）被去掉了。不过在这个丰富的 issue 中，我自己摸索出了一种解决方法，参考了 issue 中的那篇[文章](http://www.netcan666.com/2015/11/22/%E8%A7%A3%E5%86%B3Hexo%E7%BD%AE%E9%A1%B6%E9%97%AE%E9%A2%98/)。

首先移除默认安装的插件：

所在目录：hexo/
```BASH
npm uninstall hexo-generator-index --save
```
然后安装新插件：
```BASH
npm install hexo-generator-index-pin-top --save
```
最后编辑有这需求的相关文章时，在Front-matter（文件最上方以—分隔的区域）加上一行:
```BASH
top: true
```
然后就行了。如果你置顶了多篇，怎么控制顺序呢？设置top的值（大的在前面），比如：
```BASH
# Post a.md
title: a
top: 1

# Post b.md
title: b
top: 10
```
那么文章 b 便会显示在文章 a 的前面。可是，没有任何标记啊，读者怎么知道文章置顶了😂～还好 NexT 原有的置顶功能有考虑到这个，且置顶的样式没有被移除，所以可以直接利用，编辑文件加入以下代码：

文件位置：/themes/next/layout/_macro/post.swig
```DIFF
<div class="post-meta">
  <span class="post-time">

+     {% if post.top %}
+          <i class="fa fa-thumb-tack"></i>
+          <font color=7D26CD>置顶</font>
+          <span class="post-meta-divider">|</span>
+      {% endif %}
```

### 精品文章

在 `/themes/next/layout/_macro/` 路径，找到 `post.swig` ，在前 `文置` 顶功能后边，加上如下代码：
```BASH
{% if post.essential%}
     <span class="post-meta-item-icon">
         <i class="fa fa-newspaper-o jingping">精品</i>
     </span>
     <span class="post-meta-divider">|</span>
 {% endif %}
```

在 `themes/next/source/css/_custom/custom.styl` 中，增加如下样式：
```CSS
.jingping{
  background : #00a8c3;
  padding:2px 4px 2px 4px;
  color: #fff;
}
```
在需要设置精品的文章md文件中，加入如下代码：
```BASH
essential: true
```

### 添加近期文章版块

在 `next/layout/_macro/sidebar.swig` 中的 `if theme.links` 对应的 `endif` 后面添加以下代码：
```BASH
<!--近期文章版块 began-->
  {% if theme.recent_posts %}
      <div class="links-of-blogroll motion-element {{ "links-of-blogroll-" + theme.recent_posts_layout  }}">
        <div class="links-of-blogroll-title">
          <i class="fa fa-history fa-{{ theme.recent_posts_icon | lower }}" aria-hidden="true"></i>
          {{ theme.recent_posts_title }}
        </div>
        <ul class="links-of-blogroll-list">
          {% set posts = site.posts.sort('-date') %}
          {% for post in posts.slice('0', '5') %}
            <li class='my-links-of-blogroll-li'>
              <a href="{{ url_for(post.path) }}" title="{{ post.title }}" target="">{{ post.title }}</a>
            </li>
          {% endfor %}
        </ul>
      </div>
  {% endif %}
<!--近期文章版块 end-->
```
为了配置方便，在主题的 `_config.yml` 中添加了几个变量，如下：
```BASH
recent_posts_title: 近期文章
recent_posts_layout: block
recent_posts: true
```

### 代码块复制功能

依赖 [clipboard.js](https://clipboardjs.com/) 实现，个性化配置可参考官方文档。在 `/themes/next/layout/_layout.swig` 引入下载的 JS
```BASH
<!-- 代码块复制功能 -->
<script type="text/javascript" src="/js/src/clipboard.min.js"></script>
<script type="text/javascript" src="/js/src/clipboard-use.js"></script>
```

位于 `/themes/next/source/js/src/` 目录下的 `clipboard.min.js` 和 `clipboard-use.js` 代码分别如下：
```BASH
/*!
 * clipboard.min.js v2.0.4
 * https://zenorocha.github.io/clipboard.js
 * 
 * Licensed MIT © Zeno Rocha
 */
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.ClipboardJS=e():t.ClipboardJS=e()}(this,function(){return function(n){var o={};function r(t){if(o[t])return o[t].exports;var e=o[t]={i:t,l:!1,exports:{}};return n[t].call(e.exports,e,e.exports,r),e.l=!0,e.exports}return r.m=n,r.c=o,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(t,e,n){"use strict";var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=function(){function o(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(t,e,n){return e&&o(t.prototype,e),n&&o(t,n),t}}(),a=o(n(1)),c=o(n(3)),u=o(n(4));function o(t){return t&&t.__esModule?t:{default:t}}var l=function(t){function o(t,e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,o);var n=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,(o.__proto__||Object.getPrototypeOf(o)).call(this));return n.resolveOptions(e),n.listenClick(t),n}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(o,c.default),i(o,[{key:"resolveOptions",value:function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};this.action="function"==typeof t.action?t.action:this.defaultAction,this.target="function"==typeof t.target?t.target:this.defaultTarget,this.text="function"==typeof t.text?t.text:this.defaultText,this.container="object"===r(t.container)?t.container:document.body}},{key:"listenClick",value:function(t){var e=this;this.listener=(0,u.default)(t,"click",function(t){return e.onClick(t)})}},{key:"onClick",value:function(t){var e=t.delegateTarget||t.currentTarget;this.clipboardAction&&(this.clipboardAction=null),this.clipboardAction=new a.default({action:this.action(e),target:this.target(e),text:this.text(e),container:this.container,trigger:e,emitter:this})}},{key:"defaultAction",value:function(t){return s("action",t)}},{key:"defaultTarget",value:function(t){var e=s("target",t);if(e)return document.querySelector(e)}},{key:"defaultText",value:function(t){return s("text",t)}},{key:"destroy",value:function(){this.listener.destroy(),this.clipboardAction&&(this.clipboardAction.destroy(),this.clipboardAction=null)}}],[{key:"isSupported",value:function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:["copy","cut"],e="string"==typeof t?[t]:t,n=!!document.queryCommandSupported;return e.forEach(function(t){n=n&&!!document.queryCommandSupported(t)}),n}}]),o}();function s(t,e){var n="data-clipboard-"+t;if(e.hasAttribute(n))return e.getAttribute(n)}t.exports=l},function(t,e,n){"use strict";var o,r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=function(){function o(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(t,e,n){return e&&o(t.prototype,e),n&&o(t,n),t}}(),a=n(2),c=(o=a)&&o.__esModule?o:{default:o};var u=function(){function e(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),this.resolveOptions(t),this.initSelection()}return i(e,[{key:"resolveOptions",value:function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};this.action=t.action,this.container=t.container,this.emitter=t.emitter,this.target=t.target,this.text=t.text,this.trigger=t.trigger,this.selectedText=""}},{key:"initSelection",value:function(){this.text?this.selectFake():this.target&&this.selectTarget()}},{key:"selectFake",value:function(){var t=this,e="rtl"==document.documentElement.getAttribute("dir");this.removeFake(),this.fakeHandlerCallback=function(){return t.removeFake()},this.fakeHandler=this.container.addEventListener("click",this.fakeHandlerCallback)||!0,this.fakeElem=document.createElement("textarea"),this.fakeElem.style.fontSize="12pt",this.fakeElem.style.border="0",this.fakeElem.style.padding="0",this.fakeElem.style.margin="0",this.fakeElem.style.position="absolute",this.fakeElem.style[e?"right":"left"]="-9999px";var n=window.pageYOffset||document.documentElement.scrollTop;this.fakeElem.style.top=n+"px",this.fakeElem.setAttribute("readonly",""),this.fakeElem.value=this.text,this.container.appendChild(this.fakeElem),this.selectedText=(0,c.default)(this.fakeElem),this.copyText()}},{key:"removeFake",value:function(){this.fakeHandler&&(this.container.removeEventListener("click",this.fakeHandlerCallback),this.fakeHandler=null,this.fakeHandlerCallback=null),this.fakeElem&&(this.container.removeChild(this.fakeElem),this.fakeElem=null)}},{key:"selectTarget",value:function(){this.selectedText=(0,c.default)(this.target),this.copyText()}},{key:"copyText",value:function(){var e=void 0;try{e=document.execCommand(this.action)}catch(t){e=!1}this.handleResult(e)}},{key:"handleResult",value:function(t){this.emitter.emit(t?"success":"error",{action:this.action,text:this.selectedText,trigger:this.trigger,clearSelection:this.clearSelection.bind(this)})}},{key:"clearSelection",value:function(){this.trigger&&this.trigger.focus(),window.getSelection().removeAllRanges()}},{key:"destroy",value:function(){this.removeFake()}},{key:"action",set:function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:"copy";if(this._action=t,"copy"!==this._action&&"cut"!==this._action)throw new Error('Invalid "action" value, use either "copy" or "cut"')},get:function(){return this._action}},{key:"target",set:function(t){if(void 0!==t){if(!t||"object"!==(void 0===t?"undefined":r(t))||1!==t.nodeType)throw new Error('Invalid "target" value, use a valid Element');if("copy"===this.action&&t.hasAttribute("disabled"))throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');if("cut"===this.action&&(t.hasAttribute("readonly")||t.hasAttribute("disabled")))throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');this._target=t}},get:function(){return this._target}}]),e}();t.exports=u},function(t,e){t.exports=function(t){var e;if("SELECT"===t.nodeName)t.focus(),e=t.value;else if("INPUT"===t.nodeName||"TEXTAREA"===t.nodeName){var n=t.hasAttribute("readonly");n||t.setAttribute("readonly",""),t.select(),t.setSelectionRange(0,t.value.length),n||t.removeAttribute("readonly"),e=t.value}else{t.hasAttribute("contenteditable")&&t.focus();var o=window.getSelection(),r=document.createRange();r.selectNodeContents(t),o.removeAllRanges(),o.addRange(r),e=o.toString()}return e}},function(t,e){function n(){}n.prototype={on:function(t,e,n){var o=this.e||(this.e={});return(o[t]||(o[t]=[])).push({fn:e,ctx:n}),this},once:function(t,e,n){var o=this;function r(){o.off(t,r),e.apply(n,arguments)}return r._=e,this.on(t,r,n)},emit:function(t){for(var e=[].slice.call(arguments,1),n=((this.e||(this.e={}))[t]||[]).slice(),o=0,r=n.length;o<r;o++)n[o].fn.apply(n[o].ctx,e);return this},off:function(t,e){var n=this.e||(this.e={}),o=n[t],r=[];if(o&&e)for(var i=0,a=o.length;i<a;i++)o[i].fn!==e&&o[i].fn._!==e&&r.push(o[i]);return r.length?n[t]=r:delete n[t],this}},t.exports=n},function(t,e,n){var d=n(5),h=n(6);t.exports=function(t,e,n){if(!t&&!e&&!n)throw new Error("Missing required arguments");if(!d.string(e))throw new TypeError("Second argument must be a String");if(!d.fn(n))throw new TypeError("Third argument must be a Function");if(d.node(t))return s=e,f=n,(l=t).addEventListener(s,f),{destroy:function(){l.removeEventListener(s,f)}};if(d.nodeList(t))return a=t,c=e,u=n,Array.prototype.forEach.call(a,function(t){t.addEventListener(c,u)}),{destroy:function(){Array.prototype.forEach.call(a,function(t){t.removeEventListener(c,u)})}};if(d.string(t))return o=t,r=e,i=n,h(document.body,o,r,i);throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList");var o,r,i,a,c,u,l,s,f}},function(t,n){n.node=function(t){return void 0!==t&&t instanceof HTMLElement&&1===t.nodeType},n.nodeList=function(t){var e=Object.prototype.toString.call(t);return void 0!==t&&("[object NodeList]"===e||"[object HTMLCollection]"===e)&&"length"in t&&(0===t.length||n.node(t[0]))},n.string=function(t){return"string"==typeof t||t instanceof String},n.fn=function(t){return"[object Function]"===Object.prototype.toString.call(t)}},function(t,e,n){var a=n(7);function i(t,e,n,o,r){var i=function(e,n,t,o){return function(t){t.delegateTarget=a(t.target,n),t.delegateTarget&&o.call(e,t)}}.apply(this,arguments);return t.addEventListener(n,i,r),{destroy:function(){t.removeEventListener(n,i,r)}}}t.exports=function(t,e,n,o,r){return"function"==typeof t.addEventListener?i.apply(null,arguments):"function"==typeof n?i.bind(null,document).apply(null,arguments):("string"==typeof t&&(t=document.querySelectorAll(t)),Array.prototype.map.call(t,function(t){return i(t,e,n,o,r)}))}},function(t,e){if("undefined"!=typeof Element&&!Element.prototype.matches){var n=Element.prototype;n.matches=n.matchesSelector||n.mozMatchesSelector||n.msMatchesSelector||n.oMatchesSelector||n.webkitMatchesSelector}t.exports=function(t,e){for(;t&&9!==t.nodeType;){if("function"==typeof t.matches&&t.matches(e))return t;t=t.parentNode}}}])});
```

```BASH
/*页面载入完成后，创建复制按钮*/
!function (e, t, a) {
  /* code */
  var initCopyCode = function(){
    var copyHtml = '';
    copyHtml += '<button class="btn-copy" data-clipboard-snippet="">';
    //fa fa-globe可以去字体库替换自己想要的图标
    copyHtml += '  <i class="fa fa-clipboard"></i><span>复制</span>';
    copyHtml += '</button>';
    $(".highlight .code pre").before(copyHtml);
    new ClipboardJS('.btn-copy', {
      target: function(trigger) {
        return trigger.nextElementSibling;
      }
    });
  }
  initCopyCode();
}(window, document);
```

可根据需要在 `/themes/next/source/css/_custom/custom.styl` 加 CSS

```CSS
.highlight{
  //position: relative;
  position: static;
}
highlight-wrap {
  background: #008b89;
}
.btn-copy {
  display: inline-block;
  cursor: pointer;
  background-color: #eee;
  background-image: linear-gradient(#fcfcfc,#eee);
  border: 1px solid #d5d5d5;
  border-radius: 3px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-appearance: none;
  font-size: 13px;
  font-weight: 700;
  line-height: 20px;
  color: #333;
  -webkit-transition: opacity .3s ease-in-out;
  -o-transition: opacity .3s ease-in-out;
  transition: opacity .3s ease-in-out;
  padding: 2px 6px;
  position: absolute;
  right: 5px;
  top: 5px;
  opacity: 0;
}
.btn-copy span {
  margin-left: 5px;
}
.highlight:hover .btn-copy{
  opacity: 1;
}
```

### 博客加入canvas粒子时钟

这是一款很有意思的 HTML5 Canvas 时间动画，总体来说，它是一个可以和客户端同步的时钟，其特点是当时间走动时，数字将会散落成一个个粒子动画。

在 `/themes/next/layout/_custom/` 目录下，新建 `clock.swig` 文件，内容如下：
```BASH
<div id="">
  <canvas id="canvas" style="width:60%;">
</div>

<!--粒子时钟js-->
<script type="text/javascript" src="/js/src/canvas-dance-time.js"></script>
```

在 `/themes/next/layout/_macro/sidebar.swig` 中引入：
```BASH
{% include '../_custom/clock.swig' %}
```
可根据自己的偏好来设置具体位置，我是加在了侧栏的末尾。

在 `/themes/next/source/js/src` 目录下，新建 `canvas-dance-time.js` 文件，内容如下：
```BASH
(function(){
    var WINDOW_WIDTH = 820;
    var WINDOW_HEIGHT = 250;
    var RADIUS = 7; //球半径
    var NUMBER_GAP = 10; //数字之间的间隙
    var u=0.65; //碰撞能量损耗系数
    var context; //Canvas绘制上下文
    var balls = []; //存储彩色的小球
    const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"]; //彩色小球的颜色
    var currentNums = []; //屏幕显示的8个字符
    var digit =
        [
            [
                [0,0,1,1,1,0,0],
                [0,1,1,0,1,1,0],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [0,1,1,0,1,1,0],
                [0,0,1,1,1,0,0]
            ],//0
            [
                [0,0,0,1,1,0,0],
                [0,1,1,1,1,0,0],
                [0,0,0,1,1,0,0],
                [0,0,0,1,1,0,0],
                [0,0,0,1,1,0,0],
                [0,0,0,1,1,0,0],
                [0,0,0,1,1,0,0],
                [0,0,0,1,1,0,0],
                [0,0,0,1,1,0,0],
                [1,1,1,1,1,1,1]
            ],//1
            [
                [0,1,1,1,1,1,0],
                [1,1,0,0,0,1,1],
                [0,0,0,0,0,1,1],
                [0,0,0,0,1,1,0],
                [0,0,0,1,1,0,0],
                [0,0,1,1,0,0,0],
                [0,1,1,0,0,0,0],
                [1,1,0,0,0,0,0],
                [1,1,0,0,0,1,1],
                [1,1,1,1,1,1,1]
            ],//2
            [
                [1,1,1,1,1,1,1],
                [0,0,0,0,0,1,1],
                [0,0,0,0,1,1,0],
                [0,0,0,1,1,0,0],
                [0,0,1,1,1,0,0],
                [0,0,0,0,1,1,0],
                [0,0,0,0,0,1,1],
                [0,0,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [0,1,1,1,1,1,0]
            ],//3
            [
                [0,0,0,0,1,1,0],
                [0,0,0,1,1,1,0],
                [0,0,1,1,1,1,0],
                [0,1,1,0,1,1,0],
                [1,1,0,0,1,1,0],
                [1,1,1,1,1,1,1],
                [0,0,0,0,1,1,0],
                [0,0,0,0,1,1,0],
                [0,0,0,0,1,1,0],
                [0,0,0,1,1,1,1]
            ],//4
            [
                [1,1,1,1,1,1,1],
                [1,1,0,0,0,0,0],
                [1,1,0,0,0,0,0],
                [1,1,1,1,1,1,0],
                [0,0,0,0,0,1,1],
                [0,0,0,0,0,1,1],
                [0,0,0,0,0,1,1],
                [0,0,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [0,1,1,1,1,1,0]
            ],//5
            [
                [0,0,0,0,1,1,0],
                [0,0,1,1,0,0,0],
                [0,1,1,0,0,0,0],
                [1,1,0,0,0,0,0],
                [1,1,0,1,1,1,0],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [0,1,1,1,1,1,0]
            ],//6
            [
                [1,1,1,1,1,1,1],
                [1,1,0,0,0,1,1],
                [0,0,0,0,1,1,0],
                [0,0,0,0,1,1,0],
                [0,0,0,1,1,0,0],
                [0,0,0,1,1,0,0],
                [0,0,1,1,0,0,0],
                [0,0,1,1,0,0,0],
                [0,0,1,1,0,0,0],
                [0,0,1,1,0,0,0]
            ],//7
            [
                [0,1,1,1,1,1,0],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [0,1,1,1,1,1,0],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [0,1,1,1,1,1,0]
            ],//8
            [
                [0,1,1,1,1,1,0],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [1,1,0,0,0,1,1],
                [0,1,1,1,0,1,1],
                [0,0,0,0,0,1,1],
                [0,0,0,0,0,1,1],
                [0,0,0,0,1,1,0],
                [0,0,0,1,1,0,0],
                [0,1,1,0,0,0,0]
            ],//9
            [
                [0,0,0,0],
                [0,0,0,0],
                [0,1,1,0],
                [0,1,1,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,1,1,0],
                [0,1,1,0],
                [0,0,0,0],
                [0,0,0,0]
            ]//:
        ];

    function drawDatetime(cxt){
        var nums = [];

        context.fillStyle="#005eac"
        var date = new Date();
        var offsetX = 70, offsetY = 30;
        var hours = date.getHours();
        var num1 = Math.floor(hours/10);
        var num2 = hours%10;
        nums.push({num: num1});
        nums.push({num: num2});
        nums.push({num: 10}); //冒号
        var minutes = date.getMinutes();
        var num1 = Math.floor(minutes/10);
        var num2 = minutes%10;
        nums.push({num: num1});
        nums.push({num: num2});
        nums.push({num: 10}); //冒号
        var seconds = date.getSeconds();
        var num1 = Math.floor(seconds/10);
        var num2 = seconds%10;
        nums.push({num: num1});
        nums.push({num: num2});

        for(var x = 0;x<nums.length;x++){
            nums[x].offsetX = offsetX;
            offsetX = drawSingleNumber(offsetX,offsetY, nums[x].num,cxt);
            //两个数字连一块，应该间隔一些距离
            if(x<nums.length-1){
                if((nums[x].num!=10) &&(nums[x+1].num!=10)){
                    offsetX+=NUMBER_GAP;
                }
            }
        }

        //说明这是初始化
        if(currentNums.length ==0){
            currentNums = nums;
        }else{
            //进行比较
            for(var index = 0;index<currentNums.length;index++){
                if(currentNums[index].num!=nums[index].num){
                    //不一样时，添加彩色小球
                    addBalls(nums[index]);
                    currentNums[index].num=nums[index].num;
                }
            }
        }
        renderBalls(cxt);
        updateBalls();

        return date;
    }

    function addBalls (item) {
        var num = item.num;
        var numMatrix = digit[num];
        for(var y = 0;y<numMatrix.length;y++){
            for(var x = 0;x<numMatrix[y].length;x++){
                if(numMatrix[y][x]==1){
                    var ball={
                        offsetX:item.offsetX+RADIUS+RADIUS*2*x,
                        offsetY:30+RADIUS+RADIUS*2*y,
                        color:colors[Math.floor(Math.random()*colors.length)],
                        g:1.5+Math.random(),
                        vx:Math.pow(-1, Math.ceil(Math.random()*10))*4+Math.random(),
                        vy:-5
                    }
                    balls.push(ball);
                }
            }
        }
    }

    function renderBalls(cxt){
        for(var index = 0;index<balls.length;index++){
            cxt.beginPath();
            cxt.fillStyle=balls[index].color;
            cxt.arc(balls[index].offsetX, balls[index].offsetY, RADIUS, 0, 2*Math.PI);
            cxt.fill();
        }
    }

    function updateBalls () {
        var i =0;
        for(var index = 0;index<balls.length;index++){
            var ball = balls[index];
            ball.offsetX += ball.vx;
            ball.offsetY += ball.vy;
            ball.vy+=ball.g;
            if(ball.offsetY > (WINDOW_HEIGHT-RADIUS)){
                ball.offsetY= WINDOW_HEIGHT-RADIUS;
                ball.vy=-ball.vy*u;
            }
            if(ball.offsetX>RADIUS&&ball.offsetX<(WINDOW_WIDTH-RADIUS)){

                balls[i]=balls[index];
                i++;
            }
        }
        //去除出边界的球
        for(;i<balls.length;i++){
            balls.pop();
        }
    }
    function drawSingleNumber(offsetX, offsetY, num, cxt){
        var numMatrix = digit[num];
        for(var y = 0;y<numMatrix.length;y++){
            for(var x = 0;x<numMatrix[y].length;x++){
                if(numMatrix[y][x]==1){
                    cxt.beginPath();
                    cxt.arc(offsetX+RADIUS+RADIUS*2*x,offsetY+RADIUS+RADIUS*2*y,RADIUS,0,2*Math.PI);
                    cxt.fill();
                }
            }
        }
        cxt.beginPath();
        offsetX += numMatrix[0].length*RADIUS*2;
        return offsetX;
    }

    var canvas = document.getElementById("canvas");
    canvas.width=WINDOW_WIDTH;
    canvas.height=WINDOW_HEIGHT;
    context = canvas.getContext("2d");

    //记录当前绘制的时刻
    var currentDate = new Date();

    setInterval(function(){
        //清空整个Canvas，重新绘制内容
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        drawDatetime(context);
    }, 50)
})();

```

### 自定义文章底部版权声明

效果图：

![版权](https://s2.ax1x.com/2019/11/25/MjejGq.png)

在目录 `themes/next/layout/_macro/` 下添加 `my-copyright.swig` ，内容如下：
```BASH
{% if page.copyright %}
<div class="my_post_copyright">
  <script src="//cdn.bootcss.com/clipboard.js/1.5.10/clipboard.min.js"></script>

  <!-- JS库 sweetalert 可修改路径 -->
  <script src="https://cdn.bootcss.com/jquery/2.0.0/jquery.min.js"></script>
  <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
  <p><span>本文标题:</span><a href="{{ url_for(page.path) }}">{{ page.title }}</a></p>
  <p><span>文章作者:</span><a href="/" title="访问 {{ theme.author }} 的个人博客">{{ theme.author }}</a></p>
  <p><span>发布时间:</span>{{ page.date.format("YYYY年MM月DD日 - HH:mm:ss") }}</p>
  <p><span>最后更新:</span>{{ page.updated.format("YYYY年MM月DD日 - HH:mm:ss") }}</p>
  <p><span>原始链接:</span><a href="{{ url_for(page.path) }}" title="{{ page.title }}">{{ page.permalink }}</a>
    <span class="copy-path"  title="点击复制文章链接"><i class="fa fa-clipboard" data-clipboard-text="{{ page.permalink }}"  aria-label="复制成功！"></i></span>
  </p>
  <p><span>许可协议:</span><i class="fa fa-creative-commons"></i> <a rel="license" href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" title="Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)">署名-非商业性使用-禁止演绎 4.0 国际</a> 转载请保留原文链接及作者。</p>
</div>
<script>
    var clipboard = new Clipboard('.fa-clipboard');
    $(".fa-clipboard").click(function(){
      clipboard.on('success', function(){
        swal({
          title: "",
          text: '复制成功',
          icon: "success",
          showConfirmButton: true
          });
    });
    });
</script>
{% endif %}
```

在目录 `themes/next/source/css/_common/components/post/` 下添加 `my-post-copyright.styl`，内容如下:
```BASH
.my_post_copyright {
  width: 85%;
  max-width: 45em;
  margin: 2.8em auto 0;
  padding: 0.5em 1.0em;
  border: 1px solid #d3d3d3;
  font-size: 0.93rem;
  line-height: 1.6em;
  word-break: break-all;
  background: rgba(255, 255, 255, 0.4);
}

.my_post_copyright p {
  margin: 0;
}

.my_post_copyright span {
  display: inline-block;
  width: 5.2em;
  color: #b5b5b5;
  font-weight: bold;
}

.my_post_copyright .raw {
  margin-left: 1em;
  width: 5em;
}

.my_post_copyright a {
  color: #808080;
  border-bottom: 0;
}

.my_post_copyright a:hover {
  color: #0593d3;
  text-decoration: underline;
}

.my_post_copyright:hover .fa-clipboard {
  color: #000;
}

.my_post_copyright .post-url:hover {
  font-weight: normal;
}

.my_post_copyright .copy-path {
  margin-left: 1em;
  width: 1em;
  +mobile() {
    display: none;
  }
}

.my_post_copyright .copy-path:hover {
  color: #808080;
  cursor: pointer;
}

```

修改 `themes/next/layout/_macro/post.swig` ，如下：
```DIFF
{#####################}
{### END POST BODY ###}
{#####################}

+<div>
+      {% if not is_index %}
+        {% include 'my-copyright.swig' %}
+      {% endif %}
+</div>

{% if theme.wechat_subscriber.enabled and not is_index %}
  <div>
    {% include 'wechat-subscriber.swig' %}
  </div>
{% endif %}
```
{% note danger,以上 + 号后面的为新增代码 %}

打开 `themes/next/source/css/_common/components/post/post.styl` 文件，在最后一行增加代码：
```BASH
@import "my-post-copyright"
```

设置新建文章自动开启 copyright ，即新建文章自动显示自定义的版权声明，设置 `～/scaffolds/post.md` 文件，如下：
```BASH
title: {{ title }}
date: {{ date }}
copyright: true #新增,开启
---
```

### 博客动态背景图片

在 `themes/next/source/css/_custom/custom.styl` 中添加CSS样式

```CSS
/* hexo next主题下，自动更换背景图片 began */
/* 图片来源https://source.unsplash.com/ */

body {
  background: url(https://source.unsplash.com/random/1920x1080);
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: 50% 50%;
}

/* hexo next主题下，自动更换背景图片 end */
```

### 博客写作进阶

Next主题集成了很多好看的写作样式，具体可以看我的[另外一篇博客](https://hasaik.com/posts/c7631ec1.html)。

### 插入音乐和视频

音乐的话，网易云音乐的外链很好用，不仅有可以单曲，还能有歌单，有兴趣的自己去[网易云音乐](https://music.163.com/)找首歌尝试。但是目前有很多音乐因为版权原因放不了，还有就是不完全支持 https，导致浏览器地址栏的小绿锁不见了。要解决这些缺点，就需要安装插件👽。

#### 音乐

1) 直接用 HTML 的标签，写法如下：
```BASH
<audio src="https://什么什么什么.mp3" style="max-height :100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" controls="controls" loop="loop" preload="meta">Your browser does not support the audio tag.</audio>
```
2) 用插件，有显示歌词功能，也美观。首先在站点文件夹根目录安装插件：
```BASH
npm install hexo-tag-aplayer --save
```
然后文章中的写法：
```BASH
{% aplayer "歌曲名" "歌手名" "https://什么什么什么.mp3" "https://封面图.jpg" "lrc:https://歌词.lrc" %}
```
另外可以支持歌单：
```BASH
{% aplayerlist %}
{
    "autoplay": false,
    "showlrc": 3,
    "mutex": true,
    "music": [
        {
            "title": "歌曲名",
            "author": "歌手名",
            "url": "https://什么什么什么.mp3",
            "pic": "https://封面图.jpg",
            "lrc": "https://歌词.lrc"
        },
        {
            "title": "歌曲名",
            "author": "歌手名",
            "url": "https://什么什么什么.mp3",
            "pic": "https://封面图.jpg",
            "lrc": "https://歌词.lrc"
        }
    ]
}
{% endaplayerlist %}
```
里面的详细参数见 [README](https://github.com/MoePlayer/hexo-tag-aplayer) 和这插件的「母亲」Aplayer 的[官方文档](https://aplayer.js.org/)。关于 [LRC](https://baike.baidu.com/item/lrc/46935) 歌词，可以用[工具](https://www.zhihu.com/question/27638171)下载网易云音乐的歌词，另发现暂时不支持 `offset` 参数。当然，如果那歌词很操蛋，有错误（比如字母大小写和标点符号乱加）或者时间完全对不上，然后你也和我一样是个完美主义者，那接下来就是令人窒息的操作了，一句一句自己查看修改……

什么，你想把网易云的几百首歌手动同步到博客😨？慢慢慢，有一种[非常简单的方法](https://github.com/MoePlayer/hexo-tag-aplayer#meingjs-support-new-in-30)，此这种方法也支持单曲，将参数里的 `playlist` 更改为 `song` 即可，非常建议食用！更多功能请仔细阅读 README。

#### 视频

1) 直接用 HTML 的标签，写法如下：
```BASH
<video poster="https://封面图.jpg" src="https://什么什么什么.mp4" style="max-height :100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" controls="controls" loop="loop" preload="meta">Your browser does not support the video tag.</video>
```
2) 用插件，可支持弹幕，首先在站点文件夹根目录安装插件：
```BASH
npm install hexo-tag-dplayer --save
```
然后文章中的写法：
```BASH
{% dplayer "url=https://什么什么什么.mp4" "https://封面图.jpg" "api=https://api.prprpr.me/dplayer/" "id=" "loop=false" %}
```
要使用弹幕，必须有 `api` 和 `id` 两项，并且若使用的是官方的 api 地址（即上面的），id 的值不能与[这个列表](https://api.prprpr.me/dplayer/list)的值一样。id 的值自己随便取，唯一要求就是前面这点。如果唯一要求难倒了你，可以使用[这个工具](http://tool.oschina.net/encrypt?type=2)将一段与众不同的文字😂生成一段看起来毫无意义的哈希值，这样看起来是不是好多了。

当然，这个插件的功能还有很多，可以去 [README](https://github.com/MoePlayer/hexo-tag-dplayer) 和这插件的「母亲」Dplayer 的[官方文档](https://dplayer.js.org/)看看。

### 主题代码块高亮

发现一款类似 MacPanel 的代码块高亮样式，具体可以看我的[另外一篇博客](https://hasaik.com/posts/d7399e80.html)。

### 主题头像旋转功能

将头像显示成圆形，鼠标放上去有旋转效果。

找到 `/themes/next/source/css/_common/components/sidebar/sidebar-author.styl` 添加以下代码：
```BASH
/*  添加头像旋转 */
.site-author-image {
  display: block;
  margin: 0 auto;
  padding: $site-author-image-padding;
  max-width: $site-author-image-width;
  height: $site-author-image-height;
  border: $site-author-image-border-width solid $site-author-image-border-color;
  /* 头像圆形 */
  border-radius: 80px;
  -webkit-border-radius: 80px;
  -moz-border-radius: 80px;
  box-shadow: inset 0 -1px 0 #333sf;
  /* 设置循环动画 [animation: (play)动画名称 (2s)动画播放时长单位秒或微秒 (ase-out)动画播放的速度曲线为以低速结束
    (1s)等待1秒然后开始动画 (1)动画播放次数(infinite为循环播放) ]*/

  /* 鼠标经过头像旋转360度 */
  -webkit-transition: -webkit-transform 1.0s ease-out;
  -moz-transition: -moz-transform 1.0s ease-out;
  transition: transform 1.0s ease-out;
}
img:hover {
  /* 鼠标经过停止头像旋转
  -webkit-animation-play-state:paused;
  animation-play-state:paused;*/
  /* 鼠标经过头像旋转360度 */
  -webkit-transform: rotateZ(360deg);
  -moz-transform: rotateZ(360deg);
  transform: rotateZ(360deg);
}
/* Z 轴旋转动画 */
@-webkit-keyframes play {
  0% {
    -webkit-transform: rotateZ(0deg);
  }
  100% {
    -webkit-transform: rotateZ(-360deg);
  }
}
@-moz-keyframes play {
  0% {
    -moz-transform: rotateZ(0deg);
  }
  100% {
    -moz-transform: rotateZ(-360deg);
  }
}
@keyframes play {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(-360deg);
  }
}
```

## 实现图片点击放大效果

next 主题自带 facybox 图片放大功能，首先推荐使用 fancybox，如果不想用可以使用以下自定义的图片放大功能，首先创建 `images.js` 文件如下：

目录位置：hexo/themes/next/source/js/src/image.js
```BASH
let container = document.documentElement||document.body;
let img,div,src,btnleft,btnright;
var imgid=0;
let x,y,w,h,tx,ty,tw,th,ww,wh;
let closeMove=function(){
    if(div==undefined){
        return false;
    }
    div.style.opacity=0;
    img.style.height=h+"px";
    img.style.width=w+"px";
    img.style.left=x+"px";
    img.style.top=(y - container.scrollTop)+"px";
    // 延迟移除dom
    setTimeout(function(){
        div.remove();
        img.remove();
        btnright.remove();
        btnleft.remove();
    },100);

};

let closeFade=function(){
    if(div==undefined){
        return false;
    }
    div.style.opacity=0;
    img.style.opacity=0;
    // 延迟移除dom
    setTimeout(function(){
        div.remove();
        img.remove();
        btnright.remove();
        btnleft.remove();
    },100);
};


// 监听滚动关闭层
document.addEventListener("scroll",function(){
    closeFade();
});
document.querySelectorAll("img").forEach(v=>{

	if (v.parentNode.localName!=a) {
		v.id=imgid;
		imgid++;
		    v.addEventListener("click",function(e){ // 注册事件
	        // 记录小图的位置个大小
	        x=e.target.offsetLeft;
	        y=e.target.offsetTop;
	        w=e.target.offsetWidth;
	        h=e.target.offsetHeight;
	         data-src=e.target.src;
	        id=e.target.id;
	        // 创建遮罩层
	        div=document.createElement("div");
	        div.style.cssText=`
	            position:fixed;
	            left:0;
	            top:0;
	            bottom:0;
	            right:0;
	            background-color: rgba(25,25,25,0.8);
	            z-index:99999999;
	            transition:all .3s cubic-bezier(0.165, 0.84, 0.44, 1);
	        `;
	        document.body.appendChild(div);
	        setTimeout(function(){
	            div.style.opacity=1;
	        },0);
	        // (此处可以加loading)

	        // 创建副本
	        img=new Image();
	        btnright=document.createElement("button");
	        btnleft=document.createElement("button");
	        img. data-src=src;
	        btnleft.style.cssText=`
			    position:fixed;
			    border-radius: 50%;;
			    left:${x - 20}px;
			    top:${y - container.scrollTop + h/2}px;
			    width:50px;
			    height:50px;
			    border: 0px;
			    background-color: rgba(200,200,200,0.8);
			    font-size: 20px;
			    z-index: 999999999;
			    transition:all .3s cubic-bezier(0.165, 0.84, 0.44, 1);
			`;
			btnright.style.cssText=`
			    position:fixed;
			    border-radius: 50%;
			    left:${x + w + 20}px;
			    top:${y - container.scrollTop + h/2}px;
			    width:50px;
			    border: 0px;
			    height:50px;
			    font-size: 20px;
			    background-color: rgba(200,200,200,0.8);
			    z-index: 999999999;
			    transition:all .3s cubic-bezier(0.165, 0.84, 0.44, 1);
			`;
			btnleft.innerText="<";
			btnright.innerText=">";

			img.style.cssText=`
			    position:fixed;
			    border-radius: 12px;
			    left:${x}px;
			    top:${y - container.scrollTop}px;
			    width:${w}px;
			    height:${h}px;
			    z-index: 999999999;
			    transition:all .3s cubic-bezier(0.165, 0.84, 0.44, 1);
			    opacity:0;
			`;



	        btnleft.onclick=function(){
	        	if(id===0){
	        		alert("已经是第一张了！");
	        		return;
	        	}
	        	var left=document.getElementById(id-1);
	        	img. data-src=left.src;
	        	x=left.offsetLeft;
	        	y=left.offsetTop;
	      		w=left.offsetWidth;
	        	h=left.offsetHeight;
	        	id--;
	        }
	        btnright.onclick=function(){
	        	id++;
	        	if(id>=imgid){
	        		alert("已经是最后一张了！");
	        		return;
	        	}
	        	var right=document.getElementById(id);
	        	img. data-src=right.src;
	        	x=right.offsetLeft;
	        	y=right.offsetTop;
	      		w=right.offsetWidth;
	        	h=right.offsetHeight;
	        }
	        img.onload=function(){
	            document.body.appendChild(img);
	            document.body.appendChild(btnright);
	            document.body.appendChild(btnleft);

	            // 浏览器宽高
	            wh=window.innerHeight;
	            ww=window.innerWidth;

	            // 目标宽高和坐标
	            if(w/h<ww/wh){
	            	th=wh-80;
		            tw=w/h*th >> 0;
		            tx=(ww - tw) / 2;
		            ty=40;	            	
	            }
	            else{
	            	tw=ww*0.8;
	            	th=h/w*tw >> 0;
	            	tx=ww*0.1;
	            	ty=(wh-th)/2;
	            }

	            // 延迟写入否则不会有动画
	            setTimeout(function(){
	                img.style.opacity=1;
	                img.style.height=th+"px";
	                img.style.width=tw+"px";
	                img.style.left=tx+"px";
	                img.style.top=ty+"px";
	                btnleft.style.left=(tx-90)+"px";
	                btnleft.style.top=(ty+th/2)+"px";
	                btnright.style.left=(tx+tw+40)+"px";
	                btnright.style.top=(ty+th/2)+"px";
	                // 点击隐藏
	                div.onclick=img.onclick=closeMove;
	            },10);
	        };
	    });//end event
	}
});//end forEach
```
然后在 `hexo/themes/layout/_layout.swig` 中最下面 `<script></script>` 中加入如下引入：

文件位置：hexo/themes/layout/_layout.swig
```BASH
<script type="text/javascript" src="/js/src/image.js"></script>
```

### 给博客添加豆瓣读书/电影/游戏页面
作为一个有内涵的博客…咳咳…展示自己丰富的阅读量是很有必要的，豆瓣读书就是这么一个很好的平台，当然已经有作者利用爬虫将豆瓣读书/电影/游戏内容爬取下来，并制作成了 hexo 博客插件，具体可以看官方文档[README](https://github.com/mythsman/hexo-douban)，当然也可以看我的[另外一篇博客](https://hasaik.com/posts/7fbe9500.html)。

当然作者所做的界面是没有样式的，我们可以在作者的基础上继续魔改增加自己喜欢的样式，在安装好所需插件后，我们打开目录为 `hexo/node_modules/hexo-douban/lib/templates/index.css` 文件，里面是整个阅读界面的 css 样式代码文件，我们可以在其中添加背景图片等样式，比如可以添加如下：

文件位置：hexo/node_modules/hexo-douban/lib/templates/index.css
```BASH
.main {
    padding-bottom: 150px;
    margin-top: 0px;
    background-image:url("xxx.jpg");
    background-size: cover;
    background-attachment: fixed;
    background-repeat:no-repeat;
}
```
修改上面的 url 中地址图片链接就可以新增背景图片了~

### 增加二次元看板娘live2d模型
如果你喜欢二次元，或者想给博客增加一个动态装饰，那么看板娘肯定是你的不二之选了，看板娘原生[使用文档在这里](https://github.com/EYHN/hexo-helper-live2d) ，但是原生的其实不是很好用，这里我推荐一个只需要引入一个js文件就能实现看板娘的方法，[README](https://github.com/stevenjoezhang/live2d-widget)在这里，这个作者对Live2d模型进行了深度优化，可以根据鼠标放置和点击内容的不同进行一定的提示信息，并且代码中设置了一年中特殊节日的祝福语，可以说是很有心了，唯一的缺点就是网页刷新时人物模型的加载速度较慢🌚~

具体设置的话，我们去这个[张书樵live2d-widget](https://github.com/stevenjoezhang/live2d-widget)下载这个 zip 项目并解压到 `themes/next/source` 下。

然后打开下载文件中的 `autoload.js` 文件，修改以下代码：
```BASH
const live2d_path = "https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget/";
```
为下面这个地址：
```BASH
const live2d_path = "/live2d-widget/";
```
上面那个地址表示在本地引用，然后打开 `themes/next/layout/_layout.swig` 文件，在其中引入 js 文件如下：
```BASH
<script src="/live2d-widget/autoload.js"></script>
```
打开主题配置文件 `themes/next/_config.xml` 文件，在其中末尾添加：
```BASH
live2d:
  enable: true  # 设置看板娘开关
```
最后，想修改看板娘大小、位置、格式、文本内容等，可查看并修改 `waifu-tips.js` 、 `waifu-tips.json` 和 `waifu.css` 三个文件。

### 彩色标签云

就是标签上增加随机颜色，每次刷新页面标签上展示颜色都不一样。打开 `hexo/themes/next/layout/page.swig` 文件，找到：

文件位置：hexo/themes/next/layout/page.swig
```BASH
{% if page.type === "tags" %}
```
然后将这段代码：
```BASH
<div class="tag-cloud">

   <!-- <div class="tag-cloud-title">
       {{ _p(counter.tag_cloud, site.tags.length) }}
   </div> -->
   <div class="tag-cloud-tags" id="tags">
     {{ tagcloud({min_font: 16, max_font: 16, amount: 300, color: true, start_color: #fff, end_color: #fff}) }}
   </div>
 </div>
```
换成这段代码：
```BASH
<div class="tag-cloud">
  <!-- <div class="tag-cloud-title">
      {{ _p(counter.tag_cloud, site.tags.length) }}
  </div> -->
  <div class="tag-cloud-tags" id="tags">
    {{ tagcloud({min_font: 16, max_font: 16, amount: 300, color: true, start_color: #fff, end_color: #fff}) }}
  </div>
</div>
<br>

<script type="text/javascript">
   var alltags=document.getElementById(tags);
   var tags=alltags.getElementsByTagName(a);

   for (var i = tags.length - 1; i >= 0; i--) {
     var r=Math.floor(Math.random()*75+130);
     var g=Math.floor(Math.random()*75+100);
     var b=Math.floor(Math.random()*75+80);
     tags[i].style.background = "rgb("+r+","+g+","+b+")";
   }
</script>

<style type="text/css">
    div#posts.posts-expand .tag-cloud a{
   background-color: #f5f7f1;
   border-radius: 6px;
   padding-left: 10px;
   padding-right: 10px;
   margin-top: 18px;

 }

 .tag-cloud a{
   background-color: #f5f7f1;
   border-radius: 4px;
   padding-right: 5px;
   padding-left: 5px;
   margin-right: 5px;
   margin-left: 0px;
   margin-top: 8px;
   margin-bottom: 0px;

 }

 .tag-cloud a:before{
      content: "?";
 }

 .tag-cloud-tags{
   text-align: left;
   counter-reset: tags;
 }
</style>
```
然后重新渲染页面就好啦~然后如果需要将标签云放到首页，直接在对应位置添加标签云的引用代码即可：
```BASH
<div class="tag-cloud">
  <div class="tag-cloud-tags" id="tags">
    {{ tagcloud({min_font: 16, max_font: 16, amount: 300, color: true, start_color: '#fff', end_color: '#fff'}) }}
  </div>
</div>
```

### 鼠标样式

添加CSS样式代码：

文件位置：/themes/next/source/css/_custom/custom.styl 
```BASH
/* 鼠标样式 */
* {
  cursor: url(/images/default.cur),auto;
}
:link {
  cursor: url(/images/pointer.cur),auto
}
```
用到的两个文件：default.cur、pointer.cur 位于 images 目录下，因为是 .cur 这种静态光标文件，编辑器打开是一堆 [ASCII 码](http://ascii.911cha.com/)，这里就不贴了，直接附上链接，当然，你也可以在浏览器里获取。

{% btn https://hasaik.com/images/default.cur, default.cur, download fa-lg fa-fw %}

{% btn https://hasaik.com/images/pointer.cur, pointer.cur, download fa-lg fa-fw %}

### 鼠标点击特效

鼠标点击常用4种特效可以参考的我的[另外一篇博客](https://hasaik.com/posts/9c9b482b.html)。

### Valine评论框样式美化

[valine](https://valine.js.org/)自带的样式比较素，并且颜色有点单调，不如花点时间将 valine 重新打造一下，注意我修改的 valine 样式只支持 1.3.4 版本的，其它版本的也可以修改，但是需要重新适配 CSS 样式。具体内容参考我的[另外一篇博客](https://hasaik.com/posts/89ea6c8b.html)。

### 归档页面美化

归档页面其实有很多大佬已经给出美化样式了，有的有翻页特效，比如[像这样](https://hearxn.github.io/archives/)，或者直接简单点，可以参考我的[另外一篇博客](https://hasaik.com/posts/f68f129b.html)。

### 添加相册功能

这个实现的方式比较多，但是个人觉得比较实用好看的推荐参考[这篇文章](https://me.idealli.com/post/73ad4183.html)，相册展示图片样式可以在原作者基础上继续进行二次开发。我的[个人相册](https://hasaik.com/photos/)是另一种方式哦，附上[教程](https://hasaik.com/posts/39d47c89.html)。

### 引入share.js分享功能

![share](https://s2.ax1x.com/2019/11/14/MtjAbj.png)

我目前使用的 Next5 自带的分享样式都不是很好看，百度分享虽然默认不支持 HTTPS，但是强行支持后总是在 console 控制台报错，我觉得挺烦的就直接删掉了。然后偶然在 Github 上看到一个 Share.js 感觉比较美观，就想办法引入到了个人博客。方法如下：

在这个 [Share.js](https://github.com/overtrue/share.js) 中拷贝 `dist` 目录到本地的 `hexo/themes/next/source` 下。

在 `hexo/themes/next/layout/_layout.swig` 文件的 `<head></head>` 标签体内引入如下样式：
```BASH
<link rel="stylesheet" href="/dist/css/share.min.css">
```
然后在下面 `<body></body>` 标签体内引入如下 js 文件：
```BASH
<script src="/dist/js/social-share.min.js"></script>
```
最后，在 `hexo/themes/next/layout/post.swig` 文件中添加如下代码：
```DIFF
    <div class="post-spread">
      {% if theme.jiathis %}
        {% include '_partials/share/jiathis.swig' %}
      {% elseif theme.baidushare %}
        {% include '_partials/share/baidushare.swig' %}
      {% elseif theme.add_this_id %}
        {% include '_partials/share/add-this.swig' %}
      {% elseif theme.duoshuo_shortname and theme.duoshuo_share %}
        {% include '_partials/share/duoshuo_share.swig' %}
        
       <!-- 引入share.js -->
+      {% elseif theme.share_js%}
+      	<div data-weibo-title="分享到微博" data-qq-title="分享到QQ" data-douban-title="分享到豆瓣" class="social-share" class="share-component" data-disabled="twitter,facebook" data-description="Share.js - 一键分享到微博，QQ空间，腾讯微博，人人，豆瓣">分享到：</div>
+      {% endif %}

  </div>
```
并在主题配置文件中末尾添加如下：

文件位置：hexo/themes/next/_config.xml
```BASH
share_js: true
```
然后就可以使用了！里面具体一些属性设置可以查看原作者的[README](https://github.com/overtrue/share.js/blob/master/README.md)文档，介绍的很详细。

## 参考文章
1. [造个性超赞博客 Hexo + NexT + GitHub Pages 的超深度优化](https://io-oi.me/tech/hexo-next-optimization.html)
2. [Hexo+Next主题优化](https://www.jianshu.com/p/efbeddc5eb19?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation)
3. [Hexo搭建个人博客–next主题优化](https://www.jianshu.com/p/1f8107a8778c)
4. [Hexo+Next个人博客主题优化](https://www.jianshu.com/p/efbeddc5eb19)
5. [加速Hexo博客](https://io-oi.me/tech/speed-up-hexo.html#main)
6. [hexo建站笔记之彩色标签云](https://me.idealli.com/post/d6caa003.html)
7. [hexo建站笔记之首页轮播图](https://me.idealli.com/post/6bf81741.html)
8. [原生js实现图片点击展示效果](https://me.idealli.com/post/ed80a662.html)
9. [在网页中添加live2d看板娘](https://zhangshuqiao.org/2018-07/%E5%9C%A8%E7%BD%91%E9%A1%B5%E4%B8%AD%E6%B7%BB%E5%8A%A0Live2D%E7%9C%8B%E6%9D%BF%E5%A8%98)
10. [Google Fonts已支持思源宋体](https://io-oi.me/tech/noto-serif-sc-added-on-google-fonts.html#main)
11. [Hexo博客+Next主题深度优化与定制](https://bestzuo.cn/posts/blog-establish.html)
