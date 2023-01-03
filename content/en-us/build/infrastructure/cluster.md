---
title: "Cluster of Workers"
weight: 6003
menu:
  build:
    parent: "infra"
---

## Cluster: Abstraction of Workers

Phala has many Workers but we do not expose them to developers directly. They are organized into *Clusters* and used by our developers.

![](https://i.imgur.com/G4T51Ht.png)

- Contracts must be deployed to a Cluster, and a Cluster can hold multiple contracts
    - Contracts in different Clusters have no relationship, even if they share the same code
    - Contracts in one Cluster can call each other, and contracts in different Clusters need to call each other in an XCM-like way (BTW, the XCM support is WIP, so this should be supported soon)
- A Cluster is backed by one or more Workers
    - The Worker will run all the contracts in this Cluster
    <!-- - A Worker can run multiple Clusters -->
- Different access controls can be defined for different Clusters
    - like who can deploy how many contracts in this Cluster

Accordingly, we have a [two-level contract tokenomics](/en-us/general/phala-network/phat-contract-fee/) for this design.

- The L1 tokenomics define how you stake $PHA to rent Workers and form your Cluster
    - We will provide the public good Clusters, and people can stake $PHA to get the proportional computing power in our network
- The L2 tokenomics define how Cluster owners charge the contract deployers
    - We provide a [template implementation](https://github.com/Phala-Network/phala-blockchain/tree/master/crates/pink-drivers) (with `Public` and `OnlyOwner` rules) and will allow owners to implement their own logic with Phat Contract
