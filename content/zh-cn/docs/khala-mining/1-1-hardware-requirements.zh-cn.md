---
title: "1.1 检查你的硬件、BIOS和系统"
---

{{< tip "warning" >}}
Para-2 是 Phala Network (以及 Khala Network) 的第一版平行链测试网。测试网的目的是在 Khala Network 上线挖矿子系统前及早发现并解决问题，同时收集来自社区的反馈。因此在测试网络中，频繁的修改与升级是正常的。除非特殊提及，本教程中所有的区块链都指 Para-2 测试网。
{{< /tip >}}
## Phala 硬件需求门槛
![](/images/docs/poc3/1-3.1.png)
如何检查自己的设备支持 BIOS：
[前往 Intel 官网查询自己的芯片是否支持 SGX](https://www.notion.so/Intel-SGX-26209def476b40b0bb578c89d4d2e7da)

## 打开[英特尔官网](https://www.intel.cn/content/www/cn/zh/homepage.html)，搜索自己的CPU型号
   ![](/images/docs/poc3/1-3.2.png)
   ![](/images/docs/poc3/1-3.3.png)
   ![](/images/docs/poc3/1-3.4.png)
### 如图所示，这样就是支持的芯片。

## 确认 BIOS 设置

1. 首先打开百度，查询进入你的电脑的 BIOS 键是什么。每个品牌不一样。重启电脑，快速按下刚刚查到的键，进入 BIOS 界面。
   - 找到 Security（安全选项） ，找到 Secure Boot（安全启动） ，选择 Disabled（关闭）
   - 找到 Boot（启动选项） ，在 Boot Mode (启动模式) 里 启动 UEFI
   - 找到 SGX 选项，优先选 Enabled，如果没有则选 Software Controlled。选择 Software Controlled 的，进入系统以后输入下面的指令启动驱动：
```shell
wget https://github.com/Phala-Network/sgx-tools/releases/download/0.1/sgx_enable 
sudo chmod +x sgx_enable
sudo ./sgx_enable
```
{{< tip >}}

**如何打开 Ubuntu 终端**

在桌面点击右键 →终端（Open in Terminal）**

{{< /tip >}}

## Ubuntu 18.04 / 20.04

- 目前暂不支持这两个版本以外的版本
- [怎么安装 Ubuntu 18.04](https://ywnz.com/linuxaz/2588.html#:~:text=1.%E8%BF%9B%E5%85%A5win%20PE%EF%BC%88%E8%BF%99,Ubuntu%2018.04%E7%B3%BB%E7%BB%9F%E5%AE%89%E8%A3%85%E4%BA%86%E3%80%82)

### References

1. [什么是TEE?
](https://www.trustonic.com/technical-articles/what-is-a-trusted-execution-environment-tee/)
2. [什么是Intel SGX](https://software.intel.com/content/www/us/en/develop/topics/software-guard-extensions.html)


**​**

[**矿力觉醒↗️**](https://www.yuque.com/fagephalanetwork/phalatothemoon/kp0rv0)

矿力觉醒为社区成员提供的通过SGX测试的硬件设备，方便新用户快速上手。

此表中所有设备均非官方推荐，官方仅对系统中所查询数据负责，机器仅供参考。
