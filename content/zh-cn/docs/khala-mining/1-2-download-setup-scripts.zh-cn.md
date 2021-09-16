---
title: "1.2 下载并安装Phala脚本"
---

{{< tip "warning" >}}
Para-2 是 Phala Network (以及 Khala Network) 的第一版平行链测试网。测试网的目的是在 Khala Network 上线挖矿子系统前及早发现并解决问题，同时收集来自社区的反馈。因此在测试网络中，频繁的修改与升级是正常的。除非特殊提及，本教程中所有的区块链都指 Para-2 测试网。
{{< /tip >}}

**请注意，在你进行以下操作之前请确保你已经阅读了本章节以前的全部内容。已经检查过你的硬件、BIOS设置（若找不到SGX选项可以先往后做进行测试）。并且已经安装好Ubuntu18.04或Ubuntu20.04。**

下载Phala工具包地址：[https://github.com/Phala-Network/solo-mining-scripts/archive/refs/heads/para.zip](https://github.com/Phala-Network/solo-mining-scripts/archive/refs/heads/para.zip)，或者可以用wget下载，命令如下：

```shell
cd ~
sudo apt-get install wget
sudo apt-get install unzip
wget https://github.com/Phala-Network/solo-mining-scripts/archive/refs/heads/para.zip
unzip para.zip
cd solo-mining-scripts-para
```

## 使用sgx_enable激活SGX功能

在phala脚本目录打开终端，输入以下指令后电脑会重启：

```shell
cd ~/solo-mining-scripts-para
sudo chmod +x sgx_enable
sudo ./sgx_enable
sudo reboot
```

## 安装Phala工具

在phala脚本目录打开终端，输入以下指令：

```shell
cd ~/solo-mining-scripts-para
sudo chmod +x install.sh
sudo ./install.sh cn
```
