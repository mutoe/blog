---
title: 动态规划：从入门到放弃
date: 2019-02-25 21:57:14
categories: 心得
tags:
  - Dynamic Programming

mathjax: true
---

# 什么是动态规划

动态规划（DP, Dynamic Programming）

一句话总结：**在求解一个复杂问题时，将其分解为若干个简单问题。通过求解简单问题的最优解，来找到目标问题的最优解。**

# 动态规划能做什么

常见问题
- 求解斐波那契数列第 N 项 ([Leetcode 509. Fibonacci Number](https://leetcode.com/problems/fibonacci-number/))
- 背包问题
- 阶梯问题 ([Leetcode 70. Climbing Stairs](https://leetcode.com/problems/climbing-stairs/))
- 硬币问题 ([Leetcode 322. Coin Change](https://leetcode.com/problems/coin-change/))

# 怎么求解动态规划问题

我们通过一个例子来了解一下DP的基本原理。

首先，我们要找到某个状态的最优解，然后在它的帮助下，找到下一个状态的最优解。

如硬币问题的例子

> *硬币问题：如果我们有面值为1元、3元和5元的硬币若干枚，如何用最少的硬币凑够11元？*

<!-- more -->

首先我们将该问题分解为

1. 如何用最少的硬币凑够0元?
2. 如何用最少的硬币凑够1元?
3. 如何用最少的硬币凑够2元?
4. ...
5. 如何用最少的硬币凑够11元?

## “状态”是什么

“状态”用来描述该问题的子问题的解。

显然，第1个问题第解是0，我们只需要0个硬币就能凑够0元。

**我们用 $d(i)=j$ 来表示凑够 $i$ 元至少需要 $j$ 个硬币**

第1个问题即

$$d(0)=0$$

我们在解决第2个问题时（如何用最少的硬币凑够1元?），我们可以结合第1个问题第最优解，来解出第2个问题。

凑出1元时，我们可选的硬币只有1元硬币，我们只需挑选1个1元硬币，结合第1个问题第最优解即可求出第2个问题，即

$$d(1)=d(1-1)+1=d(0)+1=0+1=1$$

同理，凑出2元时，我们仍然只有1元硬币可用，于是再挑选1个1元硬币，结合第二个问题第最优解来求出第三个问题，即

$$d(2)=d(2-1)+1=d(1)+1=1+1=2$$

凑出3元时，我们多了一种3元硬币可选，于是我们就有2种方案可选：

1. 拿起1元硬币

  如果我们拿起1元硬币，我们的目标就变成了：凑够3-1元需要的最少硬币数量，即
  
  $$d(3)=d(3-1)+1=d(2)+1=2+1=3$$

2. 拿起3元硬币

  如果我们拿起3元硬币，我们的目标就变成：凑够3-3=0元需要的最少硬币数量，即
  
  $$d(3)=d(3-3)+1=d(0)+1=0+1=1$$

所以我们得到

$$d(3)=\min\\{d(3-1)+1, d(3-3)+1\\}$$

----

从上面的演算中，我们抽出两个概念：**状态** 和 **状态转移方程**。

上文中 $d(i)$ 表示凑够 $i$ 元需要的最少硬币数量，我们定义为该问题的“状态”。

我们最终要求解的问题可以用这个状态来表示： $d(3)$ 即凑够3元最少需要多少硬币。

状态转移方程就是

$$d(3)=\min\\{d(3-1)+1, d(3-3)+1\\}$$

它描述了状态之间时如何转移的，我们对它抽象化

$$d(i)=\min\\{d(i-v_j)+1\\}$$

其中 $i-v_j \geq 0$, $v_j$ 表示第 $j$ 个硬币的面值

----

有了状态和状态转移方程，这个问题基本上就解决了

下面是当 i 从 0 到 11 时到解

| $i$ | $j$ | $v_j$ ($\min\\{d(i-v_j)\\}$) |
| --- | --- | ------ |
| 0   | 0   | -                          |
| 1   | 1   | 1 (0)                      |
| 2   | 2   | 1 (1)                      |
| 3   | 1   | 3 (0)                      |
| 4   | 2   | 1 (3)                      |
| 5   | 1   | 5 (0)                      |
| 6   | 2   | 3 (3)                      |
| 7   | 3   | 1 (6)                      |
| 8   | 2   | 3 (5)                      |
| 9   | 3   | 1 (8)                      |
| 10  | 2   | 5 (5)                      |
| 11  | 3   | 1 (10)                     |

可以得到，要凑够11元至少需要3枚硬币

$$ d(11)=d(10)+1=d(5)+1+1=d(0)+1+1+1=3 $$

BB 这么多没用， Show your code !

# 代码实现

> Leetcode 322. Coin Change

## Golang

### main

``` go
// CoinChange: coins 硬币, amount 期望的金额, 返回最少需要的硬币数量，如果不可解返回-1
func CoinChange(coins []int, amount int) int {
  dp := make([]int, amount+1)
  dp[0] = 0

  for i := 1; i <= amount; i++ {
    dp[i] = amount + 1
    for _, coin := range coins {
      if coin <= i && dp[i-coin] != -1 && dp[i-coin]+1 < dp[i] {
        dp[i] = dp[i-coin] + 1
      }
    }
    if dp[i] > amount {
      dp[i] = -1
    }
  }

  return dp[amount]
}
```

### unit test

``` go
import "testing"

func TestCoinCharge(t *testing.T) {
  type args struct {
    coins  []int
    amount int
  }
  tests := []struct {
    name string
    args args
    want int
  }{
    {"[2] => 3", args{[]int{2}, 3}, -1},
    {"[2] => 4", args{[]int{2}, 4}, 2},
    {"[1,2,5] => 11", args{[]int{1, 2, 5}, 11}, 3},
    {"[1,3,5] => 11", args{[]int{1, 3, 5}, 11}, 3},
  }
  for _, tt := range tests {
    t.Run(tt.name, func(t *testing.T) {
      if got := CoinCharge(tt.args.coins, tt.args.amount); got != tt.want {
        t.Errorf("CoinCharge() = %v, want %v", got, tt.want)
      }
    })
  }
}

```

### leetcode result

    Runtime: 8 ms, faster than 99.26% of Go online submissions for Coin Change.

先写这么多，有机会再深入了解高阶的动态规划问题

# 参考链接

- [《动态规划：从新手到专家》 - Hawstein](http://www.hawstein.com/posts/dp-novice-to-advanced.html)
