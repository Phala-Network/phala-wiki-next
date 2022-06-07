---
title: Gatekeeper
weight: 1003
draft: false
menu:
  maintain:
    parent: "maintain-gatekeeper"
---

Gatekeeper is a special role that manages the secrets in the network and runs the tokenomic model. Gatekeepers are supposed to be elected by the PHA token holders with NPoS, and should also run as a collator. However, as of now, Gatekeepers are designated by the council directly, not associated with collators, because collator binding and NPoS are still under development.

To set up a Gatekeeper, you should follow the steps below:

1. Prepare an account with some PHA token to pay for the transaction fee.
2. Prepare a server with proper Intel SGX support
2. Deploy a worker stack: full node, pherry, and pRuntime
3. Make a council proposal to add the worker to the Gatekeeper list
4. Finally, you Gatkeeper should be up and running. As the opereator, you should keep monitoring.

## Prepare the Gatekeeper operator account

To operate a Gatekeeper, an account with some PHA balance is required. The Gatekeeper program runs by pruntime in Secure Enclaves. It communicates with the blockchain in two directions. It reads the events from the blockchain, runs the algorithm, and periodically writes back to the blockchain by sending transactions. An account with some balances is used to pay the transaction fee.

You may already have an account. Or you can create the account on Polkadot.js Extension, or some other wallets. In either way, you will need to keep the mnemonic (sometimes called SURI), or the raw private key, because it will be used in the next step.

It's suggested to have at least 10 PHA in the account. The Gatekeepers may consume the transacion fee in different speed. It can burn up to 5-10 PHA per day, but can also have nearly zero transaction per day. Gatekeepers generate messages constantly, but only the first one who submits the message will be charged (other transactions are just de-duped). So theoritically each Gatekeeper has an even chance to pay for the transaction fee.

## Server requirements

1. 500G SSD for running the Khala full node in Archive mode

    The large space is majorly for the Kusama full node, which takes more than 300 GiB. If you can run the full node on another server close to the Gatekeeper server, the disk requirement can be safely ignored. In such case, the network latency and bandwidth matters. SSD is always recommended because there will be a lot of random access to the database when syncing a Gatekeeper.

