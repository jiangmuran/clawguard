const { resolveRepo } = require("./repo");

function buildShareMessage({
  lang = "en",
  format = "text",
  repoUrl,
}) {
  const repo = resolveRepo({ cliRepo: repoUrl, envRepo: process.env.CLAWGUARD_REPO, pkgRepo: repoUrl });
  const fallbackUrl = "https://github.com/jiangmuran/clawguard";
  const url = repo ? repo.url : (repoUrl || fallbackUrl);

  if (lang === "zh") {
    const lines = [
      "Clawguard：面向 OpenClaw 的安全扫描器，检测高危技能/插件。",
      `仓库：${url}`,
      "网站：https://clawguard.muran.tech",
      "一行提示词：请阅读 docs/INSTALL.md 并安装 clawguard，然后运行 `clawguard scan --path ~/.openclaw`。",
    ];
    if (format === "markdown") {
      return [
        "**Clawguard：OpenClaw 安全扫描器**",
        `- 仓库：${url}`,
        "- 网站：https://clawguard.muran.tech",
        "- 一行提示词：请阅读 docs/INSTALL.md 并安装 clawguard，然后运行 `clawguard scan --path ~/.openclaw`。",
      ].join("\n");
    }
    return lines.join("\n");
  }

  const lines = [
    "Clawguard: a lightweight security scanner for OpenClaw skills/plugins.",
    `Repo: ${url}`,
    "Website: https://clawguard.muran.tech",
    "One-line prompt: Please read docs/INSTALL.md, install clawguard, then run `clawguard scan --path ~/.openclaw`.",
  ];
  if (format === "markdown") {
    return [
      "**Clawguard: OpenClaw security scanner**",
      `- Repo: ${url}`,
      "- Website: https://clawguard.muran.tech",
      "- One-line prompt: Please read docs/INSTALL.md, install clawguard, then run `clawguard scan --path ~/.openclaw`.",
    ].join("\n");
  }
  return lines.join("\n");
}

module.exports = {
  buildShareMessage,
};
