# Clawguard Install Guide

## 中文

### 一行提示词（给 OpenClaw）

```
请阅读 docs/INSTALL.md 并在本机安装 clawguard。完成后运行 `clawguard --help` 以确认安装成功。
```

### 手动安装（推荐）

1. 安装依赖：Node.js 18+（建议 22+）。
2. 克隆并安装：

```bash
git clone https://github.com/jiangmuran/clawguard.git
cd clawguard
npm install
npm link
```

3. 验证：

```bash
clawguard --help
```

### 常用命令

扫描 OpenClaw 配置目录：

```bash
clawguard scan --path ~/.openclaw
```

高危拦截启动：

```bash
clawguard guard -- openclaw gateway --port 18789
```

检查更新：

```bash
clawguard update --check
```

快速更新：

```bash
clawguard update --apply
```

### 可选配置

在项目根目录创建 `clawguard.config.json`：

```json
{
  "paths": ["~/.openclaw", "./plugins"],
  "ignore": ["node_modules", ".git"],
  "failOn": "high",
  "minSeverity": "low",
  "rules": {
    "disable": []
  }
}
```

---

## English

### One-line prompt (for OpenClaw)

```
Please read docs/INSTALL.md and install clawguard on this machine. After install, run `clawguard --help` to confirm.
```

### Manual install (recommended)

1. Install Node.js 18+ (22+ recommended).
2. Clone and install:

```bash
git clone https://github.com/jiangmuran/clawguard.git
cd clawguard
npm install
npm link
```

3. Verify:

```bash
clawguard --help
```

### Common commands

Scan OpenClaw config directory:

```bash
clawguard scan --path ~/.openclaw
```

Block risky runs:

```bash
clawguard guard -- openclaw gateway --port 18789
```

Check for updates:

```bash
clawguard update --check
```

Apply update:

```bash
clawguard update --apply
```

### Optional config

Create `clawguard.config.json` in the project root:

```json
{
  "paths": ["~/.openclaw", "./plugins"],
  "ignore": ["node_modules", ".git"],
  "failOn": "high",
  "minSeverity": "low",
  "rules": {
    "disable": []
  }
}
```
