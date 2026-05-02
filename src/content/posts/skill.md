---
title: 如何创建自己的 Agent Skills：从概念、结构到发布
published: 2026-5-2
tags: [skills]
category: AI
description: Skills 的价值，不只是让 AI “会更多”，而是让 AI “按你的方式做事”
pinned: false
draft: false
---


Agent Skills 是一种轻量级的开放格式，用于通过专业知识和工作流扩展 AI 智能体的能力。它的核心价值在于：当智能助手越来越强大时，它不一定缺少能力，而是常常缺少完成真实工作的上下文；Skills 通过按需加载程序化知识、团队规范和用户专属上下文，正好解决了这个问题。

简单来说，Skill 就是一个带有 `SKILL.md` 文件的文件夹。`SKILL.md` 里至少包含元数据，比如 `name` 和 `description`，以及告诉智能体“怎么干活”的执行指令；除此之外，还可以附带脚本、参考资料、模板和其他资源。

## 什么是Agent Skills

> 参考：https://agentskills.io/home

Agent Skills 的目标不是把 AI 变成“什么都知道”，而是把 AI 变成“在某个任务上更可靠、更一致、更懂你的工作方式”。
对于开发者来说，这意味着你可以把一个具体流程封装成可复用的能力包；对于团队来说，可以把组织知识、业务规则和操作规范沉淀下来；对于终端用户来说，则能开箱即用地为智能体增加新能力。

Agent Skills 之所以特别有用，是因为它采用了“渐进式披露”的设计：启动时只加载技能名称和描述，任务匹配后才加载完整指令，真正执行时再按需读取脚本和引用文件。
这种设计让智能体能同时保留很多技能，而不会把上下文一下子撑爆

- 技能开发者：一次构建能力，即可部署至多个智能体产品。
- 兼容智能体：技能支持让终端用户开箱即可赋予智能体新能力。
- 团队与企业：将组织知识封装为可移植、版本控制的知识包。

## Skill的目录结构

简单说，技能就是一个带 `SKILL.md` 文件的文件夹。

`SKILL.md` 里至少要有元数据（比如 `name` 和 `description`）和执行指令，告诉智能体怎么干活。技能还可以附带脚本、模板、参考资料等。

```
my-skill/
├── SKILL.md          # 必需：指令 + 元数据
├── scripts/          # 可选：可执行代码
├── references/       # 可选：文档资料
└── assets/           # 可选：模板、资源
```

------

## 技能是怎么工作的

技能用「渐进式披露」来管理上下文：

1. **发现**：启动时，智能体只加载每个技能的名称和描述，够用就行——知道什么时候可能派得上用场。
2. **激活**：当任务跟技能描述匹配时，智能体把完整的 `SKILL.md` 指令读进上下文。
3. **执行**：智能体按指令干活，需要时可以加载引用的文件或执行脚本。

这样既保证响应快，又能在需要时获取更多上下文。

------

## SKILL.md 文件结构

每个技能都从一个 `SKILL.md` 文件开始，包含 YAML 前置元数据和 Markdown 指令：

```
---
name: pdf-processing
description: 从 PDF 提取文本和表格，填写表单，合并文档
---

# PDF Processing

# 什么时候用
用户需要处理 PDF 文件时用……

# 怎么提取文本
1. 用 pdfplumber 提取文本……

# 怎么填表单
……
```

------

### 前置元数据（必填）

文件顶部必须有前置元数据：

```
---
name: skill-name
description: 这个技能是干什么的，什么时候用
---
```

------

### 完整字段示例

```
---
name: pdf-processing
description: 从 PDF 提取文本和表格，填写表单，合并文档
license: Apache-2.0
compatibility: Python 3.8+, requires pdfplumber, pymupdf
metadata:
  author: example-org
  version: "1.0"
---
```

------

### 字段说明

字段必需说明name是最多 64 字符。只能小写字母、数字、连字符，不能以连字符开头或结尾description是最多 1024 字符。描述技能的作用和使用场景license否许可证名称或许可证文件路径compatibility否环境要求（Python/Node 版本、系统依赖、网络访问等）metadata否任意键值对，用于添加额外元数据allowed-tools否技能可使用的预批准工具列表，空格分隔（实验性）

------

### name 命名规则

`name` 字段必须满足：

- 1-64 个字符
- 只能用 Unicode 小写字母数字和连字符（`a-z`、`0-9`、`-`）
- 不能以 `-` 开头或结尾
- 不能有连续连字符（`--`）
- 必须跟父目录名一致

**有效示例：**

```
name: pdf-processing
name: data-analysis
name: code-review
```

**无效示例：**

```
name: PDF-Processing    # 不能有大写
name: -pdf              # 不能以连字符开头
name: pdf--processing   # 不能有连续连字符
```

