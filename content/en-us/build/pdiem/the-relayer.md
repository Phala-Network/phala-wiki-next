---
title: "The Relayer"
weight: 10007
draft: false
menu:
  build:
    parent: "pdiem"
---

The pdiem relayer is the component to sync data between pdiem and the Diem blockchain. It runs off-chain, connects to the both blockchains, and watch the related transactions.

Codebase: [Phala-Network/pdiem-relayer](https://github.com/Phala-Network/pdiem-relayer).

## Who runs the relayer

Anyone can run a relayer, and in theory only one honest relayer is required to operate the pdiem bridge, because all the messages submitted by the relayer are validated by the Diem blockchain or the pdiem contract. However the more relayer, the higher guarantee of availability can be achieved.

In pdiem-m3 we haven't added any incentives for the relayer, but since a relayer must submit transactions on the blockchains which causes some gas fee, we would consider to allow the relayers to take a tiny amount of the transaction fee from the cross-chain transactions as a basic incentive.

An alternative solution could be to ask the user itself to be its own relayer. However this requires the user to be online for a relatively longer time (probably a few minues), and thus causes a bad user experience.
