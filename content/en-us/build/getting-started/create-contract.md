---
title: "Create Contract"
weight: 1002
menu:
  build:
    parent: "phat-basic"
---

## Create and Compile Your First Contract

In order to initialize a new Phat contract project you can use our hello world template:

```
git clone https://github.com/Phala-Network/phat-hello
```

This will create a folder `phat-hello` in your work directory.
The folder contains a scaffold `Cargo.toml` and a `lib.rs`, which both contain the necessary building blocks for using Phat Contract.

The `lib.rs` contains our hello world contract ‒ a ETH balance reader.

In order to build the contract just execute this command in the `phat-hello` folder:
```
cargo +nightly contract build
```

> Always add `+nightly` when compiling your contract, this could fix a lot of problems.

As a result you'll get the following files in the `target` folder of your contract: a `phat_hello.wasm` file, a `metadata.json` file and a `phat_hello.contract` file.
The `.contract` file combines the WASM and metadata into one file and needs to be used when instantiating the contract.


## Run Unit Tests Locally

Before you really upload and deploy your contract to our cloud, you are encouraged run local unit tests to check its correctness.

In the `phat-hello` folder, run
```
cargo +nightly test -- --nocapture
```
and ensure you see all tests passed.

> Do not add `contract` here, `cargo +nightly test` will give you more details if something goes wrong.
>
> `-- --nocapture` is optional to see the output during testing.

Now you have successfully compiled and locally test your first Phat Contract. Now it's time to deploy it to a real blockchain.
