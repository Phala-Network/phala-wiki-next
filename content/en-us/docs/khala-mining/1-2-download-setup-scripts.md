---
title: "1.2 Install Phala Tools"
weight: 6012
menu:
  docs:
    parent: "khala-mining"
---

## Prerequisites

Before you go further, please ensure that your have correct setup your hardware, BIOS and operating system according to the [previous section]({{< relref "docs/khala-mining/1-1-hardware-requirements">}}).

## Download the Phala Scripts

The Phala mining tools are availbale on our [Phala Mining Script](https://github.com/Phala-Network/solo-mining-scripts/) repository on GitHub, it can be downloaded with `wget` by executing the following commands in the terminal:

```bash
sudo apt update && sudo apt upgrade -y && sudo apt autoremove -y
sudo apt install wget unzip
cd ~
wget https://github.com/Phala-Network/solo-mining-scripts/archive/refs/heads/main.zip
unzip main.zip
```

{{< tip "warning" >}}
If you are running on testnet, please refer to: [Para2 testnet mining]({{< relref "docs/para-mining" >}})
{{< /tip >}}

## Activate the Intel® SGX Software 

> :information: You may have already enabled the Intel® SGX Extensions during your hardware setup in the [previous section](/en-us/docs/khala-mining/1-1-hardware-requirements/#5-enable-intel-sgx-extensions). Skip and proceed to :point_right:[Install Phala Tools](/en-us/docs/khala-mining/1-2-download-setup-scripts/#install-phala-tools) if talready activated.

Execute the following commands in the terminal, the computer should reboot after execution.

```shell
cd ~/solo-mining-scripts-main
sudo chmod +x sgx_enable
sudo ./sgx_enable
sudo reboot
```

## Install Phala Tools

Execute the following commands in your terminal:

```bash
cd ~/solo-mining-scripts-main
chmod +x install.sh
sudo ./install.sh en
```

> This will install the Phala CLI

\
:tada: Congratulations! You have successfully installed the required Phala tools.
