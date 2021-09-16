---
title: "1.2 Install Phala Tools"
---

## Prerequisites

Before you go further, please ensure that your have correct setup your hardware, BIOS and operating system according to the [previous section]({{< relref "docs/khala-mining/1-1-hardware-requirements">}}).

## Download Phala Scripts

The Phala tools are availbale at [https://github.com/Phala-Network/solo-mining-scripts/archive/refs/heads/main.zip](https://github.com/Phala-Network/solo-mining-scripts/archive/refs/heads/main.zip), it can be downloaded with `wget` by executing the following commands in the terminal:

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

## Activate SGX Software with sgx_enable
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
> This script will install the docker, sgx driver and pull all the Phala docker images.

Congratulation! You have successfully installed needed Phala tools.
