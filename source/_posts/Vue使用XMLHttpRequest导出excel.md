---
title: Vue 使用 XMLHttpRequest 导出 excel
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/vue.png
abbrlink: '34469844'
date: 2020-07-06 16:41:32
tags: [Vue]
categories: [Vue]
keywords: [Vue,XMLHttpRequest,导出excel]
description: 介绍 Vue 如何使用 XMLHttpRequest 导出 excel。
---

相关代码：
```BASH
const formData = new FormData()
const xhr = new XMLHttpRequest()
xhr.open('post', 'http://localhost:8080/api') // url填写后台的接口地址，如果是post，在formData append参数即可
xhr.setRequestHeader('X-Token', getToken())
xhr.responseType = 'blob'
xhr.onload = function(e) {
if (this.status === 200) {
  const blob = this.response
  const filename = '合同.xlsx' // 这里的名字，可以按后端给的接口固定表单设置一下名字，如（费用单.xlsx,合同.doc等等）
  console.log(this.response)
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename)
  } else {
    const a = document.createElement('a')
    const url = URL.createObjectURL(blob)
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
  }
}
}
xhr.send(formData)
```
