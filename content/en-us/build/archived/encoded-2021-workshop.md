---
title: "Phala x Encode Club Workshop"
weight: 9002
draft: true
menu:
  build:
    parent: "phat-archived"
---

## Phat Contract Workshop

> To get the code visit our [Phat Contract Workshop Repository](https://github.com/Phala-Network/fat-contract-workshop/tree/workshop-0.1)

## Prepare

1. [Cargo](https://rustup.rs/)

2. [Binaryen wasm toolchain](https://github.com/WebAssembly/binaryen). Install via a package manager or just put the release binaries to your $PATH environment. You will need at least version 99.

3. ink! contract toolkit

    ```sh
    cargo install cargo-contract --force
    ```

## Create a new ink! project

```sh
cargo contract new flipper
```

> Or you can clone this repo instead, but please pay attention to the filename.
>
> ```sh
> git clone https://github.com/Phala-Network/fat-contract-workshop.git
> ```

## Compile the contract
> Please note that you will need to use the nightly builds to build the contract. Run the following to resolve build failures or check out the [ink! repo](https://github.com/paritytech/cargo-contract#build-requires-the-nightly-toolchain).
>```sh
> cargo +nightly contract build
>```

```sh
cd flipper
cargo contract build
```

You will find the compile result at `./target/ink`:

> ```bash
> ~ ls -h target/ink
> flipper.contract  flipper.wasm  metadata.json
> ```

## Deploy

Collect the above three files and create the contract in a local testnet.

### Run the local testnet

Please follow the _Environment_ and _Build the Core Blockchain_ section in [this tutorial](/en-us/build/developer/run-a-local-development-network/#environment) to build a local testnet, but use the branch **master** instead (**important!**).

You should run all the three programs, `phala-node`, `pherry`, and `pruntime`, according to the _Build the Core Blockchain_ section in the tutorial.

![](./static/core-terminal.gif)

> Before running `pruntime`, please remove all the `*.seal` files in the `bin/` directory if there's any. The seal files are the state cache of pruntime, which cannot be shared across the chains. In this workshop we always start with a new local dev net. So you should make sure it doesn't reuse any seal file from another chain. If you forget to do so, the contract instantiation may not work.

### Attach the Polkadot.js browser app to the testnet

1. Enter [Polkadot.js Apps](https://polkadot.js.org/apps).
2. Click the icon at the left top corner to open the sidebar
3. Switch to "DEVELOPMENT > Custom" and enter your local `phala-node` ws rpc port (by default: ws://localhost:9944)

You should notice the frontend should load and show the blockchain status.

Now, make sure you have [Polkadot.js Extension](https://polkadot.js.org/extension/) installed and have the test account imported (At least `//Alice` and `//Bob`). You will be able to see some balance on the "Account" page under Alice and Bob. For more details, please check [the appendix](#Polkadotjs-Extension-and-the-common-seeds).

### Deploy the contract

**Query for workers.** Navigate to "Developer > Chain State", and select workers & deselect include option to get the listed workers for the next step.

![](/images/docs/developer/fat-contracts/fat-contract-query-workers.gif)

**One-off job.** Navigate to "Developer > Sudo" and send the following transaction. This only needs to be done once in a deployment.

```
phalaRegistry.registerGatekeeper(0x3a3d45dc55b57bf542f4c6ff41af080ec675317f4ed50ae1d2713bf9f892692d)
```

> The argument is the worker id (worker public key). This is the only (hard-coded) worker in your local deployment.

![](/images/docs/developer/fat-contracts/fat-contract-set-gatekeeper-verify.gif)

**First step.** Upload the contract code. Navigate to "Developer > Extrinsics", and select

```
phalaRegistry.uploadCode()
```

You should select the wasm file you got from the "Compile" section. Once it's done, you can navigate to the "Network > Explorer" page and find the `phalaRegistry.CodeUploaded` event with the code hash:

> phalaRegistry.CodeUploaded
> 0x911dd86247a3f196379e70c14357bdbb398b6283842d4bfc2213d44b5680eb2c (example, may vary in your build)

![](/images/docs/developer/fat-contracts/fat-contract-upload-flipper-code.gif)

**Next step.** Please note the code hash. Then navigate back to "Developer > Extrinsic" and select

```
phalaRegistry.instantiateContract()
```

- `codeIndex`: WasmCode(0x911dd86247a3f196379e70c14357bdbb398b6283842d4bfc2213d44b5680eb2c) (example)
- `data`: 0xed4b9d1b (the default() function)
- `salt`: 0x
- `deployWorker`: 0x3a3d45dc55b57bf542f4c6ff41af080ec675317f4ed50ae1d2713bf9f892692d

You should be able to see the following event:

> ```
> phalaRegistry.ContractInstantiated
>
> SpCoreSr25519Public ([u8;32])
>   0x4c66c3bf1e1b4dd02e7666e578e41570e79a544239d8ec77075651ba7879de5e (contract key)
> PhalaTypesContractContractInfo
>   {
>     deployer: 45R2pfjQUW2s9PQRHU48HQKLKHVMaDja7N3wpBtmF28UYDs2 (Alice)
>     groupId: 1
>     salt:
>     codeIndex: {
>       WasmCode: 0x911dd86247a3f196379e70c14357bdbb398b6283842d4bfc2213d44b5680eb2c (example)
>     }
>     instantiateData: 0xed4b9d1b
>   }
> ```

![](/images/docs/developer/fat-contracts/fat-contract-instantiate-code.gif)

**The final step.** Navigate to "Developer > Chain State" to get the contract id:

```
phalaRegistry.contractKey()
```

- include option: off

> ```
> [
>   [
>     [
>       0xcf4b9fd7eb64dc1fe5ca550e715a49fae9f5a2de88afd3c32daa137fcc8ca5b7 (contract id)
>     ]
>     0x4c66c3bf1e1b4dd02e7666e578e41570e79a544239d8ec77075651ba7879de5e (contract key)
>   ]
> ]
> ```

Now the contract is up and running at your worker (0x3a3d45dc55b57bf542f4c6ff41af080ec675317f4ed50ae1d2713bf9f892692d), with the contract id `0xcf4b9fd7eb64dc1fe5ca550e715a49fae9f5a2de88afd3c32daa137fcc8ca5b7`.

Please keep the contract id. It will be used in the next step.

## Interact with the contract

### Prerequest

1. Install Node (>= v14) and yarn.
2. Download and build Phala-Network/js-sdk (**fat-contract-workshop** branch)

    ```sh
    git clone --branch fat-contract-workshop https://github.com/Phala-Network/js-sdk.git
    ```

3. Edit `./packages/example/.env` to set the API endpoints. If you run a customized deployment please adjust according to your configuration:

    ```
    NEXT_PUBLIC_BASE_URL=http://localhost:8000
    NEXT_PUBLIC_WS_ENDPOINT=ws://localhost:9944
    ```

4. Compile and run the frontend. By default it will serve the app at <http://localhost:3000>:

    ```sh
    yarn
    yarn dev
    ```

### Interact

Open the app in your browser. You can use it to flip the bit in the flipper contract, and read the current boolean value in the contract.

1. Authorize the app for the Polkadot.js Extension access via the pop-up window
2. Choose an account with some balances (Alice or Bob) in the right-top drop-down
3. Click "Sign Certificate"

    > This step is necessary for Phat Contract Dapp because we use a certificate chain to do end-to-end encryption. Whenever you selected a new account, just sign a new certificate.

4. Paste the content of `metadata.json` to the ABI text box, and enter the contract id

    > Every time when you deploy a new contract, you will need to update the ABI and the contract address.

    > ![](/images/docs/developer/fat-contracts/fat-contract-copy-metadata-create-contract-gui.gif)

5. Click "Query" to call `get()`, and read the value
6. Click "Command" to call `flip()`
7. After around 6s, click "Query" to call `get()`. You should read a flipped value.

    > The 6s delay is due to the block finalization.

    > ![](/images/docs/developer/fat-contracts/fat-contract-interact-contract.gif)

![](./static/demo-ui.png)

## Challenge: "Secret" Flipper

We leave a challenge for you to explore the confidentiality of Phala's Phat Contract.

### How is it possible?

Fat Contracts are confidential by default. All the contract inputs, outputs, and states are encrypted. The data is only decrypted after arriving at the [Secure Enclave](https://www.anjuna.io/what-is-a-secure-enclave) (where the contract executor runs). As a result, although you can see the transactions and storage on the blockchain, they are just encrypted data.

So the only way to read some data from the contract is to send a **query**.

The query is not only end-to-end encrypted but also signed with your wallet key. In this way, the identity is attached to a query. With the signature attached, the ink! contract can determine the identity of the sender. This is done via the Phala Phat Contract executor, who validates the signature before running the contract.

More specifically, in an ink! query function, you determine the response based on the sender securely:

```rust
pub fn get(&self) -> Option<bool> {
    if self.env().caller() == self.admin {
        // The caller is the admin. Let's return some result
        // ...
    } else {
        // Otherwise, we can return something else
        // ...
    }
}
```

### Why cannot the vanilla ink! support storing secret?

In the vanilla ink! smart contract, each "query" also comes with a sender. The above code can of course compile and execute without any error.

However, it doesn't protect any secret. The sender field in the query is just an account (public key). In other words, anyone can feel free to specify any account as the query sender. The blockchain node doesn't require the sender to sign the query with its wallet.

Indeed, it doesn't make a lot of sense to require the signature. In an ordinary blockchain, all the data must be transparent and shared between all the nodes, as required by the consensus mechanism. As long as you run a full node, you get a full copy of the blockchain database. The query function just reads the data from the blockchain. Assuming we add the signature check just like what we do in Phat Contract, anyone can still make a modified version of the client to perform the query function to bypass any check. However, this doesn't work at Phala Network, because only an unmodified worker program (pRuntime) running in a canonical Secure Enclave can load the contract and get the key to decrypt the contract data. The Secure Enclave provides a strong layer of protection.

### Exercise

1. Modify the `get()` function in the Flipper contract to only return the result to the contract deployer, otherwise return an empty result
2. Change the js-app frontend and test it with two accounts (Alice to deploy the contract, and Bob to read the contract)

> Tip: After you have changed the return type of `get()` function, please don't forget to redeploy the contract, and replace the ABI in the frontend app.

### Solution

Please check the `solution` branch.

## Appendix

### Polkadot.js Extension and the common seeds

Phala App only accepts the official [Polkadot.js Extension](https://polkadot.js.org/extension/) as the wallet provider. In the local testnet, there are a few built-in well-known accounts for testing. To access them from the Polkadot.js Extension, you should import them to the extension with their raw seed. It's suggested to import at least Alice and Bob:

| Key       | Raw seed                                                           |
|-----------|--------------------------------------------------------------------|
| //Alice   | 0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a |
| //Bob     | 0x398f0c28f98885e046333d4a41c19cee4c37368a9832c6502f6cfd182e2aef89 |
| //Charlie | 0xbc1ede780f784bb6991a585e4f6e61522c14e1cae6ad0895fb57b9a205a8f938 |
| //Dave    | 0x868020ae0687dda7d57565093a69090211449845a7e11453612800b663307246 |
