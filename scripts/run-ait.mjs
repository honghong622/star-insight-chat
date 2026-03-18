import { spawn } from "node:child_process";
import { rm, writeFile } from "node:fs/promises";
import path from "node:path";

const mode = process.argv[2];

if (!mode || !["build", "dev"].includes(mode)) {
  console.error("Usage: node scripts/run-ait.mjs <build|dev>");
  process.exit(1);
}

const projectRoot = process.cwd();
const compatibilityConfigPath = path.join(projectRoot, "granite.config.js");
const compatibilityConfigSource = "export { default } from './ait.web.config.js';\n";

let childProcess;

const forwardSignal = (signal) => {
  if (childProcess && !childProcess.killed) {
    childProcess.kill(signal);
  }
};

process.on("SIGINT", forwardSignal);
process.on("SIGTERM", forwardSignal);

try {
  await writeFile(compatibilityConfigPath, compatibilityConfigSource, "utf8");

  const executable = process.platform === "win32" ? "npx.cmd" : "npx";
  childProcess = spawn(executable, ["ait", mode], {
    cwd: projectRoot,
    stdio: "inherit",
  });

  const exitCode = await new Promise((resolve) => {
    childProcess.on("close", (code) => resolve(code ?? 1));
    childProcess.on("error", () => resolve(1));
  });

  process.exitCode = Number(exitCode);
} finally {
  await rm(compatibilityConfigPath, { force: true });
}
