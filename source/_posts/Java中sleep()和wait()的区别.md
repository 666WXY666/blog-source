---
title: Java 中 sleep() 和 wait() 的区别
pin: false
toc: true
tags: [Java,线程]
categories: [Java,线程]
keywords: [Java,线程,sleep,wait,对象锁]
abbrlink: 47cc5feb
date: 2020-08-02 18:54:14
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/thread.png
description: 用一小段代码来解释一下 Java 中 sleep() 和 wait() 的区别。
---

## :tada: 两者区别
1. 对于 sleep() 方法，我们首先要知道该方法属于 Thread 类中。而 wait() 方法则属于 Object 类中的。
2. sleep() 方法导致了程序暂停执行指定的时间，让出cpu该其他线程，但是他的监控状态依然保持着，当指定的时间到了又会自动恢复运行状态。
3. 调用 sleep() 方法过程中，线程不会释放对象锁。
4. 调用 wait() 方法的时候，线程会放弃对象锁，进入等待此对象的等待锁定池，只有针对此对象调用 notify() 方法后本线程才进入对象锁定池准备获取对象锁进入运行状态。

## :tada: 举例说明

代码如下：
```java
/**
 * @author: Xuxu
 * @date: 2020-08-02 18:43
 **/
public class TestD {

    public static void main(String[] args) {
        new Thread(new Thread1()).start();
        try {
            Thread.sleep(5000);
        } catch (Exception e) {
            e.printStackTrace();
        }
        new Thread(new Thread2()).start();
    }

    public static class Thread1 implements Runnable {
        @Override
        public void run() {
            synchronized (TestD.class) {
                System.out.println("enter thread1...");
                System.out.println("thread1 is waiting...");
                try {
                    // 调用wait()方法，线程会放弃对象锁，进入等待此对象的等待锁定池
                    TestD.class.wait();
                } catch (Exception e) {
                    e.printStackTrace();
                }
                System.out.println("thread1 is going on ....");
                System.out.println("thread1 is over!!!");
            }
        }
    }

    public static class Thread2 implements Runnable {
        @Override
        public void run() {
            synchronized (TestD.class) {
                System.out.println("enter thread2....");
                System.out.println("thread2 is sleep....");
                // 只有针对此对象调用notify()方法后本线程才进入对象锁定池准备获取对象锁进入运行状态。
                TestD.class.notify();
                //区别
                //如果我们把代码：TestD.class.notify();给注释掉，即TestD.class调用了wait()方法，但是没有调用notify()方法，则线程永远处于挂起状态。
                try {
                    //sleep()方法导致了程序暂停执行指定的时间，让出cpu该其他线程，
                    //但是他的监控状态依然保持者，当指定的时间到了又会自动恢复运行状态。
                    //在调用sleep()方法的过程中，线程不会释放对象锁。
                    Thread.sleep(5000);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                System.out.println("thread2 is going on....");
                System.out.println("thread2 is over!!!");
            }
        }
    }
}
```

运行结果：
```
enter thread1...
thread1 is waiting...
enter thread2....
thread2 is sleep....
thread2 is going on....
thread2 is over!!!
thread1 is going on ....
thread1 is over!!!
```

如果注释掉下面这行代码：
```
TestD.class.notify();
```

运行结果变为：
```
enter thread1...
thread1 is waiting...
enter thread2....
thread2 is sleep....
thread2 is going on....
thread2 is over!!!
```
且程序一直处于挂起状态。

经过上面这段代码演示我相信大家会更容易的理解 sleep() 和 wait() 的区别。
