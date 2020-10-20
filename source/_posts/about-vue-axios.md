---
title: Vue中Axios的封装与使用
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/vue.png
abbrlink: 4394a738
date: 2019-12-04 10:05:38
tags: [Vue,Axios]
categories: [Vue]
keywords: [Axios,Axios的封装]
description: axios 是一个基于 promise 的 http 库，可运行在浏览器端和 node.js 中。他有很多优秀的特性，例如统一进行拦截请求和响应、取消请求、转换 json 、客户端防御 XSRF 等。所以在日常开发中可以直接推荐我们使用 axios 库。如果还对 axios 不了解的，可以移步 axios 文档。回归正题，我们所要的说的 axios 的封装和 api 接口的统一管理，其实主要目的就是在帮助我们简化代码和利于后期的更新维护。
---

## Axios是什么，为什么要统一封装？

axios 是一个基于 promise 的 http 库，可运行在浏览器端和 node.js 中。他有很多优秀的特性，例如统一进行拦截请求和响应、取消请求、转换 json 、客户端防御 XSRF 等。所以在日常开发中可以直接推荐我们使用 axios 库。如果还对 axios 不了解的，可以移步 [axios文档](http://www.axios-js.com/docs/)。回归正题，我们所要的说的 axios 的封装和 api 接口的统一管理，其实主要目的就是在帮助我们简化代码和利于后期的更新维护。

## 安装

使用 npm：
```BASH
$ npm install axios
```

使用 bower：
```BASH
$ bower install axios
```

使用 cdn：
```BASH
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```

## 统一封装Axios拦截器

```BASH
import axios from 'axios'  // 引入axios
import { Message, MessageBox } from 'element-ui'  // 这里我是使用elementUI的组件来给提示
import store from '../store'  //引入Vuex的Store
import { getToken } from '@/utils/auth'  //一个获取cookie中token的工具类
import Cookies from 'js-cookie'  //引入cookie

// 创建axios实例，在这里可以设置请求的默认配置
const service = axios.create({
  baseURL: process.env.BASE_API, //根据自己配置的反向代理去设置不同环境的baeUrl
  timeout: 50000, // 请求超时时间,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
  // withCredentials : true
})

// request 拦截器(言外之意就是在发起请求前做什么)
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // 对请求错误做些什么
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非0是抛错 可结合自己业务进行修改
     */
    let message
    let title
    let confirmButtonText
    let cancelButtonText
    const res = response.data
    if (res.code !== 0) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === '50014' || res.code === '333') {
        if (Cookies.get('language') === 'zh') {
          message = '登录超时，请重新登录!'
          title = '确定登出'
          confirmButtonText = '重新登录'
          cancelButtonText = '取消'
        }
        MessageBox.confirm(
          message,
          title,
          {
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText,
            type: 'warning',
            showCancelButton: false
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        }).catch(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      console.log(response)
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })

    return Promise.reject(error)
  }
)

export default service

```

## 统一进行接口api管理

```BASH
// 每个模块都应该有自己的接口文件去统一管理api
import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data: data
  })
}
```

## 页面上的使用

```BASH
import { login } from '@/api/login'

export default {
  name: 'login',
  data () {
    return {}
  },
  mounted () {
    let params = { userName: 'admin', password: '123456'}
    login(params).then(res => {
      console.log(res, '这是响应的结果')
    })
  }
}
```

## 我的项目目录结构

![目录结构](https://s2.ax1x.com/2019/12/04/QQXpGV.png)

## 总结

以上就是这篇文章的全部内容了，希望本文的内容对大家的学习或者工作具有一定的参考学习价值，如果有疑问大家可以留言交流，谢谢大家的支持。
