---
title: vue项目中，js根据文件名后缀，判断文件图片、视频、文档、pdf等类型的方法
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/vue.png
abbrlink: dc877e7a
date: 2020-02-13 17:23:42
tags: [Vue]
categories: [Vue]
keywords: [Vue,js根据文件名后缀判断文件类型]
description: 介绍一个Vue项目中会使用到的工具类，就是根据文件名后缀，判断文件图片、视频、文档、pdf等类型的方法。
---
vue项目中，在获得文件名信息，需要根据文件名的后缀来区分文件类型的方法如下：其中，文件后缀可自由拓展。

```BASH
// 根据文件名后缀区分 文件类型
export function matchType(fileName) {
  // 后缀获取
  let suffix = ''
  // 获取类型结果
  let result
  try {
    const fileArr = fileName.split('.')
    suffix = fileArr[fileArr.length - 1]
  } catch (err) {
    suffix = ''
  }
  // fileName无后缀返回 false
  if (!suffix) {
    result = false
    return result
  }
  // 图片格式
  const imgList = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'svg', 'icon', 'ico']
  // 进行图片匹配
  result = imgList.some(function(item) {
    return item === suffix
  })
  if (result) {
    result = 'image'
    return result
  }
  // 匹配txt
  const txtList = ['txt']
  result = txtList.some(function(item) {
    return item === suffix
  })
  if (result) {
    result = 'txt'
    return result
  }
  // 匹配 excel
  const excelList = ['xls', 'xlsx']
  result = excelList.some(function(item) {
    return item === suffix
  })
  if (result) {
    result = 'excel'
    return result
  }
  // 匹配 word
  const wordList = ['doc', 'docx']
  result = wordList.some(function(item) {
    return item === suffix
  })
  if (result) {
    result = 'word'
    return result
  }
  // 匹配 pdf
  const pdfList = ['pdf']
  result = pdfList.some(function(item) {
    return item === suffix
  })
  if (result) {
    result = 'pdf'
    return result
  }
  // 匹配 ppt
  const pptList = ['ppt', 'pptx']
  result = pptList.some(function(item) {
    return item === suffix
  })
  if (result) {
    result = 'ppt'
    return result
  }
  // 匹配 视频
  const videoList = ['mp4', 'm2v', 'mkv']
  result = videoList.some(function(item) {
    return item === suffix
  })
  if (result) {
    result = 'video'
    return result
  }
  // 匹配 音频
  const radioList = ['mp3', 'wav', 'wmv']
  result = radioList.some(function(item) {
    return item === suffix
  })
  if (result) {
    result = 'radio'
    return result
  }
  // 其他 文件类型
  result = 'other'
  return result
}
```

在项目中进行调用，只需要在需要使用的地方使用：

```BASH
this.matchType('demo.png'); // 返回的结果为 'image'
```

根据返回结果可做对应操作。
