---
title: Fat Contract Features
weight: 1002
draft: false
menu:
  learn:
    parent: "developer"
---

Please read the about section or our medium article for a more general introduction and high-level capability overview of Fat Contract :point_down:.

{{< button "/en-us/learn/products/about-fat-contract/" "About Fat Contract" >}}

{{< button "https://medium.com/phala-network/introduction-of-fat-contract-dea79ffcf0dc" "Medium: Fat Contract" >}}

## Introduction

Fat Contract is the programming model adopted by Phala Network. Fat Contract is **NOT** a smart contract.

Instead, it aims to provide the rich features that ordinary smart contracts cannot offer, including:

- CPU extensive computation: exclusive off-chain execution at the full CPU speed
- Network access: the ability to send the HTTP requests
- Low latency: non-consensus-sensitive operations may not hit the blockchain at all, removing the block latency
- Strong consistency: consensus-sensitive operations remain globally consistent
- Confidentiality: contract state is hidden by default unless you specifically expose it via the read call

> The network access feature is available in native contracts now. It will be supported in ink! contracts soon.

Fat Contract is 100% compatible with Substrate's `pallet-contracts`. It fully supports the unmodified ink! smart contracts. Therefore you can still stick to your favorite toolchain including `cargo-contract`,  `@polkadot/contract-api`, and the Polkadot.js Extension.

## Start Building

Our faith in the Fat Contract also comes from the feedback of our community. During our last hackathon, we have seen some talented developers' [creations](https://github.com/Phala-Network/Encode-Hackathon-2021/issues/21) with the powerful Fat Contract.
You can now revisit our hackathon [tutorial](/en-us/build/developer/fat-contract-tutorial/) and follow it. This will give you an immediate experience of the abilities of Fat Contract;

Just like Fat Contract, Phala meant to be open and keep improving. We welcome feedback from developers all over the world to add more inspiring features to the Fat Contract. Why not join our community now and get your hands dirty with the Fat Contract?
