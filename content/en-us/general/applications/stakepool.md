---
title: 'Delegate to a StakePool'
weight: 5005
draft: false
menu:
  general:
    parent: "general-delegation"
---

## Why is Delegation needed?

Delegation is the name of the "Stake to Earn" mechanism on the Phala and Khala Network. Staking is not yet active on the Phala Network but has been live on the Khala network since Sept 2021. (For the rest of this piece when we refer to our network, we mean both Phala and Khala)

- Compute cannot simply be added to the network on it's own. To ensure a secure and stable environment, "Proof of Stake" is used. Each worker on the newtork must be staked with some PHA, which is put at risk, in order to incentivise good behaviour.
- Compute providers and those wishing to provide stake do not have to be the same people. To improve flexibility and efficiency, Phala provides a delegation mechanism which allows delegators to stake to workers they do not control and earn rewards.
- This mechanism is enabled by a feature we call the StakePool. 
- Overall Delegation incentivises high-quality compute providers to generate consistent and reliable rewards to their delegators. This in turn ensures the stability of the compute provided.
- For even more accessibility there is another major feature called Vault. This allows delegators to pass the management of their delegation to individual StakePools to someone else. These Vault operators, for a small fee, bring further efficiency to the ecosytem by driving delegations to the best compute providers. You can read more about Vault here.

## Delegation Mechanism

### Glossary

| | Meaning   | Type            |
| --------- | ------------- | ---------------- |
| **Delegator** | Delegates PHA to **StakePools** or **Vaults** | On-chain Account |
| **StakePool** | Created and managed by the **StakePool Owner**. Delegators put PHA into these. Delegated tokens can only be used for staking.| On-chain Object  |
| **StakePool Owner**     | The account that controls the **StakePool**. Ownership is non tranferable. | On-chain Account |
| **Worker**    |  The **StakePool Owner** uses delegated funds to stake to a number of workers and therefore provide compute to the network. A worker can only belong to a single StakePool at any one time. The rewards generated will be distributed to the owner and the delegators based on the **StakePool** and **Vault** commission. The mechanism is detailed below. | Physical Machine | 
| **Vault**   | Created and managed by the **Vault Owner**. Delegators put PHA into these. Delegated tokens can only be used for staking. The **Vault Owner** manages the delegations to specific StakePools, allowing delegation by proxy. |On-chain Object|
| **Vault Owner** |The account that controls the **Vault**. Ownership is non tranferable.|On-chain Account|

### How It Works

![](https://i.imgur.com/yMXCTbA.png)

#### Lifecycle

##### 1. Delegation
PHA holders delegate tokens into a StakePool or a Vault.  

##### 2. Vault distributes (Optional)
The owner of the Vault chooses high-quality StakePools to delegate to on behalf of their delegators.  

##### 3. Workers staked and started

The owners of individual StakePools use the delegations provided to stake and start workers and so provide computing power to the network. Over time stable and well behaved Workers generate rewards.  

##### 4. Rewards distributed

Based on the StakePool's commission rewards earned by Workers are distributed to the owner and the delegators. Owner rewards can be claimed into the owner's account directly while Delegator rewards will automatically be reinvested into the StakePool. Those delegators using Vault pay a further commission for the Vault's management services.  

### Delegation represented as an NFT

After you delegate to a StakePool, your tokens will be transferred and locked. As proof of the delegation you receive a Delegation NFT in return. The Delegation NFT records its owner, the StakePool where the delegation is located, and the share of the corresponding StakePool.

Your Delegation NFT is transferable, and you can also sell it to others on PhalaWorld's NFT platform.

> **NOTE** When your Delegation NFT is transferred or sold to someone else, the delegated PHA will no longer belong to you, because you have lost the certificate to withdraw it back from the corresponding StakePool or Vault. 

### Rewards

The moment you delegate, you immediately start to earn rewards.

All staked and started workers are rewarded for providing computing power. Every time rewards are distributed 20% goes to the treasury. The remaining 80% is distributed amongst the Vault Owners (optional), StakePool Owners and delegators. Once the commissions are paid the rewards will be divided equally based on the amount of delegations from each delegator. (Please refer to [Gemini Tokenomics](https://wiki.phala.network/en-us/general/phala-network/tokenomics/) for specific reward details)

The delegator rewards distributed each time will be automatically reinvested.

The APR of the pool which is shown on the Phala App is a real-time estimate. The APR calculation is based solely on the delegator's income, after the pool owner's commission has been taken. 

### How to choose a high-quality StakePool

You can find the historical data performance of the StakePool on the pool details page of the Phala App. The common methods for choosing the StakePools are:

1. Check the historical APR trend performance of the StakePool. The historical APR of a high-quality StakePool must be stable enough.
2. Check the number of workers in the StakePool, and check the status trend of the workers. Generally, the larger the StakePool, the better the operation and maintenance level of the pool owner, and the better the stability of the mining pool. Histrical data will prove that.
3. Take the initiative to contact the StakePool owner. Contact will be shown on the pool detailed page. The friendly pool owner will be happy to talk with you and guide you how to delegate to his StakePool.

>Note, please don’t be too obsessed with the Pool APR, there are often evil pool owners who only rely on lowering their commission to achieve a high APR, but this will not be sustainable, please be sure to observe the historical trend of APR!

After you have selected the pool and delegated, please also be sure to check the performance of the StakePool regularly. Contact the pool owner when the performance of the pool do not go well.

If you find these methods is too hard for you or you want to check constantly to see if your delegation continues to turn out well. Try to delegate to **Vault**.

**Vault is always a simpler and more friendly delegation method.** 
Click [here](https://wiki.phala.network/en-us/general/applications/vault/) to learn more about Vault.


## Things to consider before delegating

This section is a short summary of some of the risks related to delegating PHA. Although delegation is non custodial there are still situations that delegators should know about before committing to delegating to a StakePool or Vault. 

- At present, Slashing is not yet enabled on the Khala Network, however it will be at some point in the future. For now you can always get back as much PHA as you delegate. Once Slashing is enabled this will no longer be guaranteed. 
- It may take upto 14 days to withdraw your PHA from a Vault or StakePool. 
- The actual rewards obtained may not be as high as the APR shown at the time of delegation. Current performance does not predict future returns. 
