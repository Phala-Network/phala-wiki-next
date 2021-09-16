---
title: "3 FAQ"
---

{{< tip "warning" >}}
Para-2 是 Phala Network (以及 Khala Network) 的第一版平行链测试网。测试网的目的是在 Khala Network 上线挖矿子系统前及早发现并解决问题，同时收集来自社区的反馈。因此在测试网络中，频繁的修改与升级是正常的。除非特殊提及，本教程中所有的区块链都指 Para-2 测试网。
{{< /tip >}}

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
