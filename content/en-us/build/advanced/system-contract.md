---
title: "System Contract and Drivers"
weight: 8001
draft: false
menu:
  build:
    parent: "phat-advanced"
---

## Introduction

The system contract is responsible for the access control of each cluster. Only the cluster owner is able to implement and deploy the system contract during the creation of the cluster.

Also, the enable the flexible management of the future features of Phat Contract, we refer to the design of the Linux kernel and enable cluster owner to dynamically register drivers to system contract to different things. For example, the [Phat Contract tokenomics](/en-us/general/phala-network/phat-contract-fee/) is implemented as a [driver](https://github.com/Phala-Network/phala-blockchain/tree/master/crates/pink-drivers/tokenomic) so each cluster owner can replace it with his/her own tokenomics in the future.

> This feature is not finalized yet so can be changed any time.

## System Contract Examples

Check our [crates](https://github.com/Phala-Network/phala-blockchain/tree/master/crates/pink-drivers) for the current implementation of the system contract and drivers.
