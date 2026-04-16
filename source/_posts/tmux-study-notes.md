---
title: Tmux 学习笔记
date: 2026-04-16 22:00:00
categories: 笔记
tags:
  - Tmux
  - Linux
---

这里记录了一些个人使用 Tmux 时的常用操作和配置, 可以作为避免踩坑和速查手册. 如有疑问欢迎留言.

个人使用 Tmux 主要是在远程服务器上保持会话不断开, 以及本地终端的多窗口管理.

<!-- more -->

# 基本概念

Tmux 的结构分为三层：

- **Session（会话）**：最顶层，一个 tmux 服务可以有多个会话
- **Window（窗口）**：一个会话可以有多个窗口，类似浏览器的标签页
- **Pane（窗格）**：一个窗口可以分割成多个窗格

Tmux 的所有快捷键都需要先按下**前缀键** <kbd>Ctrl-b</kbd>，然后再按功能键。下文中用 `Prefix` 表示前缀键。

> 如果你觉得 `Ctrl-b` 不顺手，可以在 `~/.tmux.conf` 中修改，比如改成 `Ctrl-a`：
>
> ```bash
> unbind C-b
> set -g prefix C-a
> bind C-a send-prefix
> ```

# 会话 (Session)

## 命令行操作

| 命令 | 作用 |
| --- | :--- |
| `tmux` | 新建一个无名会话 |
| `tmux new -s {name}` | 新建一个名为 `{name}` 的会话 |
| `tmux ls` | 列出所有会话 |
| `tmux a` | 恢复到上一个会话 |
| `tmux a -t {name}` | 恢复到名为 `{name}` 的会话 |
| `tmux kill-session -t {name}` | 关闭名为 `{name}` 的会话 |
| `tmux kill-server` | 关闭 tmux 服务（所有会话） |

## 快捷键操作

| 按键 | 作用 |
| --- | :--- |
| `Prefix d` | 挂起当前会话（detach） |
| `Prefix s` | 列出所有会话并切换 |
| `Prefix $` | 重命名当前会话 |
| `Prefix (` / `Prefix )` | 切换到上/下一个会话 |

# 窗口 (Window)

| 按键 | 作用 |
| --- | :--- |
| `Prefix c` | 创建新窗口 |
| `Prefix ,` | 重命名当前窗口 |
| `Prefix &` | 关闭当前窗口 |
| `Prefix w` | 列出所有窗口并切换 |
| `Prefix n` / `Prefix p` | 切换到下/上一个窗口 |
| `Prefix {0-9}` | 切换到第 n 个窗口 |
| `Prefix l` | 切换到上次使用的窗口 |
| `Prefix .` | 移动当前窗口（修改编号） |

# 窗格 (Pane)

| 按键 | 作用 |
| --- | :--- |
| `Prefix %` | 垂直分割（左右） |
| `Prefix "` | 水平分割（上下） |
| `Prefix x` | 关闭当前窗格 |
| `Prefix z` | 最大化/还原当前窗格 |
| `Prefix q` | 显示窗格编号，按编号可快速切换 |
| `Prefix o` | 切换到下一个窗格 |
| `Prefix {方向键}` | 切换到指定方向的窗格 |
| `Prefix {` / `Prefix }` | 与上/下一个窗格交换位置 |
| `Prefix Ctrl-o` | 所有窗格向前轮转 |
| `Prefix !` | 将当前窗格拆分为独立窗口 |
| `Prefix 空格` | 在预设布局间切换 |

调整窗格大小：

| 按键 | 作用 |
| --- | :--- |
| `Prefix Alt-{方向键}` | 以 5 个单元格为步长调整大小 |
| `Prefix Ctrl-{方向键}` | 以 1 个单元格为步长调整大小 |

> 开启鼠标模式（`set -g mouse on`）后，可以直接拖拽窗格边框来调整大小，比快捷键直观很多。

# 复制模式

默认情况下 tmux 使用 emacs 风格的按键，可以设置为 vi 风格（见下文配置）。以下按键基于 vi 模式。

| 按键 | 作用 |
| --- | :--- |
| `Prefix [` | 进入复制模式 |
| `q` | 退出复制模式 |
| `Space` | 开始选择 |
| `Enter` | 复制选择的内容并退出复制模式 |
| `Prefix ]` | 粘贴 |
| `/` / `?` | 向下/上搜索 |
| `n` / `N` | 搜索下/上一个匹配 |

