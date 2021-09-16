---
title: "Para-2测试网教程"
weight: 5
draft: false
---

Khala Network是Phala在Kusama上的平行链，具有去中心化的TEE挖矿功能。在这个章节，我们提供了挖矿相关每个步骤的详细描述。Para-2测试网是Khala的测试网。主要部署方法与Khala类似，但需要有部分设置不同。

我们非常希望你你此之前可以阅读Phala的 [经济模型]({{< relref "docs/tokenomic" >}}) 和 [抵押设计]({{< relref "docs/tokenomic/1-mining-staking" >}}) 来了解Khala的挖矿方式.

如果你对我们的教程有任何的问题和建议，欢迎通过下列途径进行反馈：
- Telegram: https://t.me/phalaCN
- Discord: https://discord.gg/YUxXV5xrj7
- 论坛: https://forum.phala.network/

一些Para-2相关的信息（**请注意这是不同于Khala预备主网的部分**）
- Para-2 Solo挖矿脚本下载链接：<https://github.com/Phala-Network/solo-mining-scripts/archive/refs/heads/para.zip>
- Para-2 Polkadot.js 页面: [链接](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fpara2-api.phala.network%2Fws#/explorer)
- Para-2 RPC端点: `wss://para2-api.phala.network/ws`
- Para-2 区块链浏览器：<https://phala-testnet.subscan.io/>
- Para-2 控制台：<https://https://app-test.phala.network/console/>
- Para-2 App：<https://https://app-test.phala.network>
  
### I. 部署前的检查（**请记得按照上述部分更改您的脚本下载链接**）

- [1.1 检查你的硬件、BIOS和系统"]({{< relref "docs/khala-mining/1-1-hardware-requirements" >}})
- [1.2 安装Phala脚本]({{< relref "docs/khala-mining/1-2-download-setup-scripts" >}})
- [1.3 SGX测试和信任分级]({{< relref "1-3-confidential-level-evaluation" >}})
- [1.4 测试Worker性能分]({{< relref "docs/khala-mining/1-4-benchmarking" >}})

### II. 部署Para2测试网挖矿（**请记得按照上述部分更改您的脚本下载链接**）

- [2 solo挖矿]({{< relref "docs/khala-mining/2-solo-mining" >}})
- [2.1 部署Worker节点]({{< relref "docs/khala-mining/2-1-deploy-worker-node" >}})
- [2.2 检查Worker部署情况]({{< relref "docs/khala-mining/2-2-verify-worker-status" >}})
- [2.3 Worker升级]({{< relref "docs/khala-mining/2-3-upgrade-worker-node" >}})
- [2.4 使用控制台]({{< relref "docs/khala-mining/2-4-console" >}})


### III. FAQ

- [FAQ]({{< relref "docs/khala-mining/4-faq" >}})
