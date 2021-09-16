---
title: "1.2 下载并安装Phala脚本"
---

**请注意，在你进行以下操作之前请确保你已经阅读了本章节以前的全部内容。已经检查过你的硬件、BIOS设置（若找不到SGX选项可以先往后做进行测试）。并且已经安装好Ubuntu18.04或Ubuntu20.04。**

下载Phala工具包地址：[https://github.com/Phala-Network/solo-mining-scripts/archive/refs/heads/main.zip](https://github.com/Phala-Network/solo-mining-scripts/archive/refs/heads/main.zip)，或者可以用wget下载，命令如下：

```bash
cd ~
sudo apt-get install wget
sudo apt-get install unzip
wget https://github.com/Phala-Network/solo-mining-scripts/archive/refs/heads/main.zip
unzip main.zip
cd solo-mining-scripts-main
```

## 使用sgx_enable激活SGX功能

在phala脚本目录打开终端，输入以下指令后电脑会重启：

```bash
cd ~/solo-mining-scripts-main
sudo chmod +x sgx_enable
sudo ./sgx_enable
sudo reboot
```

## 安装Phala工具

在phala脚本目录打开终端，输入以下指令：

```bash
cd ~/solo-mining-scripts-main
sudo chmod +x install.sh
sudo ./install.sh cn
```
