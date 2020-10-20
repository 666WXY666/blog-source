---
title: Java 垃圾收集算法
pin: false
toc: true
icons: []
tags: [Java,JVM]
categories: [Java,JVM]
keywords: [Java,JVM,垃圾收集,算法,内存空间]
abbrlink: 2375015f
date: 2020-08-24 19:52:59
headimg: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-headimg/JVM-GC.png
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/jvm.png
references:
    - title: 垃圾收集算法
      url: https://deecyn.com/jvm-gc-algorithms.html
description: JVM 中的垃圾回收算法有标记-清除算法、复制算法、标记-整理算法、分代收集算法四种算法。
---

JVM 中的垃圾回收算法有标记-清除算法、复制算法、标记-整理算法、分代收集算法四种算法。

## :fire: 标记 - 清除算法

标记-清除（Mark-Sweep）算法是现代垃圾回收算法的思想基础，它将垃圾回收分为「标记」和「清除」两个阶段：

1. 在标记阶段，通过 「可达性分析算法」标记出所有需要回收的对象
2. 在清除阶段，清除所有被标记为可以回收的对象。

算法示意图如下：

![标记-清除算法](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-2375015f/标记-清除算法.jpg)

这个算法的{% emp 主要缺点 %}有两个：

1. 效率问题，标记和清除两个过程的效率都不高
2. 空间问题，标记清除之后会产生大量不连续的内存碎片，空间碎片太多可能会导致以后在程序运行过程中需要分配较大对象时，无法找到足够的连续内存而不得不提前触发另一次垃圾收集动作。

后续的很多垃圾收集算法都是基于此算法的思路进行改进而得到的。垃圾收集器中的 CMS 是基于标记-清除算法实现的，不过这种收集器也逐渐被取代了。

## :fire: 标记 - 整理算法

标记-整理（Mark-Compact）算法，类似于标记-清除算法，不过它标记完对象后，不是直接对可回收对象进行清除；而是让所有仍会存活的对象都向一端移动，然后直接清理掉边界以外的内存。算法示意如下图所示：

![标记-整理算法](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-2375015f/标记-整理算法.jpg)

相对于标记-清除算法，标记-整理算法的{% emp 优点 %}是解决了内存空间碎片的问题，使对象创建时的内存分配更快速了（也可以使用 TLAB 进行分配）；{% emp 缺点 %}还是效率问题，标记和整理这两个过程的效率都不高。

基于标记-整理算法实现的垃圾收集器有很多，如 Serial 收集器、ParNew 收集器、Parallel Old 收集器、G1 收集器等。

## :fire: 复制算法

复制（copying）算法的思路为：它将内存按容量分为大小相等的两块，每次只使用其中的一块。当正在使用的内存块 A 的内存用完了，就将还活着的对象复制到另一块内存 B 上面，然后再把之前使用的内存块 A 的空间一次性清理掉，就这样循环往复。

这样使得每次都是对整个半区进行内存回收，内存分配时也不用考虑内存碎片等复杂情况，只需要移动堆顶指针，按顺序分配内存即可。复制算法的{% emp 优点 %}是解决了效率问题和内存碎片的问题，算法示意图如下：

![复制算法](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-2375015f/复制算法.jpg)

由此可见，复制算法的{% emp 缺点 %}就是每次都会浪费掉一半的内存空间，而且，在对象存活率较高时就要进行较多的复制操作，效率会变低。

现在很多垃圾收集器都采用复制算法来回收新生代。

## :fire: 分代收集算法

分代收集（Generational Collection）算法并没有什么新的垃圾回收思想，它只是根据对象存活周期的不同将内存划分为几块（一般是把 Java 堆划分为新生代和老年代），然后根据各个块的特点采用最适当的垃圾收集算法。

算法示意如图（其中，Eden、Survivor From 和 Survivor To 空间均属于{% emp 新生代 %}（Young），Old 空间属于{% emp 老年代 %}，一般这几个内存空间的大小比例为：`Eden : Survivor From : Survivor To = 8 : 1 : 1` 、`Young : Old = 1 : 2` ）：

![分代收集算法](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-2375015f/分代收集算法.jpg)

如上图所示，分代收集算法的策略为：

* 在新生代中，每次垃圾收集都有都发现有大批对象死去，只有少量存活，就选用{% emp 复制算法 %}。将 Eden 和 Survivor From 空间中还存活着的对象一次性复制到 Survivor To 空间上；当 Survivor To 空间不够用时，需要依赖其它内存（这里指老年代）来进行分配担保（Handle Promotion）；最后对刚才用过的 Eden 和 Survivor From 空间进行清理，清理之后 Survivor 区的 From 和 To 进行角色交换，之前的 From 变成了 To，之前的 To 变成了 From，也就是说无论如何都要保证名为 To 的 Survivor 区域是空的。
* 在老年代中，因为对象存活率高，也没有额外空间对它进行分配担保，就必须使用「标记-清除」或者「标记-整理」算法来进行回收。

当前的商业虚拟机基本都是采用的分代收集算法。

## :fire: 附：对象的一辈子理解

我是一个普通的 Java 对象，我出生在 Eden 区，在 Eden 区我还看到和我长得很像的小兄弟，我们在 Eden 区中玩了挺长时间。有一天 Eden 区中的人实在太多了，我就被迫去了 Survivor 区的 From 区，自从去了 Survivor 区，我就开始飘了，有时候在 Survivor 区的 From 区，有时候在 Survivor 区的 To 区，居无定所，直到我18岁的时候，爸爸说我成人了，该去社会上闯闯了。于是我就去了老年代那边，老年代里，人很多，并且年龄都挺大的，我这里也认识了很多人。在老年代里，我生活了20年（每次GC加一岁），然后被回收。

新对象申请内存空间流程图如下：

![新对象申请内存空间流程图](https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article/abbrlink-2375015f/对象申请内存空间流程.jpg)

如有不正，欢迎指出。
