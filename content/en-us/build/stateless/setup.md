---
title: "Environment Setup"
weight: 4001
menu:
  build:
    parent: "phat-stateless"
---

## Supported Operating Systems

The Phat Contract uses Rust-based ink! language, and is finally compiled to WebAssembly (WASM for short).

- You can get your contract compiled on both macOS and Linux distributions (we use Ubuntu 22.04 as the default Linux distribution);
- For Windows users, we recommend to setup a Linux development environment with virtual machine ([video tutorial](https://www.youtube.com/watch?v=x5MhydijWmc)).

<!-- ## Development Tool

Phat Contract also has its one-stop development tool [devPHAse](https://github.com/l00k/devphase). It's contributed by our community members and is still under active development. You may skip the following steps with devPHAse. -->

## Install Toolchains

Phat Contract shares exactly the same toolchains as ink!.

### Rust

A prerequisite for compiling Phat Contracts is to have Rust and Cargo (Rust's project manager) installed.

The Rust official recommends using `rustup` tool to install and manage different Rust versions. Here's [an installation guide](https://doc.rust-lang.org/cargo/getting-started/installation.html).

### ink!

We recommend installing [`cargo-contract`](https://github.com/paritytech/cargo-contract). It's a CLI tool that helps set up and manage contracts written with ink!.

You can install the `cargo-contract` with
```bash
# use the `--force` to ensure you are updated to the most recent version
cargo install cargo-contract --force
```

Then check your `cargo-contract` and ensure it's updated to `2.x` with ink! 4 support
```bash
cargo contract --version
# cargo-contract-contract 2.1.0-unknown-x86_64-unknown-linux-gnu
```
