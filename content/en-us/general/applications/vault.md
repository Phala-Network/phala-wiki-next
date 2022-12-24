---
title: 'What's Vault'
weight: 5006
draft: false
menu:
  general:
    parent: "general-delegation"
---

Vault is a function designed for delegation proxy. Vaults are pools of funds with an associated strategy that aim to maximize returns on the assets they hold.

Delegators can also skip Vault and delegate to StakePool directly.

## Why we need Vault?

‘Delegating’ refers to the process of contributing tokens to a public validator node. In Phala Network, delegating is referred to as ‘stake to earn’, whereby delegators receive incentives from the rewards of active workers.

StakePools, which are overseen by pool operators, enable users to pool their tokens to increase their chances of earning block rewards. However, for novice delegators, it is often difficult to identify high-quality StakePools, as this process is dependent upon utilizing complex indicators such as creation time, past performance, APR, etc.

The ‘quality’ of a StakePool can be determined by its performance in rewarding its delegators on a consistent basis. Therefore, if delegators unknowingly select a ‘bad’ StakePool, they’re at risk of receiving decreased rewards or no rewards. Minimizing the probability of this occurring is crucial to maintaining community confidence and avoiding risks of network instability.

Vaults increase the probability of high-performance workers being chosen as experienced agents are incentivised to assist with the process of StakePool selection.

## About Vault

> Before you start to understand Vault, please make sure you have a clear understanding of [how StakePool works](https://wiki.phala.network/en-us/general/applications/stakepool/)

### How Vault works?

![](https://i.imgur.com/OyI4jab.png)

The above image illustrates how our delegation system operates with the introduction of Vaults. PHA holders will be able to delegate into either a StakePool or a Vault, taking into account the following:

 * Vault owners select and delegate the Vault’s PHA to ‘high-quality’ StakePools;
 * A Vault owner’s reward is based upon the commission share (set by Vault owner) of all delegation rewards accrued by the Vault;
 * To the StakePool, there is no difference between delegations from common delegators or Vaults;
 * A Vault cannot delegate to other Vaults.

### Vault delegation NFTization

With the introduction of Vaults, there will now be two categories of delegation NFTs: a Proof of Delegation NFT (Vault NFT) representing delegation to a Vault, and a Certificate of StakePool Delegation NFT representing delegation directly to a StakePool. Same as delegating to StakePools, when the user delegates to a Vault, the user will also receive a Delegation NFT as a proof of your Delegation in the Vault.

The Vault Delegation NFT has the same function as the StakePool Delegation NFT: it will be transferable and able to be sold in the PhalaWorld marketplace. 

> NOTE When your Delegation NFT is transferred or sold to someone else, the delegated PHA will no longer belong to you, because you have lost the certificate to withdraw it back from the corresponding  Vault.

### Vault only has "Delegate" and "Withdraw" permissions

Vault owners only have the permission to move PHA in and out of StakePools. Therefore, **Vault owners can NEVER transfer your tokens to an external account.** This avoids your assets being permanently locked or tampered with.

For Vault users, **please ensure that you never transfer your assets to Vault account, only delegate them.**

### Different withdrawal scenarios between Vault and StakePool

![](https://i.imgur.com/LpHll0z.png)

All tokens delegated by the delegators to Vault will most likely be delegated to the StakePool. When the delegators wants to withdraw tokens from the Vault, once there are not enough free delegations in the Vault, the Vault needs to apply to the StakePool for withdrawal.

As Vaults are derivatives of StakePool delegations, withdrawals from Vaults are already subject to the maximum StakePool withdrawal period of 14 days. For Vaults, we’ve extended this withdrawal period by a week to allow for asset turnover within the Vault, making the maximum withdrawal period 21 days.

Within seven days after the withdrawal queue of the delegator is created, the Vault owner needs to ensure that the Vault has enough free delegation to eliminate the withdrawal queue, or initiate a withdrawal application to the StakePool within seven days. 

Seven days after the withdrawal queue is created, once a delegator initiates a check balance transaction, and at the same time, the total amount of withdrawal requests to the StakePool and the free delegation in Vault is not enough to repay the withdrawal queue, the Vault will be frozen until the withdraw queues in the Vault are all eliminated.

Vault being frozen means:
* Vault will initiate the withdrawal application for the entire delegation amount to all StakePools it delegated
* During the freezing process, the Vault Owner cannot conduct any other transactions except for delegating to the Vault

### All rewards in Vault come from the StakePool

Vault does not create additional rewards, all rewards in Vault come from StakePool. The vault owner achieves the highest vault APY by choosing a StakePool with the highest APR.

The reason why we call StakePool’s rate of return APR, and Vault’s APY is：

 * Individual StakePool rewards can only increase with the addition of new workers.
StakePool rewards are derived from workers, and each worker can only earn a finite amount of income regardless of how much the delegation amount in the StakePool increases. Additional rewards can be earned only when the StakePool owner adds new workers.
 * Vault’s delegation rewards comes from the StakePool’s delegator rewards. When the StakePool owner cannot add workers in time, the vault owner can transfer funds between different StakePools to realize that each tokens is effectively earning rewards, not limited to the growth rate of workers 

## About Vault Owner

### How is the Vault owner's reward calculated?

The vault owner will get a commission based on the delegator rewards of the delegation in the vault. This commission value is set by the Vault Owner and it will be manually executed by the Vault owner. After each execution, the rewards earned between the last two executions will be used as the base to draw a commissions for the pool owner.

The Share Price [(Click here to learn what's Share)](https://wiki.phala.network/en-us/general/applications/share/) in the pool will change with each reward or slash. Between the last two commission executions, the number of Share Price changed multiplied by the total value of Shares, represents the sum of total rewards and Slash in the pool which issued accumulatively during this period.

We extract commissions from the stock delegation by issuing additional Shares for the Vault. The additional Shares will still be stored in the Vault and can be assigned by the Vault owner.

Here is an example:

|Action|Delegation in Vault|Total Share|Share price|remarks|
|--|--|--|--|--|
|Tom Create the Vault #001|0|0|1|The initial price is 1|
|Bob delegates 10000 $PHA in #001|10000|10000|1|Bob has 1000 Shares|
|#001 earned 50 $PHA rewards|10050|10000|1.005|Bob still has 1000 Shares|
|Jack delegates 3000 $PHA in #001|13500|12985.07|1.005|Jack has 2,985.07 shares because the price is 1.005|
|Tom execute the commission(5%) |13500|12988.3|1.00475|Tom got 3.23 Shares as the Vault owner reward|

### Recommendations for Vault Owner

Successful Vault owners will be experienced members of the Phala community who are very familiar with managing StakePool delegations. Vault owners should be willing to commit significant time and effort to managing their Vault, which includes coordinating with StakePool owners and delegators, developing a delegation strategy, and onboarding newcomers. Vault ownership can be a very profitable activity, and it follows that the more you put into managing your Vault, the more you will get out of it.

For Delegators, we recommend evaluating Vaults based on their TVL and overall stability, which will be more important in the long run than the APY.
