---
title: "Introduction"
weight: 1001
draft: false
menu:
  build:
    parent: "developer"
---

## Introduction

[Phat Contract](/en-us/general/development/fat-contract) is the programming model adopted by Phala Network. Phat Contract is **NOT** smart contract.

![](/images/general/fat-features.jpeg)

Instead, it aims to provide the rich features that ordinary smart contracts cannot offer, including:

- CPU extensive computation: exclusive off-chain execution at the full CPU speed
- Network access: the ability to send the HTTP requests
- Low latency: non-consensus-sensitive operations may not hit the blockchain at all, removing the block latency
- Strong consistency: consensus-sensitive operations remain globally consistent
- Confidentiality: contract state is hidden by default unless you specifically expose it via the read call

Phat Contract is 100% compatible with Substrate's `pallet-contracts`. It fully supports the unmodified ink! smart contracts. Therefore you can still stick to your favorite toolchain including `cargo-contract`,  `@polkadot/contract-api`, and the Polkadot.js Extension.



## What's New?

Compared its pervious version, the latest Phat Contract is also evolving in the following aspects:

- Support HTTP Request feature in ink! contract. Previously, we have shown that we can run unmodified ink! contracts in Phala's Secure Workers. While to use the killer HTTP Request feature, a developer has to fork the phala-blockchain codebase and write the Native Contract. In the new release, we support HTTP Request feature in ink! contract and make it an ink! contract [extension](https://crates.io/crates/pink-extension). It provides HTTP request and other crypto-related functionality for ink! contract;
- Testnet goes alive. In the old time, our developers have to run a local testnet for contract development, which can be time-consuming. Now we have enabled the [Phala Testnet (PoC 5)](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fpoc5.phala.network%2Fws#/explorer), so the contract development can be easy;
- Use Phat Contract to run unmodified x86 programs. We have present a [demo](https://github.com/Phala-Network/blender-contract) to use Phat Contract to run the unmodified rendering engine Blender with the help of [Gramine project](https://github.com/gramineproject/gramine). This means the public decentralized render service is on its way. This also proves Phat Contract's potentials to run complicated real-world programs.
