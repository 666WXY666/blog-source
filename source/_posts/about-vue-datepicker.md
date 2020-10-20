---
title: Element UI DatePicker 禁用当前日之前的时间
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/vue.png
tags: [Vue,el-date-picker]
categories: [Vue]
keywords: [Vue,el-date-picker,禁用当日之前时间]
abbrlink: 69ab28bb
date: 2020-01-06 14:00:20
description: 这篇文章主要介绍了 vue element-ui el-date-picker 禁用当日之前时间,文中给大家提供了代码段和截图，非常不错，具有一定的参考借鉴价值，需要的朋友可以参考下。
---

这篇文章主要介绍了 vue element-ui el-date-picker 禁用当日之前时间,文中给大家提供了代码段和截图，非常不错，具有一定的参考借鉴价值，需要的朋友可以参考下。

```BASH
<el-date-picker
  v-model="timingDay"
  :picker-options="expireTimeOption"
  format="yyyy-MM-dd"
  type="date"
  value-format="yyyy-MM-dd"
  placeholder="选择时间"/>
```
其中 `:picker-options="expireTimeOption"` 便是限制选择时间的属性，在data中可以这样写

```BASH
data：{
 return{
   timingDay: '',
   expireTimeOption: {
      disabledDate(date) {
        return date.getTime() < Date.now() - 8.64e7
      }
    }
}
```

这样便实现了禁用当日之前时间

![datepicker](https://s2.ax1x.com/2020/01/06/lsZEd0.png)

以上所述是小编给大家介绍的vue element-ui el-date-picker限制选择时间为当天之前的代码，希望对大家有所帮助，如果大家有任何疑问请给我留言，小编会及时回复大家的。
