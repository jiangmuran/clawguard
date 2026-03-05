# Clawguard

![CI](https://github.com/jiangmuran/clawguard/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Website](https://img.shields.io/badge/website-clawguard.muran.tech-0b7285)

[English README](README.md)

OpenClaw 的生态正在出现更多恶意插件与高危技能，供应链投毒、隐蔽外传、危险命令都不再是极端案例。当前风险覆盖多个层面：命令执行、数据外泄、安装链路篡改。Clawguard 的目标是把风险挡在入口处。

Clawguard 是一个面向 OpenClaw 技能/插件的安全扫描器，能够标记高风险模式，并在启动前进行拦截。

## 项目故事

OpenClaw 让强大的自动化能力触达更多人，同时也让攻击门槛降低。一个被篡改的插件就可能静默执行命令、读取密钥或回传数据。Clawguard 的目标是尽早暴露这些风险，守住网关入口。

网站：https://clawguard.muran.tech

## 主要功能

- 扫描技能/插件中的高危模式（exec、eval、敏感路径）
- 生成扫描报告（文本或 JSON）
- Guard 模式阻止高危启动
- 更新检测与快速更新
- 可分享安装提示，方便传播

## 安装

```bash
git clone https://github.com/jiangmuran/clawguard.git
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

## 一键安装提示词（给 OpenClaw）

```
请阅读 docs/INSTALL.md 并在本机安装 clawguard。安装完成后运行 `clawguard scan --path ~/.openclaw` 并报告结果。
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
