---
title: "1.3 SGX测试和信任分级"
---

{{< tip "warning" >}}
Para-2 是 Phala Network (以及 Khala Network) 的第一版平行链测试网。测试网的目的是在 Khala Network 上线挖矿子系统前及早发现并解决问题，同时收集来自社区的反馈。因此在测试网络中，频繁的修改与升级是正常的。除非特殊提及，本教程中所有的区块链都指 Para-2 测试网。
{{< /tip >}}

### 首先需要先按照简易安装模式安装Phala脚本

```shell
sudo phala install
```
​
重要提示：请大家首先关注安全等级（在报告的最后一行），安全等级目前是网络评判的唯一标准！请大家务必先查看安全等级后再询问。

如果你看到`SGX_ERROR_UPDATE_NEEDED`这样的提示，则说明 BIOS 上缺少 Intel 要求 SGX 环境必须包含的工具，所以评估系统不满足 SGX 的安全标准。解决方法是更新你的 BIOS 版本，怎么更新请百度自己厂商的教程。如果这已经该厂商最新版 BIOS，**则无法挖矿。**

**在报告的最后一行会显示你的安全等级（1～5），如果你这里显示的是**`Can't give a `confidenceLevel` due to don't meet minimum requirement`**则代表你的机器是无法参与挖矿的。**

SGX测试完毕后，输入`ls /dev | grep sgx`，如果运行有返回`sgx`或者`isgx`，则说明驱动正常运行。

如果没有返回，请到《检查你的硬件、BIOS与系统》一章按照教程调试主板，设置好后回到本章继续进行SGX测试。

### 自检指令

```shell
sudo phala sgx-test
```

### 正常的结果

```shell
Detecting SGX, this may take a minute...
✔  SGX instruction set
  ✔  CPU support
  ✔  CPU configuration
  ✔  Enclave attributes
  ✔  Enclave Page Cache
  SGX features
    ✔  SGX2  ✔  EXINFO  ✘  ENCLV  ✘  OVERSUB  ✘  KSS
    Total EPC size: 94.0MiB
✔  Flexible launch control
  ✔  CPU support
  ？ CPU configuration
  ✔  Able to launch production mode enclave
✔  SGX system software
  ✔  SGX kernel device (/dev/sgx/enclave)
  ✔  libsgx_enclave_common
  ✔  AESM service
  ✔  Able to launch enclaves
    ✔  Debug mode
    ✔  Production mode
    ✔  Production mode (Intel whitelisted)

You are all set to start running SGX programs!
Generated machine id:
[162, 154, 220, 15, 163, 137, 184, 233, 251, 203, 145, 36, 214, 55, 32, 54]

Testing RA...  // RA就是 Remote Atestation ，远程认证。只有经过了远程认证的SGX才是可信的SGX。
aesm_service[15]: [ADMIN]EPID Provisioning initiated
aesm_service[15]: The Request ID is 09a2bed647d24f909d4a3990f8e28b4a
aesm_service[15]: The Request ID is 8d1aa4104b304e12b7312fce06881260
aesm_service[15]: [ADMIN]EPID Provisioning successful
isvEnclaveQuoteStatus = GROUP_OUT_OF_DATE //❗️❗️这一行报告尤为重要，这一行就决定了信用评级❗️❗️
platform_info_blob { sgx_epid_group_flags: 4, sgx_tcb_evaluation_flags: 2304, pse_evaluation_flags: 0, latest_equivalent_tcb_psvn: [15, 15, 2, 4, 1, 128, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0], latest_pse_isvsvn: [0, 11], latest_psda_svn: [0, 0, 0, 2], xeid: 0, gid: 2919956480, signature: sgx_ec256_signature_t { gx: [99, 239, 225, 171, 96, 219, 216, 210, 246, 211, 20, 101, 254, 193, 246, 66, 170, 40, 255, 197, 80, 203, 17, 34, 164, 2, 127, 95, 41, 79, 233, 58], gy: [141, 126, 227, 92, 128, 3, 10, 32, 239, 92, 240, 58, 94, 167, 203, 150, 166, 168, 180, 191, 126, 196, 107, 132, 19, 84, 217, 14, 124, 14, 245, 179] } }
advisoryURL = https://security-center.intel.com
advisoryIDs = "INTEL-SA-00219", "INTEL-SA-00289", "INTEL-SA-00320", "INTEL-SA-00329"
confidenceLevel = 5 //这里是你的信任评级
```
## 信任分级介绍

日前，Phala 开发团队在成都的矿工见面会上首次发布了“**信任分级机制**”：我们很开心地宣布，**Phala 是整个区块链行业中首次提出类似制度的项目**。

