---
title: Vue 格式化数字为金额格式
pin: false
toc: true
tags: [Vue,工具类]
categories: [Vue]
keywords: [Vue,金额,格式化,数字]
abbrlink: 6b9072d4
date: 2020-08-06 20:04:10
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/vue.png
description: 贴出 Vue 常用工具方法，格式化数字为金额格式。
---

代码：
```js
/**
 * @description 格式化金额
 * @param number：要格式化的数字
 * @param decimals：保留几位小数 默认0位
 * @param decPoint：小数点符号 默认.
 * @param thousandsSep：千分位符号 默认为,
 */
export const formatMoney = (number, decimals = 0, decPoint = '.', thousandsSep = ',') => {
  number = (number + '').replace(/[^0-9+-Ee.]/g, '')
  let n = !isFinite(+number) ? 0 : +number
  let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
  let sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
  let dec = (typeof decPoint === 'undefined') ? '.' : decPoint
  let s = ''
  let toFixedFix = function (n, prec) {
    let k = Math.pow(10, prec)
    return '' + Math.ceil(n * k) / k
  }
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
  let re = /(-?\d+)(\d{3})/
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, '$1' + sep + '$2')
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || ''
    s[1] += new Array(prec - s[1].length + 1).join('0')
  }
  return s.join(dec)
}
```
