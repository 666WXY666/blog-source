---
title: Java 多线程的实现
pin: false
toc: true
tags: [Java,线程]
categories: [Java,线程]
keywords: [Java,多线程,实现,Thread,Runnable,Callable,FutureTask,线程池]
abbrlink: f48050ed
date: 2020-08-10 09:35:37
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/thread.png
description: 重温 Java 多线程的四种创建方式。
--- 

## :fire: 进程和线程之间的关系
线程是在进程基础之上创建并使用的更小的程序单元，所以线程依赖于进程的支持。线程的启动速度要比进程快上很多，高并发处理的时候，线程的性能要高于进程。
* 进程：指在系统中正在运行的一个应用程序；程序一旦运行就是进程；进程——资源分配的最小单位。
* 线程：系统分配处理器时间资源的基本单元，或者说进程之内独立执行的一个单元执行流。线程——程序执行的最小单位。

## :fire: 多线程实现的四种方式
1. 继承Thread类，重写run方法。
2. 实现Runnable接口，重写run方法。
3. 通过Callable和FutureTask创建线程
4. 通过线程池创建线程

## :fire: 代码示例
### :tada: 继承Thread类
```java
/**
 * @author: Xuxu
 * @date: 2020-08-10 10:00
 **/
public class ThreadTest1 extends Thread {
    @Override
    public void run() {
        // 线程代码区
        System.out.println(Thread.currentThread().getName());
    }

    public static void main(String[] args) {
        ThreadTest1 threadTest1 = new ThreadTest1();
        threadTest1.setName("线程1");
        threadTest1.start();
        System.out.println(Thread.currentThread().toString());
    }
}
```
运行结果：
```
Thread[main,5,main]
线程1：我是通过继承Thread类实现的
```

### :tada: 实现Runnable接口
```java
/**
 * @author: Xuxu
 * @date: 2020-08-10 10:19
 **/
public class ThreadTest2 {
    static class MyThread implements Runnable {
        @Override
        public void run() {
            System.out.println(Thread.currentThread().getName());
        }
    }

    public static void main(String[] args) {
        Thread thread = new Thread(new MyThread());
        thread.setName("线程2：我是通过Runnable接口实现的");
        thread.start();
        System.out.println(Thread.currentThread().toString());
    }
}
```
运行结果：
```
Thread[main,5,main]
线程2：我是通过Runnable接口实现的
```

### :tada: 通过Callable和FutureTask创建线程
```java
import java.util.concurrent.Callable;
import java.util.concurrent.FutureTask;

/**
 * @author: Xuxu
 * @date: 2020-08-10 10:28
 **/
public class ThreadTest3 {
    static class MyThread<Object> implements Callable<Object> {
        @Override
        public Object call() {
            System.out.println(Thread.currentThread().getName());
            return null;
        }
    }

    public static void main(String[] args) {
        Callable<Object> callable = new MyThread<>();
        FutureTask<Object> futureTask = new FutureTask<>(callable);
        Thread thread = new Thread(futureTask);
        thread.setName("线程3：我是通过Callable和FutureTask创建的");
        thread.start();
        System.out.println(Thread.currentThread().toString());
    }
}
```
运行结果：
```
Thread[main,5,main]
线程3：我是通过Callable和FutureTask创建的
```

### :tada: 通过线程池创建线程
```java
import java.util.concurrent.ExecutorService;

import static java.util.concurrent.Executors.*;

/**
 * @author: Xuxu
 * @date: 2020-08-10 10:39
 **/
public class ThreadTest4 {

    //线程池数量
    private static int POOL_NUM = 10;

    static class MyThread implements Runnable {
        @Override
        public void run() {
            System.out.println("通过线程池方式创建的线程：" + Thread.currentThread().getName());
        }
    }

    public static void main(String[] args) {
        ExecutorService executorService = newFixedThreadPool(5);
        for (int i = 0; i < POOL_NUM; i++) {
            MyThread myThread = new MyThread();
            executorService.execute(myThread);
        }
        //关闭线程池
        executorService.shutdown();
    }
}
```
运行结果：
```
通过线程池方式创建的线程：pool-1-thread-2
通过线程池方式创建的线程：pool-1-thread-4
通过线程池方式创建的线程：pool-1-thread-1
通过线程池方式创建的线程：pool-1-thread-4
通过线程池方式创建的线程：pool-1-thread-2
通过线程池方式创建的线程：pool-1-thread-3
通过线程池方式创建的线程：pool-1-thread-1
通过线程池方式创建的线程：pool-1-thread-5
通过线程池方式创建的线程：pool-1-thread-2
通过线程池方式创建的线程：pool-1-thread-4
```

## :fire: 线程运行状态
对于多线程的开发而言，编写程序的过程中总是按照：定义线程的主体类，然后通过Thread类进行线程的启动，但是并不意味着你调用了`start()`方法，线程就已经开始启动了，因为整体的线程处理有自己的一套运行状态。
