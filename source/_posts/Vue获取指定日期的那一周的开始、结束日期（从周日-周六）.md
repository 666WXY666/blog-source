---
title: Vue获取指定日期的那一周的开始、结束日期（从周日~周六）
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/vue.png
abbrlink: faf888d5
date: 2020-07-06 15:26:10
tags: [Vue]
categories: [Vue]
keywords: [Vue,一周日期,指定日期计算一周时间,开始,结束日期]
description: 按照指定日期，计算出指定日期这一周的开始、结束日期。
---
需求：给定一个日期，如： 2020-07-06，获取该日期所在的这一周的开始时间、结束时间（按周日~周六算）

代码如下：
```JS
// 获取指定日期的那一周的开始、结束日期
export function getWeekStartAndEnd(val) {
  let now
  if (val) {
    now = new Date(val)
  } else {
    now = new Date()
  }
  const nowDayOfWeek = now.getDay() // 本周的第几天
  const nowDay = now.getDate() // 当前日
  const nowMonth = now.getMonth() // 当前月
  const nowYear = now.getFullYear() // 当前年
  const weekStart = getWeekStartDate(nowYear, nowMonth, nowDay, nowDayOfWeek)
  const weekEnd = getWeekEndDate(nowYear, nowMonth, nowDay, nowDayOfWeek)
  console.log(weekStart + ',' + weekEnd)
  return weekStart + ',' + weekEnd
}

// 获得某一周的开始日期
export function getWeekStartDate(nowYear, nowMonth, nowDay, nowDayOfWeek) {
  const weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek)
  return formatDate(weekStartDate)
}

// 获得某一周的结束日期
export function getWeekEndDate(nowYear, nowMonth, nowDay, nowDayOfWeek) {
  const weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek))
  return formatDate(weekEndDate)
}

// 日期格式化
export function formatDate(date) {
  var myYear = date.getFullYear()
  var myMonth = date.getMonth() + 1
  var myWeekday = date.getDate()
  if (myMonth < 10) {
    myMonth = '0' + myMonth
  }
  if (myWeekday < 10) {
    myWeekday = '0' + myWeekday
  }
  return myYear + '-' + myMonth + '-' + myWeekday
}
```
