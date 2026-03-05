const RULES = [
  {
    id: "EXEC_SYNC",
    severity: "high",
    description: "execSync can run arbitrary shell commands",
    regex: /\bexecSync\s*\(/,
  },
  {
    id: "EXEC",
    severity: "high",
    description: "exec can run arbitrary shell commands",
    regex: /\bexec\s*\(/,
  },
  {
    id: "SPAWN",
    severity: "medium",
    description: "spawn can start external processes",
    regex: /\bspawn\s*\(/,
  },
  {
    id: "CHILD_PROCESS",
    severity: "medium",
    description: "child_process usage detected",
    regex: /(require\(['"]child_process['"]\)|from\s+['"]child_process['"]|\bchild_process\b)/,
  },
  {
    id: "EVAL",
    severity: "high",
    description: "eval executes dynamic code",
    regex: /\beval\s*\(/,
  },
  {
    id: "FUNCTION_CTOR",
    severity: "high",
    description: "Function constructor executes dynamic code",
    regex: /\bnew\s+Function\s*\(/,
  },
  {
    id: "VM_RUN",
    severity: "high",
    description: "vm.run* can execute untrusted code",
    regex: /\bvm\.(runInNewContext|runInContext|runInThisContext)\b/,
  },
  {
    id: "CURL_PIPE",
    severity: "high",
    description: "curl piped to shell",
    regex: /\bcurl\b[^\n]*\|\s*(sh|bash)\b/,
  },
  {
    id: "WGET_PIPE",
    severity: "high",
    description: "wget piped to shell",
    regex: /\bwget\b[^\n]*\|\s*(sh|bash)\b/,
  },
  {
    id: "SENSITIVE_PATH",
    severity: "high",
    description: "access to sensitive system paths",
    regex: /\/etc\/(passwd|shadow)|\.ssh\/|id_(rsa|ed25519)/,
  },
  {
    id: "RAW_SOCKET",
    severity: "medium",
    description: "raw network/socket usage detected",
    regex: /(require\(['"](net|dgram)['"]\)|from\s+['"](net|dgram)['"]|\bnet\.\w+\b|\bdgram\.\w+\b)/,
  },
  {
    id: "SECRET_ENV",
    severity: "medium",
    description: "references common secret environment names",
    regex: /\b(OPENAI_API_KEY|ANTHROPIC_API_KEY|AWS_SECRET_ACCESS_KEY|GITHUB_TOKEN|SLACK_TOKEN)\b/,
  },
  {
    id: "BASE64_EVAL",
    severity: "high",
    description: "base64 decode + eval style patterns",
    regex: /eval\s*\(.*(base64|atob|Buffer\.from).*(\)|;)/,
  },
];

module.exports = {
  RULES,
};
