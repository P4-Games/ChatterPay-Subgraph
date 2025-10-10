#!/usr/bin/env node
/**
 * @file generate-subgraph.ts
 * @description Generates the subgraph.yaml file directly from code and networks.json configuration.
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
  const outputPath = path.join(cwd, "subgraph.yaml");

  if (!fs.existsSync(networksPath)) {
    console.error(`❌ networks.json not found at ${networksPath}`);
    process.exit(1);
  }

  // Define interfaces for networks.json structure
  interface NetworkConfig {
    startBlock: number;
    contracts: {
      factoryAddress?: string;
      factoryAddresses?: string[];
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
  const USDT_ADDRESS = cfg.tokens.usdt;
  const WETH_ADDRESS = cfg.tokens.weth;

  // Normalize factory addresses to an array
  const factoryAddresses: string[] = Array.isArray(cfg.contracts.factoryAddresses)
    ? cfg.contracts.factoryAddresses
    : cfg.contracts.factoryAddress
    ? [cfg.contracts.factoryAddress]
    : [];

  if (factoryAddresses.length === 0) {
    console.error("❌ No factoryAddress or factoryAddresses found in networks.json");
    process.exit(1);
  }

  // ============================================================
  // Generate factory dataSources
  // ============================================================
  const factorySources = factoryAddresses
    .map(
      (addr, idx) => `
  # ============================================================
  # ChatterPay Wallet Factory ${idx}
  # ============================================================
  - kind: ethereum/contract
    name: ChatterPayWalletFactory_${idx}
    network: ${networkArg}
    source:
      address: "${addr}"
      abi: ChatterPayWalletFactory
      startBlock: ${START_BLOCK}
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      entities:
        - ChatterPayAccount
        - ProxyCreated
        - NewImplementation
        - DefaultTokensUpdated
      abis:
        - name: ChatterPayWalletFactory
          file: ./abis/ChatterPayWalletFactory.sol/ChatterPayWalletFactory.json
      eventHandlers:
        - event: ProxyCreated(indexed address,indexed address)
          handler: handleProxyCreated
        - event: NewImplementation(indexed address)
          handler: handleNewImplementation
        - event: DefaultTokensUpdated(address[],address[])
          handler: handleDefaultTokensUpdated
      file: ./src/chatterpay.ts
`
    )
    .join("\n");

  // ============================================================
  // Compose full subgraph.yaml
  // ============================================================
  const yaml = `specVersion: 0.0.4
schema:
  file: ./schema.graphql

dataSources:
${factorySources}

  # ============================================================
  # USDT ERC20
  # ============================================================
  - kind: ethereum/contract
    name: USDT
    network: ${networkArg}
    source:
      address: "${USDT_ADDRESS}"
      abi: ERC20
      startBlock: ${START_BLOCK}
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      entities:
        - ChatterPayTransfer
        - USDTApproval
      abis:
        - name: ERC20
          file: ./abis/ERC20.sol/ERC20.json
        - name: ChatterPayWalletFactory
          file: ./abis/ChatterPayWalletFactory.sol/ChatterPayWalletFactory.json
      eventHandlers:
        - event: Transfer(indexed address,indexed address,uint256)
          handler: handleUSDTTransfer
        - event: Approval(indexed address,indexed address,uint256)
          handler: handleUSDTApproval
      file: ./src/chatterpay.ts

  # ============================================================
  # WETH ERC20
  # ============================================================
  - kind: ethereum/contract
    name: WETH
    network: ${networkArg}
    source:
      address: "${WETH_ADDRESS}"
      abi: ERC20
      startBlock: ${START_BLOCK}
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      entities:
        - ChatterPayTransfer
        - WETHApproval
      abis:
        - name: ERC20
          file: ./abis/ERC20.sol/ERC20.json
        - name: ChatterPayWalletFactory
          file: ./abis/ChatterPayWalletFactory.sol/ChatterPayWalletFactory.json
      eventHandlers:
        - event: Transfer(indexed address,indexed address,uint256)
          handler: handleWETHTransfer
        - event: Approval(indexed address,indexed address,uint256)
          handler: handleWETHApproval
      file: ./src/chatterpay.ts
`;

  // ============================================================
  // Write output
  // ============================================================
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
