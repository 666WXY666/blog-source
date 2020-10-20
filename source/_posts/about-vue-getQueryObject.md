---
title: Vue 获取 url 上的参数
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/vue.png
abbrlink: 41567ba6
date: 2020-05-08 08:51:58
tags: [Vue,工具类]
categories: [Vue]
keywords: [Vue,获取url上的参数]
description: 经常我们在项目中需要获取 url 上参数进行使用，所以今天为大家奉上该函数 💜
---

经常我们在项目中需要获取 url 上参数进行使用，所以今天为大家奉上工具类 💜

代码：
```BASH
/**
 * 获取url上的参数
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}
```

需要的小伙伴自取吧 :v:
