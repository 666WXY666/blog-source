---
title: Vue v-for list数据循环 每3或者（n）个一组
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/vue.png
abbrlink: 4fc8b649
date: 2020-07-06 15:42:46
tags: [Vue]
categories: [Vue]
keywords: [Vue,v-for,list数据循环,分组,每n个一组]
description: Vue 使用 v-for 进行数据循环 每3或者（n）个一组。
---

template 代码：
```BASH
<el-carousel-item v-for="(item,index) in listTemp" :key="index">
  <div style="margin-left: 17%;margin-right: 10%;margin-top: 20px;">
    <div v-for="o in item" :key="o" style="display:inline;padding: 0.6rem">
      <el-card :body-style="{ padding: '0px' }" style="width: 20%;max-height: 200px" @click.native="showDrawer(o)">
        <img :src="o.imgPath" class="image">
        <div style="padding: 10px;font-size:14px;display: flex;justify-content: space-between">
          <span>{{ o.eventdate }}</span>
          <span>{{ o.position }}</span>
        </div>
      </el-card>
    </div>
  </div>
</el-carousel-item>
```
computed 代码：
```BASH
computed: {
    listTemp() {
      let index = 0
      const count = 4
      const arrTemp = []
      const experts = this.alarmImgList
      for (let i = 0; i < this.alarmImgList.length; i++) {
        index = parseInt(i / count)
        if (arrTemp.length <= index) {
          arrTemp.push([])
        }
        arrTemp[index].push(experts[i])
      }
      return arrTemp
    }
}
```
