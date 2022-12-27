---
title: "What's share"
weight: 5007
draft: false
menu:
  general:
    parent: "general-delegation"
---

Here is a universal concept in the Stakepool and Vault: **Share**

A user’s ‘Share’ is a conversion unit that records the ratio of their contribution to a given pool. When delegator rewards are distributed, the rewards are evenly distributed to each Share to realize the distribution of rewards to each delegation in the Stakepool.

## Share has Price.

Price means "How much PHA is worth for each Share", A ‘unit price’ refers to the total value of your share of PHA in a pool.

Price = Total Value / Total Share

* Total Value: How many PHAs (delegation) are there in the pool: 
* Total Share: How many Shares are there in the pool: 

Two values above of the pool ( either Stakepool or Vault) will be stored on chain. Therefore, Share in different pools have different price.

Price will not be impacted by withdrawals or the actions of delegates. Fluctuations will only occur due to slashing and the allocation of rewards in the pool. Please note slashing is not currently active.

When rewards are allocated, the total delegation of the pool will increase, but the shares will not change, thus the price of each Share will rise. Likewise, slash will cause the share price to decrease.

## How Share changes

Only two factors can affect shares, delegations and withdrawals.

The change of Share will only happen when the user delegates or withdraws from the pool, and when different delegators delegate to the pool respectively, it will change the proportion of delegations owned by delegators in the pool by continuously issuing shares. When the delegators want to withdraw the delegation, it will withdraw the corresponding PHA from the pool to the delegators through the real-time share price.

Despite one exception, Vault shares will be issued when Vault owners receive their rewards, at which point the shares will also increase. [Learn more about Vault](https://wiki.phala.network/en-us/general/applications/vault/)

Here is an example:

|Action|Delegation in Vault|Total Share|Share price|remarks|
|--|--|--|--|--|
|Tom Create the Vault #001|0|0|1|The initial price is 1|
|Bob delegates 10000 $PHA in #001|10000|10000|1|Bob has 1000 Shares|
|#001 earned 50 $PHA rewards|10050|10000|1.005|Bob still has 1000 Shares|
|Jack delegates 3000 $PHA in #001|13050|12985.07|1.005|Jack has 2,985.07 shares because the price is 1.005|
|Tom execute the commission(5%) |13050|12988.3|1.00475|Tom got 3.23 Shares as the Vault owner reward|
