---
title: "2.1 环境配置"
---

{{< tip "warning" >}}
Para-2 是 Phala Network (以及 Khala Network) 的第一版平行链测试网。测试网的目的是在 Khala Network 上线挖矿子系统前及早发现并解决问题，同时收集来自社区的反馈。因此在测试网络中，频繁的修改与升级是正常的。除非特殊提及，本教程中所有的区块链都指 Para-2 测试网。
{{< /tip >}}
### 如果你已经进行了SGX测试、性能测试，那么你的配置应该已经完成，可以忽略，直接下一步
​

只需要运行（会自动请求设置使用核心数、节点名称、Gas费账户助记词、抵押池owner账户地址）：

```shell
sudo phala install
```
{{< tip "warning" >}}
Solo挖矿模式需要让一个GAS费地址对应一台Worker。GAS费地址不能复用。
{{< /tip >}}

当你希望更改使用核心数、节点名称、Gas费账户助记词、抵押池owner账户地址：

```shell
sudo phala config set
```

当你希望查看配置（使用核心数、节点名称、Gas费账户助记词、抵押池owner账户地址），你可以这样做：

```shell
sudo phala config show
```

注意：如果你使用核心数、节点名称、Gas费账户助记词、抵押池owner账户地址等输入错误，脚本会自动请求重新输入，只有输入正确的信息才会向下运行。为保证挖矿可以进行，Gas费账户最低余额不得低于0.1PHA
