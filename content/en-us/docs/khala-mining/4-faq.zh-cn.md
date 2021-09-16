---
title: "4 FAQ"
---

> 陆续更新中。

## I. 增加信任等级

目前等级 1、2、3 会被当作同样的信任等级来看待，因此如果你只是2或3级，无需去再去提升等级。但如果你的等级为4或5，则可以参考以下建议来操作。与此同时，我们鼓励加入我们的 Telegram 或 Discord 群来讨论与分享你的经验。

### 遇到提示 CONFIGURATION_NEEDED 或 CONFIGURATION_AND_SW_HARDENING_NEEDED

> The EPID signature of the ISV enclave QUOTE has been verified correctly, but additional configuration of SGX platform may be needed (for further details see Advisory IDs). The platform has not been identified as compromised and thus it is not revoked. It is up to the Service Provider to decide whether or not to trust the content of the QUOTE, and whether or not to trust the platform performing the attestation to protect specific sensitive information.
>
> -- 节选自 [Intel IAS API Sepc](https://api.trustedservices.intel.com/documents/IAS-API-Spec-rev-4.0.pdf)

这个提示表明 BIOS 配置可以改进，或者 BIOS 固件有问题。可以尝试：

- 更新到最新的 BIOS 固件（有时硬件厂商不一定会提供最新的更新，可能需要向厂商表明自己需要启用SGX功能，并更新至最新的微码版本）
- 在 BOIS 中禁用超线程
- 在 BIOS 中禁用集成显卡
- 在 BOIS 中关闭高级电源管理（例如节能模式）
- 检查远程认证报告中的 `adversoryIds` 字段，并查阅 Intel 提供的具体文档寻求解决方案

{{< tip >}}
Linux 系统也提供了升级微码的能力，但对提高信任等级没有帮助，因为 SGX 只会评估 BIOS 中载入的微码。
{{< /tip >}}

### 遇到提示 GROUP_OUT_OF_DATE

> The EPID signature of the ISV enclave QUOTE has been verified correctly, but the TCB level of SGX platform is outdated (for further details see Advisory IDs). The platform has not been identified as compromised and thus it is not revoked. It is up to the Service Provider to decide whether or not to trust the content of the QUOTE, and whether or not to trust the platform performing the attestation to protect specific sensitive information.

表明 BIOS 固件（尤其是其中搭载的 CPU 微码）已经过期，升级到位即可解决。可以尝试：

- 更新到最新的 BIOS 固件（有时硬件厂商不一定会提供最新的更新，可能需要向厂商表明自己需要启用SGX功能，并更新至最新的微码版本）

{{< tip >}}
Linux 系统也提供了升级微码的能力，但对提高信任等级没有帮助，因为 SGX 只会评估 BIOS 中载入的微码。
{{< /tip >}}

### 如何从Para2切换到Khala

1 首先请清理您的节点数据，使用命令：
sudo phala update clean
检查您的/var文件夹，应该不会出现 phala-node-data phala-pruntime-data 两个文件夹

2 根据您的自身情况，删除脚本，使用命令：

```bash
sudo phala uninstall
sudo rm -R ~/solo-mining-scripts-para
sudo rm -R ~/solo-mining-scripts-main
sudo rm ~/main.zip
sudo rm ~/para.zip
```

3 重新根据https://wiki.phala.network/zh-cn/docs/khala-mining/ 的指引下载并安装脚本