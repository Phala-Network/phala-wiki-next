---
title: "Environment Setup"
weight: 1001
menu:
  build:
    parent: "phat-basic"
---

## Supported Operating Systems

The Phat Contract uses Rust-based Ink! language, and is finally compiled to WebAssembly (WASM for short).

- You can get your contract compiled on both macOS and Linux distributions (we use Ubuntu 20.04 as the default Linux distribution);
- For Windows users, we recommend to setup a Linux development environment with virtual machine ([video tutorial](https://www.youtube.com/watch?v=x5MhydijWmc)).

## Install Toolchains

Phat Contract shares the exact same toolchains as Ink!.

A prerequisite for compiling Phat contracts is to have Rust and Cargo (Rust's project manager) installed. The Rust official recommends to use `rustup` tool to install and manage different Rust versions. Here's [an installation guide](https://doc.rust-lang.org/cargo/getting-started/installation.html).

We recommend installing [`cargo-contract`](https://github.com/paritytech/cargo-contract) as well.
It's a CLI tool which helps set up and manage contracts written with ink!:

```
# install Rust nightly toolchain for contract compilation
rustup install nightly
rustup component add rust-src --toolchain nightly
# install cargo-contract tool
cargo install cargo-dylint dylint-link
cargo install cargo-contract --force
```

Use the `--force` to ensure you are updated to the most recent `cargo-contract` version.
