---
title: "2 Solo mining configuration"
weight: 6020
menu:
  docs:
    parent: "khala-mining"
---

{{< tip >}}
If you have successfully installed the SGX driver and finished the benchmarking, you can skip the following tutorials.
{{< /tip >}}

## Install

You can use the following commands to install Phala tools. It will automatically set the number of CPU cores to use, node name, gas fee account mnemonic and pool owner account.

```bash
sudo phala install
```

By default, all the configurations are set automatically. If you want to manually config the tools, use the following commands and set the parameters.

{{< tip "warning" >}}
DO NOT share the same gas fee account across multiple solo mining setup.
{{< /tip >}}

```bash
sudo phala config set
```

> The script will ask for re-enter if the received parameter is invalid.
> To ensure the proceeding of mining, the balance of gas fee account should be greater than 0.1 PHA.

You can get the current parameters in use with

```bash
sudo phala config show
```
