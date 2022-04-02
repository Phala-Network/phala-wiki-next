---
title: 'Technical Details'
weight: 1003
menu:
  general:
    parent: "general-bridge"
---

SubBridge is different from general cross-chain solutions in that they only realize the transfer of assets and data between two chains.

SubBridge is more like a router linking different cross-chain bridges, and allow asset transfer from one chain to any other chains which have been registered. For example, we have implemented the transfer of ERC20 assets on Moonriver and Ethereum to other parachains in the Polkadot ecosystem through SubBridge. To accomplish this, it is not necessary for the parachain receiving the asset to have an EVM cross-chain bridge integrated into its own runtime. This is done by the SubBridge module that exists on Khala.

<p>
    <img src="/images/general/subbridge-pallets.png" style="background-color:white;" alt>
    <figcaption align = "center">Pallets in Khala</figcaption>
</p>

As shown in the figure below, SubBridge integrates the implementation of multiple bridges, here we use BridgeA, BridgeB, and BridgeC to represent. When Khala receives a cross-chain asset transfer, it will choose whether to forward the transaction to another chain according to the destination address. If the transaction is only transferred to an account in the Khala network, we will deposit the asset directly into the receiving account; in the case of another chain, usually, this needs to ensure:

- The destination is already supported by a certain bridge, that is, the SubBridge will traverse the list of bridges to check whether the bridge supports transfers to the destination address, and if so, use this bridge for forwarding.
- Make sure that the format of the path conforms to our specification [see next section] and still has enough assets as a fee to pay the cross-chain fee to the other chain.

It can be seen that we can not only realize the cross-chain transfer of assets through multiple bridges but also try to choose a transfer path with the lowest fee for users

<p>
    <img src="/images/general/subbridge-topology.png" style="background-color:white;" alt>
    <figcaption align = "center">SubBridge Topology</figcaption>
</p>

## MultiAsset and MultiLocation

