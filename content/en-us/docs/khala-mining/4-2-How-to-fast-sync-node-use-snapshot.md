---
title: "4.2 How to fast sync your node to you haven't fully synced yet"
weight: 6042
menu:
  docs:
    parent: "khala-mining"
---

## Problem

If your node havn't up to date, a typical node log looks like

```
2021-09-15 13:33:27 [Relaychain] ⚙️  Syncing 10.4 bps, target=#9236775 (20 peers), best: #9227955 (0xa897…4f36), finalized #9227895 (0x1d6d…1527), ⬇ 1.7MiB/s ⬆ 657.8kiB/s
2021-09-15 13:33:27 [Parachain] ⚙️  Syncing 40.4 bps, target=#400531 (1 peers), best: #396657 (0xb898…6c02), finalized #396443 (0xf470…2f54), ⬇ 378.7kiB/s ⬆ 1.6kiB/s
```

and `best` is too far from `target`.

This article shares a cheat way to fast syncing your node.

IMPORTANT: If your node is near newest block height (about several hours to catch up) or already catched up,
you don't need to do anything, just seat and wait.

## Download latest snapshot (updated at 9/15/2021)

Download snapshot data from: <https://storage.googleapis.com/khala-snapshots/khala-snapshot-210915.tar.gz>

```
$ sha256sum khala-snapshot-210915.tar.gz
d1ad677bb2421d17e12f7bed2af95beaf7343a2f9c79b4b07b85a0faa521467c  khala-snapshot-210915.tar.gz
```

Extract when downloaded, you shall get `khala-node` folder.

IMPORTANT: snapshot archive is ~220GiB, extract require ~350G, which means you require at least 550G free disk space, if you don't have enough space, consider extract to external storage.

## Preparation

Please ensure Phala services is stopped, especially the node, if you're using solo mining, use

```bash
sudo phala stop
```

to stop Phala services.

## Replace local data with extracted snapshot

### If you're solo miner

Delete all files and folders inside `/var/khala-dev-node`，move all files and folders from `khala-node` into `/var/khala-dev-node`

### Advanced miner

Find the node working directory, Delete all files and folders inside the directory, then move all files and folders from `khala-node` into it.

## Restart Phala services

If you're solo miner, do

```bash
sudo phala start
```

to restart services, then you shall find out your node has fast forward to a very close to latest status, then waiting few minutes or hours, then the node will catching up, and you can start mining now.
