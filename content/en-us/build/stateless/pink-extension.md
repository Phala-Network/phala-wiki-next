---
title: "Use Pink Extension"
weight: 3004
menu:
  build:
    parent: "phat-stateless"
---

<!-- TODO.shelven: add example explanations -->
## Introduction

All the unique capabilities of Phat Contract is implemented in [pink-extension](https://github.com/Phala-Network/phala-blockchain/tree/master/crates/pink). Informally speaking:

$ Phat\ Contract = ink! + Pink\ Extension $

It is worth noting that the Phat Contract is not a trivial extension of ink! contract since all these extra functions only work under the off-chain computation.

## Pink Extension Functions

| Functionality   | Function Name          | Query Support | Transaction Support |
| --------------- | ---------------------- | ------------- | ------------------- |
| Internet Access | http_request           | ✅             | ❌                   |
| Crypto          | getrandom              | ✅             | ❌                   |
|                 | ecdsa_sign_prehashed   | ✅             | ✅                   |
|                 | ecdsa_verify_prehashed | ✅             | ✅                   |
|                 | sign (ecdsa/ed25519)   | ✅             | ✅                   |
|                 | sign (sr25519)         | ✅             | ❌                   |
|                 | verify                 | ✅             | ✅                   |
|                 | derive_sr25519_key     | ✅             | ✅                   |
|                 | get_public_key         | ✅             | ✅                   |
| Volatile Cache  | cache_set              | ✅             | ✅                   |
|                 | cache_set_expire       | ✅             | ✅                   |
|                 | cache_get              | ✅             | ❌                   |
|                 | cache_remove           | ✅             | ✅                   |
| Misc            | log                    | ✅             | ✅                   |
|                 | is_running_in_command  | ✅             | ✅                   |

Refer to our [Phat Hello World](https://github.com/Phala-Network/phat-hello) contract to see how you can import these functions to your contract.


## Crate Recommendations

The pink-extension contains the fundmental functions of Phat Contract. There are also many useful crates and repositories which make developing Phat Contract easy.

### Use Storage Services

[pink-s3](https://crates.io/crates/pink-s3) enables you to store data to any storage services with S3-API support. Your candidates include:
- [Amazon S3](https://aws.amazon.com/s3/) - 5GB, 12 months free
- [4everland](https://www.4everland.org/bucket/) - 5GB free on IPFS and 100MB Free on Arweave
- [Storj](https://www.storj.io/) - 150GB free
- [Filebase](https://filebase.com/) - 5GB free

### Cross-chain (Ethereum) Operations

With its confidentiality and HTTP request support, you can safely store an Ethereum account in Phat Contract and use it to operate an Ethereum RPC node to do any cross-chain operations. Such pattern can be easily extended to support other blockchains.

[pink-web3](https://crates.io/crates/pink-web3) provides the cross-chain operation support for Ethereum.

### Other Crates

- [fat-contract-examples](https://github.com/Phala-Network/fat-contract-examples) contains the official examples of Phat Contract. The examples are up-to-date, and may use some not-yet-released features;
- [awesome-fat-contracts](https://github.com/Phala-Network/awesome-fat-contracts) collects the learning materials and some Phat Contract examples from previous hackathon submissions.
