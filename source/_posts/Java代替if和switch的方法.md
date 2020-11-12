---
title: Java代替if和switch的方法
pin: false
toc: true
icons: []
tags: [Java,优化]
categories: [Java,优化]
keywords: [Java,优化,if,switch,代替]
abbrlink: bc6f4faf
date: 2020-11-12 16:39:35
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/thread.png
description: 如何优雅的代替Java中的if和switch语句。
---

### :tada: 公共接口

```
package com.scaffolding.example.test;

/**
 * 公共接口
 *
 * @author xuxu
 * @date 2020/11/12 15:49
 */
public interface Function {
    /**
     * 要做的事情
     */
    void invoke();
}
```

### :tada: 代替`if else`和`switch`的方法

```
package com.scaffolding.example.test;

import java.util.Map;

/**
 * 代替'if else' 和 'switch'的方法
 *
 * @author xuxu
 * @date 2020/11/12 15:49
 */
public class IfFunction<K> {

    private Map<K, Function> map;

    /**
     * 通过map类型来保存对应的条件key和方法
     *
     * @param map a map
     */
    public IfFunction(Map<K, Function> map) {
        this.map = map;
    }

    /**
     * 添加条件
     *
     * @param key      需要验证的条件（key）
     * @param function 要执行的方法
     * @return this.
     */
    public IfFunction<K> add(K key, Function function) {
        this.map.put(key, function);
        return this;
    }

    /**
     * 确定key是否存在，如果存在，则执行相应的方法。
     *
     * @param key the key need to verify
     */
    public void doIf(K key) {
        if (this.map.containsKey(key)) {
            map.get(key).invoke();
        }
    }

    /**
     * 确定key是否存在，如果存在，则执行相应的方法。
     * 否则将执行默认方法
     *
     * @param key             需要验证的条件（key）
     * @param defaultFunction 要执行的方法
     */
    public void doIfWithDefault(K key, Function defaultFunction) {
        if (this.map.containsKey(key)) {
            map.get(key).invoke();
        } else {
            defaultFunction.invoke();
        }
    }
}
```

### :tada: 测试

```
package com.scaffolding.example.test;

import java.util.HashMap;

/**
 * 测试
 *
 * @author xuxu
 * @date 2020/11/12 15:51
 */
public class Test {

    public static void main(String[] args) {
        IfFunction<String> ifFunction = new IfFunction<>(new HashMap<>(5));

        //定义好要判断的条件和对应执行的方法
        ifFunction.add("1", () -> System.out.println("苹果"))
                .add("2", () -> System.out.println("西瓜"))
                .add("3", () -> System.out.println("橙子"));

        // 要进入的条件
        ifFunction.doIf("1");
        // 执行默认方法
        ifFunction.doIfWithDefault("4", () -> System.out.println("默认方法"));
    }
}
```