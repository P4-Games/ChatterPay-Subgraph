# Implementation (Test and Production)

## Test Environment (Scroll Sepolia)

Use this environment to test your deployment in **The Graph Studio** before going live.

1. Review your **network configuration** in `networks.json`.
   This file only defines metadata for each supported network — such as:

   * RPC endpoint (optional)
   * `startBlock` (initial block height to start indexing)
   * Contract addresses (factory, main contract)
   * Token addresses (e.g., USDT, WETH)

   ⚙️ These values are **not used directly** during deployment.
   The script `generate-subgraph.js` reads them to produce a final `subgraph.yaml` for the selected network (`scroll` or `scroll-sepolia`).

2. Obtain a **Deploy Key** from your subgraph dashboard at
   [https://thegraph.com/studio/](https://thegraph.com/studio/)

3. Authenticate with your deploy key:

```bash
graph auth <YOUR_DEPLOY_KEY>
```

> This stores your token locally and is valid for both test and production deploys.

4. Deploy your subgraph to **Graph Studio**:

```bash
graph deploy <YOUR_SUBGRAPH_SLUG>
# Example: graph deploy chatterpay-scroll-sepolia
```

5. Verify your subgraph indexing status in
   [https://thegraph.com/studio/](https://thegraph.com/studio/)

6. Take note of your GraphQL query endpoint — you’ll use it to connect your dApp, backend, or testing tools.

Example: 
https://api.studio.thegraph.com/query/86507/chatterpay-scroll-sepolia/version/latest


7. Tests queries in subgraph studio

```js
{
  chatterPayTransfers(first: 5, orderBy: blockTimestamp, orderDirection: desc) {
    id
    from
    to
    value
    token
    blockNumber
    blockTimestamp
    transactionHash
  }

}
```

## Production Environment (Scroll Mainnet)

For the live deployment powering **ChatterPay** in production.

1. Confirm that `networks.json` includes **Scroll Mainnet** parameters:

   * Correct contract addresses
   * `chainId: 534352`
   * A valid `startBlock` matching your production deployment

2. Regenerate and rebuild the subgraph for the production network:

```bash
node scripts/generate-subgraph.js scroll
graph codegen
graph build
```

This command automatically creates a new `subgraph.yaml` reflecting the Scroll Mainnet configuration.

3. Authenticate (only once per environment):

```bash
graph auth <YOUR_PRODUCTION_DEPLOY_KEY>
```

4. Deploy to **Graph Studio**:

```bash
graph deploy chatterpay-subgraph \
  --node https://api.thegraph.com/deploy/ \
  --deploy-key <YOUR_PRODUCTION_DEPLOY_KEY>
```

5. Monitor indexing progress and sync status in
   [The Graph Studio Dashboard](https://thegraph.com/studio/)



## 🔄 Maintenance & Updates

| Change Type                                     | Required Action                                                                              |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Smart Contract Redeployed**                   | Update ABI and contract address in `/abis` and `networks.json`, then rebuild and redeploy.   |
| **New Token Added**                             | Add the token’s address to `networks.json`, regenerate and rebuild the subgraph.             |
| **Mapping Logic Changed (`src/chatterpay.ts`)** | Run `generate-subgraph.js`, `graph codegen`, and `graph build`.                              |
| **Environment Change (Sepolia → Mainnet)**      | Regenerate the subgraph with the correct network: `node scripts/generate-subgraph.js scroll` |

---

### ✅ Summary

* `networks.json` only **defines contract and token configurations** for each network.
* `generate-subgraph.js` uses it to **create the final `subgraph.yaml`** according to the selected network.
* The file `subgraph.yaml` is what actually gets deployed to **The Graph Studio** and determines which chain is indexed.