# 使用技巧

Tmux 的配置文件为 `~/.tmux.conf`，修改后可以用以下命令重新加载：

```bash
tmux source-file ~/.tmux.conf
```

或在 tmux 内按 `Prefix :` 进入命令模式，输入 `source-file ~/.tmux.conf`。

## 快速重载配置

可以绑定一个快捷键来重载配置文件，修改后不用退出 tmux 就能生效：

```bash ~/.tmux.conf
bind C-c source-file ~/.tmux.conf\; display-message "Config reloaded"
```

这样按 `Prefix Ctrl-c` 就能重载配置并看到提示信息。

## Vi 风格的复制粘贴

默认的复制模式按键不太顺手，可以改成和 Vim 一致的操作习惯：

```bash ~/.tmux.conf
set -g mode-keys vi
bind -T copy-mode-vi v send-keys -X begin-selection
bind -T copy-mode-vi C-v send-keys -X rectangle-toggle
bind -T copy-mode-vi y send-keys -X copy-selection-and-cancel
bind p pasteb
```

这样在复制模式中就可以用 <kbd>v</kbd> 选择、<kbd>C-v</kbd> 切换矩形选择、<kbd>y</kbd> 复制，然后 `Prefix p` 粘贴。

## 关闭窗口/窗格时跳过确认

默认关闭窗口（`Prefix &`）和窗格（`Prefix x`）时 tmux 会弹出确认提示，如果觉得多余可以去掉：

```bash ~/.tmux.conf
bind-key '&' kill-window
bind-key 'x' kill-pane
```

## 新建窗口/分屏时保持当前路径

默认新建窗口或分屏后工作目录会回到 home，加上 `-c '#{pane_current_path}'` 就能保持在当前目录：

```bash ~/.tmux.conf
bind c new-window -c '#{pane_current_path}'
bind '%' split-window -h -c '#{pane_current_path}'
bind '"' split-window -v -c '#{pane_current_path}'
```

## 清屏并清除历史

<kbd>Ctrl-l</kbd> 只是把终端滚上去，历史还在，用 `clear-history` 可以彻底清掉：

```bash ~/.tmux.conf
bind C-k send-keys -R C-l \; clear-history
```

按 `Prefix Ctrl-k` 就能清屏 + 清除滚动历史。

## 窗格边框显示当前路径

分屏多了以后容易搞不清每个窗格在哪个目录，可以把当前路径显示在窗格边框上：

```bash ~/.tmux.conf
set -g pane-border-status top
set -g pane-border-format ' #{?pane_active,#[reverse],}#{pane_index} #{pane_current_path}'
```

如果路径太长，可以写一个脚本做截断处理，只保留前两段和末尾部分：

```bash tmux_utils.sh
#!/bin/bash
function format_pane_title() {
  current_path=$1
  # 将 home 路径替换为 ~
  if [[ $current_path == $HOME* ]]; then
    current_path="~${current_path#$HOME}"
  fi
  # 路径超过 48 字符时截断
  max_length=48
  if [[ ${#current_path} -gt $max_length ]]; then
    first_two_segments=$(echo "$current_path" | cut -d'/' -f1-2)
    tail_length=$(( $max_length-${#first_two_segments}-3 ))
    tail=$(echo "$current_path" | cut -d'/' -f4- | tail -c $tail_length)
    current_path="$first_two_segments/...$tail"
  fi
  echo "$current_path"
}
```

然后在 tmux 配置中调用：

```bash ~/.tmux.conf
set -g pane-border-format ' #{?pane_active,#[reverse],}#{pane_index} #(~/path/to/tmux_utils.sh format_pane_title #{pane_current_path})'
```

## 动态主题（跟随系统 Dark Mode）

如果你在 macOS 上使用 tmux，可以让非活跃窗格的背景色跟随系统的 Dark Mode 自动切换。

思路是：通过 `osascript` 检测当前系统是否为深色模式，然后设置不同的窗格样式。活跃窗格保持终端默认背景，非活跃窗格用一个略有区别的底色来做视觉区分。

首先在 `~/.tmux.conf` 中设置启动时的初始主题：

