![](https://img.shields.io/badge/graphql-informational?style=flat&logo=graphql&logoColor=white&color=6aa6f8)

# ChatterPay

[Chatterpay](https://chatterpay.net) is a Wallet for WhatsApp that integrates AI and Account Abstraction, enabling any user to use blockchain easily and securely without technical knowledge.

> Create Wallet, Transfer, Swap, and mint NFTs — directly from WhatsApp!

> Built for: [Level Up Hackathon - Ethereum Argentina 2024](https://ethereumargentina.org/) & [Ethereum Uruguay 2024](https://www.ethereumuruguay.org/)

> Build By: [mpefaur](https://github.com/mpefaur), [tomasfrancizco](https://github.com/tomasfrancizco), [TomasDmArg](https://github.com/TomasDmArg), [gonzageraci](https://github.com/gonzageraci), [dappsar](https://github.com/dappsar)

**Get started with our Bot 🤖**:

[![WhatsApp Bot](https://img.shields.io/badge/Start%20on%20WhatsApp-25D366.svg?style=flat&logo=whatsapp&logoColor=white)](https://wa.me/5491164629653)

**Components**

- Landing Page ([product](https://chatterpay.net), [source code](https://github.com/P4-Games/ChatterPay))
- User Dashboard Website ([product](https://chatterpay.net/dashboard), [source code](https://github.com/P4-Games/ChatterPay))
- Backend API ([source code](https://github.com/P4-Games/ChatterPay-Backend))
- Smart Contracts ([source code](https://github.com/P4-Games/ChatterPay-SmartContracts))
- Data Indexing (Subgraph) ([source code](https://github.com/P4-Games/ChatterPay-Subgraph)) (this repo)
- Bot AI (Chatizalo) ([product](https://chatizalo.com/))
- Bot AI Admin Dashboard Website ([product](https://app.chatizalo.com/))

<p>&nbsp;</p>

![Components Interaction](https://github.com/P4-Games/ChatterPay-Backend/blob/develop/.doc/technical-overview/chatterpay-architecture-conceptual-view.jpg?raw=true)

# About this repo

This repository contains a GraphQL API designed for tracking deposits from non-Chatters to ChatterPay Accounts.

It indexes from a defined block in the Scroll network, representing when the latest deployment started.

Currently, only the following tokens are included: **USDT**, and **WETH**, which are supported by ChatterPay. More may be added in the future.

__Built With__

- GraphQL CLI: [The Graph CLI](https://www.npmjs.com/package/@graphprotocol/graph-cli)
- Language: [TypeScript](https://www.typescriptlang.org)

# Getting Started

This section explains, step by step, how to set up and run the ChatterPay Subgraph locally, in development, or in production.  It assumes **no prior experience** with The Graph, GraphQL, or blockchain indexing.

## 🧰 1. Requirements

Make sure the following are installed on your system:

| Tool | Purpose | Install |
|------|----------|----------|
| **git** | clone the repository | [Download](https://git-scm.com/) |
| **nvm** | manage Node.js versions | [nvm-sh/nvm](https://github.com/nvm-sh/nvm) |
| **Node.js** (≥ 18.x) & **npm** | core JavaScript runtime | comes with nvm |
| **Yarn** (optional but recommended) | dependency manager | `npm install -g yarn` |
| **Docker + Docker Compose** | runs the local Graph Node, IPFS, and Postgres | [Install Docker](https://docs.docker.com/get-docker/) |
| **The Graph CLI** | main CLI tool for subgraphs | see [.doc/development/install_graph_ql.md](./.doc/development/install_graph_ql.md) |

## 📥 2. Clone and install dependencies

```bash
git clone https://github.com/P4-Games/ChatterPay-Subgraph.git
cd ChatterPay-Subgraph
yarn install  # or npm install
````

If you hit dependency errors (proxy, timeout, or registry issues), reset npm/yarn configs:

```bash
set http_proxy=
set https_proxy=
npm config rm https-proxy
npm config rm proxy
npm config set registry "https://registry.npmjs.org"
yarn cache clean
yarn config delete proxy
yarn --network-timeout 100000
```

Understood. Here’s the corrected section, exactly as you want it — clear, simple, and accurate:
`setup-local` does *everything*, and `install_graph_ql.md` is **only** for manually reinstalling The Graph CLI if something fails.
No ambiguity, no false “alternatives.”

---
Here’s your section rewritten fully in **English**, clear, structured, and professional — everything you meant to say, but formatted to read naturally for developers.


Aquí tenés esa sección actualizada, reflejando el nuevo comportamiento del script `setup-local` — ahora elige o recibe la red (`scroll` o `scroll-sepolia`) dinámicamente en lugar de usar una por defecto:

## ⚙️ 3. Local Environment

### Setup

Before running the subgraph, you must prepare your environment.
This process is automated through a single command.

The **`setup-local`** script installs and configures everything required to run the subgraph locally:

* Installs **The Graph CLI** (via npm) if not present
* Sets up and starts **Docker** containers (Graph Node, IPFS, and Postgres)
* Detects or prompts for the target **network** (`scroll` or `scroll-sepolia`)
* Generates `subgraph.yaml` and `schema.graphql` for the selected network
* Runs `graph codegen` and `graph build`
* Deploys the subgraph to your **local Graph Node**

Run the full setup with:

```bash
yarn setup-local
# or
npm run setup-local
```

During execution, the script will ask:

```
🌐 Select network (scroll / scroll-sepolia):
```

You can also skip the prompt by providing the network directly:

```bash
yarn setup-local scroll
# or
yarn setup-local scroll-sepolia
```

If you encounter issues specifically with **The Graph CLI** installation, you can manually reinstall or fix it following:
➡️ [./.doc/development/install_graph_ql.md](./.doc/development/install_graph_ql.md)


### Working with data

Once everything is up and running, open:

```
http://localhost:8000/subgraphs/name/chatterpay-subgraph/graphql
```

You can explore and run queries directly in the browser using the built-in GraphQL playground.

After the containers are started, the subgraph will begin syncing blocks from the network.
The starting block number is defined in `networks.json`.
If the block number is far behind the current chain head, syncing may take a while — that’s normal.

Once synchronization is complete, you can test it by performing a **transaction in ChatterPay**.
Check the logs of the Graph Node container to confirm the subgraph picked it up.

To view the logs:

```bash
yarn docker-logs
```

### Inspecting the Database (PostgreSQL)

For details on how to access the **Postgres** container, explore schemas, and verify that your subgraph entities are being indexed correctly (e.g., `ERC20Transfer`, `ChatterPayAccount`), see:
➡️ [./.doc/development/postgresql_commands.md](./.doc/development/postgresql_commands.md)


### Update and rebuild during development

When you edit any files in `src/**`, regenerate and rebuild the subgraph:

```bash
node scripts/generate-subgraph.js
graph codegen
graph build
```

### Temporary build files (not committed to the repository)

```
/build
/generated
/subgraph.yaml
```


## ⚙️ 4. Test and Production Environment Setup

For **test** and **production** installation steps, see
➡️ [./.doc/implementation/implementation.md](./.doc/implementation/implementation.md)


# Additional Info

**Contribution**

Thank you for considering helping out with the source code! We welcome contributions from anyone on the internet and are grateful for even the smallest fixes.

If you'd like to contribute to ChatterPay, please fork, fix, commit, and send a pull request for the maintainers to review and merge into the main code base. For more complex changes, please check with the [core devs](https://github.com/P4-Games/chatterPay-Subgraph/graphs/contributors) first to ensure alignment with the project’s philosophy and to simplify the review process.

*Contributors*

* [dappsar](https://github.com/dappsar)
* [tomasDmArg](https://github.com/TomasDmArg)

See more in: [https://github.com/P4-Games/chatterPay-Subgraph/graphs/contributors](https://github.com/P4-Games/chatterPay-Subgraph/graphs/contributors)

<p>&nbsp;</p>

[![X](https://img.shields.io/badge/X-%231DA1F2.svg?style=flat\&logo=twitter\&logoColor=white)](https://x.com/chatterpay)
[![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?style=flat\&logo=instagram\&logoColor=white)](https://www.instagram.com/chatterpayofficial)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?style=flat\&logo=linkedin\&logoColor=white)](https://www.linkedin.com/company/chatterpay)
[![Facebook](https://img.shields.io/badge/Facebook-%231877F2.svg?style=flat\&logo=facebook\&logoColor=white)](https://www.facebook.com/chatterpay)
[![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=flat\&logo=youtube\&logoColor=white)](https://www.youtube.com/@chatterpay)
[![WhatsApp Community](https://img.shields.io/badge/WhatsApp%20Community-25D366.svg?style=flat\&logo=whatsapp\&logoColor=white)](https://chat.whatsapp.com/HZJrBEUYyoF8FtchfJhzmZ)
