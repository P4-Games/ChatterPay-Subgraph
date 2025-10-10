#!/usr/bin/env node
/**
 * @file generate-subgraph.ts
 * @description Generates the subgraph.yaml file from a template and networks.json configuration.
 */

import fs from "fs";
import path from "path";
import readline from "readline";

/**
 * Prompt user to select a network interactively
 */
async function askNetwork(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question("🌐 Select network (scroll / scroll-sepolia): ", (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * Generate subgraph.yaml file from template and network config
 */
(async () => {
  let networkArg: string | undefined = process.argv[2];

  // Ask interactively if not provided
  if (!networkArg) {
    networkArg = await askNetwork();
  }

  // Validate network name
  const validNetworks = ["scroll", "scroll-sepolia"];
  if (!validNetworks.includes(networkArg)) {
    console.error("❌ Invalid network. Must be 'scroll' or 'scroll-sepolia'.");
    process.exit(1);
  }

  const cwd = process.cwd();
  const networksPath = path.join(cwd, "networks.json");
  const templatePath = path.join(cwd, "subgraph.template.yaml");
  const outputPath = path.join(cwd, "subgraph.yaml");

  if (!fs.existsSync(networksPath)) {
    console.error(`❌ networks.json not found at ${networksPath}`);
    process.exit(1);
  }
  if (!fs.existsSync(templatePath)) {
    console.error(`❌ subgraph.template.yaml not found at ${templatePath}`);
    process.exit(1);
  }

  // Define interfaces for networks.json structure
  interface NetworkConfig {
    startBlock: number;
    contracts: {
      factoryAddress: string;
    };
    tokens: {
      usdt: string;
      weth: string;
    };
  }

  interface NetworksFile {
    [key: string]: NetworkConfig;
  }

  const networks: NetworksFile = JSON.parse(fs.readFileSync(networksPath, "utf8"));
  const cfg = networks[networkArg];

  if (!cfg) {
    console.error(`❌ Network "${networkArg}" not found in networks.json`);
    process.exit(1);
  }

  const START_BLOCK = String(cfg.startBlock);
  const FACTORY_ADDRESS = cfg.contracts.factoryAddress;
  const USDT_ADDRESS = cfg.tokens.usdt;
  const WETH_ADDRESS = cfg.tokens.weth;

  let yaml = fs.readFileSync(templatePath, "utf8");

  yaml = yaml
    .replace(/{{NETWORK}}/g, networkArg)
    .replace(/{{START_BLOCK}}/g, START_BLOCK)
    .replace(/{{FACTORY_ADDRESS}}/g, FACTORY_ADDRESS)
    .replace(/{{USDT_ADDRESS}}/g, USDT_ADDRESS)
    .replace(/{{WETH_ADDRESS}}/g, WETH_ADDRESS);

  fs.writeFileSync(outputPath, yaml, "utf8");
  console.log(`✅ Generated subgraph.yaml for network: ${networkArg}`);
  console.log(`→ ${outputPath}`);

  // Sanity check for ABI paths
  const abiPaths = [
    "./abis/ChatterPayWalletFactory.sol/ChatterPayWalletFactory.json",
    "./abis/ERC20.sol/ERC20.json",
  ];

  for (const p of abiPaths) {
    const fullPath = path.join(cwd, p);
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️ ABI not found: ${p}`);
    }
  }
})();
