---
title: "Phala Blockchain in Detail"
weight: 11011
menu:
  learn:
    parent: "phala-blockchain"
---

## Overview

In this chapter, we try to give a brief introduction to the structure of Phala blockchain. In general, Phala Network consists of the Phala blockchain and the off-chain TEE runtime. Also, we introduce a bridge relayer to connect them. So a full stack of a Phala node contains the following three components.

- `phala-node`: The Substrate-based blockchain node
- `pRuntime`: The TEE runtime. Contracts run in `pRuntime`
- `pherry`: The Substrate-TEE bridge relayer. Connects the blockchain and `pRuntime`

<img src="/images/docs/developer/simple_architecture.png" alt="drawing" class="center"/>

(Phala architecture overview)

The core insight of our system design is that the blockchain can serve as a canonical input source for TEE. That is, although attackers cannot peek at TEE, they can trick the contracts in TEE by forging transactions or replaying/reordering valid transactions. It is important to ensure that confidential contracts only accept valid transactions and process transactions in an expected order. That’s why we introduce Phala blockchain and connect it to the `pRuntime` via `pherry`.

As illustrated, the Phala blockchain serves as a canonical source of valid transactions. Only submitted transactions can be accepted by `pRuntime`, and they will be processed in the same order as they are on the blockchain. We implement a light validation client in `pRuntime` so it can determine whether valid transactions are accepted in an expected order. Also, a key rotation mechanism will be introduced to prevent the replay of historical transactions. The great thing is that `pRuntime` hides all these complicated implementation details from you so you can just implement confidential contracts like developing ordinary programs.

`pherry` works as the bridge between Phala blockchain and `pRuntime`. It ensures that all the transactions on the blockchain are faithfully forwarded to `pRuntime` and all the TEE instances are running an unmodified version of `pRuntime`. While it is worth noting that `pRuntime` does not trust `pherry`: it will still validate every block and transaction it receives from `pherry`.
