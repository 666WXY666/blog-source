---
title: Vue axios 刷新 Jwt
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/vue.png
tags: [Vue,Jwt]
categories: [Vue]
keywords: [vue,axios刷新Jwt]
abbrlink: fc31ea3
date: 2020-03-03 11:52:04
description: 讲讲 Vue axios 是如何刷新 Jwt 的。
---
最近做项目，一个需求就是Jwt token的失效的时候，如果用户还在操作，那么希望无感刷新token，让用户的操作不受影响。

两种核心思路：

1. 前端发起ajax请求 => 后端发现jwt已经过期,返回50014状态码 => 前端拦截响应数据,并发起刷新token的请求 => 拿到最新的jwt和refresh,保存到本地 => 拿到最新的jwt去进行刚刚未请求成功的接口 => 获取到刚刚请求的结果,覆盖第一次请求失败(状态码为50014)的响应数据 => 返回第二次请求的结果.

2. 前端发起ajax请求 => 后端发现jwt已经过期,返回50014状态码 => 前端拦截响应数据,并发起刷新token的请求 => 后端返回了10007的状态码(这个时候代表refreshJwt也过期了,需要进行重新登录了) => 真正的过期了,需要跳转到登录界面.

## 新建一个refreshJwt.js文件

代码如下：
```BASH
import { getRefreshToken, setRefreshToken, setToken } from './auth'
import axios from 'axios'
import store from '../store'
import { MessageBox } from 'element-ui'
import i18n from '@/lang'

/**
 * 刷新JWT设计思路：
 *
 * 第一种情况: 前端发起ajax请求 => 后端发现jwt已经过期,返回50014状态码 => 前端拦截响应数据,并发起刷新token的请求 => 拿到最新的jwt和refresh,保存到本地 => 拿到最新的jwt去进行刚刚未请求成功的接口 => 获取到刚刚请求的结果,覆盖第一次请求失败(状态码为50014)的响应数据 => 返回第二次请求的结果.
 * 第一种情况: 前端发起ajax请求 => 后端发现jwt已经过期,返回50014状态码 => 前端拦截响应数据,并发起刷新token的请求 => 后端返回了10007的状态码(这个时候代表refreshJwt也过期了,需要进行重新登录了) => 真正的过期了,需要跳转到登录界面.
 * @returns {Promise<void>}
 */
export default async() => {
  // process.env.BASE_API是项目环境API
  const url = process.env.BASE_API + '/refreshJwt/' + getRefreshToken()
  await axios.post(url).then(res => {
    if (res.data.code === 10007) {
      // 身份过期，请重新登录
      MessageBox.confirm(
        'Token失效,你已被登出，可以取消继续留在该页面，或者重新登录',
        '确定登出',
        {
          confirmButtonText: '重新登陆',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    } else {
      // 设置token
      setToken(res.data.data.token)
      store.commit('SET_TOKEN', res.data.data.token)

      // 设置refreshToken
      setRefreshToken(res.data.data.refreshToken)
      store.commit('SET_REFRESH_TOKEN', res.data.data.refreshToken)
    }
  }).catch(error => {
    console.log(error)
  })
}
```

##  配置拦截器

代码如下：
```BASH
import axios from 'axios'
import i18n from '@/lang'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken, getRefreshToken } from './auth'
import refreshJwt from './refreshJwt'
let isLock = true

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 50000, // 请求超时时间,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
  // withCredentials : true
})

/**
 * 通用请求拦截配置
 * @param {*} config
 */
const axiosConf = (config) => {
  if (store.getters.token) {
    config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}

// request 拦截器
service.interceptors.request.use(axiosConf, error => {
  console.log(error)
  return Promise.reject(error)
})

// response 拦截器
service.interceptors.response.use(
  async response => {
    /**
     * code为非0是抛错 可结合自己业务进行修改
     */
    let data = {}
    const res = response.data
    const code = Number(res.code)
    if (code !== 0) {
      // 50014:Token 过期了;
      if (code === 50014) {
        if ((getRefreshToken() !== 'undefined' && getRefreshToken()) && isLock) {
          // 异步刷新JWT
          await refreshJwt()
          // 这里防止并发的时候造成死循环,所以要加锁
          isLock = false
          // 刷新完成,继续之前的请求
          response.config.headers['X-Token'] = getToken()
          const result = await axios.request(axiosConf(response.config))
          if (result) {
            data = result.data
            isLock = true
          }
        } else { // 身份过期，请重新登录
          MessageBox.confirm(
             'Token失效,你已被登出，可以取消继续留在该页面，或者重新登录',
             '确定登出',
             {
              confirmButtonText: '重新登陆',
              cancelButtonText: '取消',
              type: 'warning'
             }
          ).then(() => {
            store.dispatch('FedLogOut').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
            })
          })
        }
      } else {
        // 消息提示
        message(res.message)
      }
    } else {
      data = response.data
    }
    return data
  },
  error => {
    console.log('错误信息：' + error)
    message('哎呀~ (ಥ﹏ಥ)网络又开小差了,请稍后刷新重试!')
    return Promise.reject(error)
  }
)

/**
 * 消息提醒
 * @param msg
 */
export function message(msg) {
  Message({
    message: msg,
    type: 'error',
    showClose: true,
    duration: 5 * 1000
  })
}

export default service

```

小生的刷新token思路如此，如阁下有更好的思路，方便分享，请留言哦。
