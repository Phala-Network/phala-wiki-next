---
title: "Tokenomics"
weight: 1005
menu:
  general:
    parent: "phala-network"
---

> After the approval of the “Gemini Tokenomics upgrade" democratic referendum on the block height #1,467,069, we have updated the content of the Tokenomics as follows:

## Design Targets

The overall economic design is built to address these points:

1. Support Phala Network's trustless cloud computing architecture
   - Consensus-Computation Separation
   - Linearly-scalable computing workers (100k order of magnitude number of miners)
2. Incentivize miners to join the network
   - Ensure payment for power supplied irrespective of demand, especially at network bootstrap
   - Subsidize mining pool with 70% of the initial supply over time
   - Bitcoin-like budget halving schedule
   - Power the Phala and Khala at the same time
3. Application pricing
4. On-chain performance

The following details some key elements of the economic model.

## Overall Design

### Related Workers

Phala Tokenomic is applicable to any workers running on Phala or Khala.

### Value Promise ($V$)

- A virtual score for an individual miner representing value earned which is payable in the future, to motivate miners to behave honestly and reliably
- Equal to the expected value of the revenues earned by the miner for providing power for the platform
- Changes dynamically based on the miner's behaviors and the repayment of Rewards
  - Mining honestly: $V$ grows gradually over time
  - Harmful conduct: punished by reduction of $V$

### Initial $V$

A Miner will run a **_Performance Test_** and stake some tokens to get the initial $V$:

$$V^e = f(R^e, \text{ConfidenceScore}) \times (S + C)$$

- $R^e > 1$ is a **_Stake Multiplier_** set by the network (Khala or Phala).
- $S$ is the miner stake; a **_Minimum Stake_** is required to start mining. The stake can't be increased or decreased while mining, but can be set higher than the Minimum.
- $C$ is the estimated cost of the miner rigs, inferred from the **_Performance Test_**.
- $\text{ConfidenceScore}$ is based on the miner's Intel© SGX capabilities.
- $f(R^e, \text{ConfidenceScore}) = 1 + (\text{ConfidenceScore} \cdot (R^e - 1))$
- $V$ is always less than or equals to $V_{max}$.

Params used in simulation:

