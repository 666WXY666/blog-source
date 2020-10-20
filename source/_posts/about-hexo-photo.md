---
title: Hexo+NexT 博客搭建相册
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/hexo.png
abbrlink: 39d47c89
date: 2019-10-15 09:26:09
tags: [Hexo,Photos]
categories: [Hexo]
keywords: [Hexo,Next,Photos,博客相册]
description: Next主题是不带相册功能的，但是我们还想拥有一个自己的小相册，怎么办呢，经过一番资料的查找与爬坑，相册功能终于搭建成功，接下来为大家分享一下如何实现。
---

首先说一下实现想法，在 [腾讯云开发者平台](https://dev.tencent.com/) 上面创建一个相册库（PS：腾讯云开发者平台是腾讯云与 CODING 共同为开发者打造的云端工具平台，旨在为更多的开发者带去便捷、高效的开发体验，提供包括需求管理、代码编写、代码管理、代码运行的整套系统），当有更新时，提交到腾讯云开发者平台上面，同时在博客 resource 下面生成一个 data.json 来生成所有相册文件的 json 文件，博客读取 data.json 来展示相册。

实现效果链接：

{% linkCard https://hasaik.com/photos/,Photos %}

## 创建相册

在腾讯云开发者平台上面创建一个仓库,命名为 `Blog_Back_Up` (仓库名字随便). 用 `git clone` 把仓库 `clone` 到本地来.

```BASH
cd Blog_Back_Up
```

创建 `photos` 和 `min_photos` 两个目录,把要上传的相册图片 放到 `photos` 文件夹下面.

<div class="note info">
***相册图片命名方式 : yyyy-MM-dd_des.jpg/png/jpef/gif. &emsp;eg: 2017-9-18_风景.jpg*** 
</div>

## 处理图片

图片的处理我用 `python` 脚本来处理，这样每次只要执行脚本就可以了。如果您的电脑没有 `Python` ，自行上网搜索安装教程，一搜一大把。

```Python
#coding: utf-8
from PIL import Image
import os
import sys
import json
from datetime import datetime
from ImageProcess import Graphics

# 定义压缩比，数值越大，压缩越小
SIZE_normal = 1.0
SIZE_small = 1.5
SIZE_more_small = 2.0
SIZE_more_small_small = 3.0


def make_directory(directory):
    """创建目录"""
    os.makedirs(directory)

def directory_exists(directory):
    """判断目录是否存在"""
    if os.path.exists(directory):
        return True
    else:
        return False

def list_img_file(directory):
    """列出目录下所有文件，并筛选出图片文件列表返回"""
    old_list = sorted(os.listdir(directory), reverse=True)
    print(old_list)
    new_list = []
    for filename in old_list:
        name, fileformat = filename.split(".")
        if fileformat.lower() == "jpg" or fileformat.lower() == "png" or fileformat.lower() == "gif" or fileformat.lower() == "jpeg":
            new_list.append(filename)
    # print new_list
    return new_list


def print_help():
    print("""
    This program helps compress many image files
    you can choose which scale you want to compress your img(jpg/png/etc)
    1) normal compress(4M to 1M around)
    2) small compress(4M to 500K around)
    3) smaller compress(4M to 300K around)
    """)

def compress(choose, des_dir, src_dir, file_list):
    """压缩算法，img.thumbnail对图片进行压缩，
    
    参数
    -----------
    choose: str
            选择压缩的比例，有4个选项，越大压缩后的图片越小
    """
    if choose == '1':
        scale = SIZE_normal
    if choose == '2':
        scale = SIZE_small
    if choose == '3':
        scale = SIZE_more_small
    if choose == '4':
        scale = SIZE_more_small_small
    for infile in file_list:
        img = Image.open(src_dir+infile)
        # size_of_file = os.path.getsize(infile)
        w, h = img.size
        img.thumbnail((int(w/scale), int(h/scale)))
        img.save(des_dir + infile)
def compress_photo():
    '''调用压缩图片的函数
    '''
    src_dir, des_dir = "photos/", "min_photos/"
    
    if directory_exists(src_dir):
        if not directory_exists(src_dir):
            make_directory(src_dir)
        # business logic
        file_list_src = list_img_file(src_dir)
    if directory_exists(des_dir):
        if not directory_exists(des_dir):
            make_directory(des_dir)
        file_list_des = list_img_file(des_dir)
        # print file_list
    '''如果已经压缩了，就不再压缩'''
    for i in range(len(file_list_des)):
        if file_list_des[i] in file_list_src:
            file_list_src.remove(file_list_des[i])
    compress('4', des_dir, src_dir, file_list_src)

def handle_photo():
    '''根据图片的文件名处理成需要的json格式的数据
    
    -----------
    最后将data.json文件存到博客的source/photos文件夹下
    '''
    src_dir, des_dir = "photos/", "min_photos/"
    file_list = list_img_file(src_dir)
    print(file_list)
    list_info = []
    for i in range(len(file_list)):
        filename = file_list[i]
        date_str, info = filename.split("_")
        info, _ = info.split(".")
        date = datetime.strptime(date_str, "%Y-%m-%d")
        year_month = date_str[0:7]            
        if i == 0:  # 处理第一个文件
            new_dict = {"date": year_month, "arr":{'year': date.year,
                                                                   'month': date.month,
                                                                   'link': [filename],
                                                                   'text': [info],
                                                                   'type': ['image']
                                                                   }
                                        } 
            list_info.append(new_dict)
        elif year_month != list_info[-1]['date']:  # 不是最后的一个日期，就新建一个dict
            new_dict = {"date": year_month, "arr":{'year': date.year,
                                                   'month': date.month,
                                                   'link': [filename],
                                                   'text': [info],
                                                   'type': ['image']
                                                   }
                        }
            list_info.append(new_dict)
        else:  # 同一个日期
            list_info[-1]['arr']['link'].append(filename)
            list_info[-1]['arr']['text'].append(info)
            list_info[-1]['arr']['type'].append('image')
    list_info.reverse()  # 翻转
    tmp = bubbleYear(list_info)
    bubble(tmp)
    final_dict = {"list": list_info}
    with open("../xuxugood.github.io/source/photos/data.json","w") as fp:
        json.dump(final_dict, fp)

def cut_photo():
    """裁剪算法
    
    ----------
    调用Graphics类中的裁剪算法，将src_dir目录下的文件进行裁剪（裁剪成正方形）
    """
    src_dir = "photos/"
    if directory_exists(src_dir):
        if not directory_exists(src_dir):
            make_directory(src_dir)
        # business logic
        file_list = list_img_file(src_dir)
        # print file_list
        if file_list:
            print_help()
            for infile in file_list:
                img = Image.open(src_dir+infile)
                Graphics(infile=src_dir+infile, outfile=src_dir + infile).cut_by_ratio()            
        else:
            pass
    else:
        print("source directory not exist!")     



def git_operation():
    '''
    git 命令行函数，将仓库提交
    
    ----------
    需要安装git命令行工具，并且添加到环境变量中
    '''
    os.system('git add --all')
    os.system('git commit -m "add photos"')
    os.system('git push origin master')


def bubble(bubbleList):
    listLength = len(bubbleList)
    while listLength > 0:
        for i in range(listLength - 1):    # 这个循环负责设置冒泡排序进行的次数
            # print(bubbleList[i])
            for j in range(listLength-i-1):  # ｊ为列表下标
                if(bubbleList[j].get('arr').get('year') == bubbleList[j+1].get('arr').get('year')):
                    if bubbleList[j].get('arr').get('month') < bubbleList[j+1].get('arr').get('month'):
                
                        bubbleList[j], bubbleList[j+1] = bubbleList[j+1], bubbleList[j]
        return bubbleList

    
        # for i in range(listLength - 1):
        #     if(bubbleList[i].get('arr').get('year') == bubbleList[i+1].get('arr').get('year')):
        #         if bubbleList[i].get('arr').get('month') > bubbleList[i+1].get('arr').get('month'):
        #             bubbleList[i] = bubbleList[i] + bubbleList[i+1]
        #             bubbleList[i+1] = bubbleList[i] - bubbleList[i+1]
        #             bubbleList[i] = bubbleList[i] - bubbleList[i+1]
        # listLength -= 1
    
def bubbleYear(bubbleList):
    listLength = len(bubbleList)
    while listLength > 0:
        for i in range(listLength - 1):
            for j in range(listLength-i-1):
                if bubbleList[j].get('arr').get('year') < bubbleList[j+1].get('arr').get('year'):
                    
                    bubbleList[j], bubbleList[j+1] = bubbleList[j+1], bubbleList[j]
        # print(bubbleList)
        return bubbleList


if __name__ == "__main__":
    cut_photo()        # 裁剪图片，裁剪成正方形，去中间部分
    compress_photo()   # 压缩图片，并保存到mini_photos文件夹下
    git_operation()    # 提交到github仓库
    handle_photo()     # 将文件处理成json格式，存到博客仓库中
```

其中 `../xuxugood.github.io/source/photos/data.json` 是我博客地址，这里换成你的博客地址。

### *使用方法*
执行命令 `python3 tool.py` ，因为我用的是 `python3` 这里可以根据你的 `python` 版本来使用。

### 问题
如果出现 `from PIL import Image` 这种报错，说明没有 PIL 这个库，执行 `python3 -m pip install Pillow`

## 增加相册style

在 Next 主题下面增加 `photo.swig` 页面，路径如下 `next/layout`

```BASH
{% extends '_layout.swig' %}
{% import '_macro/post-collapse.swig' as post_template %}
{% import '_macro/sidebar.swig' as sidebar_template %}

{% block title %}{{ page.title }} | {{ config.title }}{% endblock %}

{% block content %}

  {#################}
  {### Photo BLOCK ###}
  {#################}
  <div class="post-block photo">

    <div id="posts" class="posts-collapse">

    </div>

  </div>

  {#####################}
  {### END Photo BLOCK ###}
  {#####################}

  {% include '_partials/pagination.swig' %}
{% endblock %}

{% block sidebar %}
  {{ sidebar_template.render(false) }}
{% endblock %}
```

## 生成相册页面

生成相册页面 `hexo new page photos`，修改 `photos` 下的 `index.md` 文件如下

```BASH
title: 我的相册
date: 2017-09-15 09:51:05
type: "photos"
comments: false
---
<link rel="stylesheet" href="./ins.css">
 <link rel="stylesheet" href="./photoswipe.css"> 
<link rel="stylesheet" href="./default-skin/default-skin.css"> 
<div class="photos-btn-wrap">
	<a class="photos-btn active" href="javascript:void(0)">Photos</a>
</div>
<div class="instagram itemscope">
	<a href="https://xuxugood.github.io" target="_blank" class="open-ins">图片正在加载中…</a>
</div>
 
<script>
  (function() {
    var loadScript = function(path) {
      var $script = document.createElement('script')
      document.getElementsByTagName('body')[0].appendChild($script)
      $script.setAttribute('src', path)
    }
    setTimeout(function() {
        loadScript('./ins.js')
    }, 0)
  })()
</script>
```

其中 `<a href="https://xuxugood.github.io" target="_blank" class="open-ins">图片正在加载中…</a>` 中的 url 替换成你的博客网址。

需要三个 css 文件和一个 js 文件放在 photos 文件夹下，其文件都在我的 [腾讯云开发者平台](https://johnxuxuy.coding.net/p/Blog_Back_Up/d/Blog_Back_Up/git/tree/master/source/photos) 上面，需要修改 `ins.js` 的 120 和 121 行的 url 为你腾讯云开发者平台图片的网址。

## 查看相册插件 photoswipe

上面 `index.md` 中加入了两个 css 文件，这是我们用 photoswipe 查看相册用到的，具体可以参考网址 [photoswipe](https://photoswipe.com/) 。这里我们已经把 css 文件加上了，之后我们要加上 js 文件 `photoswipe.min.js` 和 `photoswipe-ui-default.min.js`，js 资源下载地址 [photoswipe](https://johnxuxuy.coding.net/p/Blog_Back_Up/d/Blog_Back_Up/git/tree/master/source/photos/photoswipe.css) ，js 存放路径为 `next/source/js/src`

## 引用 js 文件

在 `layout/_scripts/pages/post-details.swig` 中插入

```BASH
<script src="{{ url_for(theme.js) }}/src/photoswipe.min.js?v={{ theme.version }}"></script>
<script src="{{ url_for(theme.js) }}/src/photoswipe-ui-default.min.js?v={{ theme.version }}"></script>
```

## 在根目录加入标签

在 `_layout.swig` 中的body标签里最前面插入以下内容

```BASH
{% if page.type === "photos" %}
<!-- Root element of PhotoSwipe. Must have class pswp. -->
<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="pswp__bg"></div>
    <div class="pswp__scroll-wrap">
        <div class="pswp__container">
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
        </div>
        <div class="pswp__ui pswp__ui--hidden">
            <div class="pswp__top-bar">
                <div class="pswp__counter"></div>
                <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
                <button class="pswp__button pswp__button--share" title="Share"></button>
                <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
                <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
                <!-- Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR -->
                <!-- element will get class pswp__preloader--active when preloader is running -->
                <div class="pswp__preloader">
                    <div class="pswp__preloader__icn">
                      <div class="pswp__preloader__cut">
                        <div class="pswp__preloader__donut"></div>
                      </div>
                    </div>
                </div>
            </div>
            <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                <div class="pswp__share-tooltip"></div> 
            </div>
            <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
            </button>
            <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
            </button>
            <div class="pswp__caption">
                <div class="pswp__caption__center"></div>
            </div>
        </div>
    </div>
</div>
{% endif %}
```

至此相册查看插件 photoswipe 已经配置完毕。

## 整个流程使用

   1. 在 Blog_Back_Up 里面加入图片,图片路径在 photos 里面 图片命名方式 yyyy-MM-dd_des.jpg/jpeg/gif/png
   2. 执行 python3 tool.py
   3. 切换到博客 resource 目录下
   4. 在 photos 里面生成了 data.json 文件，提交到腾讯云开发者平台仓库上面
   5. 输入网址查看照片
