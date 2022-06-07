---
title: "Deployment Guide for Latest Version"
weight: 2000
menu:
  mine:
    parent: "mine-prb2"
---

## Understanding Runtime Bridge

Following services make a Runtime Bridge setup work:

- Data Provider (a.k.a `data_provider`):
    - Fetches and analyses block data from Substrate,
    - Makes pre-encoded blobs that `pRuntime` consumes,
    - Serves pre-encoded blobs for lifecycle managers;
- Lifecycle Manager (a.k.a `lifecycle`):
    - Sends block data blobs to workers(`pRuntime`),
    - Registers worker on the chain,
    - Starts mining with configured stake amount,
    - Provides API to query workers and pools.
- Trader (a.k.a `trade`):
    - Sends transactions from queue to the chain.

Every service above uses [Runtime Bridge Walkie](https://github.com/Phala-Network/runtime-bridge-walkie) as a communication method built on `libp2p` and Protocol Buffer. On the first startup of each service, an RSA key pair will be generated(by default saved in `/var/data/keys/id`) to be used as the identity in the `libp2p` protocol. The current identity public key can be found in the stdout of running service by searching `Got my peer id` in the base58 format. And for lifecycle managers, the key pair is used to encrypt critical information. **DO BACK THE KEYS UP AND KEEP THE KEYS SAFE.**

When the lifecycle manager has finished the initial blob synchronization, it will attempt to sync messages in the message queue between the `pRuntime` and the blockchain. After that, it will try to register workers and do the “start mining” operation on the blockchain.

Extrinsics (transactions) shall be sent to the blockchain for the operation mentioned above. To achieve this, the lifecycle manager shall push the extrinsics data to the trader queue(currently maintained with Redis). The trader will grab jobs from the queue and report the extrinsic results back.

Runtime Bridge doesn't require a SGX environment.

## Understanding the startup process and internal dependencies

Data providers and lifecycle managers are designed to discover each other using `libp2p`. While starting the service, it connects to the blockchain then analyses the `chainIdentity` from the `parachain`, `libp2p` will be initialized with the identity key and the `chainIdentity`. After the initialization, the service should begin its work and discover other peers via mDNS as well as the bootstrap node configured.

A data provider fetches data from the `parachain` and the `relaychain`(called `parent chain` in Substrate). It starts a standalone TCP server for blob synching due to the performance issue of `libp2p`, the port of which will be included in the peer handshake process.

While starting the lifecycle manager, it connects to the Redis server for the trade queue. There should be only 1 lifecycle manager and 1 trader accessing the same Redis server. The trader paired with the lifecycle manager should use the same identity key to ensure that the trader can decrypt the private key of saved pools. While the lifecycle requires a specified Redis server to start, it doesn’t require any data provider to start the service. It will wait until any valid data providers are discovered, which means it’s safe to stop the data provider when the lifecycle manager running, and you can build an HA setup for data providers.

Data in the Redis server should never be persisted since the lifecycle manager always builds states from the blockchain and `pRuntime`. Restart the lifecycle manager, the trader, and the Redis server together when any error occurs.

## Quickstart with Docker Compose

We recommend deploying the services with Docker Compose, to install Docker and Docker Compose, please refer to the documentation:
- [Installing Docker](https://docs.docker.com/engine/install/#server)
- [Installing Docker Compose](https://docs.docker.com/compose/install/)

We assume you have already [acknowledged the basic usage](https://docs.docker.com/compose/gettingstarted/) of Docker and Docker Compose to complete this guide.

The `host` network driver is recommended when deploying with Docker to work with the auto discovery feature of Runtime Bridge.

### Local Node

Edit and save following content in `docker-compose.yml` in a directory for node deployment:

```yaml
version: "3"
services:
  node:
    image: phalanetwork/khala-node:latest
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
    volumes:
     - /var/khala-dev-node:/root/data
```

It's recommended to build a TCP load balancer for the node in production environment.

### Data Provider

Edit and save following content in `docker-compose.yml` in another directory:

```yaml
version: "3"

x-defaults: &defaults
  volumes: &default-volume-config
    - ./data:/var/data

services:
  data_provider:
    image: phalanetwork/prb:next
    hostname: data_provider
    network_mode: host
    restart: always
    volumes: *default-volume-config
    logging:
      options:
        max-size: "1g"
    environment:
      - PHALA_MODULE=data_provider
      - NODE_ENV=development
      - PHALA_LOGGER_LEVEL=debug
      - PHALA_PARENT_CHAIN_ENDPOINT=ws://path.to.kusama.node:9945
      - PHALA_CHAIN_ENDPOINT=ws://path.to.khala.node:9944
      - PHALA_WALKIE_LISTEN_ADDRESSES=/ip4/0.0.0.0/tcp/28888
      - PHALA_BRIDGE_IDENTITY=production
      - PHALA_LIFECYCLE_BLOB_SERVER_SESSION_MAX_MEMORY=64
    entrypoint:
      - "node"
      - "--trace-warnings"
      - "--experimental-json-modules"
      - "--es-module-specifier-resolution=node"
      - "--harmony-top-level-await"
      - "dist/index"

  monitor:
    image: phalanetwork/prb-monitor:next
    hostname: monitor
    network_mode: host
    environment:
      - PTP_BOOT_NODES=/ip4/127.0.0.1/tcp/28888/peer_id_of_data_provider

```

Run `docker-compose up` to start the data provider, open the monitor with `http://localhost:3000` in the browser, you will see the status of the data provider even the `PTP_BOOT_NODES` has not been set properly.

One data provider can be shared by multiple lifecycle managers.

### Lifecycle Manager and Trader

Edit and save following content in `docker-compose.yml`:

```yaml
version: "3"

x-defaults: &defaults
  volumes: &default-volume-config
    - ./data:/var/data

services:
  redis-q:
    network_mode: host
    image: redis:alpine
    hostname: redis-q
    restart: always
    logging:
      options:
        max-size: "1g"
    command: ["redis-server", "--port", "63792", "--appendonly", "no", '--save', '']

  lifecycle:
    network_mode: host
    image: phalanetwork/prb:next
    hostname: lifecycle
    restart: always
    depends_on:
      - redis-q
    volumes: *default-volume-config
    logging:
      options:
        max-size: "1g"
    environment:
      - PHALA_MODULE=lifecycle
      - PHALA_PARENT_CHAIN_ENDPOINT=ws://path.to.kusama.node:9945
      - PHALA_CHAIN_ENDPOINT=ws://path.to.khala.node:9944
      - PHALA_Q_REDIS_ENDPOINT=redis://127.0.0.1:63792/
      - PHALA_LRU_CACHE_SIZE=50
      - PHALA_LRU_CACHE_MAX_AGE=90000
      - PHALA_RUNNER_MAX_WORKER_NUMBER=100
      - PHALA_PRPC_REQUEST_TIMEOUT=60000
      - PHALA_BRIDGE_IDENTITY=production
      - PHALA_WALKIE_LISTEN_ADDRESSES=/ip4/0.0.0.0/tcp/29888
      - PHALA_WALKIE_BOOT_NODES=/ip4/ip.of.data.provider/tcp/28888/p2p/some_peer_id
      - WORKER_KEEPALIVE_ENABLED=true
      - USE_BUILT_IN_TRADER=true
    entrypoint:
      - "node"
      - "--trace-warnings"
      - "--experimental-json-modules"
      - "--es-module-specifier-resolution=node"
      - "--harmony-top-level-await"
      - "dist/index"
```

Run `docker-compose up` to start the data provider, the lifecycle manager should be discovered and accessible in the monitor.

Open `http://127.0.0.1:4567` in the browser to check the queue of on-chain transactions.

## Configuring Runtime Bridge

Services with a Runtime Bridges setup are configured with environment variables.

### Shared items

| Name | Description |
| --- | --- |
| NODE_ENV | Application environment, set to development to put the app in development mode. |
| PHALA_MODULE | The module to start. |
| PHALA_LOGGER_LEVEL | Logger level, defaults to info. See https://github.com/trentm/node-bunyan for more information. |
| PHALA_CHAIN_ENDPOINT | The WebSocket endpoint to the Substrate RPC of parachain. |
| PHALA_PARENT_CHAIN_ENDPOINT | The WebSocket endpoint to the Substrate RPC of relaychain(e.g. for Khala it’s Kusama). |
| PHALA_PEER_ID_PREFIX | The path storing identity keys, defaults to '/var/data/keys/id'. |
| PHALA_WALKIE_LISTEN_ADDRESSES | The multiaddr(https://github.com/libp2p/specs/tree/master/addressing) of listen address for libp2p, defaults to '/ip4/0.0.0.0/tcp/0,/ip6/::/tcp/0' which means listen to a random port on every interface. Only TCP protocol is supported. Use a comma between addresses. |
| PHALA_WALKIE_BOOT_NODES | The multiaddr list of bootstrap nodes for peer discovery, defaults to '/ip4/0.0.0.0/tcp/18888,/ip6/::/tcp/28889' which means no bootstrap node. Only TCP protocol is supported. Use a comma between addresses. |
| PHALA_BRIDGE_IDENTITY | The bridge identity in the PRB Walkie protocol, used to specify namespace. |

### Items for data providers

| Name | Description |
| --- | --- |
| PHALA_LOCAL_DB_PATH | The path to database, defaults to '/var/data/0'. |
| PHALA_DATA_PROVIDER_LOCAL_SERVER_PORT | The listen port for the blob server, defaults to 8012. |

### Items for lifecycle managers

| Name | Description |
| --- | --- |
| PHALA_Q_REDIS_ENDPOINT | The endpoint to the Redis for trader task queue. |
| PHALA_RUNNER_MAX_WORKER_NUMBER | The maximum worker number of one runner, defaults to 150. |
| PHALA_LIFECYCLE_CONFIG_MODE | Whether the lifecycle manager should enter config mode, where it will start only the API to add/modify saved pools/workers. Set to true to enable. |
| PHALA_LRU_CACHE_SIZE | The size of LRU cache, defaults to 5000. |
| PHALA_LRU_CACHE_MAX_AGE | The maximum age of items in the LRU cache in milliseconds, defaults to 30 minutes. |
| PHALA_ENFORCE_MIN_BENCH_SCORE | Whether the lifecycle manager should re-try the worker registration on the chain if the on-chain benchmark score to too low. Set to true to enable. |
| PHALA_MIN_BENCH_SCORE | Desired minimum benchmark score. |

### Items for trader

| Name | Description |
| --- | --- |
| PHALA_Q_REDIS_ENDPOINT | The endpoint to the Redis for task queue. |

### Configuring Node.js memory usage

Only do this when you are suffering from OOM issues.

Change the docker entrypoint to `node -trace-warnings -experimental-json-modules -es-module-specifier-resolution=node -harmony-top-level-await -max-old-space-size=$MAX_OLD_SPACE_SIZE dist/index`. Change the `$MAX_OLD_SPACE_SIZE` to your desired size in MB.

[https://nodejs.org/dist/latest-v16.x/docs/api/cli.html#--max-old-space-sizesize-in-megabytes](https://nodejs.org/dist/latest-v16.x/docs/api/cli.html#--max-old-space-sizesize-in-megabytes)

## Using the monitor

The [monitor](https://github.com/Phala-Network/runtime-bridge/tree/next) is an example of the Walkie usage. It provides a simple management ability to play with Runtime Bridge.

It also implements a JSON proxy to the Walkie API.

`POST /ptp/discover` returns the list of discovered peers.

`POST /ptp/proxy/:peer_id/:method` sends the API request to the specified peer.

The API definition can be found in [https://github.com/Phala-Network/runtime-bridge-walkie/blob/master/src/proto/message.proto#L78](https://github.com/Phala-Network/runtime-bridge-walkie/blob/master/src/proto/message.proto#L78).

## Import pools and workers

To import pools: [https://github.com/Phala-Network/runtime-bridge-walkie/blob/master/src/proto/message.proto#L95](https://github.com/Phala-Network/runtime-bridge-walkie/blob/master/src/proto/message.proto#L95)

With monitor:

```bash
curl --location --request POST 'http://path.to.monitor/ptp/proxy/Qmbz...RjpwY/CreatePool' \
--header 'Content-Type: application/json' \
--data-raw '{
    "pools": [
        {
            "pid": 2,
            "name": "test2",
            "owner": {
                "mnemonic": "boss...chase"
            },
            "enabled": true,
            "realPhalaSs58": "3zieG9...1z5g"
        }
    ]
}'
```

To import workers: [https://github.com/Phala-Network/runtime-bridge-walkie/blob/master/src/proto/message.proto#L98](https://github.com/Phala-Network/runtime-bridge-walkie/blob/master/src/proto/message.proto#L98)

With monitor:

```bash
curl --location --request POST 'http://path.to.monitor/ptp/proxy/Qmbz...RjpwY/CreateWorker' \
--header 'Content-Type: application/json' \
--data-raw '{
    "workers": [
        {
            "pid": 2,
            "name": "test-node-1",
            "endpoint": "http://path.to.worker1:8000",
            "enabled": true,
            "stake": "4000000000000000"
        },
        {
            "pid": 2,
            "name": "test-node-2",
            "endpoint": "http://path.to.worker2:8000",
            "enabled": true,
            "stake": "4000000000000000"
        }
    ]
}'
```

Restart the lifecycle manager after modified pools/workers.

## Community Works

These resources contributed by the community might be useful, use at your own risk:
- [中文部署教程 / Deployment guide in Chinese](https://github.com/suugee/phala-prb/tree/next)
- [Staking Calculator](https://phala.one/stake/)
