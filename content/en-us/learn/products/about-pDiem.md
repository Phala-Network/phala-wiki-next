---
title: About pDiem
weight: 10001
draft: false
menu:
  learn:
    parent: "products"
---

pDiem is a compliant privacy-preserving layer for [Diem](<https://en.wikipedia.org/wiki/Diem_(digital_currency)>) on Polkadot ecosystem. Powered by Phala Network confidential contract, it can protect the privacy of Diem users. More specifically, pDiem is:

- A cross-chain bridge connecting Polkadot ecosystem with Diem’s m(b)illions of users, offering a host of Polkadot-based services and applications to Diem holders and an on-ramp to massive user base for Polkadot.
- A privacy-preserving stablecoin on Polkadot that is both compliant (a single transaction is limited in value up to the no-KYC requirements by FATF) and allows for scalable value transfers in stable asset (think remittances, everyday spending, micro-payments for services). Imagine using your current account without any bank or credit provider tracking your purchases/spendings.
- A privacy-preserving DApp ecosystem that is more open and free than Facebook-operated Novi (formerly known as Calibra).

> The project was initially named pLIBRA ("Privacy-preserving Libra"). "In December 2020, Libra was rebranded as Diem." Since then we have followed Diem's rebranding, and renamed the project to pDiem.

## Try it out

pDiem is at [Milestone 3](#web3-foundation-grants). This milestone focuses on the core of the bridge: the validation of the deposit transactions. In this demo, you can connect pDiem to the Diem testnet, validate and accept incoming deposit transactions.

{{< button "deploy-local-testnet" "Deploy Local Testnet" >}}

{{< button "play-with-pdiem" "Play With pDiem" >}}

## The System

![](/images/docs/pdiem/pdiem-system-design.png)

- **pDiem Contract**: The core of pDiem, a confidential contract that validates and accepts Diem deposits and processes withdraw requests;
- **pDiem Relayers**: The nodes that relay Diem deposit transactions to the pDiem Contract, and broadcast the withdrawal transactions to Diem;
- **Phala Network**: It runs the pDiem Contract, and relayes XCM transactions between pDiem and other Polkadot parachains
- **Polkadot**: The relay chain that connects parachains including Phala Network;
- **Parachains**: Other blockchains in the Polkadot ecosystem we aim to serve;
- **XCMP**: [Cross-chain Messaging Protocol](https://wiki.polkadot.network/docs/en/learn-crosschain).

Among the components listed in the diagram, the **pDiem Contract** and the **pDiem Realyers** are the core of the pDiem bridge protocol. The contract is deployed on Phala Network. It handles users' Diem deposit transactions and withdrawal requests. The relayers are the contributors who run pDiem Relayer program, which relay the transactions between the Diem blockchain and the pDiem contract.

pDiem receives assets from the Diem blockchain, generates **pdiem bridged tokens** on the Polkadot side, and can also transfer them back to redeem the original assets. This is achieved by a combination of different components. In the docs, we will introduce:

- [The Reservation-based Model]({{< relref "docs/pdiem/reservation-based-model" >}}),
- [The Light Validation Client]({{< relref "docs/pdiem/light-validation-client.md" >}}),
- and its [Contract Implementation]({{< relref "docs/pdiem/contract-implementation.md" >}}),
- [The Relayer]({{< relref "docs/pdiem/the-relayer.md" >}}),
- and finally, the [Future Works](< relref "docs/pdiem/future-works.md" >).

Appendix:

- [Advanced: Hardware Mode]({{< relref "docs/pdiem/hardware-mode" >}})

## Web3 Foundation Grants

pDiem received [a General Grant](https://github.com/w3f/General-Grants-Program/blob/8a23ef68c7512fa0d437554640601ef28cea3fca/grants/speculative/pLIBRA.md) from Web3 Foundataion on Aug 28, 2019. In the grant plan, we have splitted the development progress into a few milestones, as shown below.

<table>
    <thead>
        <tr>
            <th></th>
            <th>Date</th>
            <th>Milestone</th>
            <th>Achievement</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>✅</td>
            <td>Sep 2019</td>
            <td>M1</td>
            <td>
                The Technical Whitepaper. (<a href="https://files.phala.network/phala-paper.pdf">PDF</a>, <a href="https://docs.google.com/document/d/e/2PACX-1vRpkf-xvEwDSglNHMKI2J8qC7F4JiB7kLv5kOwO_mJzg-bYRL545_3JxWaM-0rCX_iyHDb68zk3Sw75/pub">One Pager</a>)
            </td>
        </tr>
        <tr>
            <td>✅</td>
            <td>Mar 2020</td>
            <td>M2</td>
            <td>
                A minimal Confidential Contract implementation (Phala Network) on Substrate. (<a href="https://github.com/Phala-Network/phala-blockchain">Repo</a>)
            </td>
        </tr>
        <tr>
            <td>✅</td>
            <td>2021Q2</td>
            <td>M3</td>
            <td>
                The bridge with a light validation client in confidential contract. (<a href="https://github.com/Phala-Network/phala-blockchain/blob/master/standalone/pruntime/enclave/src/contracts/diem.rs">Contract</a>, <a href="https://github.com/Phala-Network/phala-blockchain/tree/master/diem">Light Client</a>, <a href="https://github.com/Phala-Network/pdiem-relayer">Relayer</a>)
            </td>
        </tr>
        <tr>
            <td>⌛</td>
            <td>Est. 2021Q2</td>
            <td>M4</td>
            <td>
                Final testnet product with UI (integrated with <a href="https://app.phala.network">Phala Secret Wallet</a>)
            </td>
        </tr>
    </tbody>
</table>

<a href="https://github.com/w3f/General-Grants-Program/blob/8a23ef68c7512fa0d437554640601ef28cea3fca/grants/speculative/pLIBRA.md">
    <img src="/images/docs/web3%20foundation_grants_badge_black.svg" alt="w3f grant receiver" style="height: 100px;">\
</a>
