---
title: "Khala Pre-mainnet Mining Guide"
weight: 6010
draft: false
menu:
  docs:
    parent: "khala-mining"
---

Khala Network is Phala's canary network on Kusama Parachain featuring decentralized TEE mining. We provide an overview to setup the mining environment, followed by a detailed explanation of each step.

We highly recommend miners to first read about Phala's [tokenomic]({{< relref "docs/tokenomic" >}}) and [staking mechanism]({{< relref "docs/tokenomic/1-mining-staking" >}}) to understand the calculation of incomings and how the mining proceeds.

If you have any questions, you can always reach out for help:

- Telegram: https://t.me/phalanetwork
- Discord: https://discord.gg/DWdHXFm8
- Forum: https://forum.phala.network/

Here are some note that Khala needs.

- Khala Polkadot.js UI: [Link](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkhala.api.onfinality.io%2Fpublic-ws#/explorer)
- Khala RPC Endpoint: `wss://khala.api.onfinality.io/public-ws`
- Khala blockchain explorer: <https://khala.subscan.io/>
- Khala App：<https://app.phala.network/>
- Khala Console: <https://app.phala.network/console>

### I. Getting Started

- [1.1 Check Your Hardware, BIOS and System]({{< relref "docs/khala-mining/1-1-hardware-requirements" >}})
- [1.2 Install Phala Tools]({{< relref "docs/khala-mining/1-2-download-setup-scripts" >}})
- [1.3 Check the SGX Capability and Confidence Level]({{< relref "1-3-confidential-level-evaluation" >}})
- [1.4 Benchmarking]({{< relref "docs/khala-mining/1-4-benchmarking" >}})

### II. Deploying Khala Network

- [2.1 Configuration]({{< relref "docs/khala-mining/2-solo-mining" >}})
- [2.2 Deploy Worker Node]({{< relref "docs/khala-mining/2-1-deploy-worker-node" >}})
- [2.3 Verify Worker Status]({{< relref "docs/khala-mining/2-2-verify-worker-status" >}})
- [2.4 Upgrade Worker Node]({{< relref "docs/khala-mining/2-3-upgrade-worker-node" >}})
- [2.5 Use Console to Manage Your Mining]({{< relref "docs/khala-mining/2-4-console" >}})

### III. FAQ

- [Frequently Asked Questions]({{< relref "docs/khala-mining/4-faq" >}})
- [How to get better peers connectivity]({{< relref "docs/khala-mining/4-1-How-to-get-better-peers-connectivity" >}})
- [How to fast sync your node to you haven't fully synced yet]({{< relref "docs/khala-mining/4-2-How-to-fast-sync-node-use-snapshot" >}})
