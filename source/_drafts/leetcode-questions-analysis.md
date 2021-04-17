---
title: Leetcode 题目分析
date: 2020-11-28 22:08:42
categories: 心得
tags:
  - 算法
---

# 排序

## 桶排序

桶排序适合值的数目少的排序需求。如 1370，如果使用常规的遍历方法，需要 O(n*log(n)) 的复杂度，而使用桶排序可以将复杂度降至 O(n)

> [1370. Increasing Decreasing String](https://leetcode.com/problems/increasing-decreasing-string/)
> [1528. Shuffle String](https://leetcode.com/problems/shuffle-string/)

# 链表

## 双指针

- 双指针用语检查循环链表非常适合，如 141，如果使用常规方法（如Hash Table）依次遍历节点，则时间复杂度为 O(n) ，空间复杂度为 O(n)。
  最坏情况下没有循环则需要循环链表长度 n 次，如果借助双指针（一个快指针和慢指针），最坏情况需要循环 n / 2 次。

  > [141. Linked List Cycle](https://leetcode.com/problems/linked-list-cycle)

- 寻找链表的中间元素也非常适合使用双指针，如 876，当快指针走到尾部时，慢指针刚好走到中间，处理下奇偶位即可。

  > [876. Middle of the Linked List](https://leetcode.com/problems/middle-of-the-linked-list/)  
