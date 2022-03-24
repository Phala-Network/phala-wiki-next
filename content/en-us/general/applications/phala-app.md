---
title: 'Use Phala App'
weight: 1006
draft: false
menu:
  general:
    parent: "general-staking"
---

## Phala App Delegation Tutorial

1. Delegate
    1. Easy Version
        1. Open Phala App Delegate page [https://app.phala.network/delegate/](https://app.phala.network/delegate/), you can see the list of StakePools, sorted by APR by default, and filter out the StakePools that meet the remaining quota according to the amount you want to delegate. You can choose a StakePool with the highest APR
        2. *Click Delegate, confirm the PID in the pop-up window, enter the amount to be delegated (less than Pool Remaining and Delegable Balance). Click Confirm and sign. After the transaction is sent successfully, data will be updated on the App in about 20 minutes.*

        ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1895ea96-7dc9-40af-a76b-5c9c37b47c39/Untitled.png)

    2. Advanced Version
        1. Since Phala's delegation is a kind of centralized finance, if you want to ensure stable income, you need to be careful when choosing a StakePool.
        2. Please consider the following perspectives
            1. Income
                1. Current real-time situation：APR
                2. Future (post-delegation) income stability：
                    1. Prediction from the reliability of the owner of the StakePool
                        1. Owner‘s identity
                            1. See if the owner is certified, you can also view the owner's personal website, Twitter, etc.
                            2. Whether it has passed the audit if there is a certification
                        2. See if the owner has other StakePools and the status of those
                    2. Predicting from the properties of the miner
                        1. The more number of workers, the more stable it is
                        2. If the current online rate of workers is not high, it may indicate that there is a great potential in the future
                    3. Predicting from the current delegation
                        1. It mainly depends on whether there is a withdrawal queue. The larger the number and the closer to the 7-day countdown, the higher the risk. StakePool is more likely to shut down all workers within 7 days and the APR will return to 0;
                        2. If the free funds are sufficient, the risk of downtime due to withdrawal is lower;
                        3. The remaining amount is relatively large, which means that there is a risk of lowering APR due to the new delegation. However, the remaining amount is generally sufficient.
                3. Whether the StakePool is selected by more Delegators
            2. Is the remaining amount sufficient?

            ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/97307aa7-9de2-4f10-b881-1c3c90876e5f/Untitled.png)

2. Claim
    1. You can check your current available rewards on the My Delegate page [https://app.phala.network/delegate/my-delegate](https://app.phala.network/delegate/my-delegate)
    2. *Click Claim, confirm the PID and Rewards in the pop-up window, enter the reward receiving address (you can directly click My Address to add your own address), click Confirm, sign, and after the transaction is sent successfully, you can see the data update on the App in about 20 minutes.*

    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/30f460b9-2c4c-4295-afe6-d751167d382e/Untitled.png)

3. Withdraw
    1. On the My Delegate page [https://app.phala.network/delegate/my-delegate](https://app.phala.network/delegate/my-delegate), you can see your delegated amount in the StakePools
    2. *Click Withdraw, confirm the PID in the pop-up window, enter the amount you want to withdraw (you can click Max to bring in all the delegation), click Confirm, sign. After the transaction is sent successfully, you can see the data update on the App in about 20 minutes.*
    3. If all the withdrawals are successful at once, you can see that your Delegation has decreased by the corresponding number of delegations.
    4. If you need to wait (see the mechanism introduction for the reason), you may need to reclaim after the waiting time to release the funds in order to complete the withdrawal.
        1. *Reclaim: Click Reclaim (if Reclaim is grayed out, it means that there is currently no Worker that can be reclaimed), confirm the PID and WorkerPublicKey in the pop-up window, click Confirm, sign, and after the transaction is sent successfully, you can see the data update on the App in about 20 minutes.*
    5. Note: each Delegator can only have one withdrawal application in a StakePool. the new withdrawal will overwrite the old withdrawal application, and the countdown time will be recalculated. Please be careful when you initiate a withdrawal.

    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/00392220-9d4e-48b4-b946-f48162d942ea/Untitled.png)
