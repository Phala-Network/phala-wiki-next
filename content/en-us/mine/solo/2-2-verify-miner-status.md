---
title: "Monitor Worker's Status"
weight: 2022
menu:
  mine:
    parent: "mine-solo"
---


## Verify the Status of your Worker

You can see the synchronization progress at any time of your worker.
Check your worker's status with:

```bash
sudo phala status
```

Your worker's status shows the
* `node name`
* `number of cores`
* `gas account and balance`
* `StakePool account`
* `Worker public key`
* `Alarm of node loss syncing`

> A warning will be sent if your gas account balance is under 2 PHA so you can recharge your GAS account on time.

![](/images/docs/khala-mining/2-3-1.png)
