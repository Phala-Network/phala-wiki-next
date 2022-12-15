---
title: "Configure the Worker"
weight: 2020
menu:
  mine:
    parent: "mine-solo"
---

## Get the Worker Ready

This section shows you how to set up your Phala mining CLI, the respective tools, and setting the last parameters for your drivers.

Execute the following command to get your worker ready to launch for mining.

```bash
sudo ~/solo-mining-scripts-main/phala.sh install
```

>`phala.sh` will update the worker to use your newly installed driver settings and configuration. This is required for first-time workers or whenever you update or change your driver configuration for this change to take effect.

## Mode selection

During the installation process, you will receive a prompt like:

```mode select ( full | prune ) (Default: PRUNE):```

The default option here is "prune" mode, which means less hard disk space is used to install node data. Just click `Enter` to go to the next step.

If your hard disk has more than 2T space and you want to install the complete Kusama node data, type `full` and click `Enter` to go to the next step.


## Worker Configuration

> :warning: DO NOT reuse the same gas fee account across multiple solo workers.

### Set Wallet Address & More

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

During the daily operation of workers (not in the installation process above), You can get the current parameters in use with

```bash
sudo phala config show
```

And use the following command to reset your parameters.

```bash
sudo phala config
```

## Headers update

If you select the "Prune" mode, and this is the first time that you install the mining tools which means there is no headers data in the worker.

After the Configuration, do remember to update headers with

```bash
sudo phala update headers
```
It may take some time to update headers, after the update, the installation is finished.

## Snapshot update

If you need to download node data from the beginning, you can download the node snapshot with

```bash
sudo phala update snapshot
```
