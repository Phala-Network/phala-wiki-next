---
title: Mine
weight: 1001
draft: false
menu:
  learn:
    parent: "maintain"
---

Miners, also referred to as "Workers" in Phala blockchain, provide computing power to the Phala Network. Anyone with the appropriate hardware can participate.

> More information about hardware requirements: :point_right: [here](/en-us/docs/khala-mining/1-0-hardware-requirements/#general-khala-hardware-requirements)

This section provides some theory about the mining concepts of Phala and additional background information.

> To get directly started, feel free to check the quick start guide: :point_right: [here](/en-us/getting-started/mining/mine-phala/)

## Worker Registration

Registration is required before a worker or gatekeeper can join the network. After that, any parties with TEE-supported devices can serve as workers. To register as a validated worker in the blockchain, TEE runners need to run `pRuntime` and let it send a signed attestation report to gatekeepers.

`pRuntime` requests a Remote Attestation with a hash of the `WorkerInfo` committed in the attestation report. `WorkerInfo` includes the public key of `IdentityKey` and `EcdhKey` and other data collected from the enclave. By verifying the report, gatekeepers can know the hardware information of workers and ensure that they are running unmodified `pRuntime`.

## Remote Attestation

The attestation report is relayed to the blockchain by `register_worker()` call. The blockchain has the trusted certificates to validate the attestation report. It validates:

1. The signature of the report is correct;
2. The embedded hash in the report matches the hash of the submitted `WorkerInfo`;

`register_worker()` is called by workers, and a worker can only be assigned contracts when it has certain amounts of staking PHA tokens. On the blockchain there is a `WorkerState` map from the worker to the `WorkerInfo` entry. Gatekeepers will update the `WorkerState` map after they receive and verify the submitted `WorkerInfo`.

## Offline Worker Detection

The `pRuntime` of a worker is regularly required to answer the online challenge as a heartbeat event on chain. The blockchain detects the liveness of workers by monitoring the interval of their heartbeat events. A worker is punished with the penalty of his staking tokens if it goes offline during a contract execution.
