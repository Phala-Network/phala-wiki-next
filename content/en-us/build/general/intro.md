---
title: "Introduction"
weight: 1001
draft: false
menu:
  build:
    parent: "phat-general"
---

## What is Phat Contract

Phat Contract is the innovative programming model enabling [*Off-chain Computation*](https://medium.com/phala-network/fat-contract-introduce-off-chain-computation-to-smart-contract-dfc5839d5fb8). It’s also known as Fat Contract as a practice of the "Fat Protocol & Thin Application" concept, and for its rich functionalities compared with existing smart contract. Phat Contract uses Rust-based [Ink! language](https://paritytech.github.io/ink/).

Although with the name of "contract", Phat Contract is more like the Web3 version of [Amazon Lambda](https://aws.amazon.com/lambda/) backed by the decentralized Phala computing cloud, and meant to support complex computation with low latency and cost.


## Why using Phat Contract

### Compared with Smart Contract

The existing smart contract solutions have many limitations:

- High latency with limited number of instructions to execute;
- No database support;
- No network access;
- Few libraries;

Phat Contract fixes these problems so you can do anything you want with one contract.

![](/images/general/fat-features.jpeg)

The Phat Contract inherits the self-enforcing and tamper-proof nature of smart contract, while introducing more advantages including:

- Privacy-preserving with performance. It’s safe to store and process your secret data in Phat Contract since it’s backed by hardware-based encryption throughout its lifecycle;
- Zero latency, zero gas fee. The interactions with Phat Contract can involve no on-chain transactions, thus achieving millisecond-level read and write responses with no gas fee;
- Connectivity with HTTP requests. Phat Contract natively supports HTTP requests. Use it to connect any exiting Web2 services to store data and build Oracle, or an RPC node of other blockchains for easy and safe cross-chain operations;
- Freedom to use libraries in Rust ecosystem. Write your contract with Rust-based [Ink! language](https://paritytech.github.io/ink/) and use libraries with `no_std` support. We will support `std` in the future Phat Contract version then you can use any libraries you like.

### Compared with Web2 Serverless Services

Phat Contract provides the same functionalities as our Web2 competitors, but opens up more possibilities with its Web3 nature.

- Decentralized and trustless. Our infrastructure design is totally public and all its code is available for you to check. To process your sensitive data in Phat Contract implies no trust on the Phala team, but on the code and Secure-Enclave-based hardware;
- Easier integration with other blockchains. We provide contract templates for easy and safe interactions with existing blockchains. Also you can safely delegate your chain accounts to the trustless Phat Contract with no worry about privacy leakage;
- Open contract ecosystem. A most typical difference between contracts and Web2 programs is that they are naturally public: you are free to call any existing contracts to compose your own apps with little efforts.

<!-- ## What's New?

Compared its pervious version, the latest Phat Contract is also evolving in the following aspects:

- Support HTTP Request feature in ink! contract. Previously, we have shown that we can run unmodified ink! contracts in Phala's Secure Workers. While to use the killer HTTP Request feature, a developer has to fork the phala-blockchain codebase and write the Native Contract. In the new release, we support HTTP Request feature in ink! contract and make it an ink! contract [extension](https://crates.io/crates/pink-extension). It provides HTTP request and other crypto-related functionality for ink! contract;
- Testnet goes alive. In the old time, our developers have to run a local testnet for contract development, which can be time-consuming. Now we have enabled the [Phala Testnet (PoC 5)](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fpoc5.phala.network%2Fws#/explorer), so the contract development can be easy;
- Use Phat Contract to run unmodified x86 programs. We have present a [demo](https://github.com/Phala-Network/blender-contract) to use Phat Contract to run the unmodified rendering engine Blender with the help of [Gramine project](https://github.com/gramineproject/gramine). This means the public decentralized render service is on its way. This also proves Phat Contract's potentials to run complicated real-world programs. -->
