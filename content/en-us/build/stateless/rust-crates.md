---
title: "Use Rust Crates"
weight: 3005
menu:
  build:
    parent: "phat-stateless"
---

## What Crates Can Be Used

Not every Rust crate can be used in Phat Contract. This is because the contracts are running inside the ink! runtime, which is different from operating systems like Linux. In general, there are two requirements:

- The crate has `no_std` support (learn [more](https://docs.rust-embedded.org/book/intro/no-std.html) about the differences between `std` and `no_std`);
- The crate is in Pure Rust and does not require pre-compiled libraries.


## Crate Recommendations

The pink-extension contains the fundamental functions of the Phat Contract. There are also many useful crates and repositories which make developing Phat Contract easy.

### Use Storage Services

[pink-s3](https://crates.io/crates/pink-s3) enables you to store data to any storage service with S3-API support. Such storage service providers include:

- [Amazon S3](https://aws.amazon.com/s3/) - 5GB, 12 months free
- [4everland](https://www.4everland.org/bucket/) - 5GB free on IPFS and 100MB Free on Arweave
- [Storj](https://www.storj.io/) - 150GB free
- [Filebase](https://filebase.com/) - 5GB free

### Cross-chain Operations

With its confidentiality and HTTP request support, you can safely store like an ETH account in Phat Contract and use it to operate an Ethereum RPC node to do any cross-chain operations. Such a pattern can be easily extended to support other blockchains.

- [pink-web3](https://crates.io/crates/pink-web3) provides the basic cross-chain operation support for EVM-compatible chains;
- [subrpc](https://github.com/Phala-Network/phat-offchain-rollup/tree/sub0-workshop/phat/crates/subrpc) provides the basic support for Substrate-based chains;
- [stateful-rollup](https://github.com/Phala-Network/phat-offchain-rollup/tree/sub0-workshop) enables reliable cross-chain request processing based on the crates above.

### Other Crates

- [phat-contract-examples](https://github.com/Phala-Network/phat-contract-examples) contains the official examples of Phat Contract. The examples are up-to-date, and may use some not-yet-released features;
- [awesome-phat-contracts](https://github.com/Phala-Network/awesome-phat-contracts) collects the learning materials and some Phat Contract examples from previous hackathon submissions.
