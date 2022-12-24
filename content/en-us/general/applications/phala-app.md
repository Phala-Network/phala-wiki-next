---
title: 'Use Phala App to Delegate'
weight: 5010
draft: false
menu:
  general:
    parent: "general-delegation"
---

## Delegate

### How to delegate

1. Open Phala App [Delegate](https://app.phala.network/delegate/) page. You can see the list of StakePools and Vaults, the StakePools are sorted by APR by default and Vaults are sorted by APY by default. You can switch the StakePool list or Vault list by clicking the botton. Filter out the Pools that meet the remaining quota according to the amount you want to delegate;

<img width="1100" alt="image" src="https://user-images.githubusercontent.com/110812052/209429064-02506702-8646-48f1-9d32-0a2578380218.png">


2. Click the pool you want to delegate it, details of the pools being collapsed are displayed. Enter the amount to be delegated (less than Pool Remaining and Delegable Balance). Click delegate and sign. After the transaction is sent successfully, data will be updated on the App in about 20 seconds.

<img width="1100" alt="image" src="https://user-images.githubusercontent.com/110812052/209429293-f97c0736-04a2-4cff-9e92-d4f2130a4eab.png">

3. If you want to use your Vault to delegate, click the account switch button in the upper left corner of the "delegate" page to switch to the corresponding Vault account, and then the delegation you made will be paid by the Vault account.

<img width="1100" alt="image" src="https://user-images.githubusercontent.com/110812052/209429779-a1b7b517-42e6-4b6f-ad78-e36e49070578.png">


### How could I cancel my delegation?

#### Withdraw the delegations

You need to find the corresponding delegation from "my delegation" page of the Phala App, click `withdraw` and enter the value to be withdrawn to cancel the delegation.
<img width="1100" alt="image" src="https://user-images.githubusercontent.com/110812052/209429550-27a28ae0-d20e-4749-9aae-970328cccaa1.png">


If there are enough free delegations in the stakepool, your withdrawal request will be completed in real time. 

If the free delegation is insufficient, a withdraw queue will be generated. 
* The pool owner needs to add enough free delegation within seven days after the withdrawal queue is generated. Anyone can manually trigger a `reclaim` operation at any time and use the free delegation in the stakepool to eliminate the withdraw queue. 
* If the free delegation is still insufficient after seven days, and the existed releasing stake is also insufficient to afford the withdrawal, the stakepool will be forced to stop after a new `reclaim` operation, and all active workers will enter a cooling-down period for 7 days. 
When the coolingdown countdown of the workers is over, any delegator can reclaim the delegations from the stakepool, take out the delegation which was staked into the workers, and use it to eliminate the withdrawal queue of the pool.

> When the withdrawal queue is generated, this part of the delegation will be separated from your Delegation NFT in this pool, your Delegation NFT in this pool records the remaining delegation, and a Withdrawal Delegation NFT which belongs to the stakepool will be generated (Don’t worry, this NFT records the token orientation after withdrawal, and you can find your Withdrawal NFT in the Phala App, why we do like this is for keeping the withdrawal queue being paid back in order)
> 
> And the withdrawal queue is eliminated in order. The earlier the withdrawal, the earlier the free delegation in the pool will be obtained.

Therefore, in the worst case, you will need to wait 14 days to get your delegation back from a StakePool, but in most cases, the good behavior stakepool owner will take the initiative to complete your withdrawal application within 1-7 days. If you delegated to a Vault, another 7 days is needed. Therefore, in the worst case, you will need to wait 21 days to get your delegation back from a Vault.

When you already have a withdraw queue in stakepool/Vault, you cannot cancel the existing withdrawal application. Once you initiate a new withdrawal apply under the same pool, the old withdraw queue will be invalidated and the withdrawal will be re-initiated with an updated application, and the countdown will restart to countdown on a 7-day period.

If you want to withdraw the delegations in your Vault account, click the account switch button in the upper left corner of the "my delegation" page to switch to the corresponding Vault account, and then the withdraw you made will be operated by the Vault account.

<img width="1100" alt="image" src="https://user-images.githubusercontent.com/110812052/209429873-440f22f5-9640-4c00-93d6-5b330aa40883.png">

#### Unwrap the wPHA

After withdrawal is finshed, you tokens will be stored as wPHA. You need to unwrap it in the "delegate" page, click unwrapp all to unwrap the tokens.


## StakePool/Vault management

### Create

You can select the type of pools you want to operate under the "farm", choose "StakePool" or "Vault", and click to enter the corresponding page. On the StakePool and Vault pages, you can do the same operation: 

click the "Create" button in the upper right corner to create your pool.

<img width="1100" alt="image" src="https://user-images.githubusercontent.com/110812052/209429918-868fdbf3-627d-412c-9be9-9ba20cb26d2f.png">

### Claim Owner rewards

#### Rewards of StakePool 

1. You can check your current available rewards on the [My StakePools](https://app.phala.network/farm/stake-pool) page;

<img width="1100" alt="image" src="https://user-images.githubusercontent.com/110812052/209430378-eae91aa1-155a-49fc-bd06-5a477f9461d3.png">

2. Confirm the PID and Rewards, click the *claim rewards* in the pop-up window, enter the reward receiving address (you can directly click *My Address* to add your own address), click *submit*, sign, and after the transaction is sent successfully, you can see the data update on the App in about 20 seconds.

3. You can also use *Claim all* to claim the rewards from all the StakePools by one transaction.

> Note if you claim the owner rewards to other address not the StakePool owner address, the rewards will be stored as wPHA. You need to unwrap it in the delegate page.

#### Rewards of Vault

1. You can check your current available rewards on the [My Vaults](https://app.phala.network/farm/vault) page;

<img width="1100" alt="image" src="https://user-images.githubusercontent.com/110812052/209430114-8ce86909-2439-4770-9ed9-aa3e6fa524f5.png">

2. Click the *mint cut* and sign, to manually claim the Vault owner reward. After the transaction is successful, the Vault owner's rewards will be stored in the form of the Vault's Delegation NFT.
After that, you can click *claim to delegation* to distribute the Vault owner rewards to the address you want to receive rewards, after which you will be able to manage these delegations. You can see the data update on the App in about 20 seconds.

3. You can also use *Mint Cut* and *Claim to Delegation* on the upper of page to claim the rewards from all the StakePools by one transaction.

