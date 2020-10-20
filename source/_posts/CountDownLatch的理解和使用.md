---
title: CountDownLatch 的理解和使用
pin: false
toc: true
icons: []
tags: [Java, 线程, 通信]
categories: [Java, 线程]
keywords: [Java, 线程, CountDownLatch, 计数器, 通信]
abbrlink: cf9c1454
date: 2020-08-21 10:57:48
headimg: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-headimg/CountDownLatch.png
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/thread.png
references:
    - title: CountDownLatch（倒计时计数器）使用说明
      url: https://www.cnblogs.com/tstd/p/4987935.html
    - title: CountDownLatch的简单理解
      url: https://blog.csdn.net/joenqc/article/details/76794356
description: 
---
最近在看多线程之间的通信，笔者我觉得自己的脑袋实在不够用了，很多东西看过就忘，所以今天抽出点时间码一遍 CountDownLatch 的理解和使用。

此文也是从网上查找的资料，然后自己敲一遍，以便加深印象和更深入的理解。

<!-- more -->

## :fire: CountDownLatch 的概念

CountDownLatch 是一个同步工具类，用来协调多个线程之间的同步，或者说其为线程之间的{% emp 通信 %}（而不是用作{% emp 互斥作用 %}）。

CountDownLatch 能够使一个线程在等待另外一些线程完成各自的工作之后，再继续执行。通过一个计数器来进行实现，计数器的初始值为线程的数量，当每一个线程完成自己的任务后，计数器的值就会减一，当计数器的值为零时，表示所有线程都已经完成相应的任务，然后在 CountDownLatch 上等待的线程就可以恢复执行接下来的任务。

## :fire: CountDownLatch 的方法说明

<strong>public void countDown()</strong>

递减锁存器的计数，如果计数到达零，则释放所有等待的线程。如果当前计数大于零，则将计数减少。如果新的计数为零，出于线程调度目的，将重新启用所有的等待线程。如果当前计数等于零，则不发生任何操作。

<strong>public boolean await (long timeout, TimeUnit unit) throws InterruptedException</strong>

使当前线程在锁存器倒计数至零之前一直等待，除非线程被中断或超出了指定的等待时间。如果当前计数为零，则此方法立刻返回 true 值。

如果当前计数大于零，则出于线程调度目的，将禁用当前线程，且在发生以下三种情况之一前，该线程将一直处于休眠状态：

1. 如果计数到达零，则该方法返回 true 值。
2. 如果当前线程，在进入此方法时已经设置了该线程的中断状态；或者在等待时被中断，则抛出 InterruptedException，并且清除当前线程的已中断状态。
3. 如果超出了指定的等待时间，则返回值为 false。如果该时间小于等于零，则此方法根本不会等待。

参数：
* timeout - 要等待的最长时间
* unit - timeout 参数的时间单位

返回：
* 如果计数到达零，则返回true；如果在计数到达零之前超过了等待时间，则返回false。

抛出：
* InterruptedException - 如果当前线程在等待时被中断则抛出 InterruptedException 异常

## :fire: CountDownLatch 的用法

### :tada: 典型用法1

某一线程在开始运行前等待n个线程执行完毕。将 CountDownLatch 的计数器初始化为n `new CountDownLatch(n)`，每当一个任务线程执行完毕，就将计数器减1 `countdownlatch.countDown()`，当计数器的值变为0时，在 CountDownLatch 上 `await()` 的线程就会被唤醒。一个典型应用场景就是启动一个服务时，主线程需要等待多个组件加载完毕，之后再继续执行。

