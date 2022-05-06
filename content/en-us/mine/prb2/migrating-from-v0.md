---
title: "Migrating from Runtime Bridge v0"
weight: 2003
menu:
  mine:
    parent: "mine-prb2"
---

## Overview

This article explains the steps to migrate data from Runtime Bridge v0 to v2.

Before doing the migration, please set environment variables referring to the Deployment Guide.

## Migrate Data Provider(fetch) data

| Required env var | Comments | Default value |
| --- | --- | --- |
| OLD_DATA_PATH | Path to the old data folder | /var/data_old/ |
| NEW_DATA_PATH | Path to the new data folder | /var/data/ |
| PHALA_CHAIN_ENDPOINT | WebSocket endpoint to Phala. | N/A |
| PHALA_PEER_ID_PREFIX | Path to libp2p identity store folder | /var/data/keys/id |
1. Run `docker-compose down` and make sure there is no other Runtime Bridge instance running.
2. Pull latest images from `phalanetwork/prb:next`.
3. Change to mount point of the current data folder to `/var/data_old/` and set the new mount point of the new data folder to `/var/data`, for example:

```yaml
volumes: &default-volume-config
    - /opt/deploy/data:/var/data_old
    - /opt/deploy/data_1:/var/data
```

1. Run `docker-compose run --entrypoint "yarn migrate_data_provider" data_provider`, and wait for the migration progress. This script will copy raw block data to a new clean database. Make sure that there is sufficient disk capacity.
2. Check the Deployment Guide to make everything okay then run `docker-compose up` to start the data provider, the data provider will re-process the block data.

## Migrate lifecycle manager

| Required env var | Comments | Default value |
| --- | --- | --- |
| OLD_DATA_PATH | Path to the old data folder | /var/data_old/ |
| PHALA_LOCAL_DB_PATH | Path to the new database | /var/data/local.db |
| PHALA_PEER_ID_PREFIX | Path to libp2p identity store folder | /var/data/keys/id |
1. Run `docker-compose down` and make sure there is no other Runtime Bridge instance running.
2. Pull latest images from `phalanetwork/prb:next`.
3. Change to mount point of the current data folder to `/var/data_old/` and set the new mount point of the new data folder to `/var/data`, refer to above for example.
4. Run `docker-compose run --entrypoint "yarn migrate_lifecycle" lifecycle`, and wait for the migration progress. This script will generate an RSA keypair as the identity of its libp2p peer, it will be also used as the encryption key of saved Polkadot account.
5. Check the Deployment Guide to configure data providers and make everything okay then run `docker-compose up` to start the lifecycle manager.

## Clean up unused data

After making sure the new Runtime Bridge v2 setup running, delete the old data folder to free up disk space.
