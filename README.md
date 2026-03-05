# Clawguard

![CI](https://github.com/jiangmuran/clawguard/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Website](https://img.shields.io/badge/website-clawguard.muran.tech-0b7285)

[中文 README](README.zh-CN.md)

OpenClaw has entered a phase where malicious plugins, risky skills, and supply-chain attacks are no longer rare edge cases. Real-world incidents now include stealthy exfiltration, unsafe shell execution, and tampered installs. Clawguard exists to reduce that blast radius.

Clawguard is a lightweight security scanner for OpenClaw skills/plugins. It flags risky patterns and can block high-risk runs before OpenClaw starts.

Website: https://clawguard.muran.tech

## Features

- Scan skills/plugins for risky patterns (exec, eval, sensitive paths)
- Generate reports (text or JSON)
- Guard mode to block risky runs
- Update checker and quick update helper
- Shareable install snippet for easy promotion

## Install

```bash
git clone https://github.com/jiangmuran/clawguard.git
cd clawguard
npm install
npm link
```

## Quick start

```bash
clawguard scan --path ~/.openclaw
```

```bash
clawguard guard -- openclaw gateway --port 18789
```

## One-line install prompt (for OpenClaw)

```
Please read docs/INSTALL.md and install clawguard on this machine. After install, run `clawguard scan --path ~/.openclaw` and report the results.
```

## Update

Check for updates:

```bash
clawguard update --check
```

Apply update (auto-detects git repo or npm install):

```bash
clawguard update --apply
```

## Share (growth)

Print a shareable snippet:

```bash
clawguard share --format markdown
```

## Config (optional)

Create `clawguard.config.json` in the project root:

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

## Project info

- Changelog: `CHANGELOG.md`
- Roadmap: `ROADMAP.md`
- Contributing: `CONTRIBUTING.md`
- Security: `SECURITY.md`
