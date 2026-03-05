const fs = require("fs");
const path = require("path");
const { loadConfig, normalizeConfig } = require("./config");
const { scanPaths } = require("./scanner");
const { formatTextReport, formatJsonReport, writeReport } = require("./report");
const { normalizeSeverity, severityGte, toAbsolute } = require("./utils");
const { buildShareMessage } = require("./share");
const { checkUpdate, compareVersions, applyUpdate } = require("./update");

function printHelp() {
  const help = [
    "Clawguard - scan OpenClaw skills/plugins for risky patterns",
    "",
    "Usage:",
    "  clawguard scan [--path <path> ...] [--config <file>] [--format text|json] [--fail-on <severity>] [--min-severity <severity>] [--output <file>]",
    "  clawguard guard [options] -- <command> [args...]",
    "",
    "Commands:",
    "  scan      Scan paths and report findings",
    "  guard     Block command execution if high-risk findings exist",
    "  share     Print a shareable install snippet",
    "  update    Check or apply updates",
    "",
    "Options:",
    "  --path <path>         Add a path to scan (repeatable)",
    "  --config <file>       Use a custom config file",
    "  --format <text|json>  Output format (default: text)",
    "  --fail-on <severity>  Exit non-zero if findings >= severity (default: high)",
    "  --min-severity <sev>  Only show findings >= severity (default: low)",
    "  --output <file>       Write report to file",
    "  --repo <owner/repo>   Override GitHub repository for share/update",
    "  --lang <en|zh>        Language for share output (default: en)",
    "  --apply               Apply update (update command)",
    "  --method <git|npm>    Update method (default: auto)",
    "",
    "Severity values: low, medium, high",
  ];
  console.log(help.join("\n"));
}

function parseArgs(args) {
  const options = {
    paths: [],
    configPath: null,
    format: "text",
    failOn: "high",
    minSeverity: "low",
    output: null,
  };
  const positional = [];

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--path") {
      options.paths.push(args[i + 1]);
      i += 1;
      continue;
    }
    if (arg === "--config") {
      options.configPath = args[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--format") {
      options.format = args[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--fail-on") {
      options.failOn = args[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--min-severity") {
      options.minSeverity = args[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--output") {
      options.output = args[i + 1];
      i += 1;
      continue;
    }
    positional.push(arg);
  }

  return { options, positional };
}

function parseShareArgs(args) {
  const options = { lang: "en", format: "text", repo: null };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--lang") {
      options.lang = args[i + 1] || "en";
      i += 1;
      continue;
    }
    if (arg === "--format") {
      options.format = args[i + 1] || "text";
      i += 1;
      continue;
    }
    if (arg === "--repo") {
      options.repo = args[i + 1];
      i += 1;
      continue;
    }
  }
  return options;
}

function parseUpdateArgs(args) {
  const options = { apply: false, check: false, method: "auto", repo: null };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--apply") {
      options.apply = true;
      continue;
    }
    if (arg === "--check") {
      options.check = true;
      continue;
    }
    if (arg === "--method") {
      options.method = args[i + 1] || "auto";
      i += 1;
      continue;
    }
    if (arg === "--repo") {
      options.repo = args[i + 1];
      i += 1;
      continue;
    }
  }
  if (!options.apply && !options.check) {
    options.check = true;
  }
  return options;
}

function resolveScanPaths(cliPaths, configPaths, cwd) {
  const resolved = [];
  const candidatePaths = cliPaths.length > 0 ? cliPaths : configPaths;
  if (candidatePaths.length > 0) {
    candidatePaths.forEach((item) => resolved.push(toAbsolute(item, cwd)));
  }

  const defaultPaths = [
    path.join(cwd, "plugins"),
    path.join(cwd, "skills"),
    path.join(require("os").homedir(), ".openclaw"),
  ];

  if (resolved.length === 0) {
    defaultPaths.forEach((item) => {
      if (fs.existsSync(item)) resolved.push(item);
    });
  }

  if (resolved.length === 0) {
    resolved.push(cwd);
  }

  return resolved;
}

