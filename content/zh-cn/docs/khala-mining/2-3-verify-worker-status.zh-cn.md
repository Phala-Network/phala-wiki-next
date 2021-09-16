---
title: "2.3 查看Worker状态"
---

{{< tip "warning" >}}
Para-2 是 Phala Network (以及 Khala Network) 的第一版平行链测试网。测试网的目的是在 Khala Network 上线挖矿子系统前及早发现并解决问题，同时收集来自社区的反馈。因此在测试网络中，频繁的修改与升级是正常的。除非特殊提及，本教程中所有的区块链都指 Para-2 测试网。
{{< /tip >}}


#### 在phala脚本目录打开终端，输入以下指令:

```shell
sudo phala status
```

正确的状态应该如下图：

![](/images/docs/khala-mining/2-3-1-cn.png)

注意：

这里会显示你的节点名称、核心使用数、Gas费地址及余额、抵押池账户地址以及Worker-publish-key
请注意如果你的Gas费账户余额低于2PHA此处将出现警告，若你注意到警告请及时向Gas费账户补充PHA。

