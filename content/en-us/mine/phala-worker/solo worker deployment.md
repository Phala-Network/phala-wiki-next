---
title: "Solo worker deployment"
weight: 1010
menu:
  mine:
    parent: "phala-worker"
---

Currently, there is no one-click deployment script for workers on Phala Network. Computation providers need to run docker compose manually for solo worker deployment.

## Basic Requirements

### SGX Function

Running Phala worker requires SGX-capable CPU. Please choose a device that supports SGX and enable SGX in the BIOS.
For more information, please check: [choose your CPU](https://wiki.phala.network/en-us/mine/khala-mining/hardware-requirements/#check-your-cpu)

### Device Configuration

Solo workers on Phala need to run 3 components: **Node**, **pherry**, and **pRuntime**. The requirements for each component are as follows:

|Components|RAM Space|Harddisk Space|Remark|
|:----------:|:----------:|:----------:|:----------:|
|Node|4GB+|900GB+ NVME|harddisk requirement increasing, 2t will be best|
|pherry|2GB|0|-|
|pRuntime|2GB|500MB|increase slowly|
|**Totally**|8GB+|2TB|-|

> The number of cores of the worker needs to be **4 or more**, the stronger the CPU computing power of the worker, the better the rewards in reward calculation. For details, please refer to: [Gemini Tokenomics](https://wiki.phala.network/en-us/general/phala-network/tokenomics/)

### OS Requirements

We strongly recommend that you use Ubuntu 22.04.2 LTS, download link: https://ubuntu.com/download/server

> The desktop version of the OS is less stable than Server version, so we strongly recommend using the server version.

And please make sure that the kernel version is 5.13 or above.

> If you do not want to update the current Ubuntu system version, please be sure to check the kernel version. Because pRuntime will use the SGX driver built into the kernel.

After the OS is installed, we strongly recommend that you remotely connect and deploy the worker through SSH or other methods. This will help you with document input and maintenance.

## Deployment of Components

### Preparations

After installing the OS above, first install the necessary Docker program.
```
sudo apt update && sudo apt upgrade -y && sudo apt autoremove -y
sudo apt install docker-compose
```

Then create a folder locally, and create a docker-compose document within it.
```
mkdir phala-deployment
cd ./phala-deployment
touch docker-compose.yml
```

### Document Editing

Edit the docker-compose document using the following commands:
```
vim ./docker-compose.yml 
```

After entering, you will access the document.

At this point, enter `a` and you will start editing the document. Paste the following content into the document. (Please note that the file content remains consistent and the indentation alignment of each line is consistent with this document)
```
version: "3"
services:
  node:
    image: phalanetwork/phala-node-with-launcher:latest
    container_name: node
    hostname: node
    restart: always
    ports:
     - "9933:9933"
     - "9934:9934"
     - "9944:9944"
     - "9945:9945"
     - "30333:30333"
     - "30334:30334"
    environment:
     - NODE_NAME=PNODE
     - NODE_ROLE=MINER
     - RELAYCHAIN_DB=rocksdb
     - PARACHAIN_DB=rocksdb
     - PARACHAIN_EXTRA_ARGS=--max-runtime-instances 32 --runtime-cache-size 8
     - RELAYCHAIN_EXTRA_ARGS=--max-runtime-instances 32 --runtime-cache-size 8
    volumes:
     - /var/phala/node-data:/root/data

  phala-pherry:
    image: phalanetwork/phala-pherry:latest
    container_name: phala-pherry
    hostname: phala-pherry
    restart: always
    entrypoint:
      [
        "/root/pherry",
        "-r",
        "--parachain",
        "--mnemonic={gas fee memory seed}",
        "--substrate-ws-endpoint=ws://{node ip}:9945",
        "--collator-ws-endpoint=ws://{node ip}:9944",
        "--pruntime-endpoint=http://{pruntime ip}:8000",
        "--operator={owner address}",
        "--fetch-blocks=512",
        "--auto-restart"
      ]

  phala-pruntime:
    image: phalanetwork/phala-pruntime-v2-with-handover:latest
    container_name: phala-pruntime
    hostname: phala-pruntime
    ports:
    - "8000:8000"
    devices:
    - /dev/sgx_enclave:/dev/sgx_enclave
    - /dev/sgx_provision:/dev/sgx_provision
    environment:
    - EXTRA_OPTS=--cores={core_num} --checkpoint-interval=3600
    - ROCKET_ADDRESS=0.0.0.0
    volumes:
    - /var/phala/pruntimev2:/opt/pruntime/data
    - /var/phala/pruntimev2/backups:/opt/pruntime/backups
```
Some parameters need to be customized by yourself, including:
* In phala-pherry, replace {gas fee memory seed} in “–mnemonic={gas fee memory seed}” with the mnemonic seed of the gas fee account. For example: 
  * “–mnemonic=a b c d e … h” 
* In phala-pherry, replace the {node ip} with your own node’s IP in both “–substrate-ws-endpoint=ws://{node ip}:9945” and “–collator-ws-endpoint=ws://{node ip}:9944”; 
Replace {pruntime ip} in “–pruntime-endpoint=http://{pruntime ip}:8000” with the IP of your own pruntime worker; If you are running these components on the same device, the easiest way is to replace them all with 127.0.0.1. For example:
  * “–substrate-ws-endpoint=ws://127.0.0.1:9945”
  * “–collator-ws-endpoint=ws://127.0.0.1:9944”
  * “–pruntime-endpoint=http://127.0.0.1:8000”
* In phala-pherry, replace {owner address} in “–operator={owner address}” with the Phala network address of the mining pool’s main account. For example:
  * “-operator=446u...WewDEZyv”
* In phala-pruntime, change --cores={core_num} to the number of cores of your machine, such as --cores=4.

After entering, complete the following steps to finish the text editing and save successfully.
```
1、Click "esc"
2、Enter ":wq"
3、Click "Enter"，quit the editing page
```

### Program Execution

Inside the newly created folder, run docker-compose, and the essential components for Solo worker will run successfully.
```
sudo docker-compose up -d
```

## Status Check

### Node Check

Enter the following command to get the last 100 lines of node log information
```
sudo docker logs node --tail 100
```
> If you have changed the component name through customizing docker-compose.yml, please replace "node" to your customized name in the command.

A typical node log in sync will look like this:

```
2021-09-15 13:33:27 [Relaychain] ⚙️  Syncing 10.4 bps, target=#9236775 (20 peers), best: #9227955 (0xa897…4f36), finalized #9227895 (0x1d6d…1527), ⬇ 1.7MiB/s ⬆ 657.8kiB/s
2021-09-15 13:33:27 [Parachain] ⚙️  Syncing 40.4 bps, target=#400531 (1 peers), best: #396657 (0xb898…6c02), finalized #396443 (0xf470…2f54), ⬇ 378.7kiB/s ⬆ 1.6kiB/s
```

Determine whether the parachain and relaychain are synchronizing normally by judging the height of the "target", "best", and "finalized". 
* Polkadot chain (relaychain) produces a block every 6 seconds. 
* Phala chain (parachain) produces a block every 12 seconds.

### Pherry Check

Enter the following command to get the most recent 100 lines of Pherry log information:
```
sudo docker logs phala-pherry --tail 100
```
> If you have changed the component name through customizing docker-compose.yml, please replace "phala-pherry" to your customized name in the command.

A typical pherry log will look like this:
```
[2023-05-10T11:18:38.733183Z INFO  pherry] get_block: Got block Some(8347280) hash 0x921c…c876
[2023-05-10T11:18:38.734430Z INFO  pherry] get_block: Got block Some(8347281) hash 0x66ca…de13
...
[2023-05-10T11:18:38.835415Z INFO  pherry] fetching parachain header 9257
[2023-05-10T11:18:38.835652Z INFO  pherry] fetching parachain header 9258
...
[2023-05-10T11:18:38.900188Z INFO  phactory_api::pruntime_client] Response: 200 OK
[2023-05-10T11:18:38.900338Z INFO  pherry] ..req_sync_para_header: SyncedTo { synced_to: 9414 }
[2023-05-10T11:18:38.900342Z INFO  pherry] batch syncing from 9229 to 9414 (186 blocks)
[2023-05-10T11:18:38.900345Z INFO  pherry] fetch_storage_changes (9229-9232)
[2023-05-10T11:18:38.905124Z INFO  pherry::prefetcher] prefetching (9233-9236)
[2023-05-10T11:18:38.905130Z INFO  pherry] fetch_storage_changes (9233-9236)
...
[2023-05-10T11:18:39.203944Z INFO  pherry] fetch_storage_changes (9415-9416)
[2023-05-10T11:18:39.209291Z INFO  phactory_api::pruntime_client] Response: 200 OK
[2023-05-10T11:18:39.209617Z WARN  pherry] Cannot find justification within window (from: 8347137, to: 8347327)
[2023-05-10T11:18:39.214032Z INFO  phactory_api::pruntime_client] Response: 200 OK
[2023-05-10T11:18:39.214046Z INFO  pherry] pRuntime get_info response: PhactoryInfo {
        initialized: true,
        registered: false,
        genesis_block_hash: Some(
            "...",
        ),
        public_key: Some(
            "...",
        ),
        ecdh_public_key: Some(
            "...",
        ),
        headernum: 8347137,
        para_headernum: 9415,
        blocknum: 9415,
        state_root: "...",
        dev_mode: false,
        pending_messages: 0,
        score: 0,
        gatekeeper: Some(
            GatekeeperStatus {
                role: None,
                master_public_key: "",
            },
        ),
        version: "2.0.1",
        git_revision: "...",
        memory_usage: Some(
            MemoryUsage {
                rust_used: 1973339,
                rust_peak_used: 9071307,
                total_peak_used: 328859648,
            },
        ),
        waiting_for_paraheaders: false,
        system: Some(
            SystemInfo {
                registered: false,
                public_key: "...",
                ecdh_public_key: "...",
                gatekeeper: Some(
                    GatekeeperStatus {
                        role: None,
                        master_public_key: "",
                    },
                ),
                number_of_clusters: 0,
                number_of_contracts: 0,
                max_supported_consensus_version: 0,
                genesis_block: 0,
            },
        ),
        can_load_chain_state: false,
    }
[2023-05-10T11:18:39.222654Z INFO  pherry] try to sync blocks. next required: (relay_header=8347137, para_header=9415, body=9415), relay finalized tip: 17850681, buffered: 191
[2023-05-10T11:18:39.223867Z INFO  pherry] get_block: Got block Some(8347328) hash 0xd305…04ff
[2023-05-10T11:18:39.226657Z INFO  pherry] get_block: Got block Some(8347329) hash 0x27f2…bc9a
```

You can search for issues in these logs and confirm whether the synchronization is going normally. Also, you can obtain the worker's public key and the real-time calculated P-value (score) from them.

### pRuntime Check

Enter the following command to get the most recent 100 lines of pRuntime log information:
```
sudo docker logs phala-pruntime --tail 100
```
> If you have changed the component name through customizing docker-compose.yml, please replace "phala-pruntime" to your customized name in the command.

A typical pRuntime log in sync will look like this:
```
2023-05-10T11:55:38.478826Z  INFO phactory::prpc_service: State synced
2023-05-10T11:55:38.479089Z  INFO phactory::storage::storage_ext: Got 17 messages from OutboundMessages    
2023-05-10T11:55:38.479330Z  INFO phactory::prpc_service: Dispatching block=440838
2023-05-10T11:55:38.482465Z  INFO phactory::prpc_service: State synced
2023-05-10T11:55:38.482647Z  INFO phactory::storage::storage_ext: Got 11 messages from OutboundMessages    
2023-05-10T11:55:38.482825Z  INFO pruntime::runtime: pRPC returned code=200 size=4
2023-05-10T11:55:38.482881Z  INFO prpc_measuring: POST /prpc/PhactoryAPI.DispatchBlocks cost 18221 microseconds, status: 200   
```

You can determine whether the synchronization is proceeding normally by checking the synchronized height and progress.
