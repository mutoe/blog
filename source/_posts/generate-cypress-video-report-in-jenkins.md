---
title: 在 Jenkins 中产出由 Cypress 生成的测试视频
date: 2019-10-27 18:34:02
categories: 心得
tags:
  - Cypress
  - CI
  - Jenkins
---

最近在使用 Cypress 作为前端项目的 E2E 测试，发布到 CI 环境时自动运行。

运行时发现在 Pipeline 测试报告中有生成 mp4 格式的视频，这才想起来 Cypress 自带生成视频快照的功能，结合 Jenkins 收集报告产物，不就可以拿到视频快照了吗？

哈哈，talk is cheap, show my code!

下面是 jenkins 配置

```groovy Jenkinsfile
pipeline {
  agent any

  environment {
    CHROME_BIN = '/bin/google-chrome'
  }

  stages {
    stage('Environment') {
      steps {
        sh 'uname -a'
        sh 'apt-get update'
        sh 'apt-get install -y xvfb libgtk-3-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 ttf-wqy-zenhei'
        sh 'fc-cache -v'
        sh 'yarn install'
      }
    }
    stage('Test') {
      steps {
        sh 'yarn test:e2e --headless'
        junit 'reporter/output.xml'
        archiveArtifacts 'tests/e2e/videos/*.mp4'
      }
    }
  }
}
```

其中 `ttf-wqy-zenhei` 是用来解决 Ubuntu 系统中没有中文字体等问题，否则生成的视频报告中的中文都为方框乱码。

> 如果是在 CentOS 中，执行 `yum -y groupinstall chinese-support` 解决中文问题

> 如果不知道 Jenkins 所属运行环境，使用 `uname -a` 查看系统信息

`archiveArtifacts` 用来收集报告产物

`junit` 用来收集测试报告，但 Cypress 默认是不生成报告的，需要在 `cypress.json` 中增加以下内容

```json cypress.json
{
  "reporter": "junit",
  "reporterOptions": {
    "mochaFile": "reporter/output.xml",
    "toConsole": true
  }
}
```

<!-- more -->

**效果图**

![output](https://static.mutoe.com/2019/generate-cypress-video-report-in-jenkins/output-screenshot.png)

# 参考资料

- [Linux+Cutycapt+Xvfb 实现网页快照](https://or2.in/2016/05/31/Cutycapt-webSnapshot/)
