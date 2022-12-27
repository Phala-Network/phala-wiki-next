---
title: "SideVM"
weight: 5002
draft: false
menu:
  build:
    parent: "phat-advanced"
---

## About SideVM

SideVM is the core extension of Phat Contract. Despite the advantages above, the raw Phat Contract still has limitations compared with current Web2 backend programs:

- Lifecycle limitation. The Phat Contract execution is triggered when users send on-chain transactions or off-chain queries to it, and the instance is destroyed when the execution finishes. This makes it impossible to do async requests or keep a long-live network connection;
- Program environment limitation. The Phat Contract inherits the limitations of Ink! and only supports `no_std` crates. This also limits the resources a contract can use (e.g. listening to a port for connections).

SideVM is proposed to tackle these limitations. It runs in a different runtime. This means it can continuously execute, support `std` library, and listen to the port.


## Prepare Environment

The SideVM support is already equipped to our public testnet. But it requires manual authorization to your contract to enable it to call the `start_sidevm()` function. Contact us is the `#dev` channel in our [Discord server](https://discord.gg/phala) to get support.

<!-- TODO.shelven -->
Also, you can run your local testnet following our [tutorial](xxx) and then do the testing.

## Play with it

### Programming SideVM

We use <https://github.com/Phala-Network/phat-contract-examples/tree/master/start_sidevm> as an example. It contains both the Phat contract and the SideVM program under `sideprog` folder.

The SideVM part listens to a local port. It will be launched by this [line of code](https://github.com/Phala-Network/phat-contract-examples/blob/master/start_sidevm/lib.rs#L29) if called.


### Compile Phat Contract and SideVM Program

Just `make` under the folder and it will give you
1. SideVM program `sideprog.wasm`
2. Phat contract under `target/ink/start_sidevm.contract`

### Upload SideVM Program and Instantiate the Contract

We have a [frontend](https://phat.phala.network/) but it does not support the SideVM program upload yet. So we need to upload it manually.

#### Upload SideVM Program

Use [Polkadot.js](https://polkadot.js.org/apps/) and change the endpoint to `Phala (PoC 5)` under `TEST NETWORKS`.

![](https://i.imgur.com/gerZoKj.png)

In `Developer` - `Extrinsics`, choose `phalaFatContracts` and `clusterUploadResource`. Change `resourceType` to `SidevmCode`, and drag your `sideprog.wasm` here.

Submit the transaction and you shall see its success.

#### Interact with Phat UI

Go to <https://phat.phala.network/>, click `sign in` and link your address. You need to ensure the `RPC Endpoint` is <wss://poc5.phala.network/ws> and `Default PRuntime Endpoint` <https://poc5.phala.network/tee-api-1>.

![](https://i.imgur.com/P3X0YVo.png)

Click `Upload` and drag your `target/ink/start_sidevm.contract`. Choose the default constructor and Cluster `0x0000000000000000000000000000000000000000000000000000000000000000`. Click `Submit`. You should see something like

![](https://i.imgur.com/M8PoeTO.png)

#### Start SideVM with Query

You can directly interact with your contract with Contract UI.

The `start_sidevm` query is used to start the SideVM program. It contains the [invoke](https://github.com/Phala-Network/phat-contract-examples/blob/master/start_sidevm/lib.rs#L29) to `pink::start_sidevm()`.

From the Worker log, we can see

![](https://i.imgur.com/DWjOeyh.png)

Actually, we implemented the log server with SideVM too ([ref](https://github.com/Phala-Network/phala-blockchain/pull/855)).

## More Resources

We do not have many documents on SideVM yet, feel free to ask us directly.

- Previous SideVM design: <https://github.com/Phala-Network/rfcs/blob/main/pink-sidevm/pink-sidevm.md>
- SideVM program examples under <https://github.com/Phala-Network/phala-blockchain/tree/master/crates/pink/sidevm/examples>
- Our SideVM-related PRs: <https://github.com/Phala-Network/phala-blockchain/pulls?q=sidevm+>
