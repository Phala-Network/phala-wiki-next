---
title: 'Technical Details'
weight: 4005
menu:
  general:
    parent: "general-bridge"
---

SubBridge is different from general cross-chain solutions in that they only realize the transfer of assets and data between two chains.

SubBridge is more like a router linking different cross-chain bridges and allows asset transfer from one chain to any other chains which have been registered. For example, we have implemented the transfer of ERC20 assets on Moonriver and Ethereum to other parachains in the Polkadot ecosystem through SubBridge. To accomplish this, it is not necessary for the parachain receiving the asset to have an EVM cross-chain bridge integrated into its runtime. This is done by the SubBridge module that exists on Khala.

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

The purpose of SubBridge is to connect assets in multiple chains. Therefore, how to unify the definitions of assets and locations in multiple chains is the first problem we need to solve. After research, we thought of MultiAsset and MultiLocation in the Polkadot [XCM protocol](https://github.com/paritytech/xcm-format). MultiAsset is used to represent a certain asset on a certain chain. For example, the asset of PHA can be expressed as:

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

> Among them, `bridge` represents a specific bridge, for example, Chainbridge uses "cb" to represent; CelerBridge uses "cr" to represent; `chain` represents the ID of the EVM chain under the SubBridge system. Currently, Ethereum is 0 and Moonriver is 2; `account` represents the ID on the EVM chain. An account, usually a 20-byte hexadecimal string.
>

Similarly, the assets of any chain also need to be unified. The assets on the parachain are defined by the team of the parachain to define their corresponding MultiAsset; the EVM chain assets based on SubBridge are also defined as the sub-asset of the Khala network like the account address. That is, the usual asset location would be represented as:

```rust
MultiLocation::new(1, X3(Parachain(2004), GeneralIndex(chain), GeneralKey(token)))
```

> Among them, `token` represents the contract address of a certain ERC20 or ERC721 of EVM.
>

## Asset Registration

The registration of SubBridge assets is mainly divided into two parts:

The first part is to register assets into the pallet-assets module. SubBridge uses the pallet-assets module provided by Substrate to manage the registered assets. The registered assets will be assigned an asset id. Each asset has an extra [registry info](https://github.com/Phala-Network/khala-parachain/blob/5ab4f77163c811fb4a02d337791ce669b41481ad/pallets/assets-registry/src/lib.rs#L62) which contains information of location, enabled bridges and properties. Unregistered assets will fail regardless of whether they are transferred via the EVM bridge or the XCM bridge.

The second part is to enable the corresponding EVM bridge. This part is only for the asset settings that want to carry out the cross-chain requirement from Khala to the EVM chain. In SubBridge, the same asset can enable both ChainBridge-based bridges and CelerBridge-based bridges (coming soon). In practice, users are always willing to choose solutions with lower fees.

The steps to do the registration stuff are as follow:

- Step1, we schedule a call of `pallet-registry::forceRegisterAsset` with given registration informations. When the council enacted the call, an asset instance will be created by `pallet-assets`, and some extra registration information will be saved in `pallet-registry`.

    There are several things we need to pay attention to. The first one is that each asset has a bunch of metadata defined in `pallet-assets`, like `name`, `symbol`, etc. We have provided an extrinsic called `forceSetMetadata` in `pallet-registry` which can be used to update the metadata of an asset. Another one is that each asset has some privileged accounts used to manage the asset, like `Issuer`, `Admin`, etc. Different account has different permission. In `asset-registry`, we set all the privileged accounts of each asset to an account derived by `PalletId(b"phala/ar")`. This means no external account has permission to do things beyond authority.

    All registered assets can be found at [here](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkhala.api.onfinality.io%2Fpublic-ws#/assets). The asset registration informations are stored on-chain, head to [polkadot.js.app](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkhala.api.onfinality.io%2Fpublic-ws#/chainstate) and choose RPC `assetsRegistry→registryInfoByIds` to see details. Here is a screenshot of KSM registration information:

<p>
    <img src="/images/general/subbridge-assetinfo.png" style="background-color:white;" alt>
    <figcaption align = "center">Registration infomartion of KSM</figcaption>
</p>

- Step2[optional], after the asset was registered, by default all assets will enable XCM crosschain transfer. If the asset is going to enable ChainBridge, another call named `assetRegistry::forceEnabledChainbridge` should be enacted by the council. This will enable the crosschain transfer to a specific EVM chain. And `assetRegistry::forceDisableChainBridge` is used to disable it. When ChainBridge was enabled for the asset, you will see we have new data being added to the returned registration information. For example, the enabled-bridges information of ZLK is shown below:

    ```sh
    enabledBridges: [
        {
            config: Xcmp
            metadata:
        }
        {
            config: {
            ChainBridge: {
                chainId: 2
                resourceId: 0x028da1efb56e124f659fa6d5d95b3cc541ce207cbfee2f4f066061cc92d37bae
                reserveAccount: 0xde50ca45c8f7323ea372fd5d7929b9f37946690b0b668985beebe60431badcea
                isMintable: false
            }
            }
            metadata: 0x00
        }
    ]
    ```

    Looking at the ChainBridge filed, the `chainId` is 2 means it has enabled crosschain transfer between the Khala network and Moonriver EVM. `ResourceId` is used to bind ZLK on the Khala network and ERC20-ZLK on Moonriver EVM. `reserveAccount` is used to save ZLK temporarily when transferring ZLK from the Khala network to Moonriver EVM, and will transfer back to the recipient account when someone transfer ZLK from Moonriver EVM back to Khala network. `isMintable` is `false` tells the client that should aware of the ZLK balance of reserve account.

- Step3[If Step2 has been done], we also need to config your asset on our ChainBridge [Bridge contract](https://github.com/Phala-Network/chainbridge-solidity/blob/phala-bridge/contracts/Bridge.sol) before finally launching the crosschain transfer through ChainBridge. It including:
    - Binding resource id generated during registration with its ERC20 contract address. This essentially is done by executing method [adminSetResource](https://github.com/Phala-Network/chainbridge-solidity/blob/5eef3073ccc75b48e06ce44eee522c2023da974e/contracts/Bridge.sol#L204) of Bridge contract.
    - Set decimals of the asset by executing method [adminSetDecimals](https://github.com/Phala-Network/chainbridge-solidity/blob/5eef3073ccc75b48e06ce44eee522c2023da974e/contracts/Bridge.sol#L247). SubBridge is compatible with the scenario that asset has different decimals between substrate side and EVM side.
    - If your asset is burnable and would like to give the mint/burn permission to our contract, we need to tell the contract to mark your asset as burnable by executing method [adminSetBurnable](https://github.com/Phala-Network/chainbridge-solidity/blob/5eef3073ccc75b48e06ce44eee522c2023da974e/contracts/Bridge.sol#L236). With burnable set, when the user transfers asset from EVM chains, the asset would be burned directly from their account, and mint to the recipient account when someone transfers back to EVM chains.


## The Lifecycle of Cross-chain Transaction

<p>
    <img src="/images/general/subbridge-lifecycle.png" style="background-color:white;" alt>
    <figcaption align = "center">Lifecycle of SubBridge Cross-chain Transaction</figcaption>
</p>

If the two types of bridges, XCM and ChainBridge, are used as an explanation, the life cycle of a transfer across three chains can be described in the above figure. In the above picture, assets are transferred between Parachains on the left and EVM Chains on the right, passing through the Khala network in the middle.

When a cross-chain transfer is initiated from a parachain, after executing the local XCM command (such as burning a certain amount of assets from the sending account) it will be wrapped into a cross-chain XCM message and sent from the parachain to the Khala network, the XCM related modules of the Khala network will be responsible for processing the message. The transmission and instruction processing of XCM cross-chain messages are handled by Polkadot's XCM-related modules. During the execution of the instruction, when the DepositAsset instruction is executed, SubBridge will parse the payment address. If it points to the address of another EVM Chain, the transaction will be forwarded through the ChainBridge module.

Similarly, when a cross-chain transfer is initiated from EVM Chains, the ChainBridge Relayer will forward the message to the ChainBridge module of SubBridge. After the ChainBridge module performs a series of verifications on the transaction, it will process the asset with the same logic. If it is resolved that the receiving address is not an address in the local Khala network but an address on a parachain, SubBridge's XCM module will be triggered to forward the transaction.

## Other

Subbridge's Chainbridge cross-chain bridge module is maintained and developed by the Phala team and is responsible for running three Relayers. The Relayer of the Chainbridge cross-chain bridge constructs the captured origin chain cross-chain transaction into a proposal, and then the three relayers vote on the Proposal. After the vote is passed, the proposal will be executed and the assets will be deposited in the user address.

About Chainbridge, you can refer to their [websit](https://github.com/ChainSafe/ChainBridge).

For the Phala Ethereum Chainbridge contract, please refer to the source code on [github](https://github.com/Phala-Network/chainbridge-solidity/tree/phala-bridge).

## Code Auditing

The bridges currently integrated by SubBridge include two implementations, XCM and ChainBridge.

XCM is a cross-chain message protocol implemented by Parity Tech in the two networks of Polkadot and Kusama. Its code has been audited by a third-party audit firm hired by Parity. The audit report on XCM V2 (the current version of XCM used by SubBridge) can be found [here](https://blog.quarkslab.com/resources/2022-02-27-xcmv2-audit/21-12-908-REP.pdf)

Earlier last year, we deployed ChainBridge’s Solidity contract on Ethereum. The contract info can be found [here](https://etherscan.io/address/0x8F92e7353b180937895E0C5937d616E8ea1A2Bb9). Recently we migrated the old contract to the new deploy one `0x8F92e7353b180937895E0C5937d616E8ea1A2Bb9`. Up to now, the contract has been running safely for nearly a year, and the contract has also been audited by Certik, a third-party auditor hired by Phala. The detailed audit report can be found [here](https://www.certik.com/projects/phalanetwork)

## Reference

- XCM format: [https://github.com/paritytech/xcm-format](https://github.com/paritytech/xcm-format)
- MultiAsset definition: [https://github.com/paritytech/polkadot/blob/master/xcm/src/v1/multiasset.rs](https://github.com/paritytech/polkadot/blob/master/xcm/src/v1/multiasset.rs)
- MultiLocation definition: [https://github.com/paritytech/polkadot/blob/master/xcm/src/v1/multilocation.rs](https://github.com/paritytech/polkadot/blob/master/xcm/src/v1/multilocation.rs)
- Phala Chainbridge Solidity contract: [https://github.com/Phala-Network/chainbridge-solidity/tree/phala-bridge](https://github.com/Phala-Network/chainbridge-solidity/tree/phala-bridge)
- Pallet-assets implementation: [https://github.com/paritytech/substrate/tree/master/frame/assets](https://github.com/paritytech/substrate/tree/master/frame/assets)
- Introduction to ChainBridge: [https://chainbridge.chainsafe.io/](https://chainbridge.chainsafe.io/)
- Introduction to CelerBridge: [https://cbridge-docs.celer.network/](https://cbridge-docs.celer.network/)
