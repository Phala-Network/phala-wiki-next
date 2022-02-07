---
title: "Entities in Blockchain"
weight: 1002
menu:
  learn:
    parent: "phala-blockchain"
---

## Overview

The last chapter covered Phala's architecture, whereas this page will touch on Phala's entities, the type of nodes that make Phala Network.

In Phala Network, there are three kinds of entities:

- _Client_, which operates on normal devices without any special hardware requirement;
- _Worker_, which operates on TEE (_Trusted Execution Environment_) and serves as the computation nodes for confidential smart contracts;
- _Gatekeeper_, which operates on TEE and serves as the authorities and key managers;

The image below visualizes the interaction between Phala's entities.

![Phala Network](/images/docs/spec/phala-design.png)

The basic design of Phala Network is meant to ensure the security and confidentiality of the blockchain and its smart contracts. However, with more security improvements, Phala Network can defend against advanced attacks.

> Read more technical information about [Entity Key Initialisation](/en-us/learn/developer/blockchain-entities-technical/#entity-key-initialization), [Secure Communication](/en-us/learn/developer/blockchain-entities-technical/#secure-communication), and more in the [Developer Section](/en-us/learn/developer/blockchain-entities-technical/) of Learn.