在发布后，无论是现场的矿工还是社区内的朋友都关于信任分级提出了一些疑问。我们挑选了几个有代表性的问题进行回答。
##### 一. 什么是“信任分级机制”？为什么要做信任分级？

准确来说“**信任分级机制**”应该叫做“**可信计算设备的信任分级机制**”。

支持可信计算的设备因为自身的硬件及固件支持原因，导致其安全程度不同，因此，每个设备可以适用的计算任务也不一样。所以**为了网络及网络上运行不同应用的安全性**，我们建立了信任分级机制。

Phala Network 网络上的计算机进行分级后，每种等级的可信计算节点都会被分配满足相应等级的隐私计算任务。目前 Phala Network**只对 Intel SGX 设备进行了安全分级**，后续也将逐步引入**AMD、ARM、RISCV** 等其他设备的信任分级机制。
##### 二. 具体都有哪些等级，每个等级都可以做什么样的事情，每个等级又有什么样的风险？

Phala Network 网络中的信任分级分为**可用等级**及**非可用等级**。其中可用等级有5个，即1级～5级。

| Level | isvEnclaveQuoteStatus | advisoryIDs |
|---|---|---|
| Tier 1 | OK | None |
| Tier 2 | SW_HARDENING_NEEDED | None |
| Tier 3 | CONFIGURATION_NEEDED, CONFIGURATION_AND_SW_HARDENING_NEEDED | 仅包含白名单 |
| Tier 4 | CONFIGURATION_NEEDED, CONFIGURATION_AND_SW_HARDENING_NEEDED | 白名单外|
| Tier 5 | GROUP_OUT_OF_DATE | Any value |

{{< tip >}}
白名单列表:

- INTEL-SA-00219
- INTEL-SA-00334
- INTEL-SA-00381
- INTEL-SA-00389
{{< /tip >}}

具体判定及应用场景如下。

##### Ⅰ. Phala 信任1级（最高级）

###### 🔍 如何判定？

- 如果你的 SGX 设备在做 Intel IAS 认证时，获得了英特尔 RA 报告中返回的 isvEnclaveQuoteStatus 信息为“**OK**”，则你的信任分级会被归为1级。
- 1级是**最高**等级，这证明你的可信计算设备既没有任何已知的安全漏洞，又没有任何和安全相关的固件配置错误。

###### 🔧 适用场景

- 在这样的可信执行环境中执行隐私计算任务，是最安全的。所以，在1级设备中可以运行**最高安全性的隐私计算任务**。
- 例如:

DeFi 中的转账、DEX、借贷中的仓位隐私、钱包私钥管理、资产管理以及运行 Phala Network 的 Gatekeeper 等等。

###### Ⅱ. Phala 信任2级

###### 🔍 如何判定？

- 如果你的 SGX 设备在做 Intel IAS 认证时，获得了英特尔 RA 报告中返回的 isvEnclaveQuoteStatus 信息为“**SW_HARDENING_NEEDED**”，则你的信任分级会被归为2级。
- 2级是仅次于1级的信任等级，具有与等级1相当的安全性。

###### 🔧 适用场景

- 如果你获得了2级的分级，证明硬件本身可能受到一些已知漏洞的影响，但可以在固件和软件的层面彻底地修补和加固，从而避免来自任何攻击的威胁。
- 例如，在获得2级评级的设备上必须使用 Intel提供的最新版本的 SGX SDK 及 PSW 等。
- **Phala Network**一直以来都紧跟 Intel 的安全升级和安全更新，**节点及挖矿程序已经采取了 Intel 推荐下最完整的加固措施**，从而避免一切已知安全漏洞。
- 所以在 Phala Network 的网络中，如果你获得了2级的信任评级，是**可以视为没有漏洞的**。也就是说在 Phala Network 网络中，**2级可以和1级一样运行全部隐私计算任务**。

##### Ⅲ.Phala 信任3级

###### 🔍 如何判定？

- 如果你的 SGX 设备在做 Intel IAS 认证时，获得了英特尔 RA 报告中返回的 isvEnclaveQuoteStatus 信息带有“**CONFIGURATION_NEEDED**”，且你的系统存在的潜在威胁 Intel-SA ID 都在可以被 Phala Network 放行的白名单列表中，则你的信任分级会被归为3级。
- 目前白名单内有：

INTEL-SA-00219、 INTEL-SA-00334、INTEL-SA-00381、INTEL-SA-00389。

###### 🔧 适用场景

- 这些可信计算设备虽然受到一些潜在威胁的影响，但是这些威胁经过业界的审查，都不会影响到 Phala Network 网络上隐私应用的安全性。
- 所以，如果你获得了3级的信任评级，也是可以和1级、2级一样运行**全部**隐私计算任务的。

