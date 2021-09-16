---
title: "Para-2 Testnet Mining Guide"
weight: 5
draft: false
---

{{< tip "warning" >}}
Para-2 is the Parachain testnet of Phala Network (and Khala Network). The purpose of running a testnet is to capture the chaos and collect feedback before the launch of the functionalities on Khala Network. So the system is subject to change. In this tutorial, we always refer to the testnet unless explicitly mentioned.
{{< /tip >}}

Khala Network is Phala's canary network on Kusama Parachain featuring decentralized TEE mining. We provide an overview to setup the mining environment, followed by a detailed explanation of each step.

We highly recommend miners to first read about Phala's [tokenomic]({{< relref "docs/tokenomic" >}}) and [staking mechanism]({{< relref "docs/tokenomic/1-mining-staking" >}}) to understand the calculation of incomings and how the mining proceeds.

If you have any questions, you can always reach out for help:
- Telegram: https://t.me/phalanetwork
- Discord: https://discord.gg/DWdHXFm8
- Forum: https://forum.phala.network/

Here are some note that Para-2 needs.

- Para-2 Polkadot.js UI: [Link](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fpara2-api.phala.network%2Fws#/explorer)
- Para-2 RPC Endpoint: `wss://para2-api.phala.network/ws`
- Para-2 blockchain explorer: <https://phala-testnet.subscan.io/>

### I. Getting Started

- [1.1 Check Your Hardware, BIOS and System]({{< relref "docs/khala-mining/1-1-hardware-requirements" >}})
- [1.2 Install Phala Tools]({{< relref "docs/khala-mining/1-2-download-setup-scripts" >}})
- [1.3 Check the SGX Capability and Confidence Level]({{< relref "1-3-confidential-level-evaluation" >}})
- [1.4 Benchmarking]({{< relref "docs/khala-mining/1-4-benchmarking" >}})

### II. Deploying Khala Network

- [2.1 Configuration]({{< relref "docs/khala-mining/2-1-configuration" >}})
- [2.2 Deploy Worker Node]({{< relref "docs/khala-mining/2-2-deploy-worker-node" >}})
- [2.3 Verify Worker Status]({{< relref "docs/khala-mining/2-3-verify-worker-status" >}})
- [2.4 Upgrade Worker Node]({{< relref "docs/khala-mining/2-4-upgrade-worker-node" >}})
- [2.5 Use Console to Manage Your Mining]({{< relref "docs/khala-mining/2-5-console" >}})

### III. FAQ

- [Frequently Asked Questions]({{< relref "docs/khala-mining/4-faq" >}})
