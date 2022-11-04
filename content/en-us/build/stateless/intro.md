---
title: "Build Stateless Backend"
weight: 1001
menu:
  build:
    parent: "phat-stateless"
---

## Why starting with stateless backend

Compared with traditional smart-contract-based DApps which store all their states on-chain and require transactions for interaction, the desired use cases of Phat Contract happen off-chain with no (or limited) data stored on-chain. For example, instead of implementing an [ERC-20](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/) token with Phat Contract (whose balance has to be stored on-chain), we recommend to deploy your ERC-20 contract on Ethereum, and use Phat Contract to operate it.

Actually, the Phat Contract itself focuses on the computation instead of storage, so it can be very easy to build stateless backend with Phat Contract (you can connect to other storage services with the HTTP requests in Phat Contract).
But no worry, backends and especially serverless backends are usually stateless and they worked very well without databases.

Also by implementing stateless backend brings immediate benefits at no developing cost:

- **Easy concurrent processing.** In Phala, it's easy to deploy your contract to multiple Workers, then all the instances can handle the users' off-chain requests (called [Query](/en-us/build/stateless/query-and-tx/#whats-query)) concurrently if there is no state-consistency limitation;
- **Go pure off-chain.** If your contract is stateless, it goes totally off-chain and is no longer limited by gas fee and block latency anymore. Many Phat Contract advantages (like HTTP support) are only allowed off-chain.


## What if I really need states / transactions?

Phat Contract still supports the vanilla on-chain states and transaction processing!

What's more, all the contract states are encrypted when stored on-chain. But when you use these on-chain storage, the Phat Contract will suffer the gas fee and the low performance just like the existing smart contracts.
We explain how to interact with blockchain in Phat Contract in the [Advanced Techniques](xxx), use them if you really ensure you need these.

For off-chain computation, the recommended way to store your states is to use external storage services. Phat Contract can easily connect to S3-compatible storage services and use them as cheaper and faster off-chain state storage. Explore how to do this in the following [section](/en-us/build/stateful/off-chain-state/).

> Always remember your contract may be deployed to multiple Workers and they run concurrently. If multiple instances try to write to the storage services at the same time, there can be [race conditions](https://ketanbhatt.com/db-concurrency-defects/).
>
> For now, we do not provide native locking or transaction support for these storage services.
