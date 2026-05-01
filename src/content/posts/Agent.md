---
title: 大模型为什么要进行瘦身？
published: 2026-04-24
tags: [skills]
category: 分类
cover: https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/3BMqYybg0Yz0mqwZ/img/b3a9dabf-1733-4f7e-a938-be54461eda1f.png
description: 大模型瘦身可突破存储、速度、成本、端侧部署四堵墙，核心有量化、剪枝、蒸馏三种方法；蒸馏衍生出女娲.skill（蒸馏名人）、dot-skill（蒸馏身边人），skills.sh 可便捷管理相关技能。
pinned: false
draft: false
---

# 大模型为什么要进行瘦身？

一个原始的大模型（比如未压缩的Qwen-72B），在真实场景中会遇到四堵墙：

1.  💾 存储墙 问题：72B参数的FP32模型，需要 72B × 4字节 ≈ 288GB 显存。一张A100（80GB）都装不下，更别说手机了。
    
    后果：无法单卡部署，必须多卡分布式，成本飙升。
    
2.  ⏱️ 推理速度墙 问题：大模型推理时，每个 token 都要搬运全部参数。权重越大，内存带宽越容易成为瓶颈，生成速度慢（比如不到10 tokens/秒）。
    
    后果：用户体验差，实时交互几乎不可能。
    
3.  💰 成本墙 问题：云上部署一个原始大模型，单次推理的算力成本和电量成本都极高。如果对外提供免费API，亏本严重；收费又劝退用户。
    
    后果：商业模式难以为继。
    
4.  📱 端侧部署墙 问题：手机、IoT设备、智能汽车芯片的算力和内存远不如服务器。FP32模型无法直接运行。
    

后果：AI功能必须联网，断网后变“智障”，且数据必须上传云端，隐私风险大。

:::
不压缩，大模型就永远困在机房，无法进入你的手机、笔记本、汽车和本地应用！！！
:::

# 三种“减肥方法”速览

类比三种运大象进城的方案：

| 方法 | 类比 | 核心 | 压缩比 | 精度损失 | 是否需要重训 |
| --- | --- | --- | --- | --- | --- |
| 量化 | 冻干（缩小体积） | FP32→INT8/INT4 | 4x~8x | 0.5%~2% | 否(PTQ)/是(QAT) |
| 剪枝 | 切赘肉 | 删不重要的连接/神经元 | 2x~4x | 1%~3% | 是（微调） |
| 蒸馏 | 师带徒 | 大模型教小模型 | 10x+ | 5%~10% | 是（完整训练） |

# 🔢量化：降低精度，精简模型体积

把一个模型的**数值精度降低**，让它占用的内存更少、计算速度更快。

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/3BMqYybg0Yz0mqwZ/img/f50ec79f-0f31-4a4e-834e-1aa3180dd209.png)

### 1.1 原理

**一句话**：把模型中的高精度浮点数（FP32）转换成低精度整数（INT8/INT4），减少每个数字占用的空间。

类比：你记录“3.141592653589793” vs “3”——后者省了 75% 的存储。

### 1.2 量化分类

| 类型 | 全称 | 说明 | 优点 | 缺点 |
| --- | --- | --- | --- | --- |
| **PTQ** | 训练后量化 | 训练完直接转，无需重新训练 | 极快，几分钟完成 | 精度损失略大 |
| **QAT** | 量化感知训练 | 训练过程中模拟量化误差 | 精度损失小 | 需要重新训练/微调 |
| **动态量化** | Dynamic Quantization | 权重提前量化，激活动态计算 | 平衡速度与精度 | 实现稍复杂 |

> 对大多数应用，**PTQ** 已足够；若精度敏感，可选用 **QAT**。

### 1.3 流程

1.  **训练**：在 FP32 下训练好完整模型
    
2.  **校准**：用一小批样本数据跑一遍，统计每层数值的范围（如 min=-1.2, max=2.4）
    
