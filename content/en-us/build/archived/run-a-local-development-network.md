---
title: "Run a Local Development Network"
weight: 9001
menu:
  build:
    parent: "phat-archived"
---

> Basic understanding of Linux shell and compilation is necessary to follow this tutorial. <a href="https://academy.hackthebox.com/course/preview/linux-fundamentals" target="_blank">Linux Fundamentals</a> may help.

## Overview

In this tutorial, we're going to set up a development environment. We are going to deploy a full stack of the core blockchain and connect the Web UI to the blockchain. By the end of the tutorial, you will be able to:

- Send confidential Commands and Queries
- Get a ready-to-hack version of Phala Network for building your confidential DApps

A full Phala Network stack has three components, with an optional Javascript SDK. The core components are available at [Phala-Network/phala-blockchain](https://github.com/Phala-Network/phala-blockchain):

- `phala-node`: The Substrate blockchain node
- `pRuntime`: The TEE runtime. Contracts run in `pRuntime`
- `pherry`: The Substrate-TEE bridge relayer. Connects the blockchain and `pRuntime`

<img src="/images/docs/developer/simple_architecture.png" alt="drawing" class="center"/>

(Phala architecture overview)

The Javascript SDK is at [Phala-Network/js-sdk](https://github.com/Phala-Network/js-sdk). The Web UI based on our SDK needs to connect to both the blockchain and the `pRuntime` to send Commands and Queries.

## Environment

The development environment of Phala Network requires Linux because it relies on [Linux Intel SGX SDK](https://01.org/intel-software-guard-extensions/downloads). Virtual machines should generally work. Phala Network does work on Windows with some configuration changes, but does not work on macOS natively (sorry, Mac lovers).

In this tutorial, we assume the operating system is *Ubuntu 20.04*. Though not tested yet, it should work with Ubuntu 18.04 out-of-box. Other Linux distributions should also work, but the instructions or commands may vary.
It's required to have at least 4 cores and 8GB RAM to build the project including the core blockchain and the Web UI. Less than 4GB RAM may fail to build the Web UI.

Follow the commands below to prepare the environment. Some can be skipped if already installed.

[//]: # (May need to convert to shortcode to reduce code & reusability in future.)

<ul class="nav nav-tabs" id="myTab" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Ubuntu</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Fedora</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="messages-tab" data-bs-toggle="tab" data-bs-target="#messages" type="button" role="tab" aria-controls="messages" aria-selected="false">Windows WSL</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="settings-tab" data-bs-toggle="tab" data-bs-target="#settings" type="button" role="tab" aria-controls="settings" aria-selected="false">MacOS</button>
  </li>
</ul>

<div class="tab-content">
  <div class="tab-pane active" id="home" role="tabpanel" aria-labelledby="home-tab">
  <br>

### Ubuntu

**Install dependencies via script for Ubuntu**
- Run the script to install and check required dependencies for Phala

Download the script (successfully tested on Ubuntu 20.04):
```bash
wget https://raw.githubusercontent.com/hauni97/phala_quick_run/main/phala_quick_install.sh
```
Make it executable:
```bash
chmod +x phala_quick_install.sh
```
Excute it to automate the next three manual steps to get the environment ready:
```bash
sudo ./phala_quick_install.sh
```

![](/images/docs/developer/auto-install.gif)

<br>

<details><summary> Expand for details on manual system dependency installation for Ubuntu</summary> <p>

**Install the system level dependencies manually for Ubuntu**

```bash
sudo apt update
sudo apt install -y build-essential pkg-config ca-certificates git autoconf libtool libssl-dev libclang-10-dev clang-10
```

Ensure `clang` exists in your $PATH by executing

```bash
which clang
# /usr/bin/clang

# by default, the clang executable is installed as "clang-10"
# if you got `clang not found`, you need to link the clang-10 to clang
sudo ln -sf /usr/bin/clang-10 /usr/bin/clang
```

> Notes on LLVM: We require at least LLVM-9, but higher versions are also supported. An older version like LLVM 6.0 breaks the core blockchain compilation.

Install Rust. Please choose the default toolchain

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

Install Intel SGX SDK

```bash
wget https://download.01.org/intel-sgx/sgx-linux/2.15/distro/ubuntu20.04-server/sgx_linux_x64_sdk_2.15.100.3.bin
chmod +x sgx_linux_x64_sdk_2.15.100.3.bin
echo -e 'no\n/opt/intel' | sudo ./sgx_linux_x64_sdk_2.15.100.3.bin
source /opt/intel/sgxsdk/environment
```

> You can add `source /opt/sgxsdk/environment` to your `~/.bashrc` (or `~/.zshrc`, depends on which shell you're using).

Install Node.js (>= v12) & yarn

```bash
curl -sL https://deb.nodesource.com/setup_current.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g yarn
```

</p>
</details>

  </div>
  <div class="tab-pane" id="profile" role="tabpanel" aria-labelledby="profile-tab">
  <br>

### Fedora

Install the system level dependencies for Fedora

```bash
sudo dnf update
sudo dnf install make automake gcc gcc-c++ kernel-devel ocaml autoconf automake libtool wget python openssl-devel git cmake perl pkg-config curl
```

Ensure `clang` exists in your $PATH by executing

```bash
which clang
# /usr/bin/clang

# by default, the clang executable is installed as "clang-10"
# if you got `clang not found`, you need to link the clang-10 to clang
sudo ln -sf /usr/bin/clang-10 /usr/bin/clang
```

> Notes on LLVM: We require at least LLVM-9, but higher versions are also supported. An older version like LLVM 6.0 breaks the core blockchain compilation.

Install Rust. Please choose the default toolchain

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

Install Intel SGX SDK

```bash
wget https://download.01.org/intel-sgx/sgx-linux/2.14/distro/fedora31-server/sgx_linux_x64_sdk_2.14.100.2.bin
chmod +x sgx_linux_x64_sdk_2.14.100.2.bin
echo -e 'no\n/opt/intel' | sudo ./sgx_linux_x64_sdk_2.14.100.2.bin
source /opt/intel/sgxsdk/environment
```

> You can add `source /opt/sgxsdk/environment` to your `~/.bashrc` (or `~/.zshrc`, depends on which shell you're using).

Install Node.js (>= v12) & yarn

```bash
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo dnf install -y nodejs
sudo npm install -g yarn
```

  </div>
  <div class="tab-pane" id="messages" role="tabpanel" aria-labelledby="messages-tab">
  <br>

### Windows WSL

> Instructions for (but not limited to) a relatively clean Windows11/WSL2 environment (Ubuntu 20.04LTS, and git correctly installed) are preceded by the mention "For WSL2"
>> [Install WSL2](https://docs.microsoft.com/en-us/windows/wsl/install) (Windows 10 version 2004 and higher for Build 19041 and higher or Windows 11)
>>in PowerShell or Windows Command Prompt

```bash
wsl --install
```

Ubuntu is the OS installed by default. Restart your machine, and in Powershell set WSL 2 as your default by doing the following

```bash
wsl --set-default-version 2
```

Install the system level dependencies

For WSL2:

```bash
curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash -
sudo apt install ca-certificates
```

```bash
sudo apt update
sudo apt install -y build-essential pkg-config ca-certificates git autoconf libtool libssl-dev libclang-10-dev clang-10
```

Ensure `clang` exists in your $PATH by executing

```bash
which clang
# /usr/bin/clang

# by default, the clang executable is installed as "clang-10"
# if you got `clang not found`, you need to link the clang-10 to clang
sudo ln -sf /usr/bin/clang-10 /usr/bin/clang
```

> Notes on LLVM: We require at least LLVM-9, but higher versions are also supported. An older version like LLVM 6.0 breaks the core blockchain compilation.

Install Rust. Please choose the default toolchain

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

Install Intel SGX SDK

```bash
wget https://download.01.org/intel-sgx/sgx-linux/2.15/distro/ubuntu20.04-server/sgx_linux_x64_sdk_2.15.100.3.bin
chmod +x sgx_linux_x64_sdk_2.15.100.3.bin
echo -e 'no\n/opt/intel' | sudo ./sgx_linux_x64_sdk_2.15.100.3.bin
source /opt/intel/sgxsdk/environment
```

> You can add `source /opt/sgxsdk/environment` to your `~/.bashrc` (or `~/.zshrc`, depends on which shell you're using).

Install Node.js (>= v12) & yarn

```bash
curl -sL https://deb.nodesource.com/setup_current.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g yarn
```
  </div>
  <div class="tab-pane" id="settings" role="tabpanel" aria-labelledby="settings-tab">
  <br>

### MacOS

> Currently, Mac is not supported. However, if you wish to run a simulated Phala environment for this tutorial, you may create a Virtual Machine (VM) with OS *Ubuntu 20.04*. Furthermore, MacOS is a UNIX-based Operating System; you may easily use SSH to connect to your VM without additional tools. A free resource is Amazon Web Services <a href="https://aws.amazon.com/getting-started/launch-a-virtual-machine-B-0/" target="_blank">AWS</a>.

  </div>
</div>

<script>
  var firstTabEl = document.querySelector('#myTab li:last-child a')
  var firstTab = new bootstrap.Tab(firstTabEl)

  firstTab.show()
</script>

\
You can test the installation by running the following commands. The output should match the sample outputs, or with a slightly higher version.

```bash
rustup --version
# rustup 1.24.3 (ce5817a94 2021-05-31)

cargo --version
# cargo 1.55.0 (32da73ab1 2021-08-23)

echo $SGX_SDK
# /opt/intel/sgxsdk

# LLVM-9 or higher versions are fine
clang --version
# clang version 10.0.0-4ubuntu1
# Target: x86_64-pc-linux-gnu
# Thread model: posix
# InstalledDir: /usr/bin

node --version
# v16.10.0

yarn --version
# 1.22.15
```

Finally, let's clone the code. Notice that the entire tutorial is on the **`encode-hackathon-2021 ` branch** for the blockchain.

```bash
# Clone the core blockchain repo
git clone --recursive --branch encode-hackathon-2021 https://github.com/Phala-Network/phala-blockchain.git
# Clone the JS SDK repo
git clone https://github.com/Phala-Network/js-sdk
```

## Build the Core Blockchain

Now we have both repos `phala-blockchain` and `js-sdk` in the working directory. Let's start to build the core blockchain first.

```bash
# Build the core blockchain
cargo build --release
```

Finally you can proceed with pruntime:

```bash
# Build pRuntime (TEE Enclave)
cd ./standalone/pruntime/
SGX_MODE=SW make
```

The compilation takes from 20 mins to 60 mins depending on your internet connection and CPU performance. After building, you will get the three binary files:

- `./target/release/phala-node`: The Substrate node
- `./target/release/pherry`: The Substrate-to-TEE bridge relayer
- `./standalone/pruntime/bin/app`: The TEE worker

> **Notes on `SGX_MODE`**
>
> The SGX SDK supports software simulation mode and hardware mode. `SGX_MODE=SW` enables the simulation mode. The software mode is for easy development, where the hardware enclave is not required. You can even run it on a virtual machine or a computer with an AMD CPU. However, only the hardware mode can guarantee the security and the confidentiality of the trusted execution. To enable the hardware mode, you have to install [Intel SGX DCAP Driver](https://download.01.org/intel-sgx/sgx-dcap/1.12/linux/distro/ubuntu20.04-server) and the platform software shipped with the driver, and pass `SGX_MODE=HW` to the toolchain.

The three core blockchain components work together to bring the full functionalities. Among them, `phala-node` and `pruntime` should be launched first, and `pherry` follows:

```bash
# In terminal window 1: phala-node
./target/release/phala-node --dev --tmp

# In terminal window 2: pruntime
cd standalone/pruntime/bin
./app -c 0
cd ../../..

# In terminal window 3: pherry
./target/release/pherry --dev --no-wait
```

Once they are launched successfully, they should output logs. Notice that we pass the `--dev` flag to `phala-node` and `pherry` to indicate we are in the development network. This is important since for now, smart contract functionalities are only enabled under development mode.
![](/images/docs/developer/core-terminal.gif)

The three core blockchain components are connected via TCP (WebSocket and HTTP). Please ensure your system have the TCP ports not occupied by other programs. By default they use the following ports:

- `phala-node`
  - 9944: Substrate WebSocket RPC port
  - 30333: Substrate P2P network port
- `pruntime`
  - 8000: HTTP Restful RPC port

`pherry` doesn't listen to any ports but connects to `phala-node`'s WebSocket port and `pruntime`'s HTTP RPC port. You can change the default ports of `phala-node` and `pherry` with command line arguments (check the latest argument list with `--help`). And for `pruntime`, just edit the `Rocket.toml` config file under `pruntime/bin` and restart it.

You can safely shut down the three programs by <kbd>Ctrl</kbd> + <kbd>C</kbd>. Since `--tmp` is specified for `phala-node`, no database will be left after you shut it down. So a fresh start every time you run it!


## Build the Web UI

The Web UI frontend is developed with `node.js` and managed by `yarn`. It provides the frontend you need to interact with our `GuessNumber` and `BtcPriceBot` demo contracts. Just give it a try!

```bash
cd js-sdk/packages/example
# you need to set the `NEXT_PUBLIC_BASE_URL` to the port of `pruntime`
# and `NEXT_PUBLIC_WS_ENDPOINT` to `phala-node` ws port
cp .env .env.local

yarn
yarn dev
```

It may take a few minutes to download the dependencies and build the frontend. By default, the page is served at <http://localhost:3000>. So make sure the port 3000 is available. Then it should produce some logs like below:

```log
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
info  - Loaded env from /home/user/phala-network/js-sdk/packages/example/.env.local
info  - Loaded env from /home/user/phala-network/js-sdk/packages/example/.env
info  - Using webpack 5. Reason: Enabled by default https://nextjs.org/docs/messages/webpack5
event - compiled successfully
```

> **Notes for Remote Access**
>
> In a case where you run your blockchain and WEB UI on your REMOTE_SERVER and try to access them elsewhere, you can forward the ports with `ssh` command. For example,
> ```bash
> ssh -N -f USER@REMOTE_SERVER -L 3000:localhost:3000 -L 9944:localhost:9944 -L 8000:localhost:8000
> ```
> This forwards all the necessary ports:
> - 3000: HTTP port of Web UI
> - 9944: Substrate WebSocket RPC port of `phala-node`
> - 8000: HTTP Restful RPC port of `pruntime`
>
> and you can visit the Web UI at <http://localhost:3000>.

The main page of Web UI looks like this:

![](/images/docs/developer/js-sdk-1.png)

To experience the demo contracts, you will need an account. For development, we recommend not to use your real Substrate account with funds. A good choice is for development to import `Alice` to your Polkadot.js extension since she is the pre-defined root account and is allowed to invoke privileged operations. **DO NOT** transfer real funds to your `Alice` account.

You can get the secret seed of `Alice` with the following command

```bash
# in phala-blockchain folder
./target/release/phala-node key inspect //Alice
# Secret Key URI `//Alice` is account:
#   Secret seed:       0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a
#   Public key (hex):  0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d
#   Public key (SS58): 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
#   Account ID:        0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d
#   SS58 Address:      5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
```

Then import the secret seed into your Polkadot.js extension

![](/images/docs/developer/js-sdk-2.png)

and paste the secret seed regardless of the mnemonic hint

![](/images/docs/developer/js-sdk-3.png)

Now you are good to go.


## Play the `GuessNumber`

### Authorization

Now let's play with a contract. Recall the knowledge about Commands and Queries in [previous chapter]({{< relref "docs/developer/_index.md" >}}). The first thing our contract propose is to sign a certificate. Such a temporary certificate is used to encrypt all the Queries. While every time you try to send a Command, the Polkadot.js extension will ask for your signature (since Commands can change the state, it is more critical than Queries).

![](/images/docs/developer/js-sdk-4.png)

Don't miss the prompt since there are not always pop-ups.

![](/images/docs/developer/js-sdk-5.png)

### Play with it

![](/images/docs/developer/js-sdk-6.png)

By default, the random number is 0. Click `Reset Number`, sign the Command, and start the game. If you log in as the root account or contract owner, there is a cheat button for you to peek at the secret. So no more spoiling, just play with it.

If you are curious about how this contract is implemented, the following chapter will walk you through it.


## Conclusion

Congratulations! Finally, you have followed the tutorial to:

- Prepare a ready-to-hack development environment
- Download, build and started a full-stack development-mode Phala Network
- Connect to the network via the Web UI and try the DApps

Now you are familiar with building and running a development network. Hold tight! In the next chapter, we are going to build the first confidential contract together!

Join our [Discord server](https://discord.gg/zzhfUjU) and feel free to ask for help!
