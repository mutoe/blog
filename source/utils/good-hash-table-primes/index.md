---
title: 哈希表 Tash Table 中最好的质数
date: 2021-09-21 17:13:09
keywords:
  - Hash

---

In the course of designing a good hashing configuration, it is helpful to have a list of prime numbers for the hash table size.

The following is such a list. It has the properties that:

1.  each number in the list is prime
2.  each number is slightly less than twice the size of the previous
3.  each number is as far as possible from the nearest two powers of two

Using primes for hash tables is a good idea because it minimizes clustering in the hashed table. Item (2) is nice because it is convenient for growing a hash table in the face of expanding data. Item (3) has, allegedly, been shown to yield especially good results in practice.

And here is the list:


|           dec | lwr  | upr  |     % err |      prime |
| ------------: | :--- | :--- | --------: | ---------: |
|            64 | 2^5  | 2^6  | 10.041667 |         53 |
|           128 | 2^6  | 2^7  |  1.041667 |         97 |
|           256 | 2^7  | 2^8  |  0.520833 |        193 |
|           512 | 2^8  | 2^9  |  1.302083 |        389 |
|          1024 | 2^9  | 2^10 |  0.130208 |        769 |
|          2048 | 2^10 | 2^11 |  0.455729 |       1543 |
|          4096 | 2^11 | 2^12 |  0.227865 |       3079 |
|          8192 | 2^12 | 2^13 |  0.113932 |       6151 |
|        16,384 | 2^13 | 2^14 |  0.008138 |      12289 |
|        32,768 | 2^14 | 2^15 |  0.069173 |      24593 |
|        65,536 | 2^15 | 2^16 |  0.010173 |      49157 |
|       131,072 | 2^16 | 2^17 |  0.013224 |      98317 |
|       262,144 | 2^17 | 2^18 |  0.002543 |     196613 |
|       524,288 | 2^18 | 2^19 |  0.006358 |     393241 |
|     1,048,576 | 2^19 | 2^20 |  0.000127 |     786433 |
|      2097,152 | 2^20 | 2^21 |  0.000318 |    1572869 |
|     4,194,304 | 2^21 | 2^22 |  0.000350 |    3145739 |
|     8,388,608 | 2^22 | 2^23 |  0.000207 |    6291469 |
|    16,777,216 | 2^23 | 2^24 |  0.000040 |   12582917 |
|    33,554,432 | 2^24 | 2^25 |  0.000075 |   25165843 |
|    67,108,864 | 2^25 | 2^26 |  0.000010 |   50331653 |
|   134,217,728 | 2^26 | 2^27 |  0.000023 |  100663319 |
|   268,435,456 | 2^27 | 2^28 |  0.000009 |  201326611 |
|   536,870,912 | 2^28 | 2^29 |  0.000001 |  402653189 |
| 1,073,741,824 | 2^29 | 2^30 |  0.000011 |  805306457 |
| 2,147,483,648 | 2^30 | 2^31 |  0.000000 | 1610612741 |


The columns are, in order, the lower bounding power of two, the upper bounding power of two, the relative deviation (in percent) of the prime number from the optimal middle of the first two, and finally the prime itself.

Happy hashing! 

----

> 转载自 https://planetmath.org/goodhashtableprimes
