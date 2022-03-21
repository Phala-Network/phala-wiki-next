---
title: 'Estimate Your Reword'
weight: 1006
draft: false
menu:
  general:
    parent: "applications"
---

## StakePool's APR

$APR=\frac{PoolRewardPerHour \cdot 24\cdot 365\cdot(1-TreasuryRatio)\cdot(1-Commission)}{Delegated}$

- *PoolRewardPerHour* is the theoretical estimation of the number of tokens mined in the next hour based on the status and attributes of the Workers in StakePool;
- *TreasuryRatio* is a fixed amount of mining rewards that is handed over to the treasury, which remains as 20%;
- *Commission* is the management fee left to the StakePool's owner, which is also set by the owner;
- *Delegated* is the total delegated amount in this StakePool.

## Pool Owner Reward

$Owner Reward=PoolMined \cdot (1-TreasuryRatio) \cdot Commission$

## Delegator Reward

![](/images/general/delegate.png)

$Delegator Reward = PoolMined \cdot (1-TreasuryRatio) \cdot (1-Commission) \cdot \frac{UserDelegation}{Delegated}$

- *UserDelegation* is the delegation amount of a Delegator in the StakePool
