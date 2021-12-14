---
title: "Update your Miner's Node"
weight: 6023
menu:
  docs:
    parent: "khala-mining"
---

To upgrade your worker requires it to stop first.

```bash
sudo phala stop
```

The worker node can be updated in a clean way which removes all the saved data

```bash
sudo phala update clean
```

or with the data preserved

```bash
sudo phala update
```

Finally, restart your worker with:

```bash
sudo phala start
```
