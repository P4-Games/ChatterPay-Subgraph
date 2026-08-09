#!/usr/bin/env ts-node
/**
 * 💀 ChatterPay Subgraph Setup Script (Clean Mode)
 * ------------------------------------------------
 * Completely resets and rebuilds the local Graph environment.
 * - Stops and removes all Docker containers
 * - Cleans up volumes and networks
 * - Checks for required dependencies
 * - Starts local Graph Node stack
 * - Waits for Graph Node and IPFS to be ready
 * - Generates subgraph.yaml
 * - Builds and deploys the subgraph locally
 */

import { execSync } from "child_process";
import chalk from "chalk";
import os from "os";
import readline from "readline";

const log = (msg: string) => console.log(chalk.cyan(`→ ${msg}`));
const ok = (msg: string) => console.log(chalk.green(`✔ ${msg}`));
const warn = (msg: string) => console.log(chalk.yellow(`⚠ ${msg}`));
const fail = (msg: string) => console.log(chalk.red(`✖ ${msg}`));

function run(command: string, desc?: string) {
  try {
    if (desc) log(desc);
    execSync(command, { stdio: "inherit" });
  } catch {
    fail(`Command failed: ${command}`);
    process.exit(1);
  }
}

function checkCommand(cmd: string): boolean {
  try {
    const isWindows = os.platform() === "win32";
    const checkCmd = isWindows ? `where ${cmd}` : `command -v ${cmd}`;
    execSync(checkCmd, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/**
 * 💣 Stop and remove everything Docker-related
 */
function nukeDocker() {
  log("Stopping and removing all Docker containers...");
  try {
    const isWindows = os.platform() === "win32";
    if (isWindows) {
      // Windows PowerShell commands
      try {
        execSync('docker ps -q | ForEach-Object { docker stop $_ }', { stdio: "ignore", shell: "powershell.exe" });
      } catch { }
      try {
        execSync('docker ps -aq | ForEach-Object { docker rm -f $_ }', { stdio: "ignore", shell: "powershell.exe" });
      } catch { }
    } else {
      // Unix commands
      execSync("docker ps -q | xargs -r docker stop", { stdio: "ignore" });
      execSync("docker ps -aq | xargs -r docker rm -f", { stdio: "ignore" });
    }
    execSync("docker volume prune -f", { stdio: "ignore" });
    execSync("docker network prune -f", { stdio: "ignore" });
    ok("All Docker containers, volumes, and networks removed ✅");
  } catch {
    warn("Failed to completely clean Docker environment, continuing anyway...");
  }
}

/**
 * Install libpq if missing (required by Matchstick)
 */
function installLibpq() {
  const platform = os.platform();

  if (platform === "win32") {
    warn("Windows detected - libpq installation skipped (not required on Windows)");
    return;
  }

  log("Checking PostgreSQL client library (libpq) for Matchstick...");

  try {
    execSync("ldconfig -p | grep libpq.so", { stdio: "ignore" });
    ok("libpq already installed ✅");
    return;
  } catch {
    warn("libpq not found, attempting installation...");
  }

  if (platform === "linux") {
    try {
      if (checkCommand("apt-get")) {
        run("sudo apt-get update && sudo apt-get install -y libpq-dev", "Installing libpq-dev via apt...");
      } else if (checkCommand("dnf")) {
        run("sudo dnf install -y postgresql-libs", "Installing PostgreSQL libs via dnf...");
      } else if (checkCommand("pacman")) {
        run("sudo pacman -S --noconfirm postgresql-libs", "Installing PostgreSQL libs via pacman...");
      } else {
        warn("No supported package manager detected. Install libpq manually.");
      }
    } catch {
      fail("Failed to install libpq. Run manually: sudo apt install libpq-dev");
    }
  } else if (platform === "darwin") {
    run("brew install libpq", "Installing libpq via Homebrew...");
  } else {
    warn("Unsupported OS. Please install libpq manually.");
  }

  ok("libpq installation step completed ✅");
}

/**
 * Wait until a service is reachable
 */
function waitForService(name: string, url: string, successMsg: string) {
  log(`Waiting for ${name} to respond on ${url} ...`);
  const maxAttempts = 25;
  const isWindows = os.platform() === "win32";

  for (let i = 1; i <= maxAttempts; i++) {
    try {
      const curlCmd = isWindows
        ? `curl -s -o nul -w "%{http_code}" ${url}`
        : `curl -s -o /dev/null -w '%{http_code}' ${url}`;
      execSync(curlCmd, { stdio: "pipe" });
      ok(`${successMsg} (attempt ${i}) ✅`);
      return;
    } catch {
      warn(`${name} not ready yet (${i}/${maxAttempts})...`);
      const sleepCmd = isWindows ? "timeout /t 3 /nobreak >nul" : "sleep 3";
      try {
        execSync(sleepCmd, { stdio: "ignore" });
      } catch { }
    }
  }

  fail(`${name} did not become ready after several attempts.`);
  process.exit(1);
}

/**
 * Main setup process
 */
async function main() {
  console.log(chalk.magenta.bold("\n🚀 Setting up ChatterPay Subgraph (Clean Environment)\n"));

  // 0️⃣ Kill all containers first
  nukeDocker();

  // 1️⃣ Ask for network
  const networkArg = process.argv[2];
  let network = networkArg;
  if (!network) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    network = await new Promise<string>((resolve) => {
      rl.question("🌐 Select network (scroll / scroll-sepolia / arbitrum-sepolia): ", (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    });
  }

  if (!["scroll", "scroll-sepolia", "arbitrum-sepolia"].includes(network)) {
    fail("Invalid network. Must be 'scroll', 'scroll-sepolia' or 'arbitrum-sepolia'.");
    process.exit(1);
  }

  // 2️⃣ Docker
  if (!checkCommand("docker")) {
    fail("Docker is not installed or missing from PATH.");
    console.log("Install Docker: https://docs.docker.com/get-docker/");
    process.exit(1);
  }
  ok("Docker found ✅");

  // 3️⃣ Docker Compose
  const hasDockerCompose = checkCommand("docker-compose");
  const hasDockerComposeV2 = checkCommand("docker") && (() => {
    try {
      execSync("docker compose version", { stdio: "ignore" });
      return true;
    } catch {
      return false;
    }
  })();

  if (!hasDockerCompose && !hasDockerComposeV2) {
    fail("Docker Compose not found.");
    console.log("Install: https://docs.docker.com/compose/install/");
    process.exit(1);
  }
  ok("Docker Compose available ✅");

  // 4️⃣ Graph CLI
  if (!checkCommand("graph")) {
    warn("The Graph CLI is missing. Installing globally...");
    run("npm install -g @graphprotocol/graph-cli", "Installing @graphprotocol/graph-cli...");
  } else {
    ok("Graph CLI found ✅");
  }

  // 5️⃣ libpq
  installLibpq();

  // 6️⃣ Start containers
  run("docker compose up -d", "Starting local Graph Node stack (Postgres, IPFS, Graph Node)...");

  // 7️⃣ Wait for Graph Node and IPFS
  waitForService("Graph Node", "http://localhost:8020", "Graph Node is ready");
  waitForService("IPFS", "http://localhost:5001/api/v0/version", "IPFS is ready");

  // 8️⃣ Generate subgraph.yaml
  run(`ts-node scripts/generate-subgraph.ts ${network}`, `Generating subgraph.yaml for ${network}...`);

  // 9️⃣ Codegen
  run("graph codegen", "Running graph codegen...");

  // 🔟 Build
  run("graph build", "Building subgraph...");

  // 1️⃣1️⃣ Create (ignore if already exists)
  try {
    run("graph create --node http://localhost:8020 chatterpay-subgraph", "Creating local subgraph...");
  } catch {
    warn("Subgraph already exists, skipping creation.");
  }

  // 1️⃣2️⃣ Deploy
  const version = `v${new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 8)}`;
  const ipfsHost = process.env.IPFS_HOST ?? "http://localhost:5001";
  run(
    `graph deploy chatterpay-subgraph --node http://localhost:8020 --ipfs ${ipfsHost} --version-label ${version}`,
    `Deploying subgraph (${network}, version ${version})...`
  );

  ok("Subgraph deployed successfully!");
  console.log(chalk.magentaBright("\n🌐 GraphQL Playground available at:"));
  console.log(chalk.bold("   http://localhost:8000/subgraphs/name/chatterpay-subgraph/graphql\n"));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
