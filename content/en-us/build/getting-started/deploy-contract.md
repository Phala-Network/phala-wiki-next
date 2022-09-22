---
title: "Deploy Contract and Interact"
weight: 1003
menu:
  build:
    parent: "phat-basic"
---

[Phat Contract UI](https://phat.phala.network/) provides an easy way to upload your contract, instantiate it and interact with it.

Before you use it, make sure you have prepared your test account, or follow our [tutorial](/en-us/build/getting-started/account-prep) to create one.

> Never use your personal accounts for testing in case of unexpected financial losses.

## Connect to Blockchain

![](/images/build/phat-ui-endpoints.png)

By default, the UI will connect to our [public testnet](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fpoc5.phala.network%2Fws#/explorer).

> **Why two endpoints**
>
> Unlike other blockchains like Ethereum where you have to call your contracts through transactions, Phat Contracts are finally deployed to the off-chain Secure Workers so you can interact with them directly without submitting any transactions. So the UI will ask for two endpoints, one to connect to the blockchain and another to the Worker.

To connect to our mainnet or your local testnet, you need to specify two endpoints here:
- An RPC endpoint to connect to one of the Phala blockchain node to read the chain state and send transactions;
- A pRuntime endpoint to directly connect to one of our Workers where the [off-chain computation](https://medium.com/phala-network/fat-contract-introduce-off-chain-computation-to-smart-contract-dfc5839d5fb8) really happens;


## Upload and Instantiate Contract

![](/images/build/phat-ui-upload.png)

Choose `Upload` and locate your `.contract` file. The UI will load the metadata of your contract and list all the constructor functions in the `Init Selector` section.

> **About Cluster**
>
> Phala has over 10k Secure Workers. They are organized into Clusters so you can use their computing power easily without knowing the underlying details.
>
> In our testnet, we have prepared a public good Cluster which anyone can deploy their contracts to.

After you click the `Submit`, it will upload the contract WASM to the blockchain through transaction (the UI will ask for your permission).

> **What happened**
>
> Your contract code is uploaded to the blockchain with transaction, that's why your signature is needed. The code is public, together with your instantiation arguments, this is meant to so that everyone can verify the initial state of the contract.
>
> The blockchain will automatically push the contract code to the Workers belong to the cluster you choose and instantiate it.

After the successful instantiation, you shall see the metadata of the deployed contract.

![](/images/build/phat-ui-metadata.png)


## Interact with Your Contract

Scroll down the webpage and you can see all the interfaces of this contract, with their types, selectors and descriptions.

![](/images/build/phat-ui-interfaces.png)

The interfaces are divided into two types, labeled by `TX` and `QUERY` respectively. We will explain their difference in the following sections.

![](/images/build/phat-ui-input.png)

Click the run icon to send the request to the contract. For example, we can invoke the `get_eth_balance()` to get the current balance of certain ETH address. The Polkadot.js extension will ask for your permission in the first click to encrypt your following traffic to the contract.

> **What happened**
>
> Every transaction or query to the contract is encrypted, thus needs your signature. To save your efforts for signing every query (since query can be frequent), we implement a certificate mechanism to keep your query signature valid for 15 minutes.

The `QUERY` returns immediately since it involves no on-chain transactions. Click the bottom status bar to see the execution result.

![](/images/build/phat-ui-result.png)

Congrats🎉! You have finished the basic tutorial of Phat Contract!
