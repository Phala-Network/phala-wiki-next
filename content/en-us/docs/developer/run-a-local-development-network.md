---
title: "1.1 Run a Local Development Network"
weight: 11011
menu:
  docs:
    parent: "developer"
---

> Basic understanding of Linux shell and compiling is necessary to follow this tutorial.

## Overview

In this tutorial, we're going to set up a "Hello World" development environment. We are going to deploy a full stack of the core blockchain and connect the Web UI to the blockchain. By the end of the tutorial, you will be able to:

- Send confidential transactions
- Get a ready-to-hack version of Phala Network for building your own confidential Dapps

A full Phala Network stack has three components plus a Web UI. The core components are at [Phala-Network/phala-blockchain](https://github.com/Phala-Network/phala-blockchain):

- `phala-node`: The Substrate blockchain node
- `pRuntime`: The TEE runtime. Contracts runs in pRuntime
- `phost`: The Substrate-TEE bridge relayer. Connects the blockchain and pRuntime

The Web UI is at [Phala-Network/apps-ng](https://github.com/Phala-Network/apps-ng). The Web UI needs to connect to both the blockchain and the pRuntime in order to send transaction and queries.

## Environment

The development environment of Phala Network requires Linux, because it relies on [Linux Intel SGX SDK](https://01.org/intel-software-guard-extensions/downloads). Virtual machines should generally work. Phala Network doesn't work on Windows or macOS natively (sorry, Mac lovers), however we haven't tested WLS yet. Please let us know if you are the first to run it on WLS successfully!

In this tutorial we assume the operating system is _Ubuntu 18.04_. Though not tested yet, it should work with Ubuntu 20.04 out-of-box. Other Linux distributions should also work, but the instructions or command may vary.

It's required to have at least 4 cores and 8GB ram to build the project including the core blockchain and the Web UI. Less than 4GB ram may fail to build the Web UI.

Follow the commands below to prepare the environment. Some can be skipped if already installed.

- Install the system level dependencies

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

You can test the installation by running the following commands. The output should match the sample outputs, or with a slightly higher version.

```bash
rustup --version
# rustup 1.22.1 (b01adbbc3 2020-07-08)

cargo --version
# cargo 1.46.0 (149022b1d 2020-07-17)

echo $SGX_SDK
# /opt/intel/sgxsdk

# LLVM-9 or higher versions are fine
llvm-ar-10 --version
# LLVM (http://llvm.org/):
#   LLVM version 10.0.0

node --version
# v12.16.3

yarn --version
# 2.1.1
```

Finally let's clone the code and run the initialization script to update the Rust toolchain. Please note that the entire tutorial is on the **`helloworld` branch** for both the blockchain and the Web UI repo.

```bash
# Clone the core blockchain repo
git clone --branch helloworld https://github.com/Phala-Network/phala-blockchain.git
# Clone the Web UI repo
git clone --branch helloworld https://github.com/Phala-Network/apps-ng.git

# Run the init script to update Rust toolchain and git submodule
cd phala-blockchain/
git submodule update --init
./scripts/init.sh
cd ..

# Update the git submodule
cd apps-ng/
git submodule update --init
cd ..
```

## Build the core blockchain

Now we already have the both repos `phala-blockchain` and `apps-ng` in the working directory. Let's start to build the the core blockchain first. The blockchain on the **`helloworld` branch** is based on an old version of Substrate, therefore we'll use an old version of Rust to build it.

```bash
# Build the core blockchain
rustup install nightly-2020-10-01-x86_64-unknown-linux-gnu
rustup target add wasm32-unknown-unknown --toolchain nightly-2020-10-01
cd phala-blockchain/
cargo +nightly-2020-10-01 build --release

# Build pRuntime (TEE Enclave)
cd ./pruntime/
SGX_MODE=SW make
```

> **Notes on Build the core blockchain**
>
> You would usually use the latest version of Substrate and the Rust compiler to build the core blockchain. The build would therefore be simplified to:
>
> ```bash
> # Build the core blockchain
> cd phala-blockchain/
> cargo build --release
> ```

The compilation takes from 20 mins to 60 mins depending on your internet connection and CPU performance. After building, you will get the three binary files:

- `./target/release/phala-node`: The Substrate node
- `./target/release/phost`: The Substrate-to-TEE bridge relayer
- `./pruntime/bin/app`: The TEE worker

> **Notes on `SGX_MODE`**
>
> The SGX SDK supports software simulation mode and hardware mode. `SGX_MODE=SW` enables the simulation mode. The software mode is for easy development, where the hardware enclave is not required. You can even run it on a virtual machine or a computer with an AMD cpu. However, only the hardware mode can guarantee the security and the confidentiality of the trusted execution. To enable the hardware mode, you have to install [Intel SGX DCAP Driver](https://download.01.org/intel-sgx/sgx-dcap/1.8/linux/distro/ubuntu18.04-server/) and the platform software shipped with the driver, and pass `SGX_MODE=HW` to the toolchain.

The three core blockchain components work together to bring the full functionalities. Among them, `phala-node` and `pruntime` should be launched first, and `phost` follows:

```bash
# In terminal window 1: phala-node
./target/release/phala-node --dev

# In terminal window 2: pruntime
cd pruntime/bin
./app

# In terminal window 3: phost
./target/release/phost --dev
```

![](/images/docs/core-terminal.gif)

(Core components running and producing logs)

Once they are launched successfully, they should output logs as shown in the GIF above. Notice that we pass the `--dev` flag to `phala-node` and `phost` to indicate we are in the development network.

The three core blockchain components are connected via TCP (WebSocket and HTTP). Please ensure your system have the TCP ports not occupied with other programs. By default they use the following ports:

- `phala-node`
  - 9944: Substrate WebSocket RPC port
  - 30333: Substrate P2P network port
- `pruntime`
  - 8000: HTTP Restful RPC port

`phost` doesn't listen to any ports but connect to `phala-node`'s WebSocket port and `pruntime`'s HTTP RPC port.

You can safely shutdown the three program by <kbd>Ctrl</kbd> + <kbd>C</kbd>. `phala-node` saves the blockchain database on your disk. So if the blockchain gets messed up, you may want to reset it by:

```bash
./target/release/phala-node purge-chain --dev
```

## Build the Web UI

The Web UI frontend is developed with `node.js`, `yarn` and `react`. It's easy to build and launch the frontend.

```bash
cd apps-ng
yarn
yarn dev
```

It may take a few minutes to download the dependencies and build the frontend. By default the page is served at <http://localhost:3000>. So make sure the port 3000 is available. Then it should produce some logs like below:

```log
ready - started server on http://localhost:3000
> Using "webpackDevMiddleware" config function defined in default.
> Using external babel configuration
event - compiled successfully
event - build page: /[...slug]
event - build page: /
event - compiled successfully
```

![](/images/docs/apps-ng-landing.png)
(Web UI landing page)

The Web UI connects to both `phala-node` and `pruntime` by their default RPC endpoints. If everything is configured correctly, you will see the wallet unlock screen in the landing page as shown above. You should be able to select the well-known development accounts (Alice, Bob, etc) in the drop box.

> **Notes for Remote Access**
>
> In a case where you run your blockchain and WEB UI on your REMOTE_SERVER and try to access them elsewhere, you can forward the ports with `ssh` command. For example,
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
> and you can visit the Web UI at <http://localhost:3000>.

## Send some secret tokens

In the last two sections, we have built and launched `phala-node`, `pruntime`, and `phost` in development mode, and connect the Web UI to the development network. Now we are ready to try the secret wallet feature in Phala Network!

Let's select Alice and unlock the wallet. Alice is a built-in test account with 10,000 PHA on the blockchain. This PHA token is the native token. It's transparent on-chain like a typical Substrate blockchain, managed by Balances pallet.

![](/images/docs/apps-ng-init-wallet.png)
(Secret wallet dapp)

However, the "secret assets" wallet below is very different. Secret assets are stored in confidential contracts inside TEE enclaves. Like what the name says, the secret assets are private and invisible on the blockchain.

Click "Convert to Secret PHA" button to transfer **PHA** to **Secret PHA**. You will see your PHA balance reduced first, and after around ten seconds, the Secret PHA balance will increase by the same amount, except some transaction fee.

> What just happend?
>
> You created a Substrate transaction to send some funds to the Phala pallet. The funds are stored in the pallet, and it triggered a **confidential transaction** to issue the same amount of the token in the secret wallet in TEE enclaves.
>
> It takes ~6s to include a Substrate transaction in the blockchain, and then another 6s to finalize the block. Once the transaction is finalized, it triggers a "TransferToTee" event, relayed to `pruntime` via the relayer, and the confidential contract increases the balance. Finally the Web UI queries the confidential contract to get the updated balance.

There are plenty of things you can play with the secret wallet:

- convert the secret assets back to on-chain assets;
- transfer secret assets just like ordinary assets on every Substrate blockchain;
- and even issue or destroy your own secret tokens

All the above functions are made by confidential transaction. Nobody can see the content of the transaction because the body is encrypted. By clicking "Polkadot UI" button in the navigation bar, it will bring you to the polkadot.js apps you are familiar with. After sending an encrypted transaction by clicking the "Secret Transfer" button, you can find the encrypted transaction wrapped by `phalaModel.pushCommand` extrinsic from the block explorer as shown below.

<img src="/images/docs/polkadotjs-pushCommand.png" style="max-height: 200px;">

(An encrypted confidential transaction on a blockchain explorer)

## Conclusion

Congratulations! Finally, you have followed the tutorial to:

- Prepare a ready-to-hack development environment
- Download, build, and started a full stack development mode Phala Network
- Connect to the network via the Web UI and try the secret wallet dapp

Now you are familiar with building and running a development network. Hold tight! In the next chapter, we are going to build the first confidential contract together!

Join our [Discord server](https://discord.gg/zzhfUjU) and feel free to ask for help!
