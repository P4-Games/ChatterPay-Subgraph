![](https://img.shields.io/badge/graphql-informational?style=flat&logo=graphql&logoColor=white&color=6aa6f8)

# ChatterPay

Chatterpay is a Wallet for WhatsApp that integrates AI and Account Abstraction, enabling any user to use blockchain easily and securely without technical knowledge.

> Built for: [Level Up Hackathon - Ethereum Argentina 2024](https://ethereumargentina.org/) 

> Build By: [mpefaur](https://github.com/mpefaur), [tomasfrancizco](https://github.com/tomasfrancizco), [TomasDmArg](https://github.com/TomasDmArg), [gonzageraci](https://github.com/gonzageraci),  [dappsar](https://github.com/dappsar)


__Components__:

- Landing Page ([product](https://chatterpay.net), [source code](https://github.com/P4-Games/ChatterPay))
- User Dashboard Website ([product](https://chatterpay.net/dashboard), [source code](https://github.com/P4-Games/ChatterPay))
- Backend API ([source code](https://github.com/P4-Games/ChatterPay-Backend)) 
- Smart Contracts ([source code](https://github.com/P4-Games/ChatterPay-SmartContracts))
- Data Indexing (Subgraph) ([source code](https://github.com/P4-Games/ChatterPay-Subgraph)) (this Repo)
- Bot AI (Chatizalo) ([product](https://chatizalo.com/))
- Bot AI Admin Dashboard Website ([product](https://app.chatizalo.com/))


# About this repo

This repository contains a GraphQL API designed for interacting with Chatterpay's Contracts data.

__Build With__:

- GraphQl Cli: [The Graph CLI](https://www.npmjs.com/package/@graphprotocol/graph-cli)
- Language: [TypeScript](https://www.typescriptlang.org)

# Getting Started

__1. Install these Requirements__:

- [git](https://git-scm.com/)
- [nvm](https://github.com/nvm-sh/nvm) (allows you to quickly install and use different versions of node via the command line.)
- node js & npm (installed with nvm)


__2. Clone repository__:

```bash
   git clone https://github.com/P4-Games/ChatterPay-Subgraph
   cd ChatterPay-Subgraph
```

__3. Install Dependencies__:


```sh
- yarn install # with yarn
- npm i # with npm
```

If you have troubles with dependencies, try this:

```sh
set http_proxy=
set https_proxy=
npm config rm https-proxy
npm config rm proxy
npm config set registry "https://registry.npmjs.org"
yarn cache clean
yarn config delete proxy
yarn --network-timeout 100000
```



