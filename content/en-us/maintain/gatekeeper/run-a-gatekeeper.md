---
title: "Run a Gatekeeper"
weight: 2001
draft: true
menu:
  maintain:
    parent: "maintain-gatekeeper"
---

## Setup Environment

- **Hardware**

  - **CPU**: 6th generation or newer Intel Core/Pentium/Celeron/Atom series.
  - **Memory**: 2GB - 8GB. 2GB is indeed the minimum memory you should operate your Gatekeeper with. For better performance, you can bump it up to 4GB or 8GB, but memory more than that is unnecessary. In order to compile the binary yourself, you will need around 8GB memory.
  - **Motherboard**: SGX-supported motherboard, and newer motherboards can support more SGX features. **We strongly recommend you to consult our Worker Community team about the SGX module before purchasing a board to mine PHA.**
  - **Storage** - A NVMe solid state drive, and should be reasonably sized to deal with blockchain growth. A SSD of 80GB - 160GB will be enough for the first six months of Phala Network, but this requirement needs to be re-evaluated every six months.
    For more detail, you may refer to the [worker node requirement](/en-us/mine/khala-mining/hardware-requirements/).

- **Software**

  - Ubuntu 18.04/20.04
  - Install [Docker-CE](/en-us/mine/solo/1-1-installing-phala-mining-tools/)
  - Install [SGX drivers](/en-us/mine/solo/1-1-installing-phala-mining-tools/)
  - Bandwidth：the stabler, the better

The specs posted above are by no means the minimum specs that you could use when running a
**Gatekeeper**.

<br>

## Synchronize Chain Data

