---
title: 'Use wPHA or delegation NFT for governance voting'
weight: 5012
draft: false
menu:
  general:
    parent: "general-delegation"
---


After the implementation of the StakePoolv2 feature, there has been a change in how delegations are stored in users' accounts. Previously, delegations were locked tokens, but now they are converted into wPHA and transferred to the StakePool in exchange for Delegation NFTs. As a consequence of this change, users are no longer able to use their delegations for direct voting on platforms such as subsquare.

In this page, we will guide you through the process of using Delegation NFT and wPHA in your account to participate in voting on Polkadot.js.

## Why can Delegation NFT and wPHA be used for voting?

In reality, The item used for voting is not Delegation NFTs or wPHAs, but locked PHAs. 
When users use WrappedBalances to exchange between PHA and wPHA tokens, WrappedBalances serves as an on-chain ledger that records ownership information for all wPHA tokens on the chain. All locked PHA is counted in WrappedBalances, and the corresponding voting right is assigned to the respective owner.

In other words, WrappedBalances will provide a combined value of your Delegation NFT and wPHA holdings, and allowing you to utilize this value to participate in voting for PHA.

## How to track my voting right

By utilizing on-chain queries, you can get the total value of your Delegation NFT and wPHA holdings. Within the Phala App, this information can be easily find it.

![](https://i.imgur.com/HMHwrrv.png)

*The value of your Delegation NFT and wPHA is indicated in the top left corner of the image as Delegation.*

It means that you have the corresponding right to vote.

## How to vote

* Using Polkadot.js, go to the [Extrinsics page](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkhala-api.phala.network%2Fws#/extrinsics)
* find `PhalaWrappedBalances`. Select `vote`. This is the entrance for voting.

![](https://i.imgur.com/Ssl3fdW.png)

* Please enter the number of votes you agree/disagree in the `aye` or `nay` column. Note that since we're using the u128 format here, you need to add 12 zeros at the end of the input value. So you'll need to input `5000000000000` to represent `5` votes.
* Enter the Referendum id in the `voteId: u32 (ReferendumIndex)` column, and you can find it on the [democracy page](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkhala-api.phala.network%2Fws#/democracy)
* Click `Submit Transaction` and sign the signature. Then the voting will be finished.

## How can I cancel my previous vote history and initiate a new vote?

You just need to initiate a new voting transaction, and the previous voting transaction will be directly replaced by the new one.

## The voting is over. How can I unlock my voting rights?

* Firstly, with the [same page](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkhala-api.phala.network%2Fws#/extrinsics), select `democracy.removeVote(index)`, enter the ended Referendum ID, remove your vote.
![](https://i.imgur.com/zKV1Emp.png)
* Secondly, go back to WrappedBalances and select `WrappedBalances.unlock(voteId, maxIterations)`. Enter the Referendum ID and the number of voting tokens you want to unlock, submit the transaction to unlock your them.
![](https://i.imgur.com/ttv0L5D.png)

Now your tokens have been unlocked.

**In summary, the voting process using WrappedBalance becomes to be challenging due to the need to transfer tokens during staking, which is not a seamless operation. However, we are actively working on improving this process to make it more user-friendly. Our goal is to create a separate voting page that enables users to vote and unlock with just one click, thus streamlining the process and making it more accessible for all.**