function runScan(options) {
  const cwd = process.cwd();
  const { config, configPath } = loadConfig(cwd, options.configPath);
  const normalized = normalizeConfig(config, cwd);
  const scanPathsList = resolveScanPaths(options.paths, normalized.paths, cwd);
  const ignore = normalized.ignore;
  const minSeverity = normalizeSeverity(options.minSeverity, normalized.minSeverity);
  const failOn = normalizeSeverity(options.failOn, normalized.failOn);

  const disabledRules = normalized.rules && Array.isArray(normalized.rules.disable)
    ? normalized.rules.disable
    : [];

  const result = scanPaths({
    paths: scanPathsList,
    ignorePatterns: ignore,
    disabledRules,
  });

  const allFindings = result.findings;
  const visibleFindings = allFindings.filter((finding) =>
    severityGte(finding.severity, minSeverity)
  );
  const visibleCounts = { low: 0, medium: 0, high: 0 };
  visibleFindings.forEach((finding) => {
    visibleCounts[finding.severity] += 1;
  });
  result.allFindings = allFindings;
  result.allCounts = result.counts;
  result.findings = visibleFindings;
  result.counts = visibleCounts;

  result.configPath = configPath;
  result.minSeverity = minSeverity;
  result.failOn = failOn;

  const output = options.format === "json"
    ? formatJsonReport(result)
    : formatTextReport(result);

  if (options.output) {
    writeReport(options.output, output);
  } else {
    console.log(output);
  }

  const blocked = result.allFindings.some((finding) =>
    severityGte(finding.severity, failOn)
  );

  return blocked ? 2 : 0;
}

function runGuard(options, commandArgs) {
  const exitCode = runScan(options);
  if (exitCode !== 0) {
    console.error("Clawguard blocked execution due to high-risk findings.");
    process.exit(exitCode);
  }

  if (commandArgs.length === 0) {
    console.error("No command provided for guard mode.");
    process.exit(1);
  }

  const { spawn } = require("child_process");
  const [command, ...args] = commandArgs;
  const child = spawn(command, args, { stdio: "inherit" });
  child.on("exit", (code) => process.exit(code ?? 0));
}

function runShare(options) {
  const pkg = require("../package.json");
  const repoUrl = options.repo
    || (pkg.repository && pkg.repository.url ? pkg.repository.url : pkg.repository);
  const output = buildShareMessage({
    lang: options.lang,
    format: options.format,
    repoUrl,
  });
  console.log(output);
}

async function runUpdate(options) {
  const cwd = process.cwd();
  const result = await checkUpdate({ cwd, repoOverride: options.repo });
  if (options.check) {
    if (result.latest) {
      const comparison = compareVersions(result.current, result.latest.version);
      const updateAvailable = comparison === -1;
      console.log(`Current: ${result.current}`);
      console.log(`Latest: ${result.latest.version} (${result.latest.source})`);
      console.log(`Update available: ${updateAvailable ? "yes" : "no"}`);
      if (result.latest.url) {
        console.log(`More info: ${result.latest.url}`);
      }
    } else {
      console.log(`Current: ${result.current}`);
      console.log("Latest: unavailable");
      if (result.errors.length > 0) {
        console.log(`Errors: ${result.errors.join("; ")}`);
      }
    }
  }

  if (options.apply) {
    const pkg = require("../package.json");
    const method = options.method === "auto" ? undefined : options.method;
    const applied = await applyUpdate({ cwd, method, pkgName: pkg.name });
    console.log(`Update applied via ${applied}.`);
  }
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0 || argv.includes("-h") || argv.includes("--help")) {
    printHelp();
    return;
  }

  const command = argv[0];
  if (command === "scan") {
    const { options } = parseArgs(argv.slice(1));
    const exitCode = runScan(options);
    process.exit(exitCode);
    return;
  }

  if (command === "guard") {
    const guardArgs = argv.slice(1);
    const delimiterIndex = guardArgs.indexOf("--");
    if (delimiterIndex === -1) {
      console.error("Guard mode requires -- before the command to run.");
      process.exit(1);
    }
    const { options } = parseArgs(guardArgs.slice(0, delimiterIndex));
    const commandArgs = guardArgs.slice(delimiterIndex + 1);
    runGuard(options, commandArgs);
    return;
  }

  if (command === "share") {
    const options = parseShareArgs(argv.slice(1));
    runShare(options);
    return;
  }

  if (command === "update") {
    const options = parseUpdateArgs(argv.slice(1));
    await runUpdate(options);
    return;
  }

  if (command === "version" || command === "--version" || command === "-v") {
    const pkg = require("../package.json");
    console.log(pkg.version);
    return;
  }

  console.error(`Unknown command: ${command}`);
  printHelp();
  process.exit(1);
}

module.exports = { main };
