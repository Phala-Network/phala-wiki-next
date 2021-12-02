---
title: "1.2 Run a Local Development Network"
weight: 11011
menu:
  docs:
    parent: "developer"
---

> Understanding of Linux shell is necessary to follow this tutorial. <a href="https://academy.hackthebox.com/course/preview/linux-fundamentals" target="_blank">Linux Fundamentals</a> may help.

## Overview

In this tutorial, we're going to set up a "Hello World" development environment. We are going to deploy a full stack of the core blockchain and connect the Web UI to the blockchain. By the end of the tutorial, you will be able to:

- Send confidential transactions
- Get a ready-to-hack version of Phala Network for building your own confidential Dapps

A full Phala Network stack has three components plus a Web UI. The core components are at [Phala-Network/phala-blockchain](https://github.com/Phala-Network/phala-blockchain):

- `phala-node`: The Substrate blockchain node
- `pRuntime`: The TEE runtime. Contracts runs in `pRuntime`
- `pherry`: The Substrate-TEE bridge relayer. Connects the blockchain and `pRuntime`

<img src="/images/docs/simple_architecture.png" alt="drawing" class="center"/>

(Phala architecture overview)


The Web UI is at [Phala-Network/apps-ng](https://github.com/Phala-Network/apps-ng). The Web UI needs to connect to both the blockchain and the pRuntime in order to send transaction and queries.

## Environment

The development environment of Phala Network requires Linux, because it relies on [Linux Intel SGX SDK](https://01.org/intel-software-guard-extensions/downloads). Virtual machines should generally work. Phala Network doesn't work on Windows or macOS natively (sorry, Mac lovers), however we haven't tested WLS yet. Please let us know if you are the first to run it on WLS successfully!

In this tutorial we assume the operating system is _Ubuntu 18.04_ or _Ubuntu 20.04_. Other Linux distributions should also work, but the instructions or command may vary.

It's required to have at least 4 cores and 8GB RAM to build the project including the core blockchain and the Web UI. Less than 4GB RAM may fail to build the Web UI.

Follow the commands below to prepare the environment. Some can be skipped if already installed.

### Linux

<details><summary>Expand to see installation instrcutions for Linux</summary>
<p>

#### Install Dependencies (Linux)

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

![](/images/docs/auto-install.gif)

(Walkthough of how a successfull environement setup looks like when script is run)

#### Manual Installation (Linux)

- Install the system level dependencies (manual steps)

  ```bash
  sudo apt update
  sudo apt install -y build-essential ocaml ocamlbuild automake autoconf libtool wget python libssl-dev git cmake perl pkg-config curl llvm-10 clang-10 libclang-10-dev
  ```

  > Notes on LLVM: We require at least LLVM-9, but higher versions are also supported. Older version like LLVM 6.0 breaks the core blockchain compilation.

- Install Rust. Please choose the default toolchain

  ```bash
  curl https://sh.rustup.rs -sSf | sh
  source ~/.cargo/env
  ```

- Install Intel SGX SDK

  ```bash
  wget https://download.01.org/intel-sgx/sgx-linux/2.12/distro/ubuntu18.04-server/sgx_linux_x64_sdk_2.12.100.3.bin
  chmod +x ./sgx_linux_x64_sdk_2.12.100.3.bin
  echo -e 'no\n/opt/intel' | sudo ./sgx_linux_x64_sdk_2.12.100.3.bin
  source /opt/intel/sgxsdk/environment
  ```

  > You can add `source /opt/sgxsdk/environment` to your `~/.bashrc` (or `~/.zshrc` depends on which shell you're using).

- Install Node.js (>= v12) & yarn 2

  ```bash
  curl -sL https://deb.nodesource.com/setup_current.x | sudo -E bash -
  sudo apt-get install -y nodejs
  sudo npm install -g yarn
  yarn set version berry
  ```

  </p>
</details>

### Windows

More content coming soon. (WSL to be tested).

### Mac

> Currently, Mac is not supported. However, if you wish to run a simulated Phala environment for this tutorial, you may create a Virtual Machine (VM). Furthermore, MacOS is a UNIX-based Operating System; you may easily use SSH to connect to your VM without additional tools. A free resource is Amazon Web Services <a href="https://aws.amazon.com/getting-started/launch-a-virtual-machine-B-0/" target="_blank">AWS</a>.

Specific instructions using a VM from MacOS to be added soon...

#### Test the Installation

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

Finally, let’s clone the code. Notice that the entire tutorial is on the `encode-hackathon-2021` *branch* for the blockchain.

```bash
# Clone the core blockchain repo
git clone --recursive --branch encode-hackathon-2021 https://github.com/Phala-Network/phala-blockchain.git
# Clone the JS SDK repo
git clone https://github.com/Phala-Network/js-sdk
```

## Build the core blockchain

Now we have both repos `phala-blockchain` and `js-sdk` in the working directory. Let’s start to build the core blockchain first.

```bash
# Build the core blockchain
cd phala-blockchain/
cargo build --release
```
To build `pRuntime` execute the following command:

```bash
# Build pRuntime (TEE Enclave)
cd ./standalone/pruntime/
SGX_MODE=SW make
```

> **Notes on building the core blockchain**
>
>The compilation takes from 20 mins to 60 mins depending on your internet connection and CPU performance. After building, you will get the three binary files:
>
>- `./target/release/phala-node`: The Substrate node
>- `./target/release/pherry`: The Substrate-to-TEE bridge relayer
>- `./standalone/pruntime/bin/app`: The TEE worker

> **Notes on `SGX_MODE`**
>
> The SGX SDK supports software simulation mode and hardware mode. `SGX_MODE=SW` enables the simulation mode. The software mode is for easy development, where the hardware enclave is not required. You can even run it on a virtual machine or a computer with an AMD cpu. However, only the hardware mode can guarantee the security and the confidentiality of the trusted execution. To enable the hardware mode, you have to install [Intel SGX DCAP Driver](https://download.01.org/intel-sgx/sgx-dcap/1.12/linux/distro/ubuntu20.04-server/) and the platform software shipped with the driver, and pass `SGX_MODE=HW` to the toolchain.

The three core blockchain components work together to bring the full functionalities. Among them, `phala-node` and `pruntime` should be launched first, and `pherry` follows:

```bash
# In terminal window 1: phala-node
./target/release/phala-node --dev

# In terminal window 2: pruntime
cd standalone/pruntime/bin
./app -c 0

# In terminal window 3: pherry
./target/release/pherry --dev --no-wait
```

![](/images/docs/core-terminal.gif)

(Core components running and producing logs. _Directory varies in newer versions of phala_)

Once they are launched successfully, they should output logs as shown in the GIF above. Notice that we pass the `--dev` flag to `phala-node` and `pherry` to indicate we are in the development network.

The three core blockchain components are connected via TCP (WebSocket and HTTP). Please ensure your system have the TCP ports not occupied with other programs. By default they use the following ports:

- `phala-node`
  - 9944: Substrate WebSocket RPC port
  - 30333: Substrate P2P network port
- `pruntime`
  - 8000: HTTP Restful RPC port

`pherry` doesn’t listen to any ports but connects to `phala-node`’s WebSocket port and `pruntime`’s HTTP RPC port. You can change the default ports of `phala-node` and `pherry` with command line arguments (check the latest argument list with the suffix `--help`). And for `pruntime`, just edit the `Rocket.toml` config file under `pruntime/bin` and restart it.

You can safely shutdown the three program by <kbd>Ctrl</kbd> + <kbd>C</kbd>. Since `--tmp` is specified for `phala-node`, no database will be left after you shut it down. So a fresh start every time you run it!

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

It may take a few minutes to download the dependencies and to build the frontend. By default the page is served at <http://localhost:3000>. So make sure the port 3000 is available. Then should produce the following logs:

```log
rready - started server on 0.0.0.0:3000, url: http://localhost:3000
info  - Loaded env from /home/user/phala-network/js-sdk/packages/example/.env.local
info  - Loaded env from /home/user/phala-network/js-sdk/packages/example/.env
info  - Using webpack 5. Reason: Enabled by default https://nextjs.org/docs/messages/webpack5
event - compiled successfully
```

The Web UI connects to both `phala-node` and `pruntime` by their default RPC endpoints.

> **Notes for Remote Access**
>
> In a case where you run your blockchain and WEB UI on your REMOTE_SERVER and try to access them elsewhere, you can forward the ports with `ssh` in the CLI. For example:
>
> ```bash
> ssh -N -f USER@REMOTE_SERVER -L 3000:localhost:3000 -L 9944:localhost:9944 -L 8000:localhost:8000
> ```
>
> This forwards all the necessary ports:
>
> - 3000: HTTP port of Web UI
> - 9944: Substrate WebSocket RPC port of `phala-node`
> - 8000: HTTP Restful RPC port of `pruntime`
>
> Now, you may visit the Web UI at <http://localhost:3000>.

The main page of Web UI looks like this:

![](/images/docs/js-sdk-1.png)

To experience the demo contracts, you will need an account. For development, we recommend not to use your real Substrate account with funds. A good choice is for development to import `Alice` to your _Polkadot.js_ extension since she is the pre-defined root account and is allowed to invoke privileged operations. **DO NOT** transfer real funds to your `Alice` account.

You can get the secret seed of `Alice` with the following command:

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

![](/images/docs/js-sdk-2.png)

and paste the secret seed regardless of the mnemonic hint

![](/images/docs/js-sdk-3.png)

Now you are good to go.

### Play the `GuessNumber`

#Authorization
Now let’s play with a contract. Recall the knowledge about **Commands and Queries in previous chapter**. The first thing our contract propose is to sign a certificate. Such a temporary certificate is used to encrypt all the Queries. While every time you try to send a Command, the Polkadot.js extension will ask for your signature (since Commands can change the state, it is more critical than Queries).

![](/images/docs/js-sdk-4.png)

Don’t miss the prompt since there are not always pop-ups.

![](/images/docs/js-sdk-5.png)

### Play with it

![](/images/docs/js-sdk-6.png)

By default, the random number is 0. Click `Reset Number`, sign the Command, and start the game. If you log in as the root account or contract owner, there is a cheat button for you to peek at the secret. So no more spoiling, just play with it.

If you are curious about how this contract is implemented, the following chapter will walk you through it.

## Conclusion

Congratulations! Finally, you have followed the tutorial to:

- Prepare a ready-to-hack development environment.
- Download, build, and started a full stack development mode Phala Network.
- Connect to the network via the Web UI and try the `GuessNumber` game.

Now you are familiar with building and running a development network. Hold tight! In the next chapter, we are going to build the first confidential contract together!

Join our [Discord server](https://discord.gg/zzhfUjU) and feel free to ask for help!

