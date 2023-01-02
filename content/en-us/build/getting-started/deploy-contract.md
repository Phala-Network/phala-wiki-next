---
title: "Phat Contract Console"
weight: 2003
menu:
  build:
    parent: "phat-basic"
---

Phat Contract UI provides an easy way to upload your contract, instantiate it and interact with it.

- For public testnet, visit <https://phat.phala.network>
- For Closed Beta, visit <https://phat-cb.phala.network>

Before you use it, make sure you have prepared your test account, or follow our [tutorial](/en-us/build/getting-started/account-prep) to create one.

> Never use your personal accounts for testing in case of unexpected financial losses.


## Connect Wallet

![](/images/build/phat-ui.png)

On the homepage, click *Connect Wallet* in the right top corner, and choose the wallet you are using. The browser will pop up an *Authorize* window. Click Yes to allow authorization. Then you can connect to one of your accounts in the *Select Account* window.

## Connect to Blockchain

![](/images/build/phat-ui-endpoint-setting.png)

Click the green dot beside your account will tell you the information about the current chain you are connecting to.

![](/images/build/phat-ui-connection-info.png)

By default, the UI will connect to

-  [PoC-5 Testnet](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fpoc5.phala.network%2Fws#/explorer)
-  or [Closed Beta Testnet](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fphat-beta.phala.network%2Fkhala%2Fws#/explorer)

You can connect to any other chains by filling in the RPC Endpoint and click *Connect*. The UI will automatically read the cluster information from the chain and fill in the PRuntime for you, but you can always set it to other workers.

> **Why two endpoints**
>
> Unlike other blockchains like Ethereum where you have to call your contracts through on-chain transactions, Phat Contracts are finally deployed to the off-chain Secure Workers so you can interact with them directly without submitting any transactions. So the UI will ask for two endpoints, one to connect to the blockchain and another to the worker directly.

To connect to our mainnet or your local testnet, you need to specify two endpoints here:
- An RPC endpoint to connect to one of the Phala blockchain nodes to read the chain state and send transactions;
- A pRuntime endpoint to directly connect to one of our Workers where the [off-chain computation](https://medium.com/phala-network/fat-contract-introduce-off-chain-computation-to-smart-contract-dfc5839d5fb8) really happens;

## Claim Test Tokens

Once the account is connected, you can find the *Get Test-PHA* button on the right side of the page. You can request 100 test tokens by clicking it. Please do so if you haven't done it yet. The operations below require tokens as the transaction fee.

## Upload and Instantiate the Contract

Choose `Upload` and locate your `phat_hello.contract` file (you can download it from [previous section](/en-us/build/getting-started/prep/#hello-world-contract)). The UI will load the metadata of your contract and list all the constructor functions in the `Init Selector` section.

![](/images/build/phat-ui-upload.png)

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
> The blockchain will automatically push the contract code to the workers belong to the cluster you choose and instantiate it.

After the successful instantiation, you shall see the metadata of the deployed contract.

![](/images/build/phat-ui-metadata.png)

Also, you can expand the lower bar to see the raw events when deploying the contract.

![](/images/build/phat-ui-events.png)

## Interact with Your Contract

Scroll down the webpage and you can see all the interfaces of this contract, with their function names, types, and descriptions.

The interfaces are divided into two types, labeled by `TX` and `QUERY` respectively. This contract only contains one `QUERY` handler. We will cover the `TX` handler in the following section. The phat-hello contract has only one `QUERY` interface `get_eth_balance()`.

![](/images/build/phat-ui-input.png)

Click the run icon to send the request to the contract. For example, we can invoke the `get_eth_balance()` to get the current balance of a certain ETH address. The Polkadot.js extension will ask for your permission in the first click to encrypt your following traffic to the contract.

> **What happened**
>
> Every transaction or query to the contract is encrypted, thus needs your signature. To save your efforts for signing every query (since query can be frequent), we implement a certificate mechanism to keep your query signature valid for 15 minutes.

The `QUERY` returns immediately since it involves no on-chain transactions. Click the bottom status bar to see the execution result.

![](/images/build/phat-ui-result.png)

Congrats🎉! You have finished the basic tutorial of Phat Contract!
