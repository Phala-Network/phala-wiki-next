---
title: 'Examples of Delegation'
weight: 1004
draft: false
menu:
  general:
    parent: "general-staking"
---

Before the explanation of the complex underlying mechanism, we first use two examples to demonstrate the real-world cases of delegation.

## Example 1: Reward Distribution

![](/images/general/reward-distribution.png)

StakePool 1 has two delegators who have delegated 1000 PHA and 2000 PHA respectively.

The Owner stakes 2,500 PHA on Worker A and starts running.

The StakePool commission set by the owner is 40%. After a period of time, Worker A mined 10 PHA. 20% of it will be handed over to the Treasury, which is 2 PHA, and then 40% of the commission, which is 3.2 PHA, is left to the owner. The rest is distributed to the delegators according to the delegation. 1.6 PHA is distributed to Delegator A and 3.2 PHA is distributed to Delegator B.

## Example 2: Reward Withdraw Timetable

![](/images/general/reward-withdraw.png)

This begins with 1000 PHA Free Delegation in the StakePool.

- 1st Day: Delegator A initiates a withdrawal application of 5000 PHA. Among them, 1000 PHA is immediately submitted, and the remaining 4000 PHA enters the withdrawal queue;
- 2nd Day: Delegator B delegates 500 PHA. Then this 500 PHA will be withdrawn to Delegator A;
- 3rd Day: Worker A in the StakePool completed shutdown and released 3000 PHA, which was withdrawal to Delegator A;
- 8th Day: It has been 7 days since Delegator A applied for withdrawal, and his withdrawal had not been completed. At this time, all workers in the StakePool will be forced to stop;
- 15th day: All workers in the Stakepool shut down. The withdrawal of Delegator A is then all satisfied.
