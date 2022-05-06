---
title: 'Supported Assets'
weight: 1003
menu:
  general:
    parent: "general-bridge"
---

We have supported the following assets. The asset id is an type of uint32. Each asset except PHA on Khala will have an unique asset id. You can use [pallet-assets](https://github.com/paritytech/substrate/tree/master/frame/assets) transfer asset to any accounts within Khala network. The table below describes the asset id and which chain has supported of the asset. For example, we can transfer ZLK between parachains and Moonriver EVM, but we can not transfer it between parachains and Ethereum.

| Name | AssetId | Parachains | Ethereum | Moonriver EVM |
| --- | --- | --- | --- | --- |
| PHA | Null | ✅ | ✅ | ❌ |
| KSM | 0 | ✅ | ❌ | ❌ |
| KAR | 1 | ✅ | ❌ | ❌ |
| BNC | 2 | ✅ | ❌ | ❌ |
| ZLK | 3 | ✅ | ❌ | ✅ |
| aUSD | 4 | ✅ | ❌ | ❌ |
