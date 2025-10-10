#!/usr/bin/env node
import fs from "fs";
import path from "path";

const [,, networkArg] = process.argv;
if (!networkArg) {
  console.error("❌ Missing network name. Usage: node scripts/generate-subgraph.js scroll-sepolia");
  process.exit(1);
}

const networksPath = path.resolve("networks.json");
const templatePath = path.resolve("subgraph.template.yaml");
const outputPath = path.resolve("subgraph.yaml");

const networks = JSON.parse(fs.readFileSync(networksPath, "utf8"));
const cfg = networks[networkArg];

if (!cfg) {
  console.error(`❌ Network "${networkArg}" not found in networks.json`);
  process.exit(1);
}

let yaml = fs.readFileSync(templatePath, "utf8");

yaml = yaml
  .replace(/{{NETWORK}}/g, networkArg)
  .replace(/{{START_BLOCK}}/g, cfg.startBlock)
  .replace(/{{FACTORY_ADDRESS}}/g, cfg.contracts.factoryAddress)
  .replace(/{{USDT_ADDRESS}}/g, cfg.tokens.usdt);

fs.writeFileSync(outputPath, yaml);

console.log(`✅ Generated subgraph.yaml for network: ${networkArg}`);
console.log(`→ ${outputPath}`);