##### Ⅳ. Phala 信任4级

###### 🔍 如何判定？

- 如果你的 SGX 设备在做 Intel IAS 认证时，获得了英特尔 RA 报告中返回的 isvEnclaveQuoteStatus 信息带有“**CONFIGURATION_NEEDED**”，但存在潜在威胁 Intel-SA ID白名单之外的条目，则你的隐私分级会被归为4级。

###### 🔧 适用场景

- 经过 Phala 的评估，获得4级评级的设备中，存在一些影响隐私计算安全性的潜在威胁，且 Intel IAS 认证认为这些威胁**暂时**没有被修复。
- 在这些评级为4的隐私计算设备上，由于一些潜在威胁的存在，他们**不适用于最高安全等级的隐私计算任务，但它并不代表设备不可用**。这类设备可能在极端情况下对机密数据提供长久的保护，但在大量的其他场景下依然有很高的价值。

例如大数据计算、个人隐私管理、Web3 Analytics、PvP 游戏、VPN 等没有持久的机密数据需求的应用。或是低敏感数据的计算任务，例如传统 Web2.0 应用、Oracle、普通 DApp 等等。

##### Ⅴ. Phala信任5级（最低级）

###### 🔍 如何判定？

如果你的 SGX 设备在做 Intel IAS认证时，获得了英特尔 RA 报告中返回的 isvEnclaveQuoteStatus 信息为“**GROUP_OUT_OF_DATE**”，则你的信任评级会被归为5级。

###### 🔧 适用场景

- 这个等级的可信计算设备**相对安全等级较低**，你获得了5级的信任评级就说明**此系统在理论上有受到数据泄漏威胁的可能性**。通常当一个平台的安全性受到潜在威胁，Intel 就会通过微码更新来修补漏洞，并触发一次密钥轮换，保证新的密钥是不受任何潜在攻击威胁的。而**这个等级表示该 CPU 的密钥不是最新版本，需要接受微码升级**。

- 与4级类似，在5级评级的可信计算设备上无法进行类似最高安全等级的任务，但依旧**可以运行等级4中描述的任务**。

##### Ⅵ.非可用等级：低于5级

其余的 Intel RA 报告或者无法获得 Intel RA 报告的计算设备都是不满足基本需求的计算设备，都**无法加入 Phala Network**。例如你的 RA 报告中出现“**SGX_ERROR_UPDATE_NEEDED**”等。这部分计算设备**不被允许注册**在 Phala Network 网络中。

---

##### 三. 其他 Q&A

##### 1.如何改变自己的信任等级，怎样可以提升信任等级？

你的隐私等级为4级说明你的 BIOS 设置存在一定的风险，你可以尝试关闭 BIOS 中的超频、降频、电压控制、超线程等开关来消除潜在威胁（Intel-SA ID），从而提高信任评级。特别是 BIOS 中 OC Mailbox Interface 开关可能是影响此部分等级的主要因素。当你的隐私等级为5级时，你可以尝试通过更新到最新的 BIOS 固件来升级微码，升级到更高等级。一些主板厂商会回应用户的邮件请求，专门为用户提供BIOS固件更新。

##### 2.我找不到 BIOS 更新或者在 BIOS 设置中找不到第1个问题中提到的开关怎么办？

请联系你的主板厂，要求主板厂依照 Intel 的要求进行安全更新。时刻保持安全更新是主板厂作为生产厂家应该尽到的义务。

##### 3.不做信任分级会怎么样？

Phala Network 率先在行业内提出信任分级制度。这样做的目的是让 Phala 提供完全安全的隐私计算服务成为可能，并实现不同级别的隐私计算服务可被分发到不同级别的可信计算设备中。经过信任分级，我们相信 Phala Network 网络将会进一步的提高自身的安全门槛。

##### 4.SGX 是否安全？

经过细致、完整的信任分级，Phala Network 上的可信计算设备可以保证非常高的安全性。不同等级的设备将会服务于不同的应用场景，更多的在线设备也会为开发者所需的安全性提供合理的价格。

##### 5.增加信任分级是中心化的吗？今后对信任分级的升级方法是什么？

这一版本的信任分级是根据 Intel 给出的报告解释和大量的调研而产生的。

分级系统包含于Phala区块链的运行时中，可以通过链上运行时升级在未来进行调整。Substrate 的链上升级由技术委员会、议会、以及民主投票决定。例如：今后若对信任分级的评价标准做出任何修改、或者加入 AMD CPU 的支持等等，都需要经过链上升级民主决策，通过后才会生效。
