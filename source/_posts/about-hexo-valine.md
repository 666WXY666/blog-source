---
title: 使用增强版valine
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/hexo.png
abbrlink: bf9eba42
date: 2019-11-15 11:48:15
tags: [Hexo,Valine]
categories: [Hexo]
keywords: [Valine]
description: 云淡风轻在很早之前就开发了一款极简的valine评论系统，由于现在Disqus被墙，使用起来步骤太复杂，所以现在大多数个人博客还是以valine为主。但是原生的valine功能过于单调，后来有不少大佬在基于原作者的基础上增强了valine的功能，我想推荐的一款就是 Deserts 增强的valine，作者介绍文档并没有针对hexo博客做出适配，所以我记录一下我在hexo博客中做出的修改。
---
云淡风轻在很早之前就开发了一款极简的[valine评论系统](https://ioliu.cn/2017/add-valine-comments-to-your-blog/)，由于现在Disqus被墙，使用起来步骤太复杂，所以现在大多数个人博客还是以valine为主。但是原生的valine功能过于单调，后来有不少大佬在基于原作者的基础上增强了valine的功能，我想推荐的一款就是 [Deserts](https://deserts.io/) 增强的valine，[作者介绍文档](https://deserts.io/diy-a-comment-system/)并没有针对hexo博客做出适配，所以我记录一下我在hexo博客中做出的修改。

相比于原生valine，作者做出了以下增强功能：

1. 支持博主标记显示
2. 必须填写昵称和邮箱才能评论（反垃圾评论的作用）
3. 支持PJAX主题
4. 可以自定义表情包，评论样式修改，点赞功能（新版中被作者去掉了。。。）
5. 评论表情包
6. 支持Disqus数据迁移到valine
7. 隐私保护：敏感字段限制读取，如E-mail、用户信息（使用的浏览器等）、IP
8. 头像显示、样式美化
9. 完善的邮件通知
10. 基于Akimmet的垃圾评论自动标注和过滤
11. 通知邮件补发
12. ……

[评论在线预览](https://desertsp.github.io/Valine/)，具体介绍可以参考作者[原文博客](https://deserts.io/diy-a-comment-system/)

为了适配hexo博客，可以做如下修改：

1. 先[下载](https://site-1258928558.cos.ap-guangzhou.myqcloud.com/js/Valine.min.js)作者给出的 `Valine.min.js` 文件，放到 `hexo/themes/next/source/js/src` 下，或者你的其它托管路径下

2. 然后修改代码如下：

文件位置：hexo/themes/next/layout/_third-party/comments/valine.swig
```BASH
{% if theme.valine.enable and theme.valine.appid and theme.valine.appkey %}
  <script src="//cdn1.lncld.net/static/js/3.0.4/av-min.js"></script>
  <script src="/js/src/Valine.min.js"></script>

  <!--<script src="//unpkg.com/valine/dist/Valine.min.js"></script>-->
  <!-- https://deserts.io/diy-a-comment-system/ -->
  <script type="text/javascript">
    new Valine({
        lang: 'zh-cn',
        admin_email: '22476705@qq.com', //博主邮箱
        el: '#comments' ,
        appId: '{{ theme.valine.appid }}',
        appKey: '{{ theme.valine.appkey }}',
        emoticon_url: 'https://cloud.panjunwen.com/alu',
        emoticon_list: ["吐.png","喷血.png","狂汗.png","不说话.png","汗.png","坐等.png","献花.png","不高兴.png","中刀.png","害羞.png","皱眉.png","小眼睛.png","中指.png","尴尬.png","瞅你.png","想一想.png","中枪.png","得意.png","肿包.png","扇耳光.png","亲亲.png","惊喜.png","脸红.png","无所谓.png","便便.png","愤怒.png","蜡烛.png","献黄瓜.png","内伤.png","投降.png","观察.png","看不见.png","击掌.png","抠鼻.png","邪恶.png","看热闹.png","口水.png","抽烟.png","锁眉.png","装大款.png","吐舌.png","无奈.png","长草.png","赞一个.png","呲牙.png","无语.png","阴暗.png","不出所料.png","咽气.png","期待.png","高兴.png","吐血倒地.png","哭泣.png","欢呼.png","黑线.png","喜极而泣.png","喷水.png","深思.png","鼓掌.png","暗地观察.png"],
        placeholder: '{{ theme.valine.placeholder }}',
  });

  <!--点击邮件中的链接跳转至相应评论-->
  if(window.location.hash){
      var checkExist = setInterval(function() {
         if ($(window.location.hash).length) {
            $('html, body').animate({scrollTop: $(window.location.hash).offset().top-90}, 1000);
            clearInterval(checkExist);
         }
      }, 100);
   }

  </script>

{% endif %}
```
这样就可以基本替代了，但是…但是还是存在不少BUG，比如，原生valine自带的首页元数据评论数量统计不见了，有人提出了issue，作者表示无意开发这个功能。

如果你懂一些css知识的话，评论样式依旧可以自己在 `cuntom.styl` 文件中修改。
