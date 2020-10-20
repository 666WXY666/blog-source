---
title: CyclicBarrier 的理解和使用
pin: false
toc: true
icons: []
tags: [Java, 线程]
categories: [Java, 线程]
keywords: [线程, CyclicBarrier, 原理, 使用]
abbrlink: 6d42a1fc
date: 2020-08-31 09:36:48
headimg: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-headimg/CyclicBarrier.png
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/thread.png
description: CyclicBarrier 是一个同步辅助类，它允许一组线程互相等待，直到到达某个公共屏障点 (common barrier point)。在涉及一组固定大小的线程程序中，这些线程必须不时地互相等待，此时 CyclicBarrier 很有用。因为该 barrier 在释放等待线程后可以重用，所以称它为循环的 barrier 。
---

## :fire: CyclicBarrier 的理解

CyclicBarrier 是一个同步辅助类，它允许一组线程互相等待，直到到达某个公共屏障点 (common barrier point)。在涉及一组固定大小的线程程序中，这些线程必须不时地互相等待，此时 CyclicBarrier 很有用。因为该 barrier 在释放等待线程后可以重用，所以称它为循环的 barrier 。

举个例子，就像生活中我们会约朋友们到某个餐厅一起吃饭，有些朋友可能会早到，有些朋友可能会晚到，但是这个餐厅规定必须等到所有人到齐之后才会让我们进去。这里的朋友们就是各个线程，餐厅就是 CyclicBarrier 。

## :fire: CyclicBarrier 的方法说明

### :tada: 构造方法

<strong>CyclicBarrier(int parties)</strong>：创建一个新的 CyclicBarrier ，当给定数量的线程（线程）等待它时，它将跳闸，并且当屏障跳闸时不执行预定义的动作。

<strong>CyclicBarrier(int parties, Runnable barrierAction)</strong>：创建一个新的 CyclicBarrier ，当给定数量的线程（线程）等待时，它将跳闸，当屏障跳闸时执行给定的屏障动作，由最后一个进入屏障的线程执行。

### :tada: 方法

* <strong>int await()</strong> 等待所有 parties 已经在这个障碍上调用了 await 。
* <strong>int await(long timeout, TimeUnit unit)</strong> 等待所有 parties 已经在此屏障上调用 await ，或指定的等待时间过去。
* <strong>int getNumberWaiting()</strong> 返回目前在屏障处等待的线程个数。
* <strong>int getParties()</strong> 返回履行这个障碍所需的 parties 数量。
* <strong>boolean isBroken()</strong> 查询这个障碍是否处于破碎状态。
* <strong>void reset()</strong> 将屏障重置为初始状态。

## :fire: CyclicBarrier 的用法

CyclicBarrier 核心主要有两点：线程组内彼此相互等待，然后大家开始做某件事；这一代结束后开始下一代–重用思想。

CountDownLatch 核心思想为确保某些活动直到其他活动都完成才继续执行，而且 CountDownLatch 不可重用。

举例，班级集体野炊，在大巴上等待所有同学到来才开始出发，一个班级集合完毕出发一辆大巴，这是 CyclicBarrier 。到达目的地后需要同学自行寻找食材，寻找到需要的所有食材后才开始做饭，一个班级做饭活动是一次性的，这是 CountDownLatch 。

### :tada: 典型用法1

赛跑时，等待所有人都准备好时，才起跑。

代码示例：
```java
import lombok.extern.slf4j.Slf4j;

import java.util.Random;
import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.ExecutorService;

import static java.util.concurrent.Executors.*;

/**
 * @author: Xuxu
 * @date: 2020-08-31 10:48
 **/
@Slf4j
public class CyclicBarrierTest {

    public static void main(String[] args) {
        CyclicBarrier cyclicBarrier = new CyclicBarrier(3);

        ExecutorService executorService = newFixedThreadPool(3);

        for (int i = 1; i <= 3; i++) {
            executorService.submit(new Thread(new Runner(cyclicBarrier, i + "号选手")));
        }
        executorService.shutdown();
    }

    static class Runner implements Runnable {
        /**
         * 一个同步辅助类，它允许一组线程互相等待，直到到达某个公共屏障点 (common barrier point)
         */
        private CyclicBarrier barrier;

        private String name;

        Runner(CyclicBarrier barrier, String name) {
            super();
            this.barrier = barrier;
            this.name = name;
        }

        @Override
        public void run() {
            try {
                Thread.sleep(1000 * (new Random()).nextInt(8));
                System.out.println(name + " 准备好了...");
                // barrier的await方法，在所有参与者都已经在此 barrier 上调用 await 方法之前，将一直等待。
                barrier.await();
            } catch (InterruptedException | BrokenBarrierException e) {
                e.printStackTrace();
            }
            System.out.println(name + " 起跑！");
        }
    }
}
```

