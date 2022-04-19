---
title: 'Security Concern'
weight: 1004
menu:
  general:
    parent: "general-bridge"
---

Among the numerous blockchain security attacks, attacks against cross-chain bridges are undoubtedly the most frequent and serious types of asset losses. SubBridge ensures the security of cross-chain bridges through multiple dimensions.

## Code audit

The bridges currently integrated by SubBridge include two implementations, XCM and ChainBridge. XCM is a cross-chain message protocol implemented by parity tech in the two networks of Polkadot and Kusama. Its code has been audited by a third-party audit firm hired by Parity. The audit report on XCM V2 (the current version of XCM used by SubBridge) can be found here: [https://blog.quarkslab.com/resources/2022-02-27-xcmv2-audit/21-12-908-REP.pdf](https://blog.quarkslab.com/resources/2022-02-27-xcmv2-audit/21-12-908-REP.pdf)

Earlier last year, we deployed ChainBridge's Solidity contract on Ethereum. The contract address is:[https://etherscan.io/address/0xC84456ecA286194A201F844993C220150Cf22C63](https://etherscan.io/address/0xC84456ecA286194A201F844993C220150Cf22C63)

Up to now, the contract has been running safely for nearly a year, and the contract has also been audited by Certik, a third-party auditor hired by Phala. The detailed audit report can be found here:[https://www.certik.com/projects/phalanetwork](https://www.certik.com/projects/phalanetwork)

## Administrator private key multi-signature processing

When it comes to ultra-privileged accounts, multi-signature is often the most effective way to avoid attacks. SubBridge's XCM-related configuration itself is implemented based on Substrate's council module, and its essence is also a multi-signature implementation; the administrator account of the ChainBridge Solidity contract is used to configure the bridge, and its private key is also managed by multi-signature.
