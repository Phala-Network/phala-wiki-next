---
title: "Runtime Bridge"
weight: 6
---
在单机挖矿挖矿场景中，[pherry](https://github.com/Phala-Network/phala-blockchain/tree/master/standalone/pherry)负责从区块链全节点获取区块数据并发送到TEE运行时，然而，其在矿池等场景中有诸多不便且存在性能问题。因此，我们开发了Phala [Runtime Bridge](https://github.com/Phala-Network/runtime-bridge)（简称`prb`），其利用了新经济模型v0.9（提案）中引入的StakePool机制以降低使用pherry所产生的复杂性。

`prb`同时支持在云原生环境和传统Linux Shell环境中部署，它通过Redis提供RPC接口来管理Worker的生命周期。`prb`未来将在挖矿场景下完全替代pherry。

## 系统需求

由于Substrate官方仅对JavaScript SDK提供了完善的支持，因此`prb`使用Node.js编写。由于Node.js的单线程模型，prb运行时会有若干个进程同时运行，因此运行prb的CPU需要拥有至少8个核心且单核性能足够。

`prb` 可选择使用RocksDB或LevelDB作为存储后端，因此其需要选用有大缓存的PCI-E 3.0/4.0 SSD来支持大量的随机读写操作。每个区块的所占用的平均存储空间占用参考：
- 使用LevelDB时占用50 KiB，
- 使用RocksDB时占用40 KiB。

在运行环境内需要运行完整的中继链全节点和Phala平行链全节点以支持prb的交易发送和区块数据读取。

## 功能

`prb` 提供以下服务:
- `io`：一个简单的服务以提供prb内部的RocksDB/LevelDB I/O能力。由于RocksDB/LevelDB被设计为线程安全模型，该服务只能同时运行最多1个实例；
- `fetch`：从区块链节点中获取数据，并处理成同步所需的格式；
- `trade`：向区块链发送交易；
- `lifecycle`：向TEE计算节点同步消息队列和区块数据并管理TEE计算节点的生命周期与状态。

## Redis, RPC and the monitor

Redis用于维护内部的消息队列和组件之间的通信，由于Redis默认不设鉴权，**请勿将其暴露在公共网络中**。

`prb`的RPC接口使用Protobuf定义, [查看RPC定义](https://github.com/Phala-Network/runtime-bridge-proto/blob/main/message.proto)。

[Monitor](https://github.com/Phala-Network/runtime-bridge-monitor)提供了一个简单Web界面用于管理计算节点。其仅为上述RPC接口的使用实例，并不提供完整的管理功能。

## Linux内核优化

您无需在开发和测试期间对内核进行调优。

当prb中的Worker量超过300台时应该调整lifecycle组件所在容器的最大TCP连接数，我们在项目目录中提供了一个[示例](https://github.com/Phala-Network/runtime-bridge/tree/master/system/bridge)，**请您注意，我们无法对Linux内核以及您的运行环境提供任何支持。**
