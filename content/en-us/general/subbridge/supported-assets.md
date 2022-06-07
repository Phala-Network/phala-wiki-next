---
title: 'Supported Assets'
weight: 1003
menu:
  general:
    parent: "general-bridge"
---

Currently, we have supported the following assets with the corresponding transfer routes. The table below shows which chains have been supported for each asset. For example, we can transfer ZLK between parachains and Moonriver EVM, but we cannot transfer it between parachains and Ethereum.

An asset id of type *uint32* is allocated for each registered asset. Each asset except PHA on Khala will have an unique asset id. You can use [pallet-assets](https://github.com/paritytech/substrate/tree/master/frame/assets) to transfer asset to any accounts within Khala Network.

| Name |                     Location                     | Asset ID | Parachains | Ethereum | Moonriver EVM |
| ---: | :----------------------------------------------: | :------: | :--------: | :------: | :-----------: |
| PHA  | (1, X1(Parachain(2004)))                         |   null   |     ✅      |    ✅     |      ❌      |
| KSM  | (1, Here)                                        |     0    |     ✅      |    ❌     |      ❌      |
| KAR  | (1, X2(Parachain(2000), GeneralKey(0x0080)))     |     1    |     ✅      |    ❌     |      ❌      |
| BNC  | (1, X2(Parachain(2001), GeneralKey(0x0001)))     |     2    |     ✅      |    ❌     |      ❌      |
| ZLK  | (1, X2(Parachain(2001), GeneralKey(0x0207)))     |     3    |     ✅      |    ❌     |      ✅      |
| aUSD | (1, X2(Parachain(2000), GeneralKey(0x0081)))     |     4    |     ✅      |    ❌     |      ❌      |
| BSX  | (1, X2(Parachain(2090), GeneralKey(0x00000000))) |     5    |     ✅      |    ❌     |      ❌      |
| MOVR | (1, X2(Parachain(2023), PalletInstance(10)))     |     6    |     ✅      |    ❌     |      ❌      |
| HKO  | (1, X2(Parachain(2085), GeneralKey("HKO")))      |     7    |     ✅      |    ❌     |      ❌      |