- $R^e_{\text{Phala}} =R^e_{\text{Khala}} = 1.5$
- $\text{ConfidenceScore}$ for different [Confidence Levels](/en-us/mine/solo/1-2-confidential-level-evaluation/#confidence-level-of-a-miner)
  - $\text{ConfidenceScore}_{1,2,3} = 1$
  - $\text{ConfidenceScore}_{4} = 0.8$
  - $\text{ConfidenceScore}_{5} = 0.7$
- $V_{max} = 30000$

### Performance Test

A performance test measures how much computation can be done in a unit time:

$$P = \frac{\text{Iterations}}{\Delta t}$$

For reference,

| Platform          | Cores | Score | Approximate Price |
| ----------------- | ----- | ----- | ----------------- |
| Low-End Celeron   | 4     | 450   | $150              |
| Intel Xeon E Processor| 6     | 1900  | $500              |
| Mid-End i5 10-Gen | 8     | 2000  | $500              |
| High-End i9 9-Gen | 10    | 2800  | $790              |

> The table is based on the version while writing of this documentation and is subject to changes.

The performance test will be performed:

1. **Before mining** to determine the **_Minimum Stake_**
2. **During mining** to measure the current performance, and to adjust the $V$ increment dynamically

### Minimum Stake

$$S_{min}=k \sqrt{P}$$

- $P$ - **_Performance Test_** score
- $k$ - adjustable multiplier factor

Proposed parameter:

- $k_{\text{Phala}} =k_{\text{Khala}} = 50$

> Locked state $PHA token can also be used for mining staking, e.g., Khala Crowdloan reward

### Cost

$$C = \frac{0.3 P}{\phi}$$

- $\phi$ is the current PHA/USD quote, dynamically updated on-chain via Oracles
- $P$ is the initial **_Performance Test_** score.
- In the early stages we are compensating the equipment cost $C$ with a higher Value Promise.
- In the future we plan to compensate for higher amortization costs (adding equipment amortization cost to the running costs $c^i$ and $c^a$), thus increasing the speed of growth of the Miner's $V$.

### General mining process

![](https://i.imgur.com/IpEnlGR.png)

![](https://i.imgur.com/zKWAI1S.png)

Each individual's $V$ is updated at every block:

- Increased by $\Delta V_t$ if the worker keeps mining
- Decreased by $w(V_t)$ if the miner got a payout
- Decreased according to the **_Slash Rules_** if the miner misbehaves

When a miner gets a payout $w(V_t)$, they will receive the amount immediately in their Phala wallet. The payout follows **_Payout Schedule_** and cannot exceed the **_Subsidy Budget_**.

Finally, once the miner decides to stop mining, they will wait for a Cooling Down period $\delta$. They will receive an one-time final payout after the cooldown.

| Block number  |     $t$      |    $t+1$     | $\dots$ |     $T$      |             $\dots$             |       $T+\delta$        |
| :------------ | :----------: | :----------: | :-----: | :----------: | :-----------------------------: | :---------------------: |
| Value Promise |    $V_t$     |  $V_{t+1}$   | $\dots$ |    $V_T$     |             $\dots$             |         $\dots$         |
| Payment       |   $w(V_t)$   | $w(V_{t+1})$ | $\dots$ |   $w(V_T)$   |               $0$               | $\kappa \min(V_T, V^e)$ |
|               | Block reward |     ...      |   ...   | Block reward | Cooling off for $\delta$ blocks |      Final payout       |

Proposed parameter:

- $\delta = \text{blocks equivalent to 7 days}$

### Update of $V$

When there's no payout or slash event:

$$\Delta V_t = k_p \cdot \big((\rho^m - 1) V_t + c(s_t) + \gamma(V_t)h(V_t)\big)$$

- $\rho^m$ is the unconditional $V$ increment factor for miner
- $c(s_t)$ is the operational cost to run the miner
- $\gamma(V_t)h(V_t)$ represents a factor to compesate for accidental/unintentional slashing (ignored in simulated charts)
- $k_p = \min(\frac{P_t}{P}, 120\\%)$, where $P_t$ is the instant performance score, and $P$ is the initial score
- If $V > V_{max}$ after the update, it will be capped to $V_{max}$

Proposed parameters:

- $\rho^m_{\text{Phala}} =\rho^m_{\text{Khala}} = 1.00020$ (hourly)

### Payout Event

In order to stay within the subsidy budget, at every block the budget is distributed proportionally based on the current **_Miner Shares_**:

$$w(V_t) = B \frac{\text{share}}{\Sigma \text{share}}$$

where $B$ is the current network subsidy budget for the given payout period.

Whenever $w(V_t)$ is paid to a miner, his $V$ will be updated accordingly:

$$\Delta V = -min(w(V_t),V_t-V_\text{last}).$$

$V_\text{last}$ is the value promised at the last payout event, or $V^e$ if this is the first payout.

>The update of V is limited to ensure the payout doesn't cause $V$ to drop lower than it was in the last payout event. The limit is necessary to make sure miners are well incentives to always accumulate credits in the network. Otherwise, miners are incentivized to constantly reset their mining session if V decreases over time.

Share represents how much the miner is paid out from $V$. We expect it will approximate the share baseline, but with minor adjustment to reflect the property of the worker:

$$\text{share}_{\text{Baseline}} = V_t.$$

$\Sigma \text{share}$ contains the share of workers which are running on Phala or Khala with a same subsidy ratio.

Proposed algorithm:

- $\text{share}_{\text{Khala}} = \sqrt{V_t^2 + (2 P_t \cdot \text{ConfidenceScore})^2}$
- $\text{share}_{\text{Phala}} = \sqrt{V_t^2 + (2 P_t \cdot \text{ConfidenceScore})^2}$
- $P_t$ is the instant performance score

### Subsidy Budget

|                    |    Phala / Khala   |
| ------------------ |  :---------------: |
| Relaychain         |  Polkadot/ Kusama  |
| Budget for Mining  |       700 mln      |
| Halving Period     |       180 days     |
| Halving Discount   |         25%        |
| Treasure Share     |         20%        |
| First Month Reward |       21.6 mln     |

### Heartbeat & Payout Schedule

In any block $t$, if the Miner's VRF is smaller than their current Heartbeat Threshold $\gamma(V_t)$, they must send the Heartbeat transaction to the chain, which will update the on-chain record of their Value Promise and send a Mining Reward $w(V_t)$ to their reward wallet:

$$\Delta V_t = - w(V_t).$$

If they fail to send the Heartbeat transaction to the chain within the challenge window, the update of their value promise will be

$$\Delta V_t = - h(V_t),$$

and their status is changed to _unresponsive_, and they will get repeatedly punished until they send a heartbeat, or stop mining. The slash amount $h$ is defined in the **_Slash_** section.

The target is to process around 20 heartbeat challenges per block. The heartbeat challenge probability $\gamma(V_t)$ will be adjusted to target this number of challenges.

Potential parameters:

- $\text{ChallengeWindow} = 10$ (blocks)

### Slash rules

The slash rules for miners are defined below. No slash rules have been implemented at the moment, but will start in the near future.

| Severity | Fault                               | Punishment                                |
| -------- | ----------------------------------- | ----------------------------------------- |
| Level1   | Worker offline                      | 0.1% V per hour (deducted block by block) |
| Level2   | Good faith with bad result          | 1% from V                                 |
| Level3   | Malicious intent or mass error      | 10% from V                                |
| Level4   | Serious security risk to the system | 100% from V                               |

### Final payout

When a miner chooses to disconnect from the platform, they send an Exit Transaction and receives their Severance Pay after $\delta$ blocks.

After the cooling down period, the miner gets their final payout, representing the return of the initial stake. However, if $V_T$ goes lower than the initial $V^e$, the miner will get less stake returned as a punishment:

$$w(T + \sigma) = \min(\frac{V_T}{V^e}, 100\\%) \cdot S$$

where $S$ is the initial stake.
