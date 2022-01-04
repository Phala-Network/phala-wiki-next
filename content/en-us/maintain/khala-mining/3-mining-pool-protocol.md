---
title: "3 Phala Runtime Bridge"
weight: 10030
draft: true
menu:
  maintain:
    parent: "khala-mining"
---

Github: https://github.com/Phala-Network/runtime-bridge

## What is Phala Management Development Component?

Phala Management Development Component is an open-source development component which meant to serve Phala miners. It provides a Cloud Native RPC interface to manage Phala Workers' lifecycle through Redis. It can be utilized by:

- Public Mining Pool, a third-party service which enables its members to share their processing power and split the reward according to the amount of work they contributed;
- Mining Cluster, a private network consisted of multiple TEE Workers.

Noted that Phala Management Development Component is a development component which can be customized by developers, and it should not be directly used by end users.

## Hardware Requirements

Unlike normal Worker which runs in SGX, Phala Management Development Component itself \***_requires no TEE (i.e., SGX) capabilities_**. We list the recommended hardwares as follow.

|     Hardware     |             Requirement             |
| :--------------: | :---------------------------------: |
|       CPU        |        Intel E5/8th Core I7         |
|      Memory      |             $\geq$ 64G              |
|     Storage      | $\geq$ 1TB SSD (NVME PCIE 3.0 \* 4) |
| Operating System |      Ubuntu 18.04/20.04 Server      |
|     Network      |      LAN Bandwidth $\geq$ 1GB       |

## Functionalities

Phala Management Development Component provides functionalities include:

<!-- TODO.zhe: I think the Worker and Controller accounts have been abandoned -->

<!-- TODO.zhe: we'd better give this a license -->

## Technical Support

Feel free to ask for help during development in:

- Phala forum: https://forum.phala.network/t/topic/2379
- Telegram: https://t.me/phaladeveloper