The purpose of SubBridge is to connect assets in multiple chains. Therefore, how to unify the definitions of assets and locations in multiple chains is the first problem we need to solve. After research, we thought of MultiAsset and MultiLocation in the Polkadot XCM protocol (XCM: https://github.com/paritytech/xcm-format). MultiAsset is used to represent a certain asset on a certain chain. For example, the asset of PHA can be expressed as:

```rust
MultiAsset::new(Fungible(amount), Concrete(pha_location))
```

> Where `amount` is a certain amount of asset, `pha_location` is the path of PHA under the XCM protocol standard, which is defined by SubBridge and represented by MultiLocation, usually represented as:
>

```rust
MultiLocation::new(1, X1(Parachain(2004)))
```

> Among them, `2004` is the parachain ID of the Khala network. So how do we use the XCM protocol to represent any non-parachain‘s account address? It determines how SubBridge will recognize and forward cross-chain transactions.
>

What we do in practice is that we incorporate other non-parachains into sub-addresses of the Khala network, similar to the local area network specified by TCP/IP. In this way, the account address of an EVM chain can be represented as:

```rust
MultiLocation::new(1, X4(Parachain(2004), GeneralKey(bridge), GeneralIndex(chain), GeneralKey(account)))
```

> Among them, `bridge` represents a specific bridge, for example, Chainbridge uses “cb” to represent; CelerBridge uses “cr” to represent; `chain` represents the ID of the EVM chain under the SubBridge system. Currently, Ethereum is 0 and Moonriver is 2; `account` represents the ID on the EVM chain. An account, usually a 20-byte hexadecimal string.
>

Similarly, the assets of any chain also need to be unified. The assets on the parachain are defined by the team of the parachain to define their corresponding MultiAsset; the EVM chain assets based on SubBridge are also defined as the sub-asset of the Khala network like the account address. That is, the usual asset location would be represented as:

```rust
MultiLocation::new(1, X3(Parachain(2004), GeneralIndex(chain), GeneralKey(token)))
```

> Among them, `token` represents the contract address of a certain ERC20 or ERC721 of EVM.
>

## Asset registration

The registration of SubBridge assets is mainly divided into two parts:

The first part is to register assets into the pallet-assets module. SubBridge uses the pallet-assets module provided by Substrate to manage the registered assets. The registered assets will be assigned an asset id. When registering assets, the asset location mentioned above will be recorded in the assets-wrapper module (which will be replaced by the assets-registry module soon). Unregistered assets will fail regardless of whether they are transferred via the EVM bridge or the XCM bridge.

The second part is to enable the corresponding EVM bridge. This part is only for the asset settings that want to carry out the cross-chain requirement from Khala to the EVM chain. In SubBridge, the same asset can enable both ChainBridge-based bridges and CelerBridge-based bridges (coming soon). In practice, users are always willing to choose solutions with lower fees.

## The life cycle

<p>
    <img src="/images/general/subbridge-lifecycle.png" style="background-color:white;" alt>
    <figcaption align = "center">Lifecycle of SubBridge Cross-chain Transaction</figcaption>
</p>

If the two types of bridges, XCM and ChainBridge, are used as an explanation, the life cycle of a transfer across three chains can be described in the above figure. In the above picture, assets are transferred between Parachains on the left and EVM Chains on the right, passing through the Khala network in the middle.

When a cross-chain transfer is initiated from a parachain, after executing the local XCM command (such as burning a certain amount of assets from the sending account) it will be wrapped into a cross-chain XCM message and sent from the parachain to the Khala network, the XCM related modules of the Khala network will be responsible for processing the message. The transmission and instruction processing of XCM cross-chain messages are handled by Polkadot's XCM-related modules. During the execution of the instruction, when the DepositAsset instruction is executed, SubBridge will parse the payment address. If it points to the address of another EVM Chain, the transaction will be forwarded through the ChainBridge module.

Similarly, when a cross-chain transfer is initiated from EVM Chains, the ChainBridge Relayer will forward the message to the ChainBridge module of SubBridge. After the ChainBridge module performs a series of verifications on the transaction, it will process the asset with the same logic. If it is resolved that the receiving address is not an address in the local Khala network but an address on a parachain, SubBridge's XCM module will be triggered to forward the transaction.

## Other

Subbridge's Chainbridge cross-chain bridge module is maintained and developed by the Phala team and is responsible for running three Relayers. The Relayer of the Chainbridge cross-chain bridge constructs the captured origin chain cross-chain transaction into a proposal, and then the three relayers vote on the Proposal. After the vote is passed, the proposal will be executed and the assets will be deposited in the user address.

About Chainbridge can refer to：https://github.com/ChainSafe/ChainBridge

For the Phala Ethereum Chainbridge contract, please refer to：[https://github.com/Phala-Network/chainbridge-solidity/tree/phala-bridge](https://github.com/Phala-Network/chainbridge-solidity/tree/phala-bridge)

## Quote

XCM format：https://github.com/paritytech/xcm-format

MultiAsset definition：[https://github.com/paritytech/polkadot/blob/master/xcm/src/v1/multiasset.rs](https://github.com/paritytech/polkadot/blob/master/xcm/src/v1/multiasset.rs)

MultiLocation definition：[https://github.com/paritytech/polkadot/blob/master/xcm/src/v1/multilocation.rs](https://github.com/paritytech/polkadot/blob/master/xcm/src/v1/multilocation.rs)

Phala Chainbridge Solidity contract：[https://github.com/Phala-Network/chainbridge-solidity/tree/phala-bridge](https://github.com/Phala-Network/chainbridge-solidity/tree/phala-bridge)

Pallet-assets implementation：[https://github.com/paritytech/substrate/tree/master/frame/assets](https://github.com/paritytech/substrate/tree/master/frame/assets)

Introduction to ChainBridge：[https://chainbridge.chainsafe.io/](https://chainbridge.chainsafe.io/)

Introduction to CelerBridge：[https://cbridge-docs.celer.network/](https://cbridge-docs.celer.network/)
