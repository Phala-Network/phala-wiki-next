---
title: "Build Stateless DApps"
weight: 1001
menu:
  build:
    parent: "phat-stateless"
---

## Why Stateless DApps

Compared with traditional smart-contract-based DApps which store all their states on-chain and require transactions for interaction, the desired use cases of Phat Contract happen off-chain with no (or limited) data stored on-chain. For example, instead of implementing an [ERC-20](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/) token with Phat Contract (whose balance has to be stored on-chain), we recommend to deploy your ERC-20 contract on Ethereum, and use Phat Contract to operate it.

Our insight here is that:

> Only a very limited portion of your DApp data really needs to be stored on-chain.

Since the on-chain storage can be expensive (from both monetary and performance perspectives), it's timeworthy to refactor your DApps and move the stateless parts to Phat Contract. The benefits include:

- **Easy concurrent processing.** In Phala, it's easy to deploy your contract to multiple Workers, then all the instances can handle the users' off-chain requests (called [Query](/en-us/build/stateless/query-and-tx/#whats-query)) concurrently if there is no state-consistency limitation;
- **Go pure off-chain.** If your contract is stateless, it goes totally off-chain and is no longer limited by gas fee and block latency anymore. Many Phat Contract advantages (like HTTP support) are only allowed off-chain.


## What if I really need states / transactions?

Phat Contract still supports the vanilla on-chain states and transaction processing! The extra benefit is that all the contract states are encrypted when stored on-chain. But when you use these traditional features, the Phat Contract will still suffer the gas fee and the low performance like the existing smart contracts.
We explain these features in the [Advanced Techniques](xxx), use them if you really ensure you need these.

More importantly, Phat Contract supports many external storage services for cheaper and faster off-chain state storage. Explore them in the following [section](/en-us/build/stateful/off-chain-state/).

> Always remember your contract may be deployed to multiple Workers and they run concurrently. If multiple instances try to write to the storage services at the same time, there can be [race conditions](https://ketanbhatt.com/db-concurrency-defects/).
>
> For now, we do not provide native locking or transaction support for these storage services.
