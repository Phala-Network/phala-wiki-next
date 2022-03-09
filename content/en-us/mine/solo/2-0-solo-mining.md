---
title: "Configure the Miner"
weight: 1020
menu:
  mine:
    parent: "mine-solo"
---

## Get the Miner Ready

This section shows you how to set up your Phala mining CLI, the respective tools, and setting the last parameters for your drivers.

Execute the following command to get your miner ready to launch for mining.

```bash
sudo phala install
```

>`phala install` will update the miner to use your newly installed driver settings and configuration. This is required for first-time miners or whenever you update or change your driver configuration for this change to take effect.

## Miner Configuration

> :warning: DO NOT reuse the same gas fee account across multiple solo miners.

### Set Wallet Address & More

Use the following command to set your parameters.

```bash
sudo phala config set
```
You will be prompted to set:
- the number of CPU cores to use
  - <details><summary>How to look up your CPU cores?</summary>
    <p>

    If you do not know your CPUs utilizable cores, you may look them up by executing the following command:

    ```bash
    lscpu | grep -E '^Thread|^Core|^Socket|^CPU\('
    ```

    </p>
    </details>
- node name
- gas fee account mnemonic
- the pool owner account

> If any entered parameter is invalid, the script will ask to re-enter the information.\
> \
> :information: To ensure the proceeding of mining, the balance of the gas fee account should be >2 PHA.

### Check Current Configuration

> Note, the following command will show sensitive information (mnemonic seed).

You can get the current parameters in use with

```bash
sudo phala config show
```