```bash ~/.tmux.conf
# 启动时检测系统 Dark Mode，设置窗格样式
if-shell '[[ $(osascript -e "tell app \"System Events\" to tell appearance preferences to return dark mode") = "true" ]]' {
  set -g pane-active-border-style fg=color5,bg=terminal
  setw -g window-active-style bg=terminal
  set -g pane-border-style bg=colour239
  setw -g window-style bg=colour239
} {
  set -g pane-active-border-style fg=color5,bg=terminal
  setw -g window-active-style bg=terminal
  set -g pane-border-style bg=colour254
  setw -g window-style bg=colour254
}
```

但这只在 tmux 启动时检测一次。如果你在使用过程中切换了系统的 Dark Mode，窗格颜色不会跟着变。这时就需要用到 tmux 的 `after-set-environment` hook：

```bash ~/.tmux.conf
# 当环境变量变化时，根据 THEME 变量动态切换主题
set-hook -g after-set-environment {
  if-shell '[[ $(tmux showenv -g THEME) = "THEME=dark" ]]' {
    set -g pane-active-border-style fg=color5,bg=terminal
    setw -g window-active-style bg=terminal
    set -g pane-border-style bg=colour239
    setw -g window-style bg=colour239
  } {
    set -g pane-active-border-style fg=color5,bg=terminal
    setw -g window-active-style bg=terminal
    set -g pane-border-style bg=colour254
    setw -g window-style bg=colour254
  }
}
```

但问题来了，谁来触发这个 `set-environment` 呢？这就需要 iTerm2 的 AutoLaunch 脚本来配合了。

### iTerm2 AutoLaunch 脚本

iTerm2 支持 Python API，可以监听系统主题变化事件。我们写一个 AutoLaunch 脚本，当系统切换 Dark Mode 时，同时切换 iTerm2 配色方案和 tmux 的 `THEME` 环境变量：

```python switch_automatic.py
#!/usr/bin/env python3

import iterm2
import os

async def changeTheme(theme_parts, connection):
    if "dark" in theme_parts:
        preset = await iterm2.ColorPreset.async_get(connection, "GruvboxDark")
        os.system('/opt/homebrew/opt/tmux/bin/tmux setenv -g THEME dark')
    else:
        preset = await iterm2.ColorPreset.async_get(connection, "MutoeLight")
        os.system('/opt/homebrew/opt/tmux/bin/tmux setenv -g THEME light')

    # 更新所有 profile 的配色
    profiles = await iterm2.PartialProfile.async_query(connection)
    for partial in profiles:
        profile = await partial.async_get_full_profile()
        await profile.async_set_color_preset(preset)

async def main(connection):
    # 启动时先设置一次
    app = await iterm2.async_get_app(connection)
    parts = await app.async_get_theme()
    await changeTheme(parts, connection)

    # 持续监听系统主题变化
    async with iterm2.VariableMonitor(
        connection, iterm2.VariableScopes.APP, "effectiveTheme", None
    ) as mon:
        while True:
            theme = await mon.async_get()
            parts = theme.split(" ")
            await changeTheme(parts, connection)

iterm2.run_forever(main)
```

将这个脚本放在 `~/Library/Application Support/iTerm2/Scripts/AutoLaunch/` 目录下，iTerm2 启动时会自动运行。

> 需要先在 iTerm2 中安装 Python Runtime：菜单 Scripts > Manage > Install Python Runtime。
> 脚本中的 `GruvboxDark` 和 `MutoeLight` 是 iTerm2 中导入的配色方案名称，替换成你自己的就好。

这样整条链路就串起来了：

1. **系统切换 Dark Mode** → iTerm2 感知到 `effectiveTheme` 变化
2. **AutoLaunch 脚本** → 切换 iTerm2 配色方案 + `tmux setenv -g THEME dark/light`
3. **tmux hook** → `after-set-environment` 触发，切换窗格背景色

三者配合，终端的配色就能跟随系统主题无缝切换了。

