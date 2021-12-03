---
title: "Khala预备主网挖矿教程"
weight: 5
draft: false
---

Khala Network是Phala在Kusama上的平行链，具有去中心化的TEE挖矿功能。在这个章节，我们提供了挖矿相关每个步骤的详细描述。

我们非常希望你你此之前可以阅读Phala的 [经济模型]({{< relref "docs/tokenomic" >}}) 和 [抵押设计]({{< relref "docs/tokenomic/1-mining-staking" >}}) 来了解Khala的挖矿方式.

如果你对我们的教程有任何的问题和建议，欢迎通过下列途径进行反馈：
- Telegram: https://t.me/phalaCN
- Discord: https://discord.gg/YUxXV5xrj7
- 论坛: https://forum.phala.network/

一些Khala相关的信息

- Khala Polkadot.js 页面: [链接](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkhala.api.onfinality.io%2Fpublic-ws#/explorer)
- Khala RPC端点: `wss://khala.api.onfinality.io/public-ws`
- Khala 区块链浏览器: <https://phala-testnet.subscan.io/>
- Khala App: <https://app.phala.network/>
- Khala 控制台: <https://app.phala.network/console>

### I. 前期准备

- [1.1 检查你的硬件、BIOS和系统"]({{< relref "docs/khala-mining/1-0-hardware-requirements" >}})
- [1.2 安装Phala脚本]({{< relref "docs/khala-mining/1-2-download-setup-scripts" >}})
- [1.3 SGX测试和信任分级]({{< relref "1-3-confidential-level-evaluation" >}})
- [1.4 测试Worker性能分]({{< relref "docs/khala-mining/1-4-benchmarking" >}})

### II. 部署Khala网络挖矿节点

- [2 Solo挖矿部署]({{< relref "docs/khala-mining/2-solo-mining" >}})
- [2.1 部署Worker节点]({{< relref "docs/khala-mining/2-1-deploy-worker-node" >}})
- [2.2 检查Worker部署情况]({{< relref "docs/khala-mining/2-2-verify-worker-status" >}})
- [2.3 Worker升级]({{< relref "docs/khala-mining/2-3-upgrade-worker-node" >}})
- [2.4 使用控制台]({{< relref "docs/khala-mining/2-4-console" >}})

### III. FAQ

- [FAQ]({{< relref "docs/khala-mining/4-faq" >}})
- [如何改善节点的网络状况]({{< relref "docs/khala-mining/4-1-How-to-get-better-peers-connectivity" >}})
- [如果你还没有开始同步节点，如何快速跟上]({{< relref "docs/khala-mining/4-2-How-to-fast-sync-node-use-snapshot" >}})
