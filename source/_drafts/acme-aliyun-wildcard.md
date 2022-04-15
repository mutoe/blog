---
title: acme aliyun wildcard
date: 2022-02-16 01:55:24
categories:
tags:
---

``` bash
export Ali_Key=""
export Ali_Secret=""
acme.sh --set-default-ca --server letsencrypt
acme.sh --issue -d mutoe.com -d '*.mutoe.com' -w /var/htdoc/blog --keylength ec-256 --dns dns_ali
```
