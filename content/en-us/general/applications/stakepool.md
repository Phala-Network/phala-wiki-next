---
title: 'Delegate to a Stakepool'
weight: 1004
draft: false
menu:
  general:
    parent: "applications"
---

## Why Delegation is Needed?

Delegation is the method of "stake to earn" in Phala and Khala Network (both represented by Phala below).

- In order to ensure the stability and security of Phala Network computing power, a staking mechanism is required for mining in Phala;
- To improve staking flexibility and efficiency, Phala provides a delegate mechanism in which delegators can participate and get rewards;
- PHA holders can get PHA rewards by simply delegating PHA to the StakePool without Workers;
- Delegation indirectly helps Phala Network select high-quality Workers while delegators are also contributing to Phala Network.

## Delegation Mechanism

### Main Characters

| Character | Description                                                                                                                                                                                                                                                                                     | Types            |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| Delegator | The account that delegates PHA into StakePool                                                                                                                                                                                                                                                   | On-chain Account |
| StakePool | StakePools are created, owned, and managed by the owner. The delegator put PHA into the StakePool, and the owner can only use the tokens for staking.                                                                                                                                           | On-chain Object  |
| Owner     | The account that created the StakePool is the owner of the StakePool. It is a person who controls the owner's account.                                                                                                                                                                          | On-chain Account |
| Worker    | A Worker can only be bound to one StakePool. The StakePool owner controls Workers. The owner of the StakePool uses the funds in the StakePool to stake the workers to start up. The output of the workers will be distributed to the owner and the delegators. The mechanism is detailed below. | Physical Machine |

### How It Works

![](/images/general/overall.png)

- The holder of PHA delegates PHA into a StakePool;
- The owner of that StakePool uses the funds in the StakePool to stake the workers and start mining;
- The tokens mined by the Workers are distributed to the owner and the delegators.


### FAQ

#### 1. Can I delegate PHA to any StakePool?

As long as the remaining amount of the StakePool is sufficient in a StakePool, you can delegate PHA into it.

<p align="center">
  <img src="/images/general/stakepool.png" />
</p>

The remaining amount is the hard cap of the StakePool (the maximum amount that can be delegated to StakePool set by the owner, which is unlimited by default)  minus the amount that has been delegated.

> Note: The owner can also delegate into his own StakePool as a delegator, and share the rewards as a delegator.

#### 2. Will I be rewarded for delegating PHA into the Stakepool?

Simply delegating into the StakePool **DOES NOT** guarantee rewards. For example, if there are no running Workers in the StakePool, and the commission is set to 100%, there will be no reward.

#### 3. How are the rewards distributed?

The output and distribution process of the reward is as follows:

- The Workers in the StakePool mine tokens on a regular basis (at least once every two days);
- The tokens mined by each Worker are first distributed to the Owner according to the commission set;
- The rest is distributed to all delegators according to the delegation amount.

#### 4. How long will it take to receive the reward?

If it is not in the above scenario, your reward should be received within **two days**.

#### 5. How to claim the award?

You can get the reward in Phala App. Please refer to the [delegation tutorial](/en-us/general/applications/phala-app) for details.

#### 6. How is reward size affected?

Learn about the [Reward Formulas](/en-us/general/applications/reward-calculation) to estimate your reward. In general, human factors fall into the following categories:

**FIX THIS**

-PoolMined The overall performance of miners⬆️, namely PoolMined
    1. Commission⬇️
    2. Delegated⬇️
1. Among them, a generally does not fluctuate greatly. b depends on the credit of the owner of the StakePool, and c may change steadily

#### 7. Can the funds delegated to the StakePool be withdrawn immediately?

It depends. The fastest can be put forward immediately, and the slowest takes 14 days. Detailed principles are as follows:
- The delegator initiates a withdrawal, and if the free funds in the StakePool are greater than or equals to the withdrawal amount, all of the withdrawal can be withdrawn immediately;
- If the free funds are less than the withdrawal amount, all the free funds will be withdrawn. The remaining funds will enter the withdrawing queue. The fetches in the waiting queue will be satisfied when
  - There are new funds delegated to the StakePool;
  - Within 7 days, the owner can actively shut down. If the stake amount of the stopped workers meet the withdrawal amount, the workers can be released after 7 days, and the withdrawal will be satisfied;
  - In 7 days, if the stake amount of the stopped workers has not yet met the withdrawal amount, all the workers in the StakePool will be forced to shut down. they can be released after 7 days, and the withdrawal will be satisfied. In this case, withdrawal might take up to 14 days.

## Risk Statements

This section is a summary of the risks related to the above. At present, slash mechanism is not enabled in Khala Network, that is, you will not lose your principal through delegation. You can get back as much PHA as you delegate. However, there are currently the following risks:

- After delegating a StakePool, if you want to get your money back, you may have to wait up to 14 days;
- The actual reward obtained after the delegation may not be as high as the APR at the time of delegation, so you need to regularly check the APR of the staking pool you delegate to and the rewards you actually get.
