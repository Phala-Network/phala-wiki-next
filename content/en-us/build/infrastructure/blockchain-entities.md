---
title: "Blockchain Entities"
weight: 5002
draft: false
menu:
  build:
    parent: "infra"
---

## Overview

The last chapter covered Phala's architecture, whereas this page will touch on Phala's entities and the types of nodes that make Phala Network.

In Phala Network, there are three kinds of entities:

- _Client_, which operates on normal devices without any special hardware requirements;
- _Worker_, which operates on Secure Enclave and serves as the computation nodes for confidential smart contracts;
- _Gatekeeper_, which operates on Secure Enclave and serves as the authorities and key managers;

The image below visualizes the interaction between Phala's entities.

![Phala Network](/images/docs/spec/phala-design.png)

The basic design of Phala Network is meant to ensure the security and confidentiality of the blockchain and its [Phat Contract](/en-us/build/developer/intro/). However, with more security improvements, Phala Network can defend against advanced attacks.

## Entity Key Initialization

In Phala, the communication between any entity should be encrypted, so each entity generates the following entity key pairs with a pseudorandom number generator during initialization:

1. `IdentityKey`
   - an `sr25519` key pair to uniquely identify an entity;
2. `EcdhKey`
   - an `sr25519` key pair for secure communication;

### pRuntime Initialization

During initialization, `pRuntime` automatically generates the entity key pairs above with a random number generator. The generated key pairs are managed in `pRuntime` in the Secure Enclave, which means the workers and gatekeepers can only use it with the limited APIs exported by `pRuntime`, and can never gain the plaintext key pairs to read the encrypted data out of the Secure Enclave.

The generated key pairs can be locally encrypted and cached on the disk with [Sealing](https://sgx101.gitbook.io/sgx101/sgx-bootstrap/sealing) and decrypted and loaded when restarting. This applies to both gatekeepers and workers.

## Secure Communication Channels

The `EcdhKey` public key in the `pRuntime` of a worker or gatekeeper is publicly available. Therefore an [ECDH key agreement protocol](https://wiki.openssl.org/index.php/Elliptic_Curve_Diffie_Hellman) can be applied to establish a secure communication channel between a worker (or a gatekeeper) and any other entity non-interactively.

A channel between two entities, `A` and `B` is denoted as $Channel(Pk_A, Pk_B)$, where $Pk_A$ and $Pk_B$ are the public keys of their ECDH key pairs correspondingly. A shared secret can be derived from one's ECDH private key and the counterpart's public key via the Diffie Hellman algorithm. Then the final communication key `CommKey(A, B)` can be calculated via a one-way function. Finally, `CommKey(A, B)` is used to encrypt the messages between the two entities.

> In Khala, the `EcdhKey` is an `sr25519` key pair. We can adopt the [child key derivation (CKD) functions](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#child-key-derivation-ckd-functions) from Bitcoin BIP32 to derive `CommKey(A, B)` from the key agreed by ECDH.
>
> The messages are end-to-end encrypted with `aes-gcm-256`.

The public keys of the entities are registered on-chain. So we can build on-chain or off-chain communication channels:

- On-chain Communication
  1. Both `A` and `B` know each other's public keys from the blockchain. They can derives `CommKey(A, B)`;
  2. `A` posts a cipher message encrypted by `CommKey(A, B)` to the blockchain;
  3. `B` receives it, and decrypts it with `CommKey(A, B)`;
- Off-chain (`A` is off-chain and `B` is an on-chain worker) Communication
  1. `A` can learn `B`'s public key from the blockchain and derive `CommKey(A, B)`;
  2. `A` learns the API endpoint of `B` from its `WorkerInfo` in `WorkerState` on chain;
  3. `A` sends a signed cipher message (encrypted by `CommKey(A, B)`) with its public key to `B` directly;
  4. `B` gets `A`'s public key from the message, and derives `CommKey(A, B)` to decrypt it;

### Client-worker Payload Example

A client communicates with a worker only for contract invocation. An invocation consists of at least the following payloads.

```js
{
    from: Client_IdentityKey,
    payload: {
        to: Contract_IdentityKey,
        input: "0xdeadbeef",
    },
    nonce: 12345,
    sig: UserSignature,
}
```

- `nonce` is necessary for defending against Double-spend and Replay Attacks.
- `from` shows the identity of the caller, and can be verified with `sig`. `from` will be further passed to the contract.
- Since a worker can run multiple contracts (or even different instances of the same contract), `to` is needed to specify the invocation target.
- `input` encodes the invoked function and arguments, it should be serialized according to the ABI of contracts.

## Serialization

> ## `EcdhKey` Rotation
>
> Unlike the `IdentityKey` which shows the identity of a worker or gatekeeper thus should not be changed, we recommend a regular rotation of the `EcdhKey` to ensure the security of the communication channels between different entities. In the future, `pRuntime` will automatically rotate the managed `EcdhKey` key after certain time interval.
