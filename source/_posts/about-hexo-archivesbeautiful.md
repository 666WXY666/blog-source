---
title: Hexo博客+Next主题归档页美化
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/hexo.png
abbrlink: f68f129b
date: 2019-11-14 15:39:14
tags: [Hexo]
categories: [Hexo]
keywords: [Hexo,归档页美化]
description: 感觉归档页美化效果也还不错哈，不妨在本站归档页看看效果~
---
大家在使用hexo博客的Next主题的时候应该都觉得原来默认的归档页面很丑吧，最近也有小伙伴问我这个归档页面美化怎么弄的，今天就小小的总结一下。

{% linkCard https://hasaik.com/archives/,我的归档页面 %}

首先我们打开Next主题目录（注意这个美化样式只支持Next主题），然后找到 `next/layout/_macro/post-collapse.swig` 文件。

<div class="note warning">
注意：Next5和Next6主题下这个文件中内容可能会有点不太一样，需要找到对应内容对应一一修改。
</div>

以下基于Next5，其中原始内容如下，Next6主题下类似：

文件位置：/hexo/next/layout/_macro/post-collapse.swig
```BASH
{% macro render(post) %}

 <article class="post post-type-{{ post.type | default('normal') }}" itemscope itemtype="http://schema.org/Article">
    <header class="post-header">

       <{% if theme.seo %}h3{% else %}h2{% endif %} class="post-title">
            {% if post.link %}{# Link posts #}
            <a class="post-title-link post-title-link-external" target="_blank" href="{{ url_for(post.link) }}" itemprop="url">
                {{ post.title or post.link }}
                <i class="fa fa-external-link"></i>
            </a>
            {% else %}
            <a class="post-title-link" href="{{ url_for(post.path) }}" itemprop="url">
                {% if post.type === 'picture' %}
                {{ post.content }}
                {% else %}
                <span itemprop="name">{{ post.title | default(__('post.untitled')) }}</span>
                {% endif %}
            </a>
            {% endif %}
            </{% if theme.seo %}h3{% else %}h2{% endif %}>

        <div class="post-meta">
            <time class="post-time" itemprop="dateCreated"
                  datetime="{{ moment(post.date).format() }}"
                  content="{{ date(post.date, config.date_format) }}" >
                {{ date(post.date, 'MM-DD') }}
            </time>
        </div>

    </header>
</article>

{% endmacro %}
```
然后主要找 class 属性做修改，首先将 `post-meta` 代码块的内容上移到 `post-header` 下面，如下：
```DIFF
{% macro render(post) %}

 <article class="post post-type-{{ post.type | default('normal') }}" itemscope itemtype="http://schema.org/Article">
    <header class="post-header">
    
+       <div class="post-meta">
+            <time class="post-time" itemprop="dateCreated"
+                  datetime="{{ moment(post.date).format() }}"
+                  content="{{ date(post.date, config.date_format) }}" >
+                {{ date(post.date, 'MM-DD') }}
+            </time>
+        </div>

       <{% if theme.seo %}h3{% else %}h2{% endif %} class="post-title">
            {% if post.link %}{# Link posts #}
            <a class="post-title-link post-title-link-external" target="_blank" href="{{ url_for(post.link) }}" itemprop="url">
                {{ post.title or post.link }}
                <i class="fa fa-external-link"></i>
            </a>
            {% else %}
            <a class="post-title-link" href="{{ url_for(post.path) }}" itemprop="url">
                {% if post.type === 'picture' %}
                {{ post.content }}
                {% else %}
                <span itemprop="name">{{ post.title | default(__('post.untitled')) }}</span>
                {% endif %}
            </a>
            {% endif %}
            </{% if theme.seo %}h3{% else %}h2{% endif %}>
        
-       <div class="post-meta">
-            <time class="post-time" itemprop="dateCreated"
-                  datetime="{{ moment(post.date).format() }}"
-                  content="{{ date(post.date, config.date_format) }}" >
-                {{ date(post.date, 'MM-DD') }}
-            </time>
-        </div>

    </header>
</article>

{% endmacro %}
```

然后对照下面代码修改 class 属性，红色代码为原始代码，绿色代码为修改后的代码，实际上修改的地方只是在对应的 class 属性前面加上 `my-` 即可，比如原始是 `post-title-link` ，修改为 `my-post-title-link` 。注意以下只是原始代码和修改代码参考对比，不要直接复制！ 
```DIFF
{% macro render(post) %}

- <article class="post post-type-{{ post.type | default('normal') }}" itemscope itemtype="http://schema.org/Article">
+ <article class="my-post post-type-{{ post.type | default('normal') }}" itemscope itemtype="http://schema.org/Article">
-    <header class="post-header">
+    <header class="my-post-header">

-       <div class="post-meta">
+       <div class="my-post-meta">
-            <time class="post-time" itemprop="dateCreated"
+            <time class="my-post-time" itemprop="dateCreated"
                  datetime="{{ moment(post.date).format() }}"
                  content="{{ date(post.date, config.date_format) }}" >
                {{ date(post.date, 'MM-DD') }}
            </time>
        </div>

-       <{% if theme.seo %}h3{% else %}h2{% endif %} class="post-title">
+       <{% if theme.seo %}h3{% else %}h2{% endif %} class="my-post-title">
            {% if post.link %}{# Link posts #}
-            <a class="post-title-link post-title-link-external" target="_blank" href="{{ url_for(post.link) }}" itemprop="url">
+            <a class="my-post-title-link post-title-link-external" target="_blank" href="{{ url_for(post.link) }}" itemprop="url">
                {{ post.title or post.link }}
                <i class="fa fa-external-link"></i>
            </a>
            {% else %}
-            <a class="post-title-link" href="{{ url_for(post.path) }}" itemprop="url">
+            <a class="my-post-title-link" href="{{ url_for(post.path) }}" itemprop="url">
                {% if post.type === 'picture' %}
                {{ post.content }}
                {% else %}
                <span itemprop="name">{{ post.title | default(__('post.untitled')) }}</span>
                {% endif %}
            </a>
            {% endif %}
            </{% if theme.seo %}h3{% else %}h2{% endif %}>

    </header>
</article>

{% endmacro %}
```

最后打开主题目录下的 `next/source/css/_custom/custom.styl` 文件，在文件末尾添加如下样式：

```BASH
/* 归档页样式 began */
.page-archive .archive-page-counter {
  font-size: 18px;
  background-color: #49b1f5;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 8px;
  color: #fff;
  +mobile() {
    font-size: 16px;
  }
}
.my-post-time{
  font-size: 11px;
  position: absolute;
  color: #fff;
  background-color: #49b1f5;
  border-radius: 5px;
  padding-left: 5px;
  padding-right: 5px;
  margin-left: 15px;
}
.mypost{
  position: relative;
  margin-bottom: 1rem;
  -webkit-transition: all .2s ease-in-out;
  -moz-transition: all .2s ease-in-out;
  -o-transition: all .2s ease-in-out;
  -ms-transition: all .2s ease-in-out;
  transition: all .2s ease-in-out;
}
a.my-post-title-link:before{
  top: 10px;
  width: 18px;
  height: 18px;
  content: "📚";
  margin-right: 5px;
  font: normal normal normal 14px/1 FontAwesome;
  font-size: 15px;
  line-height: 18px;
}
.my-post:hover{
  transform: scale(1.1);
  box-shadow: 10px 10px 15px 2px rgba(0,0,0,.12), 0 0 6px 0 rgba(104, 104, 105, 0.1);
  border-radius: 30px;
  width: 400px;
  padding: 1px 10px;
  margin-left: 25px;
  font-size: 16px;
  transition-duration: 0.15s;
  +mobile(){
    width: 260px;
    margin-left: 18px;
  }
  //display:flex;
}
a.my-post-title-link{
  text-decoration: none;
  font-size: 15px;
  font-weight: 400;
  +mobile() {
    font-size: 14px;
  }
}
.my-post-title{
  display: block;
  margin-left: 4.5rem;
  color: #4c4948;
  text-decoration: none;
  font-size: .8rem;
  cursor: pointer;
  +mobile() {
    //margin-left: 4rem;
  }
}
.my-post-header{
  position: top;
  margin-bottom: 1rem;
  -webkit-transition: all .2s ease-in-out;
  -moz-transition: all .2s ease-in-out;
  -o-transition: all .2s ease-in-out;
  -ms-transition: all .2s ease-in-out;
  transition: all .2s ease-in-out;
}
//.my-post-title-link{
//  font-size: 16px;
//  font-weight: 500;
//}
.my-post-meta{
  position: absolute;
  color: #99a9bf;
  width: 80px;
  color: #114142;
}
div.post-block.tag .collection-title h2 {
  border-width: 1px;
  border-style: solid;
  border-color: #3f3f3f;
  border-radius: 20px;
  font-size: 22px;
  background-color: #b4e8fa;
  padding: 2px 15px;
  letter-spacing: 1.5px;
  box-sizing: border-box;
  color: #3f3f3f;
  display: inline-block;
  margin: 10px 0 10px;
  text-align: center;
  +mobile(){
    font-size: 18px;
  }
}
.category-list-link:hover{
  transform: scale(1.1);
  box-shadow: 10px 10px 15px 2px rgba(0,0,0,.12), 0 0 6px 0 rgba(104, 104, 105, 0.1);
  border-radius: 8px;
  padding: 1px 1px;
  margin-left: 5px;
  font-size: 16px;
  transition-duration: 0.15s;
  //display:flex;
}
/* 归档页样式 end */
```

然后 `hexo clean && hexo g && hexo s` 就可以查看效果了！
