---
title: Gatekeeper
weight: 10001
draft: false
menu:
  learn:
    parent: "maintain"
---

Gatekeepers contribute to the security of the decentralized Phala network.
\
Running a Gatekeeper (GK) in Phala Network means responsibility. You will be accountable for your stake and the stakes of your nominators. That said, your reputation and stake may be slashed if you make mistakes.

## Gatekeeper Election

Gatekeepers share the same `pRuntime` as normal workers (miners). To distinguish gatekeepers, their `IdentityKey` public keys are recorded in the `GatekeeperState` list on blockchain.

In the pre-mainnet of Phala Network, the list of gatekeepers is hard-coded in the genesis block of the blockchain.

> Gatekeepers are elected on blockchain by NPoS mechanism similar to Polkadot. This is done by `Staking` pallet, where nominators can stake their tokens, and vote for their trusted gatekeepers. Once a gatekeeper is elected, both itself and the nominators can get PoS reward from PHA inflation.

## MasterKey Generation

`MasterKey` is used to derive the keys to encrypt the states of confidential smart contracts and communicate. In Phala Network, only the `pRuntime` of a gatekeeper is authorized to manage the `MasterKey`. Noted that since `MasterKey` is managed by `pRuntime` and its usage is limited, even a malicious gatekeeper cannot decrypt any contract states without fully compromising the TEE and `pRuntime`.

`MasterKey` is a `secp256k1` key pair generated and managed by gatekeepers.

> We aim to plan to switch to `sr25519` in the future.

In the pre-mainnet of Phala Network, all the gatekeepers share the same pre-generated `MasterKey`.

> Through DKG (_[distributed key generation](https://en.wikipedia.org/wiki/Distributed_key_generation)_) more than one gatekeeper is required to produce a `MasterKey`, and each gatekeeper only hold a share of this key. When DKG is enabled, the contract key shares are provisioned to the workers (miners) by the gatekeepers separately.

##  Shared MasterKey Rotation

Similar to the rotation of `EcdhKey`, the `MasterKey` needs to be rotated regularly to achieve forward secrecy, and defend any attempts to leak `MasterKey` and decrypt the contract states.

> The rotation of `MasterKey` is triggered after certain interval of block height. The key to `MasterKey` rotation is the re-encryption of saved contract states. It may take several blocks to complete. `MasterKey` rotation is consisted of the following steps:

> - Gatekeepers generate the new `MasterKey`;
> - Gatekeepers use old `MasterKey` to decrypt the saved contract states, and use new `MasterKey` to encrypt them in parallel;
> - The old `MasterKey` and saved contract states are abandoned;
>
> Again, since all these operations happen inside `pRuntime` in TEE, the gatekeepers themselves cannot take a peek at the contract states.

## State Migration

We must make sure the data can be migrated to a new version of blockchain and pRuntime without revealing the contents. The state migration is triggered by on-chain governance decision denoted by an event, and can be achieved in the same way we proposed for `MasterKey` rotation.
