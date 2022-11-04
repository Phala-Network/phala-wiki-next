---
title: "Language Basics"
weight: 1002
menu:
  build:
    parent: "phat-stateless"
---

The Phat Contract is written in ink! language, which is extended from Rust language (more language supports will be provided in the future). It is finally compiled to WebAssembly (WASM), which also takes [security](https://training.linuxfoundation.org/blog/webassembly-security-now-and-in-the-future/) into consideration when designed, then you can upload and deploy them.

Rust is thought to be a hard language, but no worry! It deserves the efforts since Rust is fast and helps prevent many million-dollar bugs. Also I sincerely believe one day you will find it charming since all your enemy is just the Rust compiler itself😼.

The prospering ecosystem is another reason to use Rust-based ink! to develop your contract. There are many secure and high-performance libraries for you to use without building all the wheels from scratch.

This section will not teach your about the Rust and ink! language itself. Instead, it provides some helpful links and comments to get you prepared quickly.


## Rust

### Tooling

When using Rust, you will always rely on the following official tools to manage your toolchain and compile your projects:
- [rustup](https://rustup.rs/), which helps you install and manage different versions of Rust compilers;
- cargo, the package manager installed automatically along with Rust compiler. Each Rust project contains a `Cargo.toml` file to describe its metadata and dependencies, and `cargo` downloads the dependencies and builds the project for you. The [cargo book](https://doc.rust-lang.org/cargo/reference/index.html) can help, and ensure you understand the [[dependencies]](https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html) and [[features]](https://doc.rust-lang.org/cargo/reference/features.html) sections in `Cargo.toml` before going on.

### Language Basics

The best material is surely the official [Rust book](https://doc.rust-lang.org/book/).
- For a beginner, to learn the first 6 sections is enough for your journey in the Phat Contract world;
- I also recommend to finish the 7 - 10 sections when you decide to go a little deeper.

There are also many [books recommended by the community](https://www.reddit.com/r/rust/comments/sjclfb/best_book_to_learn_rust/) for more advanced topics.


## ink!

ink! is the default contract programming language in Polkadot ecosystem. The native ink! contracts can run on different blockchains (like Polkadot and Phala), but Phala adds its secret ingredient called [pink-extension](https://github.com/Phala-Network/phala-blockchain/tree/master/crates/pink) (short for Phala ink! Extension) to form Phat Contract which is only functional in Phala cloud.

> Phat Contract is the superset of ink! contract.

### ink! Macros

The difference between a ink! contract and a normal Rust program is the macros in it. As shown in our [example contract](/en-us/build/getting-started/create-contract/#create-and-compile-your-first-contract), you need to annotate the Rust code with ink! macros so the compiler can learn your contract structure. For example,

```rust
#[ink(storage)]
pub struct OnchainState;
```

`#[ink(storage)]` tells us the following struct `OnchainState` saves the contract states and needs to be stored on-chain. And

```rust
#[ink(message)]
pub fn query_handler(&self, from: AccountId) {
    // actual implementation
}
```

`#[ink(message)]` means the following functions are meant to be called by other contracts or users in different ways.

For a complete list of these macros and more detailed tutorial, refer to the [official document](https://ink.substrate.io/).

### Use Crates in Your Contract

> If you do not know what's Crate, you may need to go over your Rust book.

[crates.io](https://crates.io/) is the market for the Rust crates. While only the crates with `no_std` support can be used in your ink! contract. The reason is [explained by the official](https://ink.substrate.io/faq#why-is-rusts-standard-library-stdlib-not-available-in-ink).

We will further provide crate recommendation for different use cases in the following [section](/en-us/build/stateless/rust-crates).
