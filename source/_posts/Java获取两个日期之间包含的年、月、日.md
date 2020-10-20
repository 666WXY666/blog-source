---
title: Java获取两个日期之间包含的年、月、日
pin: false
toc: true
thumbnail: https://cdn.jsdelivr.net/gh/XuxuGood/cdn@master/blogImages/article-thumbnail/java.png
abbrlink: f4a01af3
date: 2020-07-09 19:39:16
tags: [Java,工具类]
categories: [Java,工具类]
keywords: [Java,计算,日期之间,年,月,日]
description: Java获取两个日期之间包含的年、月、日。
---

不多废话，直接上代码：
```JAVA
package com.scaffolding.demo.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * @author: Xuxu
 * @date: 2020-06-30 19:36
 **/
public class DateUtil {

    public static void main(String[] args) throws ParseException {
        // TODO Auto-generated method stub
        String beginTime = "2019-02-01";
        String endTime = "2019-02-04";
        // 测试天
        List<String> daysStr = findDaysStr(beginTime, endTime);
        System.out.println("所有天：" + daysStr);
        // 测试月
        List<String> monthsStr = findMonthsStr(beginTime, endTime);
        System.out.println("所有月：" + monthsStr);
        // 测试年
        List<String> yearsStr = findYearsStr(beginTime, endTime);
        System.out.println("所有年：" + yearsStr);
    }

    /**
     * 计算两个日期之间包含的所有天
     *
     * @param beginTime
     * @param endTime
     * @return
     */
    public static List<String> findDaysStr(String beginTime, String endTime) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date dBegin = null;
        Date dEnd = null;
        try {
            dBegin = sdf.parse(beginTime);
            dEnd = sdf.parse(endTime);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        List<String> daysStrList = new ArrayList<String>();
        daysStrList.add(sdf.format(dBegin));
        Calendar calBegin = Calendar.getInstance();
        calBegin.setTime(dBegin);
        Calendar calEnd = Calendar.getInstance();
        calEnd.setTime(dEnd);
        while (dEnd.after(calBegin.getTime())) {
            calBegin.add(Calendar.DAY_OF_MONTH, 1);
            String dayStr = sdf.format(calBegin.getTime());
            daysStrList.add(dayStr);
        }
        return daysStrList;
    }

    /**
     * 计算两个日期之间包含的所有月份
     *
     * @param beginTime
     * @param endTime
     * @return
     * @throws ParseException
     */
    public static List<String> findMonthsStr(String beginTime, String endTime) throws ParseException {
        List<String> monthsStrList = new ArrayList<>();
        //格式化为年月
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");

        Calendar min = Calendar.getInstance();
        Calendar max = Calendar.getInstance();

        min.setTime(sdf.parse(beginTime));
        min.set(min.get(Calendar.YEAR), min.get(Calendar.MONTH), 1);

        max.setTime(sdf.parse(endTime));
        max.set(max.get(Calendar.YEAR), max.get(Calendar.MONTH), 2);

        while (min.before(max)) {
            monthsStrList.add(sdf.format(min.getTime()));
            min.add(Calendar.MONTH, 1);
        }
        return monthsStrList;
    }

    /**
     * 计算两个日期之间包含的所有年份
     *
     * @param beginTime
     * @param endTime
     * @return
     */
    public static List<String> findYearsStr(String beginTime, String endTime) {
        List<String> yearsStrList = new ArrayList<>();
        beginTime = beginTime.substring(0, 4);
        endTime = endTime.substring(0, 4);
        if (beginTime.equals(endTime)) {
            yearsStrList.add(beginTime);
        } else {
            yearsStrList.add(beginTime);
            for (int i = 1; i <= Integer.parseInt(endTime) - Integer.parseInt(beginTime); i++) {
                yearsStrList.add(String.valueOf(Integer.parseInt(beginTime) + i));
            }
        }
        return yearsStrList;
    }
}
```
