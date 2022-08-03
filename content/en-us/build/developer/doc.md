---
title: "Documentation"
weight: 1003
draft: false
menu:
  build:
    parent: "developer"
---

## Ink! Documentation

From a programmer's perspective, you can regard Phat Contract to be a combination of basic [Parity's Ink!](https://paritytech.github.io/ink/) and [Phala's Ink! Extension](https://github.com/Phala-Network/phala-blockchain/tree/master/crates/pink).

We recommend to go through the official [Ink! Documentation](https://paritytech.github.io/ink-docs/) to learn the basics about contract developing.

## Phat Contract Examples

We keep a list of [contract examples](https://github.com/Phala-Network/phala-blockchain/tree/master/crates/pink/examples) for every extra feature of Phat Contract compared with the original Ink! contract.

## Handle Upload/Instantiation Failure

Code upload could failed if there are *illegal* instructions in your compiled WASM. Phala uses Substrate's `contract_pallet` for contract execution, check its [code examination mechanism](https://github.com/paritytech/substrate/blob/32a4fe01f110a755bf22eb8f803cdfd7052d4f8b/frame/contracts/src/wasm/prepare.rs#L381-L387) for potential illegal instructions. Report in the #dev channel of our [Discord](https://discord.gg/phala) and we will help you find the exact reason.

The contract instantiation could also fail for runtime errors. For now, the contract execution log is not directly available to the developers. Join our [Discord](https://discord.gg/phala) and we can help forward the Worker logs if necessary.
