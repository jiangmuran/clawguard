# Clawguard

![CI](https://github.com/your-org/clawguard/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

[English README](README.md)

Clawguard 是一个面向 OpenClaw 技能/插件的安全扫描器，能够标记高风险模式，并在启动前进行拦截。

## 主要功能

- 扫描技能/插件中的高危模式（exec、eval、敏感路径）
- 生成扫描报告（文本或 JSON）
- Guard 模式阻止高危启动
- 更新检测与快速更新
- 可分享安装提示，方便传播

## 安装

```bash
git clone https://github.com/your-org/clawguard.git
cd clawguard
npm install
npm link
```

## 快速开始

```bash
clawguard scan --path ~/.openclaw
```

```bash
clawguard guard -- openclaw gateway --port 18789
```

## 快速更新

检查更新：

```bash
clawguard update --check
```

执行更新（自动识别 git 或 npm 安装方式）：

```bash
clawguard update --apply
```

## 分享（推广）

打印可分享的文案：

```bash
clawguard share --lang zh --format markdown
```

## 可选配置

在项目根目录创建 `clawguard.config.json`：

```json
{
  "paths": ["~/.openclaw", "./plugins"],
  "ignore": ["node_modules", ".git"],
  "failOn": "high",
  "minSeverity": "medium",
  "rules": {
    "disable": ["SECRET_ENV"]
  }
}
```

## 项目信息

- 变更记录：`CHANGELOG.md`
- 路线图：`ROADMAP.md`
- 贡献指南：`CONTRIBUTING.md`
- 安全政策：`SECURITY.md`

## 给 OpenClaw 的一行提示词

```
请阅读 docs/INSTALL.md 并在本机安装 clawguard。安装完成后运行 `clawguard scan --path ~/.openclaw` 并报告结果。
```
