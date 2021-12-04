---
title: "4.2 Speed Up Node Synching"
weight: 6042
menu:
  docs:
    parent: "khala-mining"
---

## Check Your Status

A typical node log that is not up to date will look like this:

```
2021-09-15 13:33:27 [Relaychain] ⚙️  Syncing 10.4 bps, target=#9236775 (20 peers), best: #9227955 (0xa897…4f36), finalized #9227895 (0x1d6d…1527), ⬇ 1.7MiB/s ⬆ 657.8kiB/s
2021-09-15 13:33:27 [Parachain] ⚙️  Syncing 40.4 bps, target=#400531 (1 peers), best: #396657 (0xb898…6c02), finalized #396443 (0xf470…2f54), ⬇ 378.7kiB/s ⬆ 1.6kiB/s
```

You can check your node logs anytime by executing the following:

```bash
sudo docker logs -f phala-node
```

For a status on your block heights, feel free to run:

```bash
sudo phala status
```

## Download a Snapshot

> :information: If your node is close to the newest block height (about several hours to catch up) or already caught up, you don't need to do anything; sit and wait.

Download the snapshot from (updated at 9/15/2021): [here](https://storage.googleapis.com/khala-snapshots/khala-snapshot-210915.tar.gz)

To download the snapshot from the command line, follow these steps:

```bash
wget https://storage.googleapis.com/khala-snapshots/khala-snapshot-210915.tar.gz
```
The download will take a while, as the file is large. Get some :coffee: in the meantime.

Once downloaded the checksum for data integrity is:

```
$ sha256sum khala-snapshot-210915.tar.gz
d1ad677bb2421d17e12f7bed2af95beaf7343a2f9c79b4b07b85a0faa521467c  khala-snapshot-210915.tar.gz
```

> :information: The snapshot archive is ~220 GB; the extraction requires ~350 GB, which means you need at least 550 GB of free disk space; if you don't have enough space, consider extracting to an external storage.

To extract the file execute:

```bash
tar -xvzf khala-snapshot-210915.tar.gz
```

The extraction will take a while to complete as well. After extraction, you should get a folder named `khala-node`.
You can list your files with `ls` to verify where you extracted the snapshot.

### Use the Snapshot

Please ensure all Phala services are stopped on your node. Hence, to stope them use:

```bash
sudo phala stop
```

To replace your block heights with the snapshot, delete the node's current synchronization status. 

```bash
rm -r /var/khala-dev-node/chains
rm -r /var/khala-dev-node/polkadot
```

Now move the snapshot into the correct directory.

```bash
mv ~/khala-node/chains/ /var/khala-dev-node
mv ~/khala-node/polkadot/ /var/khala-dev-node
```

Delete all files and folders inside `/var/khala-dev-node`，move all files and folders from `khala-node` into `/var/khala-dev-node`

#### Restart the Phala Node

```bash
sudo phala start
```

Your node has now been fast-forwarded and will be usable for mining sooner. 
