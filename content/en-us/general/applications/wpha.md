---
title: 'WrappedBalances & W-PHA'
weight: 5008
draft: false
menu:
  general:
    parent: "general-delegation"
---

WrappedBalances is the name of a pallet with the function of wrapping W-PHA to delegate. And it also has the role of bookkeeping, which will record the total value of the Delegation and W-PHA in the address, and can help the user to cast a governance vote that does not exceed this total value.

W-PHA (Wrapped PHA) is the token that users use PHA to wrap from WrappedBalances 1-to-1. Used to contribute to StakePool or Vault to obtain Delegation NFT and earn delegation rewards.

## Why do we need W-PHA

In the StakePool V1, the PHA could be used as a delegation. While delegated in the StakePool, the Delegator can also use it for daily community governance voting. Because when you delegate your PHA to the StakePool, the status of the token will be adjusted to "locked", but it will remain in your address. Then you can use it for governance voting. This logic caused the Delegation to be unable to be transferred or traded.

In the process of NFTization of the Delegation, to improve the liquidity of the Delegation, we hope to set the NFTs in a tradable state and use a suitable mechanism to give these Delegation NFTs governance voting rights.

Therefore, we need to introduce the concept of WrappedBalances and W-PHA.

## How does it work

W-PHA is an asset on the Khala chain (Delegation is not yet enabled on the Phala chain, so there is no W-PHA on Phala yet). Therefore, when you wrap a W-PHA from WrappedBalances, your PHA will be transferred to the pallet (WrappedBalances) and locked there.

Delegators can only use W-PHA to delegate into a StakePool or a Vault.

* When the user delegates to a Vault or a StakePool, W-PHA will be transferred from the user address to the account of the pools
* When the Vault delegates to a StakePool, W-PHA will be transferred from the Vault address to the StakePool account
* When StakePool stakes the Delegation to the worker, W-PHA will be transferred to the worker staking account corresponding to the StakePool

> Please Note that use the "contribute" for all delegating operations to the pools and use the "start working" to set the worker to the active state.
>
> Do not transfer tokens to any pool or worker address manually. The protocol controls these addresses, and the tokens you manually transfer in cannot be transferred out forever.

WrappedBalances is a ledger responsible for calculating how much W-PHA each user has. When the user transfers W-PHA to the pool as a delegation, because of the existence of the Delegation NFT, it will treat the Delegation NFT as a delegation certificate. Therefore, the W-PHA will be counted into the address holding the Delegation NFT.

The process of W-PHA being transferred between the user and the pool will be fully calculated by WrappedBalances.

### PHA and W-PHA are always one-to-one exchange

Whenever a W-PHA is minted, a PHA will be locked in the pallet, which is a protocol-controlled rule.

When the W-PHA delegated into the StakePool is used as a delegation to obtain delegation rewards, the Delegation rewards it obtained (PHA) will be directly locked into the pallet, and the protocol will mint the same amount of W-PHA at the same time, which will automatically be delegated into the corresponding StakePool as a delegation. And be recorded in the corresponding Delegation NFT.

Because of this minting logic, W-PHA will not be issued maliciously, and it can be unwrapped to PHA at any time unless the holder uses its right to vote in WrappedBalances.

## Use your Delegation to vote

### You will not vote with any W-PHA or Delegation NFT

When you vote in WrappedBalances, you will not use any W-PHA or Delegation NFT to vote.

WrappedBalances uses a proxy voting mechanism.

When you wrap PHA to W-PHA through WrappedBalances, your voting rights will be held by the pallet along with the transfer of PHA. Therefore, WrappedBalances' bookkeeping function records how many voting rights it manages that belong to you. Then, when you want to initiate a vote in the pallet, it will calculate how many equivalent PHA assets you have locked in it based on the W-PHA and Delegation NFT you hold, which means how many voting rights you are represented by it. Then, you can direct WrappedBalances to cast these votes on your behalf.

This is the original logic of this proxy voting mechanism. The operation is to initiate a vote transaction in WrappedBalances, and the rest of the proxy voting will be completed by the protocol. As long as you have enough voting rights, the vote you initiate will be a success.

Once you vote for a proposal in WrappedBalances, it will temporarily lock a part of your W-PHA assets to lock the voting rights. This part of W-PHA will not be transferred or unwrapped to PHA until your vote is over.

### Different initiation methods, the same result

You can still use PHA to initiate voting in the [Polkadot.js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkhala.api.onfinality.io%2Fpublic-ws#/democracy) or [Subsquare](https://www.subsquare.io/). At the same time, you can use your proxy voting rights through WrappedBalances. But you cannot use your W-PHA or Delegation NFT to vote on Subsquare. So, for the time being, you can only use the locked assets in WrappedBalances to vote through making transactions in [extrinsics page of Polkadot.js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkhala.api.onfinality.io%2Fpublic-ws#/extrinsics).

This is a short-term phenomenon.

We are going to gather all the governance behaviors in the Phala APP. At that time, you will be able to use your PHA or Delegation for governance in the Phala App at the same time.
Please look forward to it.
