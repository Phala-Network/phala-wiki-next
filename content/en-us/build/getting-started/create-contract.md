---
title: "Create Contract"
weight: 1002
menu:
  build:
    parent: "phat-basic"
---

## Create and Compile Your First Contract

In order to initialize a new Phat contract project you can use:

```
cargo contract new flipper
```

This will create a folder `flipper` in your work directory.
The folder contains a scaffold `Cargo.toml` and a `lib.rs`, which both contain the necessary building blocks for using ink!.

The `lib.rs` contains our hello world contract ‒ the `Flipper`.

In order to build the contract just execute this command in the `flipper` folder:
```
cargo +nightly contract build
```

> Always add `+nightly` when compiling your contract, this could fix a lot of problems.

As a result you'll get the following files in the `target` folder of your contract: a `flipper.wasm` file, a `metadata.json` file and a `flipper.contract` file.
The `.contract` file combines the WASM and metadata into one file and needs to be used when instantiating the contract.


## Run Unit Tests Locally

Before you really upload and deploy your contract to our cloud, you are encouraged run local unit tests to check its correctness.

In the `flipper` folder, run
```
cargo +nightly test
```
and ensure you see all tests passed.

> Do not add `contract` here, `cargo +nightly test` will give you more details if something goes wrong.
