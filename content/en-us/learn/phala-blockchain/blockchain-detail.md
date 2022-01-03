---
title: "Phala Blockchain in Detail"
weight: 1000
menu:
  learn:
    parent: "phala-blockchain"
---

## An Overview

Phala is a trustless cloud computing solution for the next generation's internet, the [Web 3.0](https://web3.foundation/). We is build on [Parity's Substrate](https://www.parity.io/technologies/substrate/) and operate in the Polkadot ecosystem on the [Kusama](https://kusama.network/) parachain. 
\
Phala tackles the privacy issue of legacy blockchain solutions operated in a cloud environment by decoupling the computation from the chain to off-chain secure workers (miners).
\
\
Our secure workers utilize specific TEE ([trusted execution environment](https://www.securetechalliance.org/wp-content/uploads/TEE-101-White-Paper-V1.1-FINAL-June-2018.pdf)) hardware that ensures confidentiality, security, and performance of blockchain computation. Furthermore, our code is all open source. 

## The Architecture

In general, Phala Network consists of the Phala blockchain and the off-chain TEE runtime. Also, we introduce a bridge relayer to connect them. So a full stack of a Phala node contains the following three components.

- `phala-node`: The Substrate-based blockchain node
- `pRuntime`: The TEE runtime. Contracts run in `pRuntime`
- `pherry`: The Substrate-TEE bridge relayer. Connects the blockchain and `pRuntime`

<img src="/images/docs/developer/simple_architecture.png" alt="drawing" class="center"/>

(Phala architecture overview)

### Transaction Security

The core insight of our system design is that the blockchain can serve as a canonical input source for the TEE. Although attackers cannot peek at the TEE, they can trick the contracts in the TEE by forging transactions or replaying/reordering valid transactions. It is important to ensure that confidential contracts only accept valid transactions and process transactions in an expected order. That’s why we introduce Phala blockchain and connect it to the `pRuntime` via `pherry`.

As illustrated, the Phala blockchain serves as a canonical source of valid transactions. Only submitted transactions can be accepted by `pRuntime`, and they will be processed in the same order as they are on the blockchain. We implement a light validation client in `pRuntime` to determine whether valid transactions are accepted in an expected order. Also, a key rotation mechanism will be introduced to prevent the replay of historical transactions. The great thing is that `pRuntime` hides all these complicated implementation details from you to implement confidential contracts like developing ordinary programs.

`pherry` works as the bridge between Phala blockchain and `pRuntime`. It ensures that all the transactions on the blockchain are faithfully forwarded to `pRuntime` and all the TEE instances are running an unmodified version of `pRuntime`. While it is worth noting that `pRuntime` does not trust `pherry`, it will still validate every block and transaction it receives from `pherry`.