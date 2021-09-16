---
title: "3 Phala Runtime Bridge"
draft: true
---

{{< tip "warning" >}}
Para-2 is the Parachain testnet of Phala Network (and Khala Network). The purpose of running a testnet is to capture the chaos and collect feedback before the launch of the functionalities on Khala Network. So the system is subject to change. In this tutorial, we always refer to the testnet unless explicitly mentioned.
{{< /tip >}}

<script>
  MathJax = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$','$$'], ['\\[', '\\]']],
      processEscapes: true,
      processEnvironments: true
    },
    options: {
      skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
    }
  };
  window.addEventListener('load', (event) => {
      document.querySelectorAll("mjx-container").forEach(function(x){
        x.parentElement.classList += 'has-jax'})
    });
</script>
<script type="text/javascript" id="MathJax-script" async
  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

Github: https://github.com/Phala-Network/runtime-bridge

## What is Phala Management Development Component?

Phala Management Development Component is an open-source development component which meant to serve Phala miners. It provides a Cloud Native RPC interface to manage Phala Workers' lifecycle through Redis. It can be utilized by:
- Public Mining Pool, a third-party service which enables its members to share their processing power and split the reward according to the amount of work they contributed;
- Mining Cluster, a private network consisted of multiple TEE Workers.

Noted that Phala Management Development Component is a development component which can be customized by developers, and it should not be directly used by end users.


## Hardware Requirements

Unlike normal Worker which runs in SGX, Phala Management Development Component itself ****requires no TEE (i.e., SGX) capabilities***. We list the recommended hardwares as follow.

| Hardware | Requirement |
| :---: | :---: |
| CPU | Intel E5/8th Core I7 |
| Memory | $\geq$ 64G |
| Storage | $\geq$ 1TB SSD (NVME PCIE 3.0 * 4) |
| Operating System | Ubuntu 18.04/20.04 Server |
| Network | LAN Bandwidth $\geq$ 1GB |


## Functionalities

Phala Management Development Component provides functionalities include:
<!-- TODO.zhe: I think the Worker and Controller accounts have been abandoned -->

<!-- TODO.zhe: we'd better give this a license -->


## Technical Support

Feel free to ask for help during development in:
- Phala forum: https://forum.phala.network/t/topic/2379
- Telegram: https://t.me/phaladeveloper
