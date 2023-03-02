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
Upgrade cargo-contract to version 1.5.2 or higher once [this PR](https://github.com/paritytech/cargo-contract/pull/904) has been merged.

### Avoiding FP Instructions in JSON Parsing
A common case that introduces FP instructions is parsing JSON in a contract. Either serde or serde_json are designed to be able to handle FP numbers. In theory, if you don't use it to deal with FP data, the compiler and wasm-opt should be able to optimize the FP instructions away for many cases. However, in practice, if you use serde_json, it always emits FP instructions in the final output wasm file.

If your JSON document contains FP numbers, you can skip this section and go to ["How to do floating point calculations"](#do-fp) for solutions. If your JSON document does not contain FP numbers, here are some suggestions for removing the instructions:

- Use the crate [pink-json](https://crates.io/crates/pink-json) instead of `serde_json`.
- Don't deserialize to `json::Value` or `serde::Value`. These are dynamically typed values and make it impossible for the compiler to optimize the code paths that contain FP ops. Instead, mark concrete types with `#[derive(Deserialize)]` and deserialize to them directly.
- If using `pink-web3` and loading `Contract` from its JSON ABI, you may encounter FP problems in a function like `_ZN5serde9__private2de7content7Content10unexpected17h5ce9c505c30bc609E` from serde. To fix this, you can patch `serde` as shown below.
  ```toml
  [patch.crates-io]
  serde = { git = "https://github.com/kvinwang/serde.git", branch = "pink" }
  ```

### <a name="do-fp"></a>How to do Floating Point Calculations
TODO

### Resource limits

| Item  | Description | ink | SideVM |
| ---- | ---- | ---- | ---- |
| Supported languages | Supported developing language of phat contract | Currently only Rust is supported for developing a vanilla phat contract. Javascript can be run via the [phat-quickjs](https://github.com/Phala-Network/phat-quickjs) project.  | Currently only Rust is supported. More languages are possible in the future |
| Maximum code size | The maximum size of the compiled contract code that can be deployed | 2 megabytes | 32 megabytes |
| Maximum ingress requests | The maximum number of simultaneous query requests go into a single worker | 8 by default | unlimited |
| Request fulfillment timeout | The maximum duration of an in-flight query request. | 10 seconds | unlimited |
| Maximum request size | The maximum size of a incomming Request. This includes the all arguments| 16 kilobytes| unlimited, streaming is supported |
| Maximum returned value size | The maximum size of the response of a query| 16 kilobytes | unlimited, streaming is supported |
| Maximum source code execution time | The maximum amount of time that a single query can execute | 10 seconds | N/A (continiously running) |
| Maximum memory allocated | The maximum amount of memory allocated to your source code during execution | 4 megabytes | 16 MB |
| HTTP - Maximum queries | The maximum number of HTTP requests that your source code can make| 1 (because the API is synchronous) | unlimited |
| HTTP - query timeout | The duration of an HTTP request before it times out | 10 seconds | unlimited |
| HTTP - Maximum request length | The maximum size of an HTTP request, including the request body and HTTP headers | 16 kilobytes | unlimited |
| HTTP - Maximum response length | The maximum size of an HTTP response | 16 kilobytes | unlimited |
