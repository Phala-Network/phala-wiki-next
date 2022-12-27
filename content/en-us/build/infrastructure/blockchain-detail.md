---
title: "Phala Blockchain in Detail"
weight: 5001
menu:
  build:
    parent: "infra"
---

## Overview

Phala is a trustless cloud computing solution for the next generation's internet, the [Web3](https://web3.foundation/). We build on [Parity's Substrate](https://www.parity.io/technologies/substrate/) and operate in the Polkadot ecosystem on the [Kusama](https://kusama.network/) parachain.

Phala tackles the privacy and performance issues of legacy blockchain solutions operated in a cloud environment by decoupling the computation from the chain to off-chain secure workers: the blockchain is only used as the canonical (encrypted) message queue, and the attested secure workers fetch requests (i.e., transactions) from the chain, verify and execute them, and then write the computation results back.

![blockchain design](/images/learn/phala-design.png)

Our secure workers utilize specific [Secure Enclave](https://en.wikipedia.org/wiki/Trusted_execution_environment) hardware that ensures confidentiality, security, and performance of blockchain computation. Furthermore, our code is all open-source.

## The Architecture

In general, Phala Network consists of the Phala blockchain and the off-chain runtime in Secure Enclave. Also, we introduce a bridge relayer to connect them. So a full stack of a single Phala node contains the following three components.

- `phala-node`: The Substrate-based blockchain node;
- `pRuntime`: The Secure Enclave runtime. Contracts run in `pRuntime`;
- `pherry`: The Substrate-Enclave bridge relayer. Connects the blockchain and `pRuntime`;

![node detail](/images/learn/node-detail.png)

### Transaction Security

The core insight of our system design is that the blockchain can serve as a canonical input source for the Secure Enclave, and the Secure Enclave hardware enforces confidential and faithful execution instructed by the chain even if the worker operators are malicious.

Although attackers cannot peek at the Secure Enclave, they can trick the contracts in it by forging transactions or replaying/reordering valid transactions. It is important to ensure that confidential contracts only accept valid transactions and process transactions in an expected order. That’s why we introduce the Phala blockchain and connect it to the `pRuntime` via `pherry`.

As illustrated, the Phala blockchain serves as a canonical source of valid transactions. Only submitted transactions can be accepted by `pRuntime`, and they will be processed in the same order as they are on the blockchain. We implement a light validation client in `pRuntime` to determine whether valid transactions are accepted in an expected order. Also, a key rotation mechanism will be introduced to prevent the replay of historical transactions. The great thing is that `pRuntime` hides all these complex implementation details from you to implement confidential contracts like developing ordinary programs.

`pherry` works as the bridge between Phala blockchain and `pRuntime`. It ensures that all the transactions on the blockchain are faithfully forwarded to `pRuntime` and that all the enclave instances are running an unmodified version of `pRuntime`. While it is worth noting that `pRuntime` does not trust `pherry`, it will still validate every block and transaction it receives from `pherry`.
