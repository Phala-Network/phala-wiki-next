---
title: "Archived: 1.4 Benchmarking"
weight: 2004
draft: true
menu:
  mine:
    parent: "mine-solo"
#Decommissioned, as benchmarking is no longer supported.
---

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