3.  **映射**：将浮点范围线性映射到整数范围（如 INT8 的 -128~127）
    
4.  **转换**：替换模型中的权重和激活函数
    
5.  **微调**（可选）：若精度下降，用少量数据微调恢复
    

### 1.4 工具链

*   **PyTorch**：`torch.quantization`
    
*   **TensorRT**（NVIDIA 生态）
    
*   **ONNX Runtime**（跨平台）
    
*   **TFLite**（移动端）
    
*   **GGUF / llama.cpp**（CPU 大模型专用）
    
*   **GPTQ / AWQ**（LLM 4-bit 量化）
    

量化大模型后缀：

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/3BMqYybg0Yz0mqwZ/img/02627ee3-5b09-47df-a7ba-eb2d5f02be4f.png)

# 🎓蒸馏：模仿学习

### 2.1原理

模型蒸馏（Model Distillation）最初由 Hinton 等人在2015年提出，其核心思想是通过**模型缩减或知识迁移**的方式，将一个复杂的大模型（教师模型）的知识传授给一个相对简单的小模型（学生模型）。

模型蒸馏分为**结构拆解（模型剪枝）** 和**知识迁移**（目前最主流）两大类。我这里将重点讲解实操性更强的**知识迁移**蒸馏方法。

### 2.2核心概念

*   **软标签（soft label）**：教师模型输出的概率分布（比如 0.7 猫 + 0.2 老虎 + 0.05 豹子）
    
*   **硬标签（hard label）**：真实答案（“猫”）
    
*   **损失函数**：学生同时学硬标签 + 模仿教师的软标签
    

**关键 insight**：软标签里藏着“类别之间的关系”，这就是**暗知识**。

### 2.3🔧 模型蒸馏操作指南

