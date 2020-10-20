---
title: Vue 日期格式化
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/vue.png
abbrlink: c9b4cff2
date: 2020-01-15 09:39:22
tags: [Vue,工具类]
categories: [Vue]
keywords: [Vue日期格式化,Vue工具类]
description: 介绍 Vue 中经常使用的日期格式化工具类。
---

## 函数封装（将该函数封装成一个文件，或者加入自己项目的函数库）

```BASH
// 这个函数网上随处可见，我也是应用了别人的。
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}
```

## 文件引入（注意：由于是函数，故名字要和函数的名字一致）

```BASH
import { formatDate } from '@/common/commonUtil.js'
```

## 添加到过滤器中

```BASH
filters: {
    formatDate(time) {
    var date = new Date(time);
    return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
   }
},
```

## 使用场景一： 在HTML中使用

```BASH
// item.createDate是后台数据~~
<div class="time">{{item.createDate | formatDate}}</div>
```

## 使用场景二： 在提交时候使用

```BASH
let nowDate = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
```

## 使用场景三： 在绑定属性中使用

```BASH
<mt-cell title="开始时间" :value="startDate | formatDate"></mt-cell>
```
