---
title: "1.1 Check Your Hardware, BIOS and System"
---

{{< tip "warning" >}}
Para-2 is the Parachain testnet of Phala Network (and Khala Network). The purpose of running a testnet is to capture the chaos and collect feedback before the launch of the functionalities on Khala Network. So the system is subject to change. In this tutorial, we always refer to the testnet unless explicitly mentioned.
{{< /tip >}}

## General Khala Hardware Requirements

A system can potentially mine Phala if it meets these general requirements:


![](/images/docs/poc3/1-3.1.png)

It will also need a motherboard and BIOS which support using Intel SGX to run a Trusted Execution Environment (TEE).

## Check Your CPU

1. Look up your computer's **Processor**. On Windows, you can find this in Control Panel/Settings, or right-click on the Start icon and select System. On Ubuntu, click in the upper-right corner, pick Settings, and then pick About.

    ![](/images/docs/poc3/1-3.2.png)

2. Confirm the **CPU supports SGX**

    Open Intel's website at ark.intel.com and search for your exact CPU; and confirm that CPU supports Intel Software Guard Extensions (Intel SGX).

    ![](/images/docs/poc3/1-3.3.png)
    ![](/images/docs/poc3/1-3.4.png)

    (This image shows a CPU that supports SGX.)

## Check BIOS settings

1. Boot your computer into BIOS: either search the internet for the right method to boot into BIOS on your computer or look for instructions on screen immediately after a cold boot; this varies by computer model.
2. **Disable Secure Boot**. Go to `Security` -> `Secure Boot`, set it to `Disabled`.
3. **Use UEFI Boot**. Go to `Boot` -> `Boot Mode`, and make it's set to `UEFI`.
4. **Enable SGX Extensions**. Go to `Security` -> `SGX` (The exact name may vary by manufacturer), set it to `Enabled`.
    >If you only see the `SGX: Software Controlled` option, you will have to later run [Intel's sgx-software-enable](https://github.com/intel/sgx-software-enable) in Ubuntu. You can follow Intel's instructions to build it from source and execute it. We also provide a prebuilt binary for Ubuntu 18.04 / 20.04 that can be found [here](https://github.com/Phala-Network/sgx-tools/releases/tag/0.1). You can download and execute it with the following commands:
    > ```bash
    > wget https://github.com/Phala-Network/sgx-tools/releases/download/0.1/sgx_enable
    > chmod +x sgx_enable
    > sudo ./sgx_enable
    > ```
5. Save and reboot.

## Supported Operating Systems: Ubuntu 18.04 and 20.04

You'll need to be able to boot your computer into a supported version of Ubuntu to mine. Versions above 18.04 and 20.04 should work, but are not guaranteed.

[Installing Ubuntu Desktop](https://ubuntu.com/tutorials/install-ubuntu-desktop#1-overview)

### References

1. [What is a Trusted Execution Environment (TEE)?
](https://www.trustonic.com/technical-articles/what-is-a-trusted-execution-environment-tee/)
2. [What is Intel SGX](https://software.intel.com/content/www/us/en/develop/topics/software-guard-extensions.html)
