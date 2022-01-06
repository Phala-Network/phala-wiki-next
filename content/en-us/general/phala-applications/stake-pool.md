---
title: 'Staking: Delegate to a StakePool'
weight: 5002
draft: false
menu:
  general:
    parent: "phala-applications"
---

## Delegator

If you hold PHA tokens, you can stake them on the [Phala App](https://app.phala.network/delegate/). When you stake your tokens, we refer to the term delegating PHA, which can be understood as depositing and earning interest on your PHA. Therefore, this process makes you a delegator.

## How to Delegate

### Introduction of Delegation

You delegate your tokens to a StakePool. StakePools are controlled by account owners that provide miners (workers) to the community. Miners will add their miners to their StakingPools. Your tokens provide liquidation to the miners in the respective StakePool. The mining rewards will be distributed to the delegators according to the delegation share.

### Choose StakePool

Enter [Phala Network’s delegation page]( https://app.phala.network/delegate/ )

![stakepool delegate](/images/docs/khala-user/stakepool-delegate.png)

The first page of delegation is a list of StakePools, which allows users to select and delegate. All data in the list can be sorted. You can check below to learn how to choose StakePool:

1. Pay attention to the current real-time value, mainly **APR** and **Cap Gap**:

    $$
    APR = \frac{\text{Mining workers reward in 1 day} \times 365 \times (1-\text{Treasury fee}) \times (1-\text{StakePool commission})}{\text{Stakepool delegated}}
    $$

    - Please refer to the Phala Network’s [new token economics](https://medium.com/phala-network/reading-phala-network-economic-paper-preview-5f33b7019861) for worker reward rules, treasury’s processing fees rate is 20%, which is fixed. StakePool commission rate is set by StakePool’s Owner, which means the mining rewards of Workers will be distributed to Owners according to a certain proportion.
    - **Cap Gap**: The maximum number of tokens that a StakePool can accept to delegate currently.

2. If you have higher requirements for token flexibility, please pay attention to the ** Free Delegation ** of the StakePool to determine the required withdrawal time for the delegation.

### How to Delegate

Click on the “Delegate” button and type in the amount you wish to delegate. Then click “Confirm” and wait for the signature to complete the delegation successfully.

![stakepool delegate action](/images/docs/khala-user/stakepool-delegate-action.jpg)

## Check Delegation

![stakepool claim](/images/docs/khala-user/stakepool-claim.jpg)

1. You can check your delegated StakePool by clicking on “My Delegate”. “Claimable Rewards” is the reward you can withdraw at the moment. **The reward will remain valid until claiming**.
2. You can delegate again by clicking “Delegate”.
3. You can withdraw your delegation from the StakePool by clicking the “Withdraw” button. The withdrawal time depends on the amount of **Free Delegation**. If there is sufficient Free Delegation then you will be able to unlock and withdraw immediately. If not, it may take up to 14 days for the delegation to be fully unlocked under extreme circumstances.

## Potential Risks

There are two potential risks for the delegators:

1. There might be a delay in token withdrawal from the StakePool. The length of the delay depends on the amount of Free Delegation in the StakePool. It can take up to 14 days for tokens to unlock.
2. Under extreme conditions, if workers receive too many punishments, **the number of tokens in StakePool will shrink**, which will affect the initial delegation in the StakePool. However, **the probability of such a situation is low**.

<script>
  MathJax = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$','$$'], ['\\[', '\\]']],
      processEscapes: true,
      processEnvironments: true
    },
    options: {
      skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
    }
  };
  window.addEventListener('load', (event) => {
      document.querySelectorAll("mjx-container").forEach(function(x){
        x.parentElement.classList += 'has-jax'})
    });
</script>
<script type="text/javascript" id="MathJax-script" async
  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