运行结果：
```
1号选手 准备好了...
3号选手 准备好了...
2号选手 准备好了...
2号选手 起跑！
1号选手 起跑！
3号选手 起跑！
```

### :tada: 典型用法2

CyclicBarrier 等待与复用：宿舍四哥们约着去操场打球

代码示例：
```java
import java.util.concurrent.*;

/**
 * @author: Xuxu
 * @date: 2020-08-31 11:31
 **/
public class CyclicBarrierTest1 {
    private static final ExecutorService executorService = Executors.newFixedThreadPool(4);

    /**
     * 当拦截线程数达到4时，便优先执行barrierAction，然后再执行被拦截的线程。
     */
    private static CyclicBarrier cyclicBarrier = new CyclicBarrier(4,
            () -> System.out.println("寝室四兄弟一起出发去球场")
    );

    private static class GoThread extends Thread {
        private final String name;

        GoThread(String name) {
            this.name = name;
        }

        @Override
        public void run() {
            System.out.println(name + "开始从宿舍出发");
            try {
                cyclicBarrier.await();//拦截线程
                System.out.println(name + "从楼底下出发");
            } catch (InterruptedException | BrokenBarrierException e) {
                e.printStackTrace();
            }
        }
    }

    public static void main(String[] args) {
        // TODO Auto-generated method stub
        String[] str = {"李明", "王强", "刘凯", "赵杰"};
        String[] str1 = {"王二", "洪光", "雷兵", "赵三"};
        for (int i = 0; i < 4; i++) {
            executorService.execute(new GoThread(str[i]));
        }
        try {
            Thread.sleep(4000);
            System.out.println("四个人一起到达球场，现在开始打球");
            System.out.println("现在对CyclicBarrier进行复用.....");
            System.out.println("又来了一拨人，看看愿不愿意一起打：");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        cyclicBarrier.reset();
        //进行复用：
        for (int i = 0; i < 4; i++) {
            executorService.execute(new GoThread(str1[i]));
        }
        try {
            Thread.sleep(4000);
            System.out.println("四个人一起到达球场，表示愿意一起打球，现在八个人开始打球");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        executorService.shutdown();
    }
}
```

运行结果：
```
刘凯开始从宿舍出发
赵杰开始从宿舍出发
王强开始从宿舍出发
李明开始从宿舍出发
寝室四兄弟一起出发去球场
李明从楼底下出发
刘凯从楼底下出发
赵杰从楼底下出发
王强从楼底下出发
四个人一起到达球场，现在开始打球
现在对CyclicBarrier进行复用.....
又来了一拨人，看看愿不愿意一起打：
王二开始从宿舍出发
洪光开始从宿舍出发
雷兵开始从宿舍出发
赵三开始从宿舍出发
寝室四兄弟一起出发去球场
赵三从楼底下出发
王二从楼底下出发
洪光从楼底下出发
雷兵从楼底下出发
四个人一起到达球场，表示愿意一起打球，现在八个人开始打球
```

## :fire: CountDownLatch 和 CyclicBarrier 的比较

1. CountDownLatch 是线程组之间的等待，即一个(或多个)线程等待N个线程完成某件事情之后再执行；而 CyclicBarrier 则是线程组内的等待，即每个线程相互等待，即N个线程都被拦截之后，然后依次执行。
2. CountDownLatch 是减计数方式，而 CyclicBarrier 是加计数方式。
3. CountDownLatch 计数为0无法重置，而 CyclicBarrier 计数达到初始值，则可以重置。
4. CountDownLatch 不可以复用，而 CyclicBarrier 可以复用。
