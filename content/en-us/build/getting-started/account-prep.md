---
title: "Prepare Test Account"
weight: 2010
menu:
  build:
    parent: "phat-basic"
---

We recommend to use [Phala Testnet](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fpoc5.phala.network%2Fws#/explorer) for contract testing.

To deploy your contract to testnet, you need to
-  generate your own test account;
-  transfer some test tokens to it to ensure you have enough balance to pay for the deployment transaction fee.

In the following tutorial, we use the [Polkadot.js extension](https://polkadot.js.org/extension/) as the default wallet. Other wallets are available [here](/en-us/general/applications/extension-wallet/).

## Setup Your Test Account

### Create Test Account with Polkadot.js

> Never use your personal accounts for testing in case of unexpected financial losses.

1. Install [Polkadot.js extension](https://polkadot.js.org/extension/);
2. Choose your installed Polkadot.js extension;
3. Click "+", and choose "Create new account";

<p align="center">
  <img src="/images/docs/khala-user/new-account.png" width="400"/>
</p>

4. Keep mnemonic seed safe;
5. Choose Network "Allow use on any chain", fill in the descriptive name and password, and click "Add the account with the generated seed".

<p align="center">
  <img src="/images/docs/khala-user/choose-network.png" width="400"/>
</p>

> You can refer to the Polkadot.js [official tutorial](https://wiki.polkadot.network/docs/learn-account-generation#polkadotjs-browser-extension) for more usages.

### Transfer Test Tokens

The balance of all the accounts is available on the [Polkadot.js app](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fpoc5.phala.network%2Fws#/accounts).

1. Send some tokens from any development account;

![](/images/build/tutor-transfer.png)

2. Choose your account in the "send to address" and type in the amount (1000 is more than enough);

![](/images/build/tutor-choose-to.png)

3. Click "Make transfer";
4. Check your account balance in the [Accounts page](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fpoc5.phala.network%2Fws#/accounts).