代码示例：
```java
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;

import static java.lang.Math.*;
import static java.util.concurrent.Executors.newFixedThreadPool;

/**
 * @author: Xuxu
 * @date: 2020-08-21 14:51
 **/
public class CountdownLatchTest1 {
    public static void main(String[] args) {
        ExecutorService service = newFixedThreadPool(3);
        final CountDownLatch latch = new CountDownLatch(3);
        for (int i = 0; i < 3; i++) {
            Runnable runnable = () -> {
                try {
                    System.out.println("子线程" + Thread.currentThread().getName() + "开始执行");
                    Thread.sleep((long) (random() * 10000));
                    System.out.println("子线程" + Thread.currentThread().getName() + "执行完成");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    // 很关键, 无论上面程序是否异常必须执行countDown,否则await无法释放
                    latch.countDown();
                }
            };
            service.execute(runnable);
        }

        try {
            System.out.println("主线程" + Thread.currentThread().getName() + "等待子线程执行完成...");
            latch.await();//阻塞当前线程，直到计数器的值为0
            System.out.println("主线程" + Thread.currentThread().getName() + "开始执行...");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        service.shutdown();
    }
}
```
运行结果：
```
主线程main等待子线程执行完成...
子线程pool-1-thread-3开始执行
子线程pool-1-thread-1开始执行
子线程pool-1-thread-2开始执行
子线程pool-1-thread-2执行完成
子线程pool-1-thread-1执行完成
子线程pool-1-thread-3执行完成
主线程main开始执行...
```

### :tada: 典型用法2

实现多个线程开始执行任务的最大{% emp 并行性 %}。注意是并行性，不是并发，强调的是多个线程在某一时刻同时开始执行。类似于赛跑，将多个线程放到起点，等待发令枪响，然后同时开跑。做法是初始化一个共享的 CountDownLatch(1)，将其计数器初始化为1，多个线程在开始执行任务前首先 `coundownlatch.await()`，当主线程调用 `countDown()` 时，计数器变为0，多个线程同时被唤醒。

代码示例：
```java
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;

import static java.lang.Math.*;
import static java.util.concurrent.Executors.*;

/**
 * @author: Xuxu
 * @date: 2020-08-21 15:15
 **/
public class CountdownLatchTest2 {
    public static void main(String[] args) {
        ExecutorService service = newCachedThreadPool();
        final CountDownLatch cdOrder = new CountDownLatch(1);
        final CountDownLatch cdAnswer = new CountDownLatch(4);
        for (int i = 0; i < 4; i++) {
            Runnable runnable = () -> {
                try {
                    System.out.println("选手" + Thread.currentThread().getName() + "正在等待裁判发布口令");
                    cdOrder.await();
                    System.out.println("选手" + Thread.currentThread().getName() + "已接受裁判口令");
                    Thread.sleep((long) (random() * 10000));
                    System.out.println("选手" + Thread.currentThread().getName() + "到达终点");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    // 很关键, 无论上面程序是否异常必须执行countDown,否则await无法释放
                    cdAnswer.countDown();
                }
            };
            service.execute(runnable);
        }

        try {
            Thread.sleep((long) (Math.random() * 10000));
            System.out.println("裁判" + Thread.currentThread().getName() + "即将发布口令");
            cdOrder.countDown();
            System.out.println("裁判" + Thread.currentThread().getName() + "已发送口令，正在等待所有选手到达终点");
            cdAnswer.await();
            System.out.println("所有选手都到达终点");
            System.out.println("裁判" + Thread.currentThread().getName() + "汇总成绩排名");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        service.shutdown();
    }
}
```

运行结果：
```
选手pool-1-thread-2正在等待裁判发布口令
选手pool-1-thread-3正在等待裁判发布口令
选手pool-1-thread-4正在等待裁判发布口令
选手pool-1-thread-1正在等待裁判发布口令
裁判main即将发布口令
裁判main已发送口令，正在等待所有选手到达终点
选手pool-1-thread-3已接受裁判口令
选手pool-1-thread-1已接受裁判口令
选手pool-1-thread-4已接受裁判口令
选手pool-1-thread-2已接受裁判口令
选手pool-1-thread-2到达终点
选手pool-1-thread-1到达终点
选手pool-1-thread-4到达终点
选手pool-1-thread-3到达终点
所有选手都到达终点
裁判main汇总成绩排名
```