2. Good internet connection

    A bandwidth of 50 Mbps or faster is recommended. Otherwise the initial block download will take a very long time. A public IP address is recommended because otherwise you may got too few peer connections, causing the full node got stuck for some period. A stable network is always required. Once Gatekeeper online detection is on, any detected offline event may cause significant slash. (So far it's still under the development.)

3. Intel SGX compatible hardware with a confidence level >= 3

    Gatekeeper runs its pRuntime inside the Secure Encalve (Intel SGX), which is the same requirement of mining on Khala Network. Please refer to the mining guide to learn more about Intel SGX compatability and the confidence score. Gatekeepers manage highly sensitive data. Therefore it requires the highest confidence level (1, 2, or 3).

    Although SGX is a feature in CPU, some configuration in BIOS is still needed. Please refer to the mining guide to tune the BIOS when necessary.

4. Linux OS

    So far only Linux is supported. We suggest to deploy the Gatekeeper stack on Ubuntu 21.04. While other versions of Ubuntu or other Linxu distribution could be supported, this document will assume you are running on Ubuntu.

    The Intel SGX driver is required. However, you don't need to install it manually on Ubuntu 21.04 because it's shipped with the native kernel SGX driver. The kernel driver doesn't support all the legacy SGX CPUs though. For legacy CPUs, you may need to run an older Linux kernel without the native driver, and install the iSGX driver instead.

5. [Docker](https://docs.docker.com/engine/install/ubuntu/#install-using-the-convenience-script)

{{< tip >}}
**SGX virtualization (vSGX)**

vSGX is supported. VMWare and KVM based vSGX are being tested successfully. However, the more instances to virtualize, the less EPC size each VM can get. Smaller EPC can cause a decrease of the performance. Please use with caution.
{{< /tip >}}

## Deploy the full stack

Please make sure you have meet all the above requirements, so that you can start to deploy the three components by Docker.

First, run the full node and wait it to sync. If you already have a full node, this step can be skipped.

```bash
docker run -dti --rm \
    --name khala-node \
    -e NODE_NAME=khala-node \
    -e NODE_ROLE=MINER \
    -p 9933:9933 -p 9944:9944 -p 9615:9615 -p 30333:30333 \
    -p 9934:9934 -p 9945:9945 -p 9616:9616 -p 30334:30334 \
    -v $HOME/data/khala-dev-node:/root/data phalanetwork/khala-node
```

The command line above will start the Khala node docker image managed by the Phala team. The node runs in Archive mode (specified by `NODE_ROLE=MINER`). Then two sets of the ports are exported, including the p2p ports (30333, 30334), Prometheus metrics (9615, 9616), ws rpc (9944, 9945), and http rpc ports (9933, 9944). For each pair of the ports, the former one is Khala's and the later one is Kusama's. The data directory `/root/data` is mapped to the disk. Feel free to change it to somewhere better.

The node may take a few days to be fully synced. Recovering from a backup can greatly reduce the time to sync, if you have one.

Second, run pRuntime:

```bash
docker run -dti --rm \
    --name phala-pruntime \
    -p 8000:8000 \
    -v $HOME/data/phala-pruntime:/root/data \
    -e EXTRA_OPTS="-c 0" \
    --device /dev/sgx \
    --device /dev/sgx_enclave \
    --device /dev/sgx_provision \
    --device /dev/sgx_vepc \
    phalanetwork/phala-pruntime
```

The command brings up a pRuntime instance with its RPC port 8000 exported. Please note that if you run with the iSGX driver (legacy driver), there's only one SGX device file `/etc/isgx`. Note that pruntime will store its credentials under `/root/data`, which is mapped to the locla disk. The credentials are encrypted with the CPU keys. It's important to backup the key in order to keep the identity of the worker (pRuntime instance). However, it's impossible to recover the credentials in another CPU (vCPU).

{{< tip >}}
In the above command line we assumed you are running with the kernel SGX driver. If you have to run with the manually installed driver on an older kernel, you may consider to switch to differnt device arguments:

- Standalone DCAP driver
    - `--device /dev/sgx/enclave`
    - `--device /dev/sgx/provision`
- Standalone iSGX driver
    - `--device /dev/isgx`
{{< /tip >}}

Finally, run pherry, the relayer to connect the node and pRuntime (specify your own mnenomic).

```bash
docker run -dti --rm \
    --name phala-pherry \
    -e PRUNTIME_ENDPOINT="http://phala-pruntime:8000" \
    -e PHALA_NODE_WS_ENDPOINT="ws://khala-node:9945" \
    -e MNEMONIC="<Insert-Your-Mnemonic>" \
    -e EXTRA_OPTS="-r --parachain --collator-ws-endpoint=ws://khala-node:9944" \
    --link khala-node --link phala-pruntime \
    phalanetwork/phala-pherry
```

The command starts pherry, linked with `khala-node` and `phala-pruntime` containers. It reads the blokchain from `khala-node:9944` and sync the data to `phala-pruntime:8000`. If you run the full node remotely, just change the host name `khala-node` to the node rpc endpoint. The mnenomic is specified by the environment variable.

pherry usually takes 1-2 days to sync the blockchain history. However, since pRuntime doesn't persist the state, if it exits, you will need to sync from scratch in the next time.

The account you specified will be used to send transactions on behalf of the Gatekeeper. Once it's fully synced, it will initiate a `PhalaRegistry.registerWorker()` extrinsic to the blockchain. A Gatekeeper is identified by its worker public key (worker pubkey). You can find it from `http://phala-pruntime:8000/get_info` RPC, and check the registration status from the blockchain at `PhalaRegistry.workers()`.

Summary:

1. Run the full node in Archive mode and keep it in sync
2. Run pRuntime with the SGX device set up correctly
3. Run pherry to connect the full node and pRuntime

## Propose to join the Gatekeeper whitelist

(WIP)

## Monitor the Gatekeeper

(WIP)
