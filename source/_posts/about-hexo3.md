---
title: Hexo博客静态资源压缩
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/hexo.png
abbrlink: 495d0b23
date: 2019-10-13 12:52:32
tags: [Hexo,Gulp,Neat]
categories: [Hexo]
keywords: [Gulp,Hexo-Neat,静态资源压缩]
description: 对于个人博客来说，优化页面的访问速度是很有必要的，如果打开你的个人站点，加载个首页就要十几秒，页面长时间处于空白状态，想必没什么人能够忍受得了吧。个人觉得，如果能把页面的加载时间控制在三四秒内，就很不错了。
---
针对于博文静态资源压缩，介绍一下两种压缩方式，第一种方式是使用Gulp来进行压缩，`Gulp` 是 `Node.js` 下的自动构建工具，通过一列的task执行步骤进行自动流程化处理。第二种方式就是使用由rozbo大佬开发的 `Hexo-Neat` 压缩插件，配置简单，无需额外命令。

附上大佬的 `Github` 链接：

{% linkCard https://github.com/rozbo/hexo-neat,Hexo-Neat %}

## Hexo-Neat使用

1、在站点根目录下安装 `Hexo-Neat`

```CMD
$ npm install hexo-neat --save
```

2、在站点配置文件中末尾添加以下相关配置即可，也可以按照自己的需求去自定义配置。

```BASH
# hexo-neat
# 博文压缩
neat_enable: true
# 压缩html
neat_html:
 enable: true
 exclude:
# 压缩css
neat_css:
 enable: true
 exclude:
   - '*/*.min.css'
# 压缩js
neat_js:
 enable: true
 mangle: true
 output:
 compress:
 exclude:
   - '**/*.min.js'
   - '**/jquery.fancybox.pack.js'
   - '**/index.js'
```

## Gulp使用

1、在站点的根目录下执行以下命令

```CMD
$ npm install gulp -g
$ npm install gulp-minify-css gulp-uglify gulp-htmlmin gulp-htmlclean gulp --save
```

2、在博客根目录下新建 `gulpfile.js` ，并填入以下内容

```BASH
var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');
var imagemin = require('gulp-imagemin');

// 压缩html
gulp.task('minify-html', function() {
    return gulp.src('./public/**/*.html')
        .pipe(htmlclean())
        .pipe(htmlmin({
            collapseWhitespace: true, //从字面意思应该可以看出来，清除空格，压缩html，这一条比较重要，作用比较大，引起的改变压缩量也特别大
            collapseBooleanAttributes: true, //省略布尔属性的值，比如：<input checked="checked"/>,那么设置这个属性后，就会变成 <input checked/>
            removeComments: true, //清除html中注释的部分
            removeEmptyAttributes: true, //清除所有的空属性
            removeScriptTypeAttributes: true, //清除所有script标签中的type="text/javascript"属性。
            removeStyleLinkTypeAttributes: true, //清楚所有Link标签上的type属性。
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
        }))
        .pipe(gulp.dest('./public'));
});
// 压缩css
gulp.task('minify-css', function() {
    return gulp.src('./public/**/*.css')
        .pipe(minifycss({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest('./public'));
});
// 压缩js !代表排除的js,例如['!./public/js/**/*min.js']
gulp.task('minify-js', function() {
    return gulp.src(['./public/js/**/.js'])
        .pipe(uglify()) //压缩混淆
        .pipe(gulp.dest('./public'));
});
// 压缩图片
gulp.task('minify-images', function() {
    return gulp.src('./public/images/**/*.*')
        .pipe(imagemin(
        [imagemin.gifsicle({'optimizationLevel': 3}),
        imagemin.jpegtran({'progressive': true}),
        imagemin.optipng({'optimizationLevel': 7}),
        imagemin.svgo()],
        {'verbose': true}))
        .pipe(gulp.dest('./public/images'));
});
// 默认任务
gulp.task('default',gulp.series(gulp.parallel('minify-html','minify-css','minify-js','minify-images')));
```

3、生成博文时执行 `hexo g && gulp` 就会根据 `gulpfile.js` 中的配置，对 `public` 目录中的静态资源文件进行压缩。

<div class="note success">
以上就是关于博文静态资源压缩的两种方式，欢迎自由选择引用，如有不明白的地方欢迎下方留言 o(^▽^)o ，谢谢阅读。
</div>
