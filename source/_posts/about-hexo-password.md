---
title: Hexo+NexT 自定义样式博文加密
pin: false
toc: true
headimg: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-headimg/privacy-space.png
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/hexo.png
abbrlink: c1cdcf68
date: 2019-10-16 16:31:27
tags: [Hexo,Password,Security]
categories: [Hexo]
keywords: [Hexo,Next,Password,博文加密]
description: 介绍一种自定义博文加密方式，不需要插件，极简模式，相对安全。
---

介绍一种自定义博文加密方式，不需要插件，极简模式，相对安全。

先看一下效果：

![密码](https://s2.ax1x.com/2019/11/01/KHMRr8.png)

## 代码

1、在目录 `/themes/next/layout/` 下的 `_layout.swig` 中，找到main标签添加自定义的 swig

```BASH
<main id="main" class="main">
  <div class="main-inner">
    <div class="content-wrap">
      <div id="content" class="content">
        {% block content %}{% endblock %}
      </div>
      {% include '_third-party/duoshuo-hot-articles.swig' %}
      {% include '_partials/comments.swig' %}
    </div>
    {% if theme.sidebar.display !== 'remove' %}
      {% block sidebar %}{% endblock %}
    {% endif %}
  </div>

 <!-- 此处为新加的代码 -->
 {% include 'password.swig' %}

</main>
```

2、在目录 `/themes/next/layout/` 下创建 `password.swig` ，内容如下：

```JS
<script src="https://cdn.staticfile.org/jquery/3.1.1/jquery.min.js"></script>
<script>
    //暂时储存文章中的内容
    var div = $('.post-body');
    //暂时储存目录的内容
    var toc=$('.post-toc')
    function password() {
        if('{{ page.password }}'){
            //将文章内容删除
            div.remove();
            //将目录删除
            toc.remove();
            //将文章删除后，向原来文章的地方添加，应该出现的提示用户输入密码的样式
            //下面这里的第一个用textarea是因为如果在手机端的时候只能显示一部分文字，
            //只是拓展:input里面的字只能显示一行，不会自动换行，目前上网搜索没有发现好的办法，所以用了textarea，右下角的小三角通过resize:none 去掉。
            $('.post-header').after(
            '<span class="description" value="请输入密码，然后按 Enter 键阅读" style="font-style: oblique;font-weight: bold;border: none;display: block;'+
            'width: 60%;margin: 0 auto;text-align: center;outline: none;margin-bottom: 40px;resize:none ">'+
            '<i class="fa fa-heartbeat" id="myheartbeat"></i>'+
            '请输入密码，然后按 Enter 键阅读' +
            '<i class="fa fa-heartbeat" id="myheartbeat"></i>'+
            '</span>' +
            '<div class="qiang" style="height: 100px;width: 60%;margin:0 auto">' +
            '<input class="password"  type="password" autocomplete="new-password" autofocus="autofocus" value="" style="border-radius: 5px;height: 30px;border: none;display: block;border-bottom: 1px solid #ccc;' +
            'margin: 0 auto;outline: none;width:95%"/>' +
            '</div>')
            //绑定点击事件，如果是点击的.password 这个div就改变样式，如果是document中除了div之外的其他任何元素，就变回原来的样式。
            document.onclick = function (event) {
                var e = event || window.event;
                var elem = e.srcElement || e.target;

                while (elem) {
                    if (elem != document) {
                        if (elem.className == "password") {
                            //$(".password").animate({paddingTop:"30px",width:"100%",borderWidth:"2px"},300)
                            return;
                        }
                        elem = elem.parentNode;
                    } else {
                        //$(".password").animate({paddingTop:"0px",width:"95%",borderWidth:"1px"},300)
                        return;
                    }
                }
            }
            //绑定enter键按下后离开的事件
            $(document).keyup(function(event){
                if(event.keyCode ==13&&$('.password').length>0){
                    //console.log($('.password').val())
                    //console.log('{{ page.password }}')
                    if ($('.password').val() == '{{ page.password }}') {
                        //恢复文章内容
                        (div).appendTo($(".post-header"))
                        //恢复目录
                        toc.appendTo($(".sidebar-inner"))
                        //删除本页面的输入密码组件
                        $(".description").remove();
                        $(".qiang").remove();
                        $(".password").remove();

                        //重新处理pjax事件,如果没有加pjax的从下面这行起到下面的else之间的代码需要去掉。
                        //图片懒加载，没有加入此功能的这个函数需要去掉
                        $('img').lazyload({
                            placeholder: '/images/loading.gif',
                            effect: 'fadeIn',
                            threshold : 100,
                            failure_limit : 20,
                            skip_invisible : false
                        });
                        //pjax后出现文章不显示，没有pjax的下面四行需要去掉
                        $(".post-block").css({opacity:1});
                        $(".post-header").css({opacity:1});
                        $(".post-body").css({opacity:1});
                        $(".pagination").css({opacity:1});
                    }else {
                        alert("对不起，密码输入错误。")
                    }
                }
                //将document的keyup移除，防止在pjax的情况下会重复绑定事件
            });
        }
    }
    password();
</script>
```

## 使用
新建一个 test.md ，内容如下

```MD
title: 测试
date: 2019-03-30 21:18:02
password: aaa
---
# aaaaaa
我就很反感大家老是那么说我，
## bbbbbb
除了有才，就只剩下那无可比拟的颜值。
```

上面的 password 后面的值自定义。

## 注意

如果自己的博客源码中的这篇文章上传到 github ，密码也就公诸于世了，可以在 push 到 github 的时候将这篇文章忽略。
