const fs = require("fs");
const path = require("path");
const { RULES } = require("./rules");

const DEFAULT_IGNORE_DIRS = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".cache",
]);

const DEFAULT_EXTENSIONS = new Set([
  ".js",
  ".cjs",
  ".mjs",
  ".ts",
  ".json",
  ".yml",
  ".yaml",
  ".md",
]);

const MAX_FILE_SIZE_BYTES = 1024 * 1024; // 1 MB

function shouldIgnorePath(filePath, ignorePatterns) {
  return ignorePatterns.some((pattern) => filePath.includes(pattern));
}

function walkDir(rootDir, ignorePatterns, files) {
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    if (shouldIgnorePath(fullPath, ignorePatterns)) continue;

    if (entry.isDirectory()) {
      if (DEFAULT_IGNORE_DIRS.has(entry.name)) continue;
      walkDir(fullPath, ignorePatterns, files);
      continue;
    }

    if (entry.isSymbolicLink()) continue;

    const ext = path.extname(entry.name).toLowerCase();
    if (!DEFAULT_EXTENSIONS.has(ext)) continue;
    files.push(fullPath);
  }
}

function scanFile(filePath, rules, disabledRules) {
  const findings = [];
  let contents;
  try {
    const stats = fs.statSync(filePath);
    if (stats.size > MAX_FILE_SIZE_BYTES) {
      return { findings, skipped: true, reason: "file too large" };
    }
    contents = fs.readFileSync(filePath, "utf8");
  } catch (error) {
    return { findings, skipped: true, reason: error.message };
  }

  const lines = contents.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const rule of rules) {
      if (disabledRules.has(rule.id)) continue;
      if (!rule.regex.test(line)) continue;
      findings.push({
        filePath,
        line: index + 1,
        ruleId: rule.id,
        severity: rule.severity,
        description: rule.description,
        snippet: line.trim().slice(0, 200),
      });
    }
  });

  return { findings, skipped: false };
}

function scanPaths({
  paths,
  ignorePatterns,
  rules = RULES,
  disabledRules = [],
}) {
  const findings = [];
  const files = [];
  const skipped = [];
  const errors = [];
  const disabledSet = new Set(disabledRules);

  for (const rootDir of paths) {
    if (!fs.existsSync(rootDir)) {
      errors.push({ path: rootDir, error: "path does not exist" });
      continue;
    }
    const stat = fs.statSync(rootDir);
    if (stat.isFile()) {
      files.push(rootDir);
      continue;
    }
    if (stat.isDirectory()) {
      walkDir(rootDir, ignorePatterns, files);
    }
  }

  for (const filePath of files) {
    const result = scanFile(filePath, rules, disabledSet);
    if (result.skipped) {
      skipped.push({ filePath, reason: result.reason });
      continue;
    }
    findings.push(...result.findings);
  }

  const counts = { low: 0, medium: 0, high: 0 };
  findings.forEach((finding) => {
    counts[finding.severity] += 1;
  });

  return {
    findings,
    counts,
    filesScanned: files.length,
    pathsScanned: paths,
    skipped,
    errors,
  };
}

module.exports = {
  scanPaths,
};