1.  Download the [GK setup package](https://drive.google.com/file/d/1meYBcEwZViezeY0ksC34K0qAe6AiFlsv/view?usp=sharing).
2.  Open your Terminal and run the commands below:

    ```bash
    sudo cp ./poc3_validator.service /etc/systemd/system
    sudo systemctl enable poc3_validator.service
    sudo systemctl start poc3_validator.service
    ```

3.  Type in `vim validator.sh` , press `a`, and replace `YOUR NAME` with a cool node name you like. 🤟

4.  Press `ESC`, and press `Shift` + `;` , type in `wq` , and press `Enter` to save and return.

5.  Go to [https://telemetry.polkadot.io/#list/Phala PoC-3](https://telemetry.polkadot.io/#list/Phala%20PoC-3), find your node name, and wait for its block synchronization until it's the same with others. The synchronization may take 1-2 hours and the exact duration depends on your bandwidth.

### \*To Compile Your Gatekeeper Node

Download the latest Phala Network binary from the Github [release page](https://github.com/Phala-Network/phala-blockchain/releases).

You can also build the `phala-node` binary from the
[Phala-Network/phala-blockchain](https://github.com/Phala-Network/phala-blockchain) repository on GitHub using the source
code available in the **master** branch. You will need to prepare the Rust build environment described in the [Run a Full Node]({{< relref "maintain/poc2/run-a-full-node" >}}) tutorial.

> Note: If you prefer to use SSH rather than HTTPS, you can replace the first line of the below with
> `git clone git@github.com/Phala-Network/phala-blockchain.git`.

```sh
  git clone https://github.com/Phala-Network/phala-blockchain
  cd phala-blockchain
  ./scripts/init.sh
  git submodule update --init
  cargo build --release
```

This step will take a while (generally 10 - 40 minutes, depending on your hardware).

> **Note**: If you run into compile errors, you may have to switch to a less recent nightly Rust compiler. This can be
> done by running:
>
> ```sh
> rustup install nightly-2020-05-15
> rustup override set nightly-2020-05-15
> rustup target add wasm32-unknown-unknown --toolchain nightly-2020-05-15
> ```

If you are interested in generating keys locally, you can also install `subkey` from the same
directory. You may then take the generated `subkey` executable and transfer it to an air-gapped
machine for extra security.

```sh
cargo install --force --git https://github.com/paritytech/substrate subkey
```

> **Note**: By default, Gatekeeper nodes are in archive mode. If you've already synced the chain not
> in archive mode, you must first remove the database with `phala-node purge-chain` and then ensure
> that you run Phala Network with the `--pruning=archive` option.
>
> You may run a Gatekeeper node in non-archive mode by adding the following flags:
> `-unsafe-pruning --pruning OF BLOCKS>`, but note that an archive node and non-archive node's
> databases are not compatible with each other, and to switch you will need to purge the chain data.

You can begin syncing your node by running the following command:

```sh
./phala-node --pruning=archive
```

if you do not want to start in Gatekeeper mode right away.

The `--pruning=archive` flag is implied by the `--validator` and `--sentry` flags, so it is only
required explicitly if you start your node without one of these two options. If you do not set your
pruning to archive node, even when not running in Gatekeeper and sentry mode, you will need to
re-sync your database when you switch.

> **Note**: Gatekeepers should sync using the RocksDb backend. This is implicit by default, but can
> be explicit by passing the `--database RocksDb` flag. In the future, it is recommended to switch
> to using the faster and more efficient ParityDb option. Switching between database backends will
> require a resync.
>
> If you want to test out ParityDB you can add the flag `--database paritydb`.

Depending on the size of the chain when you do this, this step may take a few minutes
to a few hours.

If you are interested in determining how much longer you have to go, your server logs (printed to
STDOUT from the `phala-node` process) will tell you the latest block your node has processed and
verified. You can then compare that to the current highest block via
[Telemetry](https://telemetry.polkadot.io/#list/Phala%20PoC-2) or the
[Phala Web App](https://app.phala.network/#/explorer).

> **Note**: If you do not already have PHA, this is as far as you will be able to go until the end
> of the soft launch period. You can still run a node, but you will need to have a minimal amount of
> PHA to continue, as balance transfers are disabled during the soft launch. Please keep in mind
> that Gatekeepers will be re-elected when the NPoS phase starts.

<br>

## Bond PHA

> The steps below have to be processed on the device you have set up.

1.  [Create 2 accounts](https://www.notion.so/Create-Accounts-710e6dccac6f45d2953f5ea84206a58e) and be ensured that you have saved **the mnemonics of your controller** account correctly.
2.  [Claim test tokens](https://www.notion.so/Claim-Test-Tokens-9f53f6b805634f84bd44f202ef53b11c) and be ensured that there are over `100 tPHA` in the stash account and the controller account.
3.  Go to `Network` → `Staking` → `Account Actions` → `+Stash`
4.  Type in an amount of tPHA that you would like to bond.
5.  Click `Bond` and Sign.

> - **Stash account** - Select your Stash account. In this example, we will bond 100 PHA - make sure that your Stash account contains _at least_ this much. You can, of course, stake more than this.
> - **Controller account** - Select the Controller account created earlier. This account will also need a small amount of PHA in order to start and stop validating.
> - **Value bonded** - How much PHA from the Stash account you want to bond/stake. Note that you do not need to bond all of the PHA in that account, and you can always bond _more_ PHA later. However, _withdrawing_ any bonded amount requires the duration of the unbonding period. In Phala Network, the unbonding period is 7 days.
> - **Payment destination** - The account to which the rewards from validating are sent. More info [here](https://wiki.polkadot.network/en/latest/polkadot/learn/staking/#reward-distribution).

After a few seconds, you should see an "ExtrinsicSuccess" message. You should now see a list with all your accounts (you may need to refresh the web page). The bonded amount on the right corresponds to the funds bonded by the Stash account.

![](/images/docs/gatekeeper/1.png)
![](/images/docs/gatekeeper/2.png)
![](/images/docs/gatekeeper/3.png)

<br>

## Set Session Keys

> **Note**: The session keys are consensus critical, so if you are not sure if your node has the
> current session keys that you made the `setKeys` transaction then you can use one of the two available RPC methods to query your node: [hasKey](https://polkadot.js.org/api/substrate/rpc.html#haskey-publickey-bytes-keytype-text-bool) to check for a specific key or [hasSessionKeys](https://polkadot.js.org/api/substrate/rpc.html#hassessionkeys-sessionkeys-bytes-bool) to check the full session key public key string.

### Generating the Session Keys

You need to tell the chain your Session keys by signing and submitting an extrinsic. This is what associates your Gatekeeper node with your Controller account in Phala Network.

#### Option 1: PolkadotJS-APPS

1. Click the Phala logo → `DEVELOPMENT`, and type in `ws://127.0.0.1:9944` , and click `Switch`.
2. Go to `Developers` → `RPC Calls`, choose `author` → `rotateKeys()`, and click `Submit`. The number string on the page is exactly your session key. Copy your session key.
3. Go back to `Network` → `Staking` → `Account Actions`, click `Set Sessionkey` right next to your bonded accounts. Paste the session key and save.

![](/images/docs/gatekeeper/4.png)
![](/images/docs/gatekeeper/5.png)

#### Option 2: CLI

If you are on a remote server, it is easier to run this command on the same machine (while the node is running with the default HTTP RPC port configured):

```sh
curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "author_rotateKeys", "params":[]}' http://localhost:9933
```

The output will have a hex-encoded "result" field. The result is the concatenation of the four
public keys. Save this result for a later step.
You can restart your node at this point, omitting the `--unsafe-rpc-expose` flag as it is no longer needed.

### Set Your Sessions Keys

1. Go to `Network` → `Staking` → `Account Actions`, click `Set Sessionkey` right next to your bonded accounts. Paste the number string and save.
2. Now we go to `Developers` → `Extrinsics`, choose your stash account at the first line, choose `phalaModule` → `setStash(controller)` at the second line, choose your controller account at the third line. Click `Submit Transaction`.

![](/images/docs/gatekeeper/6.png)
![](/images/docs/gatekeeper/7.png)

<br>

## pRuntime Setup

1.  Type in `sudo docker pull phalanetwork/phala-poc3-pruntime` to pull Phala pRuntime mirror files. It may take 10-30 mins according to the bandwidth of your network.
2.  Choose and type the commands below based on your driver.
    **DCAP driver:**
    `bash sudo docker run -d -ti --rm --name phala-pruntime -p 8000:8000 -v $HOME/phala-pruntime-data:/root/data --device /dev/sgx/enclave --device /dev/sgx/provision phalanetwork/phala-poc3-pruntime `

        **SGX driver:**
        ```bash
        sudo docker run -d -ti --rm --name phala-pruntime -p 8000:8000 -v $HOME/phala-pruntime-data:/root/data --device /dev/isgx phalanetwork/phala-poc3-pruntime
        ```

    > How to check the driver type of your computer?
    >
    > - Run `ls /dev/isgx` and it returns feedback: you are using **SGX driver**;
    > - Run `ls /dev/sgx` and it returns feedback: you are using **DCAP driver**
    >
    > If both of the commands work, use the commands of the DCAP driver in the following steps.
    > If none of them work, please refer to the [Installing Phala Mining Tools](/en-us/mine/solo/1-1-installing-phala-mining-tools/) in Phala Guide.

<br>

## pHost Setup

1.  Type in `vim runphost.sh` in your Terminal.
2.  Press `a` until there's an `INSERT` tag at the lower-left corner. Replace the `Key Key Key ... Key` with **your controller mnemonics**. Press `ESC`, then press `Shift` + `;` , type in `wq` , and press `Enter` to save and return.
3.  Type in `./runphost.sh` . Wait for a moment until it reads `OK(())` .

> If it returns errors as below:
> `...FailedToCallRegisterWorker: Err(Rpc(Request(Error { code: ServerError(1010), message: "Invalid Transaction", data: Some(String("Inability to pay some fees (e.g. account balance too low)")) }))) bridge() exited with result: Err(FailedToCallRegisterWorker)`
> Please kindly check your mnemonics written in `vim runphost.sh` or your operations in step 2 & step 3.

![](/images/docs/gatekeeper/8.png)
![](/images/docs/gatekeeper/9.png)
![](/images/docs/gatekeeper/10.png)

<br>

## Validate Your Gatekeeper

1.  Go to `Network` → `Staking` → `Account Actions`
2.  Click the `Validate` button right next to your bonded accounts.
3.  Set the commission rate and sign.
4.  Your controller node will be on the [waiting list](https://poc4.phala.network/#/staking/waiting) in the next [Epoch](https://wiki.polkadot.network/docs/en/glossary#epoch).

![](/images/docs/gatekeeper/11.png)
![](/images/docs/gatekeeper/12.png)
![](/images/docs/gatekeeper/13.png)

> **Note**: This step will fail if you haven't successfully registered an SGX-enabled worker on your controller account. Please double check the steps before to make sure your hardware is correctly registered.

If you go to the "Staking" tab, you will see a list of active Gatekeepers currently running on the
network. At the top of the page, it shows the number of Gatekeeper slots that are available as well as the number of nodes that have signaled their intention to be a Gatekeeper. You can go to the "Waiting" tab to double check to see whether your node is listed there.

![staking queue](https://wiki.polkadot.network/docs/assets/guides/how-to-validate/polkadot-dashboard-staking.jpg)

The Gatekeeper set is refreshed every era. In the next era, if there is a slot available and your
node is selected to join the Gatekeeper set, your node will become an active Gatekeeper. Until then, it will remain in the _waiting_ queue. If your Gatekeeper is not selected to become part of the Gatekeeper set, it will remain in the _waiting_ queue until it is. There is no need to re-start if you are not selected for the Gatekeeper set in a particular era. However, it may be necessary to increase the number of PHA staked or seek out nominators for your Gatekeeper in order to join the Gatekeeper set.

<br>

### Worker Community

[![](https://img.shields.io/discord/697726436211163147?label=Phala%20Discord)](https://discord.gg/FUtZzYH) [![](https://img.shields.io/badge/Join-Telegram-blue)](https://t.me/joinchat/PDXFHFI9RXcOKMaumhTTvw)
