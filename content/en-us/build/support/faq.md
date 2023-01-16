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

### How to set arguments when instantiating the contract in Phat Contract UI?
  - Now the Phat Contract Console does not support specifying arguments during contract instantiation
  - **Workaround**: you can implement a `config(&mut self, argument0, ...)` function and set the contract state with transactions after the instantiation

### Phat UI reports an error before deploying the contract
The Phat UI checks the contract's validity before uploading it to the cluster. However, sometimes the contract output by `cargo-contract` may be invalid. We've listed common errors and solutions below:

#### Error: gas instrumentation failed: unsupported instruction: F32Load(2, 4)
or sometimes "use of floating point type in locals is forbidden"

This error occurs when the contract or its dependencies use floating point operations not allowed by the ink runtime.

- To find the source of the problem, try recompiling the contract with `--keep-debug-symbols`, then convert the wasm file to wat using `wasm2wat my_contract.wasm > my_contract.wat`, and search for `f32` or `f64` in my_contract.wat to find the function using these instructions.
- If the floating point operations are necessary, see the section ["How to do floating point calculations"](#do-fp) for more information.

#### Error: sign extension operations support is not enabled
- We suggest compiling the contract on Linux and upgrading cargo-contract to version 1.5.1 or higher.
- If compiling on macOS, there is no guaranteed solution, but you can refer to this [issue](https://github.com/paritytech/cargo-contract/issues/832) for ideas.

### <a name="do-fp"></a>How to do Floating Point Calculations
TODO
