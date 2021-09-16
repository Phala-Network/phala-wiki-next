---
title: "2.3 Verify Worker Status"
---

{{< tip "warning" >}}
Para-2 is the Parachain testnet of Phala Network (and Khala Network). The purpose of running a testnet is to capture the chaos and collect feedback before the launch of the functionalities on Khala Network. So the system is subject to change. In this tutorial, we always refer to the testnet unless explicitly mentioned.
{{< /tip >}}

## Verify Worker Status

Read the worker status with:

```bash
sudo phala status
```

An expected worker status is shown as follow, which contains the node name, number of cores, gas account and balance, StakePool account and Worker public key.
> Warning will be sent if your gas account balance is under 2 PHA so you can recharge in time.
    ![](/images/docs/khala-mining/2-3-1.png)
