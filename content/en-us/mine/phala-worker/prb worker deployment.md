---
title: "PRB worker deployment"
weight: 1040
menu:
  mine:
    parent: "phala-worker"
---

## Basic requirements

Apart from the reduced requirements for hard disk and memory space, the process of deploying a PRB worker is the same as deploying a solo worker. The only difference is that the PRB worker only needs to run pRuntime, while the solo worker needs to run node and pherry additionally. 

For details of solo worker deployment, please refer to: [Solo worker deployment](https://wiki.phala.network/en-us/mine/phala-worker/solo-worker-deployment/)

Therefore, the requirements for running a PRB worker are:

* Support for SGX function
* Ubuntu 22.04.2 LTS system with a kernel of 5.13 and above
* 4 or more CPU cores
* 8GB memory
* 128GB NVME hard disk

## Worker deployment

### Preparations

After installing the OS, first install the necessary docker programs
```
sudo apt update && sudo apt upgrade -y && sudo apt autoremove -y
sudo apt install docker-compose
```

Then create a folder locally, and create a docker-compose document within it.
```
mkdir phala-deployment
cd ./phala-deployment
mkdir docker-compose.yml
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

> A parameter needs to be customized by yourself:
> In phala-pruntime, change --cores={core_num} to the number of cores of your machine, such as --cores=4.

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

## Configuration for adding worker to PRB server

All on-chain information configuration, including transaction accounts, pool master's information, etc., can be done through the PRBv3 configuration interface. 

At this stage, you only need to record the IP of this worker to be filled into the PRB database.

### How to Find the Local IP Address:

Install the net-tools package.
```
sudo apt install net-tools
```

Then Use this command to search the IP
```
ifconfig
```

The result will look like this:
```
br-0cec631198c9: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        inet xxx.xxx.xxx.xxx  netmask 255.255.240.0  broadcast 111.111.111.111
        ...

br-2493ab4f406b: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        inet xxx.xxx.xxx.xxx  netmask 255.255.0.0  broadcast 111.111.111.111
        ...

br-2990701611a3: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        inet xxx.xxx.xxx.xxx  netmask 255.255.240.0  broadcast 111.111.111.111
        ...
```

You can find your public or private IP after each `inet`.

## Create a connection between Worker and PRB

For more details, please refer to the [Using PRBv3](https://wiki.phala.network/en-us/mine/phala-worker/using-prbv3/)
