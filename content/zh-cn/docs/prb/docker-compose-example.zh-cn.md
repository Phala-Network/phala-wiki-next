---
title: "基于Docker Compose的部署示例"
weight: 2
---

每当prb在Github Release上发布新版本时，[Docker Hub](https://hub.docker.com/r/phalanetwork/prb)会同步更新其容器镜像，您可以通过以下命令获取其最新版本:
```bash
docker pull phalanetwork/prb
```

您可以通过使用`prb`的RPC进行符合您使用需求的代码集成而不需要对prb本身进行改动。使用容器技术对其进行管理比在Linux中直接运行容易得多。以下是使用Docker Compose部署`prb`的一个简单示例。

> **注意:** 此示例仅介绍了各个服务之间的关系，请您根据自己的需求进行环境配置。

## 系统要求
- Ubuntu LTS 20.04
- Docker 20.10或更新
- Docker Compose 1.29 或更新

> Ubuntu默认APT源中的Docker版本太旧，请您根据[https://docs.docker.com/engine/install/ ](https://docs.docker.com/engine/install/)与[https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)安装Docker和Docker Compose的最新版本。

> 在生产环境中，请您使用Docker Hub中的预构建的镜像而非由源码自行构建以避免非预期的行为。

## 环境准备

1. 创建一个新的文件夹，然后用[这里](https://github.com/Phala-Network/runtime-bridge/blob/master/docker/testing/bridge/docker-compose.example.yml)的样例创建和编辑docker-compose.yml；
2. 运行`docker-compose pull`拉取最新镜像；
3. 在Worker机上部署 `pruntime`；
4. 在区块链上建立Stakepool。

## 基础服务

运行`docker-compose up -d redis io`启动基础服务。

在本示例中，Redis中的数据没有被持久化，其意外退出会破坏整个环境，请在生产环境中配置高可用的Redis服务。如果您需要在Docker Compose的网络环境外使用RPC，请暴露Redis的端口。

RocksDB/LevelDB数据将存放于环境变量中`PHALA_DB_PREFIX`所指定的目录中。其中，`0`目录将用于区块数据存储。`1`目录用于保存Pool和Worker数据（包括私钥，请务必备份）。

## `fetch`服务

运行`docker-compose up -d fetch`启动`fetch`服务。

此服务将至少占用3个CPU核心:
1. 从中继链中获取包含justification的区块header；
2. 从平行链中获取区块header和storage changes；
3. 将区块数据编码为`pruntime`所接受的格式；
4. 组织并合并上述数据以实现快速同步。

这所有的操作都是异步的，在同步时，您将看到这几个进程会占用大量的CPU时间。`fetch`服务可以根据实际情况停止和启动。

## `trade`服务

运行`docker-compose up -d trade`启动`trade`服务。

其仅需要需要1个CPU核心即可将消息队列中的消息进行签名并发送至区块链上。其签名所需的密钥将保存在内存中，请保证运行环境的数据安全。

每次更改pool的账户信息时，`trade`须重启才能生效。

## `lifecycle`服务

运行 `docker-compose up -d lifecycle`启动`lifecycle`服务。

其向TEE计算节点同步消息队列和区块数据并管理TEE计算节点的生命周期与状态。使用[monitor](https://github.com/Phala-Network/runtime-bridge-monitor)来添加、编辑、删除或检查TEE计算节点。

每次更改Worker（TEE计算节点）信息时，`lifecycle`须重启才能生效。
