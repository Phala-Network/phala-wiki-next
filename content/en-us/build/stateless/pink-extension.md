---
title: "Use Pink Extension"
weight: 3004
menu:
  build:
    parent: "phat-stateless"
---

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

Refer to our [Phat Hello World](https://github.com/Phala-Network/phat-hello/blob/master/lib.rs) contract to see how you can import these functions to your contract.