> 参考：[The Power of Tmux Hooks](https://devel.tech/tips/n/tMuXz2lj/the-power-of-tmux-hooks)

## 其他常用配置

```bash ~/.tmux.conf
# 开启鼠标支持
set -g mouse on

# 窗口编号从 1 开始（默认从 0 开始）
set -g base-index 1
setw -g pane-base-index 1

# 关闭窗口后重新编号
set -g renumber-windows on

# 设置历史记录行数
set -g history-limit 10000

# 设置窗格编号显示时间（按 Prefix q 后）
set -g display-panes-time 1500
```

## 插件

个人使用 [TPM (Tmux Plugin Manager)](https://github.com/tmux-plugins/tpm) 来管理插件：

```bash ~/.tmux.conf
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-sensible'     # 一组合理的默认配置
set -g @plugin 'tmux-plugins/tmux-resurrect'    # 会话持久化，重启后恢复
set -g @plugin 'tmux-plugins/tmux-copycat'      # 增强复制模式的搜索
set -g @plugin 'tmux-plugins/tmux-open'         # 在复制模式中快速打开文件/URL
set -g @plugin 'tmux-plugins/tmux-pain-control' # 窗格操作增强

run '~/.tmux/plugins/tpm/tpm'
```

安装插件：在 tmux 中按 `Prefix I`（大写 I）即可自动安装。

## 配合 Claude Code 使用

在 tmux 中跑 Claude Code 有几个地方需要注意，不配置的话会踩一些坑。

### Shift+Enter 换行失效

这是最常遇到的问题。在 tmux 里使用 Claude Code 时，<kbd>Shift+Enter</kbd> 无法换行，按下去直接提交了。原因是 tmux 默认不传递扩展按键序列，需要手动开启：

```bash ~/.tmux.conf
set -s extended-keys on
set -as terminal-features 'xterm*:extkeys'
```

如果你用的是 iTerm2 + tmux 的组合，加了上面的配置可能还是不行。还需要在 iTerm2 中开启 CSI u 模式：Preferences → Profiles → Keys → General → 把 Report modifiers using CSI u 设置为 **All keys**。

不加这些的话只能用 <kbd>Ctrl+J</kbd> 或 `\` + <kbd>Enter</kbd> 来换行，不太顺手。

### Cmd+V 粘贴图片不生效

在 macOS 上，Claude Code 支持用 <kbd>Cmd+V</kbd> 粘贴剪贴板中的图片，但在 tmux 中这个功能不生效。tmux 拦截了粘贴事件，只会把剪贴板当成纯文本处理。

替代方案：用 <kbd>Ctrl+V</kbd> 代替，Claude Code 也绑定了这个快捷键来粘贴图片，在 tmux 中可以正常使用。

### 防止画面闪烁

tmux 本身就是一层渲染中间层，Claude Code 输出内容时容易出现画面闪烁或滚动位置跳动。可以开启全屏渲染模式来解决：

```bash
export CLAUDE_CODE_NO_FLICKER=1
```

加到 `~/.zshrc` 或 `~/.bashrc` 里就好。开启后 Claude Code 会使用 alternate screen buffer（和 Vim 一样），渲染更稳定，内存占用也更平稳。

### 通知透传

Claude Code 在后台任务完成时会发送桌面通知，但 tmux 默认会拦截这些 escape sequences，导致通知无声无息地消失。加上这个配置就好：

```bash ~/.tmux.conf
set -g allow-passthrough on
```

### 前缀键冲突

tmux 默认前缀键是 <kbd>Ctrl-b</kbd>，如果 Claude Code 中有用到 <kbd>Ctrl-b</kbd> 的快捷键（比如 `task:background`），按下去会被 tmux 拦截进入前缀等待状态。解决办法有两个：

- 按两次 <kbd>Ctrl-b</kbd>，第一次触发 tmux 前缀，第二次把字符传给 Claude Code
- 或者干脆换掉 tmux 前缀键（见上文"基本概念"一节的配置）

### 多窗格并行工作

tmux 配合 Claude Code 最实用的场景就是多窗格并行：一个窗格跑 Claude Code，另一个窗格跑 dev server 或看日志。Claude Code 还能通过 `/tmux` 技能直接向其他窗格发送命令和读取输出，比如让它帮你观察 dev server 的报错然后自动修复。

# 参考资料

- [Tmux Cheat Sheet & Quick Reference](https://tmuxcheatsheet.com/)
- [The Power of Tmux Hooks](https://devel.tech/tips/n/tMuXz2lj/the-power-of-tmux-hooks)
