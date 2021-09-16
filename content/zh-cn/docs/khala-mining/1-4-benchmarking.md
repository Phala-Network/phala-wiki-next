---
title: "1.4 Benchmarking"
---

{{< tip "warning" >}}
Para-2 is the Parachain testnet of Phala Network (and Khala Network). The purpose of running a testnet is to capture the chaos and collect feedback before the launch of the functionalities on Khala Network. So the system is subject to change. In this tutorial, we always refer to the testnet unless explicitly mentioned.
{{< /tip >}}

## Benchmark Your Worker

First, install the needed images with Phala tools:

```bash
sudo phala install
```

If you have installed the images before, you can update them with:

```bash
sudo phala update script
```

Get the performance score with:

```bash
sudo phala score-test [number_of_cores]
# e.g., sudo phala score-test 4
```
> Tip: We recommend to use all the cores of your CPU.

The performance test has to be stopped manually with:

```bash
sudo phala stop pruntime-bench
```

After that, you will be asked whether to upload the performance test results.
> Noted that your performance test results can vary due to different factors.
> The results are only for reference, and a re-evaluation can be necessary for the pre-mainnet.
