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

To connect to our mainnet or your local testnet, you need to specify two endpoints here:
- An RPC endpoint to connect to one of the Phala blockchain node to read the chain state and send transactions;
- A pRuntime endpoint to directly connect to one of our Workers where the [off-chain computation](https://medium.com/phala-network/fat-contract-introduce-off-chain-computation-to-smart-contract-dfc5839d5fb8) really happens;


## Upload and Instantiate Contract

![](/images/build/phat-ui-upload.png)

Choose `Upload` and locate your `.contract` file. The UI will load the metadata of your contract and list all the constructor functions in the `Init Selector` section.

After you click the `Submit`, it will upload the contract WASM to the blockchain through transaction (the UI will ask for your permission).

After the successful instantiation, you shall see the metadata of the deployed contract.

![](/images/build/phat-ui-metadata.png)


## Interact with Your Contract

Scroll down the webpage and you can see all the interfaces of this contract.

![](/images/build/phat-ui-interfaces.png)

The interfaces are divided into two classes, labeled by `TX` and `QUERY` respectively. We will explain their difference in the followign sections.

Click the thunder icon to send the request to the contract. For example, we can invoke the `get()` to get the current value of the flipper coin. Click the bottom status bar to see the execution result.

![](/images/build/phat-ui-query-result.png)

Congrats🎉! You have finished the basic tutorial of Phat Contract!
