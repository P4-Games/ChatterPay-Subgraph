![](https://img.shields.io/badge/graphql-informational?style=flat&logo=graphql&logoColor=white&color=6aa6f8)

# ChatterPay

[Chatterpay](https://chatterpay.net) is a Wallet for WhatsApp that integrates AI and Account Abstraction, enabling any user to use blockchain easily and securely without technical knowledge.

> Create Wallet, Transfer, Swap, and mint NFTs — directly from WhatsApp!

> Built for: [Level Up Hackathon - Ethereum Argentina 2024](https://ethereumargentina.org/) & [Ethereum Uruguay 2024](https://www.ethereumuruguay.org/)

> Build By: [mpefaur](https://github.com/mpefaur), [tomasfrancizco](https://github.com/tomasfrancizco), [TomasDmArg](https://github.com/TomasDmArg), [gonzageraci](https://github.com/gonzageraci), [dappsar](https://github.com/dappsar)


**Get started with our Bot 🤖**:

[![WhatsApp Bot](https://img.shields.io/badge/Start%20on%20WhatsApp-25D366.svg?style=flat&logo=whatsapp&logoColor=white)](https://wa.me/5491164629653)


**Components**:

- Landing Page ([product](https://chatterpay.net), [source code](https://github.com/P4-Games/ChatterPay))
- User Dashboard Website ([product](https://chatterpay.net/dashboard), [source code](https://github.com/P4-Games/ChatterPay))
- Backend API ([source code](https://github.com/P4-Games/ChatterPay-Backend)) 
- Smart Contracts ([source code](https://github.com/P4-Games/ChatterPay-SmartContracts))
- Data Indexing (Subgraph) ([source code](https://github.com/P4-Games/ChatterPay-Subgraph)) (this Repo)
- Bot AI (Chatizalo) ([product](https://chatizalo.com/))
- Bot AI Admin Dashboard Website ([product](https://app.chatizalo.com/))

<p>&nbsp;</p>

![Components Interaction](https://github.com/P4-Games/ChatterPay-Backend/blob/develop/.doc/technical-overview/chatterpay-architecture-conceptual-view.jpg?raw=true)


# About this repo

This repository contains a GraphQL API designed for tracking Deposits from non-Chatters to ChatterPay Accounts.

It is intended to index from the block 15400000 in scroll mainnet, which represents an approximate date from when the accounts started running under the last deploy.

Also only the following tokens are included: USDT, WETH and WBTC, which are currently supported by ChatterPay. More may be added in the future.

__Built With__:

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

# Additional Info


**Contribution**:

Thank you for considering helping out with the source code! We welcome contributions from anyone on the internet, and are grateful for even the smallest of fixes!

If you'd like to contribute to ChatterPay, please fork, fix, commit and send a pull request for the maintainers to review and merge into the main code base. If you wish to submit more complex changes though, please check up with the [core devs](https://github.com/P4-Games/chatterPay-Subgraph/graphs/contributors) first to ensure those changes are in line with the general philosophy of the project and/or get some early feedback which can make both your efforts much lighter as well as our review and merge procedures quick and simple.

_Contributors_: 

* [dappsar](https://github.com/dappsar) - [tomasDmArg](https://github.com/TomasDmArg).

* See more in: <https://github.com/P4-Games/chatterPay-Subgraph/graphs/contributors>

<p>&nbsp;</p>

---

[![X](https://img.shields.io/badge/X-%231DA1F2.svg?style=flat&logo=twitter&logoColor=white)](https://x.com/chatterpay)
[![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?style=flat&logo=instagram&logoColor=white)](https://www.instagram.com/chatterpayofficial)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/chatterpay)
[![Facebook](https://img.shields.io/badge/Facebook-%231877F2.svg?style=flat&logo=facebook&logoColor=white)](https://www.facebook.com/chatterpay)
[![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=flat&logo=youtube&logoColor=white)](https://www.youtube.com/@chatterpay)
[![WhatsApp Community](https://img.shields.io/badge/WhatsApp%20Community-25D366.svg?style=flat&logo=whatsapp&logoColor=white)](https://chat.whatsapp.com/HZJrBEUYyoF8FtchfJhzmZ) 