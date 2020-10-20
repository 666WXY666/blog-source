---
title: Vue兼容ie下载网络图片
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/vue.png
abbrlink: ef31a0a3
date: 2020-07-06 10:48:36
tags: [Vue]
categories: [Vue]
keywords: [Vue,兼容IE,图片,ie下载图片]
description: 记录一下如何在 vue 项目中下载网络图片，而不是直接在网页端打开。
---

最近在做 vue 项目中需要将图片下载到本地，而且要兼容 ie ，这就让人很头大，终于功夫不负有心人，解决了此问题，在此记录一下，希望可以帮助到其他人 :v:。

以下为 js 代码：
```BASH
<script>
    downloadByBlob(imageUrl, name) {
      const image = new Image()
      // 解决跨域问题
      image.setAttribute('crossOrigin', 'anonymous')
      image.src = imageUrl
    
      image.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
    
        const quality = 0.8
        // 这里的dataUrl就是base64类型
        const dataUrl = canvas.toDataURL('image/jpeg', quality)// 使用toDataUrl将图片转换成jpeg的格式,不要把图片压缩成png，因为压缩成png后base64的字符串可能比不转换前的长！
    
        const arr = dataUrl.split(',')
        const mime = arr[0].match(/:(.*?);/)[1]
        const bStr = atob(arr[1])
        let n = bStr.length
        const u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bStr.charCodeAt(n)
        }
        const blob_ = new Blob([u8arr], { type: mime })
    
        if (this.myBrowser() === 'IE') {
          const url = {
            name: name,
            src: blob_
          }
          // filename文件名包括扩展名，下载路径为浏览器默认路径
          navigator.msSaveBlob(url.src, url.name)
        } else {
          const save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
          save_link.href = dataUrl
          save_link.download = name
          const event = document.createEvent('MouseEvents')
          event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
          save_link.dispatchEvent(event)
        }
      }
    },
    myBrowser() {
      const userAgent = window.navigator.userAgent // 取得浏览器的userAgent字符串
      const isOpera = userAgent.indexOf('Opera') > -1 // 判断是否Opera浏览器
      const isIE = userAgent.indexOf('NET') > -1 && userAgent.indexOf('rv') > -1 // 判断是否IE浏览器
      const isEdge = userAgent.indexOf('Edge') > -1 // 判断是否IE的Edge浏览器
      const isFF = userAgent.indexOf('Firefox') > -1 // 判断是否Firefox浏览器
      const isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1 // 判断是否Safari浏览器
      const isChrome = userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1 // 判断Chrome浏览器
    
      if (isIE) {
        return 'IE'
      }
      if (isOpera) {
        return 'Opera'
      }
      if (isEdge) {
        return 'Edge'
      }
      if (isFF) {
        return 'FF'
      }
      if (isSafari) {
        return 'Safari'
      }
      if (isChrome) {
        return 'Chrome'
      }
    }
</script>
```