[https://docs.jdcloud.com/cn/jdaip/distill-details](https://docs.jdcloud.com/cn/jdaip/distill-details)

1.  **选择教师模型**：一个性能顶尖的大模型（如 GPT-4、DeepSeek-V3、Qwen-Max）
    
2.  **准备学生模型**：一个你想部署的小模型（如 Qwen-1.8B、Llama-3.2-1B）
    
3.  **准备数据集**：覆盖目标领域的无标签或少量标签数据
    
4.  **教师生成软标签**：用教师模型对数据集进行推理，得到每个样本的概率分布（可离线保存）
    
5.  **训练学生模型**：学生同时学习硬标签（若有）和教师软标签，损失函数如上所述
    
6.  **评估与部署**：测试学生性能，并可进一步量化学生模型
    

### 2.4 效果

*   学生参数量可减少 **10 倍以上**（如 100 亿 → 1 亿）
    
*   学生能力可达教师的 **90% 以上**
    
*   推理速度提升 **5-10 倍**（取决于模型结构）
    

# ✂️剪枝——结构性减脂

### 3.1 原理

模型训练后，很多权重值接近零或对输出影响极小。剪枝就是**删除这些不重要的连接或整个神经元**，让模型变得稀疏。

类比：修剪盆栽，剪掉多余的枝叶，让养分更集中。

### 3.2 剪枝分类

| 类型 | 方式 | 优点 | 缺点 |
| --- | --- | --- | --- |
| **非结构化剪枝** | 删除单个权重连接 | 压缩率高 | 稀疏结构对硬件不友好，实际加速有限 |
| **结构化剪枝** | 删除整个通道 / 注意力头 / 层 | 硬件友好，真正加速 | 精度损失略大，需微调 |

> 实际应用中，**结构化剪枝** 更受欢迎。

### 3.3 剪枝流程

1.  **训练基线模型**：获得一个完全训练的 FP32 模型
    
2.  **评估重要性**：通过权重绝对值、梯度、或 Hessian 信息判断哪些连接不重要
    
3.  **剪除**：将低于阈值的连接/通道置零或直接删除
    
4.  **微调**：用原训练数据的一小部分重新训练，恢复精度
    
5.  **迭代**：重复 2-4 步，达到想要的压缩率
    

> 剪枝通常需要多次迭代，每次剪掉一小部分（如 10%~20%），然后微调。

# 蒸馏的新形态：从“压缩模型”到“复制人格”

#####  案例 1：女娲.skill —— 蒸馏任何人的思维（5 分钟）

> 项目地址：https://github.com/alchaincyf/nuwa-skill  一周收获 1 万星，2026 年 4 月最火的开源项目之一。

输入一个名字（乔布斯、马斯克、鲁迅…），它会：

1.  **自动调研**：6 个 AI Agent 并行采集资料
    
2.  **提炼思维模型**：比如“乔布斯的现实扭曲力场”
    
3.  **生成可对话的 AI 人格**
    

**效果演示（文字模拟）**：

> 👤 你：乔布斯，你怎么看现在的折叠屏手机？  🤖 乔布斯 skill：折叠屏？真正的创新不是把屏幕折起来，而是让用户根本不需要思考怎么折。我们当年做 iPhone，就是直接干掉键盘。现在这群人只是在解决自己制造的问题。

> 👤 你：马斯克，你同意吗？  🤖 马斯克 skill：乔布斯说的有一定道理，但他忽略了物理极限。折叠屏的核心是材料科学，而不是用户体验的矫情。等我 Neuralink 做好了，你们连屏幕都不需要。

👉 **现场可以选一个大家都熟悉的名人，提前蒸馏好，现场演示对话。**

#####  案例 2：dot-skill / 同事.skill —— 蒸馏你身边的人（5 分钟）

> 项目地址：https://github.com/titanwings/colleague-skill  开发者：24 岁的上海 AI 工程师周天奕（4 小时写出来，初衷是沉淀团队隐性知识）

推荐博客：[https://gitcode.csdn.net/69cb329454b52172bc65aa57.html](https://gitcode.csdn.net/69cb329454b52172bc65aa57.html)

**和女娲.skill 的区别**

| 特性 | 女娲.skill | dot-skill |
| --- | --- | --- |
| 目标人物 | 名人 / 公众人物 | 同事 / 身边人 |
| 数据来源 | 公开资料 | 飞书、钉钉、邮件、聊天记录 |
| 自动化程度 | 半自动 | **全自动（支持 API 采集）** |
| 人格模型 | 6 维研究链 | 专业层 + 5 层人格模型 |

### 最简单入门方式（女娲.skill）

```bash
# 1. 安装 Claude Code（或使用 Cursor）
# 2. 安装女娲 skill
npx skills add alchaincyf/nuwa-skill

# 3. 在 Claude Code 中输入
蒸馏尤雨溪

# 4. 等待 2-3 小时，自动生成
```

### 蒸馏身边同事（dot-skill）

```bash
git clone https://github.com/titanwings/colleague-skill.git .claude/skills/create-colleague
# 然后输入 /create-colleague 按提示操作
```

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/3BMqYybg0Yz0mqwZ/img/d57d5f55-2ccf-4f28-b2e4-fc599bf20525.png)

1️⃣ 检查并安装依赖

进入 `dot-skill` 项目目录（即 `create-colleague` 所在的父目录），然后运行：

```plaintext
## 确保已安装 Python 3.7+
python3 --version
## 安装项目所需依赖（如果有 requirements.txt）
pip3 install -r requirements.txt
## 如果项目没有提供 requirements，手动安装常见依赖
pip3 install requests dingtalk-sdk
```

2️⃣ 配置钉钉应用凭证 钉钉自动采集工具通常需要你提供企业内部应用的认证信息。你需要：

登录 钉钉开放平台，创建“企业内部开发”应用，获取 AppKey 和 AppSecret

在应用权限中开启“企业通讯录只读”、“消息查询”等相关权限

将应用授权给需要采集的成员

然后，将这些信息配置到工具中。通常是编辑 tools/dingtalk\_config.json 或通过环境变量设置：

```plaintext
export DINGTALK_APP_KEY="你的AppKey"
export DINGTALK_APP_SECRET="你的AppSecret"
```

或者直接修改 dingtalk\_auto\_collector.py 中的默认值（不推荐）。

3️⃣ 运行诊断命令 有些工具提供诊断模式，可以尝试：

```plaintext
python3 tools/dingtalk_auto_collector.py --check
```

如果没有 --check 选项，可以查看帮助：

```plaintext
python3 tools/dingtalk_auto_collector.py --help
```

4️⃣ 尝试简化采集：手动导出聊天记录

:::
钉钉电脑端：打开聊天窗口 -> 右上角“…” -> 聊天记录 -> 多选 -> 导出（部分版本支持）

浏览器开发者工具：抓取钉钉网页版的接口数据（复杂，不推荐）

第三方工具：如 DingTalk Export 等（注意安全风险）
:::

手动导出的聊天记录保存为 .txt 或 .json，然后通过 create-colleague 技能上传文件。直接粘贴也支持

## 附：备用资源与链接

*   女娲.skill 仓库：https://github.com/alchaincyf/nuwa-skill
    
*   dot-skill 仓库：https://github.com/titanwings/colleague-skill
    
*   知识蒸馏论文合集：https://github.com/Tebmer/Awesome-Knowledge-Distillation-of-LLMs
    

# 怎么使用其他skills

[https://skills.sh/](https://skills.sh/)

使用 `skills.sh` 里的技能非常简单，核心就是通过其配套的 `npx skills` 命令行工具来安装和管理。整个流程可以概括为：**发现 -> 安装 -> 使用**。

### 🔍 第一步：发现技能

在安装之前，需要先找到合适的技能。

*   **访问 skills.sh 网站**：直接访问 [https://skills.sh/](https://skills.sh/) 浏览技能库，它有“All Time（总榜）”、“Trending（趋势榜）”、“Hot（热门榜）”等分类，可以帮助你发现社区里最受欢迎或最新的技能。
    
*   **使用搜索功能**：在网站上通过关键词搜索，可以精准定位特定领域的技能。
    

### 🛠️ 第二步：安装技能

`npx` 是 Node.js 自带的包运行工具，无需额外安装即可使用 `skills` 这个 CLI 工具。它的基本用法是 `npx skills add <安装源>`。

`<安装源>`有多种指定方式，最常见的是 GitHub 仓库的“拥有者/仓库名”简写格式，不过为了明确安装具体技能，更通用的方法是：`拥有者/仓库名/技能名`。

例如，要安装 `vercel-labs/skills` 仓库下的 `find-skills` 技能，可以在终端中运行以下命令：

```bash
npx skills add vercel-labs/skills/find-skills
```

| 安装模式 | 命令示例 | 存放位置 |
| --- | --- | --- |
| **项目级 (Project)**<br>_(默认推荐)_ | `npx skills add ...` | `./<AI代理名称>/skills/`<br>（位于你当前**项目文件夹**内） |
| **全局级 (Global)**<br>_(所有项目共享)_ | `npx skills add ... -g` | `~/.<AI代理名称>/skills/`<br>（位于你的**用户主目录**下） |

*   **全局安装的区别**：和项目级安装不同，如果使用 `-g` 参数进行**全局安装**，Skill 会安装到用户主目录的对应路径，例如 `C:\Users\Atopos\.claude\skills\`、`C:\Users\Atopos\.cursor\skills\` 等。这样安装的技能在所有项目中都能生效。
    

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/3BMqYybg0Yz0mqwZ/img/b3a9dabf-1733-4f7e-a938-be54461eda1f.png)

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/3BMqYybg0Yz0mqwZ/img/7dbb9e52-4dfc-42d8-88ff-013033b91b9a.png)

*   `Installation Summary`（安装概览）
    

*   **信息**：显示将 `find-skills` 复制到 `.\.agents\skills\find-skills` 路径，并列出兼容的 AI Agent（Amp、Cline、Cursor 等）。你选择自己想要选择的AI工具就好了。
    

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/3BMqYybg0Yz0mqwZ/img/496228f8-e100-4b70-9f97-587d8e3220e5.png)

在这个 `skills.sh`（Vercel 技能 CLI）的安装流程里，**中间的 “Proceed with installation?” 步骤**，会提供两个选项：

*   `Yes`：确认继续安装当前选中的技能
    
*   `No`：取消本次安装，直接退出流程
    

如果你想跳过这个确认步骤，可以在安装命令里加上 `-y` 参数，比如：

```plaintext
npx skills add vercel-labs/skills/find-skills -y
```

运行完成之后，我们就可以使用find-skills进行管理skills工具了

`find-skills` 是一个**技能检索与安装工具**，作用类似「AI Agent 的技能商店」，帮你快速查找、安装其他可扩展的技能。

### 🛠️ 主要使用方式

你可以通过两种方式来使用 `find-skills`。

| 方式 | 具体方法 |
| --- | --- |
| **💬 自然语言交互 (推荐)** | 在你的AI编程助手（如 Claude Code, Cursor）中，直接用中文提问即可。比如：“**帮我找一个能处理 PDF 文件的技能**”。 |
| **⌨️ 直接运行命令** | 如果你想手动搜索，也可以在命令行终端执行 `npx skills find <搜索关键词>`。例如，搜索React性能相关技能：<br>`npx skills find react performance` |

### 💡 自然语言使用示例

就像你之前做的那样，在对话中直接说出需求就行。`find-skills` 会为你处理一切。

*   **询问如何做某事**：
    
    > 我怎样才能让我的 **React 应用跑得更快**？这时Agent会执行 `npx skills find react performance` 进行搜索。
    
*   **寻求某项特定能力**：
    
    > 帮我做 **PR review**。这时Agent会执行 `npx skills find pr review` 进行搜索。
    
*   **寻找特定领域的帮助**：
    

> 我需要一个 **创建变更日志 (changelog)** 的工具。这时Agent会执行 `npx skills find changelog` 进行搜索。

> **小贴士**：为了稳定触发，建议在你的请求中明确包含 `**skill**` 这个词，比如“找一个**数据分析的skill**”，这样AI能更准确地理解你的意图是调用 `find-skills`。

### ⚙️ 第三步：管理技能

技能安装后，可以通过以下命令进行管理：

*   `**npx skills list**`：列出当前已安装的所有技能。
    
    ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/3BMqYybg0Yz0mqwZ/img/23794968-1996-4e15-af8e-e7f6572ccdbe.png)
    
    ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/3BMqYybg0Yz0mqwZ/img/53c5be9a-4ddc-449d-8cda-7359ee77bd2a.png)
    
*   `**npx skills remove <技能名>**`：移除一个已安装的技能。
    
*   `**skills-lock.json**`：项目中生成的 `skills-lock.json` 文件记录了技能的具体版本。分享这个文件，可以让团队其他成员安装完全相同的技能版本，保证环境一致性。
    

### 🚀 第四步：使用技能

技能的触发方式取决于你使用的 AI 编程助手，一般有两种：

*   **自动触发（推荐）**：这是最常见的方式。安装技能后，AI 助手会根据你的对话内容，自动判断是否需要调用相关技能。比如，安装了一个“日志分析”技能，当你问“分析这个日志文件”时，AI 就会自动激活它，无需手动操作。
    
*   **手动触发**：部分工具或特定技能也支持通过输入“/技能名”这样的命令来手动调用。
    

### 💎 总结

总的来说，`skills.sh` 提供了一种**标准化、社区驱动**的方式来扩展 AI 编程助手的能力。通过 `npx skills add` 命令和自动触发机制，你可以轻松地为自己常用的 AI 工具安装和启用各种专业能力，帮助减少重复劳动，提升开发效率。