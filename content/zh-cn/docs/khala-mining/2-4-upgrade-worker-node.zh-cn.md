---
title: "2.4 Worker升级"
---

{{< tip "warning" >}}
Para-2 是 Phala Network (以及 Khala Network) 的第一版平行链测试网。测试网的目的是在 Khala Network 上线挖矿子系统前及早发现并解决问题，同时收集来自社区的反馈。因此在测试网络中，频繁的修改与升级是正常的。除非特殊提及，本教程中所有的区块链都指 Para-2 测试网。
{{< /tip >}}

# 停止挖矿

```shell
sudo phala stop
```
# 清空节点数据并升级

```shell
sudo phala update clean
sudo phala start
```
# 不清空节点数据升级

```shell
sudo phala update
sudo phala start
```

