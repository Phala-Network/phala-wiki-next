---
title: 'Estimate Your Reward'
weight: 5008
draft: false
menu:
  general:
    parent: "general-delegation"
---

![](/images/general/delegate.png)
## StakePool's APR

$APR=\frac{PoolRewardPerHour \cdot 24\cdot 365\cdot(1-TreasuryRatio)\cdot(1-Commission)}{Delegated}$

- *PoolRewardPerHour* is the theoretical estimation of the number of tokens mined in the next hour based on the status and attributes of the Workers in StakePool;
- *TreasuryRatio* is a fixed amount of mining rewards that is handed over to the treasury, which remains as 20%;
- *Commission* is the management fee left to the StakePool's owner, which is also set by the owner;
- *Delegated* is the total delegated amount in this StakePool.

## Pool Owner Reward

$Owner Reward=PoolMined \cdot (1-TreasuryRatio) \cdot Commission$

## Delegator Reward

$Delegator Reward = PoolMined \cdot (1-TreasuryRatio) \cdot (1-Commission) \cdot \frac{UserDelegation}{Delegated}$

- *UserDelegation* is the delegation amount of a Delegator in the StakePool

## How these variables affect reward

Human factors fall into the following categories:

1. *PoolMined*: The better the performance:up_arrow: of the workers in the StakePool, the more rewards:up_arrow: mined, and the more rewards:up_arrow: the delegators get;
2. *Commission*: The higher the commission:up_arrow:, the less reward:down_arrow: the delegators get;
3. *Delegated*: The higher the amount of delegation:up_arrow: in the StakePool, the less reward:down_arrow: the delegators get.

Among them, the 1st generally does not fluctuate greatly. The 2nd depends on the credit of the owner of the StakePool, and the 3rd may change steadily.
