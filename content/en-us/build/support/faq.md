---
title: "FAQ"
weight: 3001
menu:
  build:
    parent: "phat-support"
---

## Get questions answered

You can post your questions to
- [Substrate and Polkadot StackExchange](https://substrate.stackexchange.com/), remember to add the `phat-contract` tag;
- or join our [Discord server](https://discord.gg/phala) and get an immediate response in the `#dev` channel.

## Question List

- How to set arguments when instantiating the contract in Phat Contract UI?
   - Now the Phat Contract Console does not support specifying arguments during contract instantiation
   - **Workaround**: you can implement a `config(&mut self, argument0, ...)` function and set the contract state with transactions after the instantiation
