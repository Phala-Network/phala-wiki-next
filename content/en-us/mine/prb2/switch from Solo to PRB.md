---
title: "How to switch from Solo mining to PRB mining"
weight: 2010
menu:
  mine:
    parent: "mine-prb2"
---

## How Solo miner works

Solo miner runs 3 Docker containers named Phala-node, Phala-pherry, and Phala-pRuntime. 

Node provides blockchain node services; PRuntime provides TEE-runtime services; And Pherry acts as a bridge between TEE and blockchain nodes. The only component that really provides decentralized computing services to the network is pRuntime

## How Prb works

Prb is "Phala Runtime Bridge" which replaces pherry to make a bridge between the blockchain and pRuntime to convey information in batches.

## How to switch from Solo mining to PRB mining

* Turn off Pherry service on solo miners
* Shut down the Node service on solo miners
* Let pRuntime run alone and add pruntime's endpoint to PRB

## Operation steps
* Step1
`Sodo phala stop`
* Step 2
`sudo mkdir ~/prb`
* Step 3
Copy the docker-compse.yml and .env files in the Solo mining folder to ~/prb
* Step 4
`sudo vim docker-compose.yml`
Edit the docker-compose file and delete the descriptions of the node and pherry services
* Step 5
`sudo docker-compose up -d` 
start pruntime alone
* Step 6
Add the endpoint of this pruntime on the Worker page of Prb (the format is: http://xxx.xxx.xxx.xxx:8000)
* Step 7
Restart the lifecycle component of prb

## How to set up a PRB worker
Just learn from this page: [PRB setup](https://wiki.phala.network/en-us/mine/prb2/deployment-guide/)
