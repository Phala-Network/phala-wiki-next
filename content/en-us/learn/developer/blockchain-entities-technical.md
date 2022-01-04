---
title: Blockchain Entities Technical
weight: 1000
draft: false
menu:
  learn:
    parent: "developer"
---

The [Blockchain Entities](/en-us/learn/phala-blockchain/blockchain-entities/) section in Learn provides a generally high introduction level, while this section briefly introduces the technical concepts of Phala's blockchain entities.

## Entity Key Initialization

In Phala, the communication between any entity should be encrypted, so each entity generates the following entities key pairs with a pseudorandom number generator during initialization:

1. `IdentityKey`
   - a `secp256k1` key pair to uniquely identify an entity;
2. `EcdhKey`
   - a `secp256r1` key pair for secure communication;

### pRuntime Initialization

During initialization, `pRuntime` automatically generates the entity key pairs above with a pseudorandom number generator. The generated key pairs are managed in `pRuntime` in the TEE, which means the workers and gatekeepers can only use it with the limited APIs exported by `pRuntime`, and can never gain the plaintext key pairs to read the encrypted data out of the TEE.

The generated key pairs can be locally encrypted and cached on the disk by the `SGX Sealing` and decrypted and loaded when restarting. This applies to both gatekeepers and workers.

## Secure Communication Channels

The `EcdhKey` public key in the `pRuntime` of a worker or gatekeeper is publicly available. Therefore a [ECDH key agreement protocol](https://wiki.openssl.org/index.php/Elliptic_Curve_Diffie_Hellman) can be applied to establish a secure communication channel between a worker (or a gatekeeper) and any other entity non-interactively.

A channel between two entities, `A` and `B` is denoted as $Channel(Pk_A, Pk_B)$, where $Pk_A$ and $Pk_B$ is the public key their ECDH key pairs correspondingly. A shared secret can be derived from one's ECDH private key and the counterpart's public key via the Diffie Hellman algorithm. Then the final communication key `CommKey(A, B)` can be calculated via a one-way function. Finally, `CommKey(A, B)` is used to encrypt the messages between the two entities.

{{< tip >}}
In pre-mainnet, the `EcdhKey` is a `secp256r1` key pair. We can adopt the [child key derivation (CKD) functions](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#child-key-derivation-ckd-functions) from Bitcoin BIP32 to derive `CommKey(A, B)` from the key agreed by ECDH.

The messages are E2EE with `aes-gcm-256`.
{{< /tip >}}

The public key of the entities are registered on-chain. So we can build on-chain or off-chain communication channels:

- On-chain Communication
  1. Both `A` and `B` knows each other's public key from the blockchain. They can derives `CommKey(A, B)`;
  2. `A` posts a cipher message encrypted by `CommKey(A, B)` to the blockchain;
  3. `B` receives it, and decrypt it with `CommKey(A, B)`;
- Off-chain (`A` is off-chain and `B` is an on-chain worker) Communication
  1. `A` can learn `B`'s public key from the blockchain and derive `CommKey(A, B)`;
  2. `A` learns the API endpoint of `B` from its `WorkerInfo` in `WorkerState` on chain;
  3. `A` sends a signed cipher message (encrypted by `CommKey(A, B)`) with its public key to `B` directly;
  4. `B` gets `A`'s public key from the message, and derive `CommKey(A, B)` to decrypt it;

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

- `nonce` is necessary for defending against Double-spend and Replay Attack.
- `from` field shows the identity of caller, and can be verified with `sig`. `from` will be further passed to contract.
- Since a worker can run multiple contracts (or even different instances of the same contract), `to` is needed to specify the invocation target.
- `input` encodes the invoked function and arguments, it should be serialized according to the ABI of contracts.

## Serialization

> ## `EcdhKey` Rotation
>
> Unlike the `IdentityKey` which shows the identity of a worker or gatekeeper thus should not be changed, we recommend a regular rotation of the `EcdhKey` to ensure the security of the communication channels between different entities. In the future, `pRuntime` will automatically rotate the managed `EcdhKey` key after certain time interval.