---
title: 'Supported Assets'
weight: 1003
menu:
  general:
    parent: "general-bridge"
---

Currently, we have supported the following assets with the corresponding transfer routes. The table below shows which chains have been supported for each asset. For example, we can transfer ZLK between parachains and Moonriver EVM, but we cannot transfer it between parachains and Ethereum.

An asset id of type *uint32* is allocated for each registered asset. Each asset except PHA on Khala will have an unique asset id. You can use [pallet-assets](https://github.com/paritytech/substrate/tree/master/frame/assets) to transfer asset to any accounts within Khala Network.

| Name | Asset ID | Parachains | Ethereum | Moonriver EVM |
| ---: | :------: | :--------: | :------: | :-----------: |
|  PHA |   null   |     ✅      |    ✅     |       ❌       |
|  KSM |     0    |     ✅      |    ❌     |       ❌       |
|  KAR |     1    |     ✅      |    ❌     |       ❌       |
|  BNC |     2    |     ✅      |    ❌     |       ❌       |
|  ZLK |     3    |     ✅      |    ❌     |       ✅       |
| aUSD |     4    |     ✅      |    ❌     |       ❌       |