------

### description 怎么写

`description` 字段：

- 1-1024 个字符，不能为空
- 要说清楚技能是干什么的、什么时候用
- 最好带上一些关键词，方便智能体判断什么时候该用这个技能

------

### 指令内容建议结构

```
# 技能标题

# 概述
详细介绍技能的使用场景、技术背景等

# 前置条件
需要什么环境配置、依赖项

# 工作流程
详细步骤，告诉智能体怎么执行任务

# 最佳实践
经验总结、注意事项、常见陷阱

# 示例
具体使用案例

# 故障排查
常见问题和解决方案
```

------

## 使用脚本

技能可以让智能体执行 shell 命令，也可以把可重用的脚本放在 `scripts/` 目录里。

- **一次性命令**：直接在指令里写 shell 命令
- **独立脚本**：有自身依赖的代码，放在 `scripts/` 下
- **脚本接口设计**：让智能体知道怎么调用脚本、传什么参数

------

## 获取天气Skills

调用高德地图 API 查询指定城市的实时天气信息

项目目录结构：

```
weather-skill/
├── SKILL.md   # 技能定义文件
└── weather.py # API查询文件
```

### 获取 API Key

访问 [高德开放平台](https://console.amap.com/dev/index) 申请 Web 服务 API Key。

### SKILL.md 文件

```
---
name: weather-skill
description: 通过高德地图 API 查询指定城市的实时天气信息
license: Apache-2.0
metadata:
  author: zhoupb
  version: "1.0.0"
---

# 城市天气查询技能

## 功能描述

查询指定城市的实时天气信息，包括温度、天气状况、风力风向等。

## 使用方式

直接描述你要查询的天气，例如：
- "[城市]天气怎么样"
- "[城市]今天的天气"
- "[城市]现在多少度"

## 环境变量

使用前请设置高德 API Key：

​```bash
export AMAP_MAPS_API_KEY=your_api_key
​```

## 安装依赖

​```bash
pip install -r requirements.txt
​```

## 使用方法

​```bash
python weather.py [城市]
​```

## 示例输出

​```
北京天气：晴
温度：15°C
风力：3 级 北风
湿度：45%
发布时间：2026-03-03 10:00:00
​```

## API 说明

使用高德地图天气 API：
- **城市查询 API**: `https://restapi.amap.com/v3/config/district`
- **天气查询 API**: `https://restapi.amap.com/v3/weather/weatherInfo`

## 获取 API Key

访问 [高德开放平台](https://console.amap.com/dev/index) 申请 Web 服务 API Key。
```

### weather .py 文件

```
#!/usr/bin/env python3
"""城市天气查询 - 使用高德 API"""

import os
import sys
import requests


def get_city_code(city_name: str, api_key: str) -> str | None:
    """根据城市名获取城市 code"""
    url = "https://restapi.amap.com/v3/config/district"
    params = {
        "key": api_key,
        "keywords": city_name,
        "subdistrict": 0,
    }
    resp = requests.get(url, params=params, timeout=5)
    resp.raise_for_status()
    data = resp.json()

    if data.get("status") == "1" and data.get("districts"):
        return data["districts"][0]["adcode"]
    return None


def query_weather(city_code: str, api_key: str) -> dict | None:
    """查询城市天气"""
    url = "https://restapi.amap.com/v3/weather/weatherInfo"
    params = {
        "key": api_key,
        "city": city_code,
        "extensions": "base",
    }
    resp = requests.get(url, params=params, timeout=5)
    resp.raise_for_status()
    data = resp.json()

    if data.get("status") == "1" and data.get("lives"):
        return data["lives"][0]
    return None


def main():
    if len(sys.argv) < 2:
        print("用法：python weather.py <城市名>")
        print("示例：python weather.py 北京")
        sys.exit(1)

    city_name = sys.argv[1]
    api_key = os.environ.get("AMAP_MAPS_API_KEY")

    if not api_key:
        print("错误：请设置环境变量 AMAP_MAPS_API_KEY")
        sys.exit(1)

    city_code = get_city_code(city_name, api_key)
    if not city_code:
        print(f"未找到城市：{city_name}")
        sys.exit(1)

    weather = query_weather(city_code, api_key)
    if not weather:
        print(f"无法获取 {city_name} 的天气信息")
        sys.exit(1)

    print(f"{weather['city']}天气：{weather['weather']}")
    print(f"温度：{weather['temperature']}°C")
    print(f"风力：{weather['windpower']} {weather['winddirection']}风")
    print(f"湿度：{weather['humidity']}%")
    print(f"发布时间：{weather['reporttime']}")


if __name__ == "__main__":
    main()
```

------

## 官方 Skills

https://github.com/anthropics/skills



