---
title: 'Use Phala App to Delegate'
weight: 1006
draft: false
menu:
  general:
    parent: "general-staking"
---

## Delegate

### Basic Steps

1. Open Phala App [Delegate](https://app.phala.network/delegate/) page. You can see the list of StakePools, sorted by APR by default, and filter out the StakePools that meet the remaining quota according to the amount you want to delegate;

![](/images/general/app-list.png)

2. Click *Delegate*, confirm the PID in the pop-up window, enter the amount to be delegated (less than Pool Remaining and Delegable Balance). Click Confirm and sign. After the transaction is sent successfully, data will be updated on the App in about 20 minutes.

### Advanced Topics

Since your delegation reward is totally determined by the StakePool, if you want to ensure stable income, you need to be careful when choosing it. As a reference, consider the following perspectives:

- Current income：APR
- Future (post-delegation) income stability：
  - Prediction from the reliability of the owner of the StakePool;
    - See if the owner is certified, you can also view the owner's personal website, Twitter, etc.;
    - Whether he/she has passed the audit if there is a certification;
    - See if the owner has other StakePools and the status of those;
  - Predicting from the properties of the miner;
    - The more number of workers, the more stable it is;
    - If the current online rate of workers is not high, it may indicate that there is a great potential in the future;
  - Predicting from the current delegation;
    - It mainly depends on whether there is a withdrawal queue. The larger the number and the closer to the 7-day countdown, the higher the risk. StakePool is more likely to shut down all workers within 7 days and the APR will return to 0;
    - If the free funds are sufficient, the risk of downtime due to withdrawal is lower;
    - The remaining amount is relatively large, which means that there is a risk of lowering APR due to the new delegation. However, the remaining amount is generally sufficient;
- Whether the StakePool is selected by more Delegators;
- Is the remaining amount sufficient?
  ![](/images/general/app-stakepool.png)

## Claim

1. You can check your current available rewards on the [My Delegate](https://app.phala.network/delegate/my-delegate) page;

![](/images/general/app-my-delegate.png)

2. Click *Claim*, confirm the PID and Rewards in the pop-up window, enter the reward receiving address (you can directly click *My Address* to add your own address), click *Confirm*, sign, and after the transaction is sent successfully, you can see the data update on the App in about 20 minutes.

## Withdraw

1. On the [My Delegate](https://app.phala.network/delegate/my-delegate) page, you can see your delegated amount in the StakePools;

![](/images/general/app-withdraw.png)

2. Click *Withdraw*, confirm the PID in the pop-up window, enter the amount you want to withdraw (you can click *Max* to bring in all the delegation), click *Confirm*, sign. After the transaction is sent successfully, you can see the data update on the App in about 20 minutes;
3. If all the withdrawals are successful at once, you can see that your Delegation has decreased by the corresponding number of delegations;
4. If you need to wait (see our [example](/en-us/general/applications/delegation-example/#example-2-reward-withdraw-timetable) and [FAQ](/en-us/general/applications/stakepool/#7-can-the-funds-delegated-to-the-stakepool-be-withdrawn-immediately)), you may need to reclaim after the waiting time to release the funds in order to complete the withdrawal;
    1. Reclaim: Click *Reclaim* (if *Reclaim* is grayed out, it means that there is currently no Worker that can be reclaimed), confirm the PID and WorkerPublicKey in the pop-up window, click *Confirm*, sign, and after the transaction is sent successfully, you can see the data update on the App in about 20 minutes;

> Each Delegator can only have **ONE** withdrawal application in a StakePool. The new withdrawal will overwrite the old withdrawal application, and the countdown time will be recalculated. Please be careful when you initiate a withdrawal.
