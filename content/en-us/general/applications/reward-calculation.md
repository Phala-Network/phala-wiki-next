---
title: 'Estimate Your Reward'
weight: 5011
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

Vaults act as the same role as delegators when Vaults delegate to StakePool. But Vault owner will charge an additional commission for the management of funds. Click to learn more about [Vault commission](https://wiki.phala.network/en-us/general/applications/vault/).

## Vault's APY

$Vault's APR=\frac{Delegations from Vault to StakePool\cdot StakePool's APR}{Total delegation in Vault}$

$Vault's APY={(\frac{Vault's APR}{365}+1)}^{365} - 1$

All rewards earned by Vaults are from StakePool delegations. However, we use ‘APY’ to evaluate the interest accrual in the Vault rather than ‘APR’ which is used in StakePools.

This was decided for the following reasons:

* Individual StakePool rewards can only increase with the addition of new workers.
StakePool rewards are derived from workers, and each worker can only earn a finite amount of income regardless of how much the delegation amount in the StakePool increases. Additional rewards can be earned only when the StakePool owner adds new workers.

* Vault owners have the ability to freely transfer delegations among different StakePools.
A Vault’s delegation rewards are derived from the StakePools it delegates to. If a certain StakePool is producing its maximum reward and doesn’t add more workers, the Vault owner can begin delegating to a new StakePool to continue increasing the rewards that Vault earns.

* The interest in the Vault delegation is compounded.
All delegation rewards in the Vault will remain in StakePools and will be compounded if they’re not withdrawn.

## How these variables affect reward

Human factors fall into the following categories:

1. *PoolMined*: The better the performance:up_arrow: of the workers in the StakePool, the more rewards:up_arrow: mined, and the more rewards:up_arrow: the delegators get;
2. *Commission*: The higher the commission:up_arrow:, the less reward:down_arrow: the delegators get;
3. *Delegated*: The higher the amount of delegation:up_arrow: in the StakePool, the less reward:down_arrow: the delegators get.

Among them, the 1st generally does not fluctuate greatly. The 2nd depends on the credit of the owner of the StakePool, and the 3rd may change steadily.
