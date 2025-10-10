#!/usr/bin/env ts-node
/**
 * 🛠️ ChatterPay Subgraph Setup Script
 * ----------------------------------
 * Prepara el entorno local completo para The Graph.
 * - Verifica dependencias (Docker, Compose, Graph CLI, libpq)
 * - Levanta los contenedores locales
 * - Genera el subgraph.yaml y schema.graphql
 * - Compila, crea y despliega el subgraph local
 */

import { execSync } from "child_process";
import chalk from "chalk";
import os from "os";
import readline from "readline";

const log = (msg: string) => console.log(chalk.cyan(`→ ${msg}`));
const ok = (msg: string) => console.log(chalk.green(`✔ ${msg}`));
const warn = (msg: string) => console.log(chalk.yellow(`⚠ ${msg}`));
const error = (msg: string) => console.log(chalk.red(`✖ ${msg}`));

function run(command: string, desc?: string) {
  try {
    if (desc) log(desc);
    execSync(command, { stdio: "inherit" });
  } catch (e) {
    error(`Command failed: ${command}`);
    process.exit(1);
  }
}

function checkCommand(cmd: string): boolean {
  try {
    execSync(`command -v ${cmd}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function installLibpq() {
  const platform = os.platform();
  log("Checking PostgreSQL client library (libpq) for Matchstick...");

  try {
    execSync("ldconfig -p | grep libpq.so", { stdio: "ignore" });
    ok("libpq already installed ✅");
    return;
  } catch {
    warn("libpq not found, installing...");
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
        warn("Could not detect package manager. Please install libpq manually.");
      }
    } catch {
      error("Failed to install libpq. Install manually: sudo apt install libpq-dev");
    }
  } else if (platform === "darwin") {
    run("brew install libpq", "Installing libpq via Homebrew...");
  } else {
    warn("Non-Linux platform detected. Please ensure libpq is installed manually.");
  }

  ok("libpq installation step completed ✅");
}

function waitForGraphNode() {
  log("Waiting for Graph Node to be ready on http://localhost:8020 ...");
  const maxAttempts = 25;
  for (let i = 1; i <= maxAttempts; i++) {
    try {
      execSync("curl -s -o /dev/null -w '%{http_code}' http://localhost:8020", {
        stdio: "pipe",
      });
      ok(`Graph Node is responding (attempt ${i}) ✅`);
      return;
    } catch {
      warn(`Graph Node not ready yet (attempt ${i}/${maxAttempts})...`);
      execSync("sleep 3");
    }
  }
  error("Graph Node did not become ready after several attempts.");
  process.exit(1);
}

async function main() {
  console.log(chalk.magenta.bold("\n🚀 Setting up ChatterPay Subgraph local environment\n"));

  // 1️⃣ Ask for network if not provided
  const networkArg = process.argv[2];
  let network = networkArg;
  if (!network) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    network = await new Promise<string>((resolve) => {
      rl.question("🌐 Select network (scroll / scroll-sepolia): ", (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    });
  }

  if (!["scroll", "scroll-sepolia"].includes(network)) {
    error("Invalid network. Must be 'scroll' or 'scroll-sepolia'.");
    process.exit(1);
  }

  // 2️⃣ Check Docker
  if (!checkCommand("docker")) {
    error("Docker is not installed or not in PATH.");
    console.log("Install Docker first: https://docs.docker.com/get-docker/");
    process.exit(1);
  }
  ok("Docker is installed ✅");

  // 3️⃣ Check Compose
  if (!checkCommand("docker-compose") && !checkCommand("docker compose")) {
    error("Docker Compose is not installed.");
    console.log("Install it: https://docs.docker.com/compose/install/");
    process.exit(1);
  }
  ok("Docker Compose is available ✅");

  // 4️⃣ Graph CLI
  if (!checkCommand("graph")) {
    warn("The Graph CLI is missing. Installing globally...");
    run("npm install -g @graphprotocol/graph-cli", "Installing @graphprotocol/graph-cli...");
  } else {
    ok("Graph CLI found ✅");
  }

  // 5️⃣ libpq
  installLibpq();

  // 6️⃣ Start Docker containers
  run("docker compose up -d", "Starting local Graph Node stack (Postgres, IPFS, Graph Node)...");

  // 7️⃣ Wait for readiness
  waitForGraphNode();

  // 8️⃣ Generate subgraph.yaml
  run(`node scripts/generate-subgraph.js ${network}`, `Generating subgraph.yaml for ${network}...`);

  // 9️⃣ Codegen
  run("graph codegen", "Running graph codegen...");

  // 🔟 Build
  run("graph build", "Building subgraph...");

  // 1️⃣1️⃣ Create if not exists
  try {
    run("graph create --node http://localhost:8020 chatterpay-subgraph", "Creating local subgraph...");
  } catch {
    warn("Subgraph already exists, skipping creation.");
  }

  // 1️⃣2️⃣ Deploy
  const version = `v${new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 8)}`;
  run(
    `graph deploy chatterpay-subgraph --node http://localhost:8020 --ipfs http://localhost:5001 --version-label ${version}`,
    `Deploying subgraph to local Graph Node (${network}, version ${version})...`
  );

  ok("Subgraph deployed successfully!");
  console.log(chalk.magentaBright("\n🌐 Open your GraphQL playground at:"));
  console.log(chalk.bold("   http://localhost:8000/subgraphs/name/chatterpay-subgraph/graphql\n"));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
