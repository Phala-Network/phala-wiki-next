---
title: "Accelerate Khala Syncing"
weight: 2023
menu:
  mine:
    parent: "mine-solo"
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

Download the snapshot using the torrent (updated at 4/30/2022): [here](/files/khala-node-snapshot-2022-04-30.tar.gz.torrent)

The download will take a while, as the file is large. Get some :coffee: in the meantime.

> :information: The snapshot archive is ~750 GB; if you don't have enough space, consider extracting to an external storage.

To extract the file execute:

```bash
tar -xvzf khala-node-snapshot-2022-04-30.tar.gz
```

The extraction will take a while to complete as well. After extraction, you should get a folder named `khala-node`.
You can list your files with `ls` to verify where you extracted the snapshot.
