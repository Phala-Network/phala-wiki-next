---
title: "Installing Phala Mining Tools"
weight: 1002
menu:
  mine:
    parent: "mine-solo"
---

## Prerequisites

Before you go further, please ensure that your have correct setup your hardware, BIOS and operating system according to the [previous section]({{< relref "mine/khala-mining/hardware-requirements">}}).

## Download the Phala Scripts

The Phala mining tools are available on our [Phala Mining Script](https://github.com/Phala-Network/solo-mining-scripts/) repository on GitHub, it can be downloaded with `wget` by executing the following commands in the terminal:

```bash
sudo apt update && sudo apt upgrade -y && sudo apt autoremove -y
sudo apt install wget unzip
cd ~
wget https://github.com/Phala-Network/solo-mining-scripts/archive/refs/heads/main.zip
unzip main.zip
```

## Activate the Intel® SGX Software

> :information: You may have already enabled the Intel® SGX Extensions during your hardware setup in the [previous section](/en-us/mine/khala-mining/1-0-hardware-requirements/#5-enable-intel-sgx-extensions). Skip and proceed to :point_right:[Install Phala Tools](/en-us/mine/mine-solo/1-1-installing-phala-mining-tools/#install-phala-tools) if already activated.

Execute the following commands in the terminal, the computer should reboot after execution.

```bash
cd ~/solo-mining-scripts-main/tools
sudo ./sgx_enable
sudo reboot
```

## Install Phala Tools

Execute the following commands in your terminal:

```bash
cd ~/solo-mining-scripts-main
sudo ./phala.sh install
```

> This will install the Phala CLI

\
:tada: Congratulations! You have successfully installed the required Phala tools.
