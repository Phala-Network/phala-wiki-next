---
title: "Monitor Miner's Status"
weight: 6022
menu:
  docs:
    parent: "khala-mining"
---


## Verify the Status of your Miner

You can see the synchronization progress at any time of your miner. 
Check your miner's status with:

```bash
sudo phala status
```

Your miner's status shows the 
* `node name`
* `number of cores` 
* `gas account and balance` 
* `StakePool account`
* `Worker public key`

> A warning will be sent if your gas account balance is under 2 PHA so you can recharge your GAS account on time.

![](/images/docs/khala-mining/2-3-1.png)