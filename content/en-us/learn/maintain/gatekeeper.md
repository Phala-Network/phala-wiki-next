---
title: Gatekeeper
weight: 1003
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

> Gatekeepers are elected on blockchain by NPoS mechanism similar to Polkadot. This is done by `Staking` pallet, where nominators can stake their tokens, and vote for their trusted gatekeepers. Once a gatekeeper is elected, both itself and the nominators can get PoS reward from PHA inflation.

## MasterKey in Gatekeeper

`MasterKey` is used to derive the keys to encrypt the states of confidential smart contracts and communicate. In Phala Network, only the `pRuntime` of a gatekeeper is authorized to manage the `MasterKey`. Noted that since `MasterKey` is managed by `pRuntime` and its usage is limited, even a malicious gatekeeper cannot decrypt any contract states without fully compromising the Secure Enclave and `pRuntime`.

`MasterKey` is a `sr25519` key pair generated and managed by gatekeepers.

In the pre-mainnet of Phala Network, all the gatekeepers share the same pre-generated `MasterKey`.

> Through DKG (_[distributed key generation](https://en.wikipedia.org/wiki/Distributed_key_generation)_) more than one gatekeeper is required to produce a `MasterKey`, and each gatekeeper only hold a share of this key. When DKG is enabled, the contract key shares are provisioned to the workers (miners) by the gatekeepers separately.
>
