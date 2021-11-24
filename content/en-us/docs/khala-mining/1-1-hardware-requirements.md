---
title: "1.1 Hardware, BIOS and System Compatability"
weight: 6011
menu:
  docs:
    parent: "khala-mining"
---

## General Khala Hardware Requirements

A system can potentially mine Phala if it meets these general requirements:

![](/images/docs/poc3/1-3.1.png)

### Requirements Checklist

- [x] An [Intel® SGX](https://www.intel.com/content/www/us/en/architecture-and-technology/software-guard-extensions.html)  compatible processor. 
   - [Lookup your CPU](#1-lookup-your-processor) and see if it is compatible.
   - [How to find new Intel® SGX processors](#2-confirm-the-cpu-supports-intel-sgx) if mine is not compatible.
- [x] A motherboard and BIOS that supports [Intel® SGX](https://www.intel.com/content/www/us/en/architecture-and-technology/software-guard-extensions.html) to run the [Trusted Execution Environment (TEE)](https://murdoch.is/talks/rhul14tee.pdf) is required.
   - [Check BIOS compatability](#check-your-bios).
- [x] A Solid-state drive (SSD) storage device
   - Storing your blockchain data on a mechanical HDD will result in slow syncronosation speeds. At a minimum a 512GB SSD drive is recommended. 
      - Refer to [issue #554.](https://github.com/Phala-Network/phala-blockchain/issues/554)
- [x] Have a supported version of Ubuntu (18.04, 20.04, 21.04) installed and booted from it.
   - See [Suported OS requirements](#supported-operating-systems). 

## Check Your CPU

> Currently, only [Intel® SGX](https://www.intel.com/content/www/us/en/architecture-and-technology/software-guard-extensions.html) is supported, hence an [Intel® SGX compatible CPU](https://www.intel.com/content/www/us/en/support/articles/000028173/processors.html) is a requirement.

### 1. Lookup Your **Processor**

#### Windows

> `Start` > `Settings` > `Control Panel`
>> Note that you require a [supported Linux OS](#supported-operating-systems) to run a Phala miner.

On Windows, head over to 'Control Panel/Settings,' or right-click on the Start icon and select 'System.' 

#### Linux

- #### With a GUI

>  `Settings` > `About`

On Ubuntu, click in the upper-right corner, pick 'Settings,' select 'About,' and look for 'Processor.'

<p class="aligncenter">
<img src="/images/docs/khala-mining/linux_settings.png" >
</p>

(Navigating to 'Settings' on a Desktop GUI to look up CPU specs)

- #### Without GUI

In case you do not have a GUI, enter the following command into your shell and look for your CPU's 'Model name:'

```bash
lscpu
```

<p class="aligncenter">
<img src="/images/docs/khala-mining/CPU_Linux_check.gif" height="400">
</p>

(Looking up the CPU model with the `lscpu` command in the Linux shell)

### 2. Confirm the **CPU Supports Intel® SGX**

> Once you know your CPU's model name:
> -  Lookup your Processor's Intel® SGX compatability in the [Intel® product specifications (ARK)](https://ark.intel.com/content/www/us/en/ark.html#@Processors)

On the [Intel® product specifications (ARK)](https://ark.intel.com/content/www/us/en/ark.html#@Processors)
website, you will find information about your CPU's Intel® SGX compatibility. In addition, under the 'Security & Reliability' section, it will mention if your CPU is compatible or not.
Below is an example of the [Intel® Core™ i7-8700 CPU @ 3.20GHz](https://ark.intel.com/content/www/us/en/ark/products/126686/intel-core-i78700-processor-12m-cache-up-to-4-60-ghz.html), a screenshot taken from the Intel® product specifications (ARK).

<p class="aligncenter">
<img src="/images/docs/khala-mining/SGX_comptible_ARK.png" >
</p>

(This image shows a CPU that supports Intel® SGX.)

If you do not have an Intel® SGX compatible CPU yet, you may use the [advanced search](https://ark.intel.com/content/www/us/en/ark/search/featurefilter.html?productType=873&2_SoftwareGuardExtensions=Yes%20with%20Intel%C2%AE%20ME&3_CoreCount-Min=8&2_StatusCodeText=4) option at the Intel® website to find your next processor. In general terms, the newer the processor is and the more cores it has, the greater the compatibility and the miner rating. 

## Check Your BIOS

> A mainboard supporting Intel® SGX and the BIOS settings listed below is required.

### 1. Boot into BIOS. 

   > Refer to these resources to 'boot into BIOS mode' from [Microsoft©](https://docs.microsoft.com/en-us/windows-hardware/manufacture/desktop/boot-to-uefi-mode-or-legacy-bios-mode?view=windows-11) or [wikiHow](https://www.wikihow.com/Enter-BIOS).

   Look for instructions to boot into your BIOS on the screen immediately after a cold boot; this varies by manufacturer. 

### 2. **Disable Secure Boot**. 

   > In the BIOS settings go to: `Security` > `Secure Boot` and set it to `Disabled`
   > -  The terms in the BIOS menu may differ depending on your mainboard manufacturer.

### 3. **Use UEFI Boot**. 

   > In the BIOS menu under `Boot` > `Boot Mode` set it to `UEFI`.
   > -  Refer to ['boot into UEFI mode'](https://docs.microsoft.com/en-us/windows-hardware/manufacture/desktop/boot-to-uefi-mode-or-legacy-bios-mode?view=windows-11) for additional information.

### 4. **Enable SGX Extensions**. 

   > Go to `Security` > `Intel® SGX` (The exact name may vary by manufacturer), set it to `Enabled`.
   >
   >> - Note: If you only see the Intel® `SGX: Software Controlled` or similar, you need to run the [Intel® Software Guard Extensions Software Enabling Application for Linux](https://github.com/intel/sgx-software-enable) after booting into your Ubuntu OS. Before executing the script, refer to the [Supported Operating Systems](#supported-operating-systems) section.
   >>
   >> - Phala also provides a prebuilt binary [here](https://github.com/Phala-Network/sgx-tools/releases/tag/0.1). 
   >>  You can download and execute it with the following commands:
   >> ```bash
   >> wget https://github.com/Phala-Network/sgx-tools/releases/download/0.1/sgx_enable
   >> chmod +x sgx_enable
   >> sudo ./sgx_enable
   >> ```

### 5. Save & Reboot

> Do not forget to save your BIOS settings. 
> - Reboot your machine after the settings are saved.

## Supported Operating Systems 

Ubuntu is recommended. You need to be able to boot your computer into a supported version of Ubuntu to mine. The following OS versions of Ubuntu have been reported to mine.

> More information on how to [install Ubuntu Desktop](https://ubuntu.com/tutorials/install-ubuntu-desktop#1-overview).

### Ubuntu 18.04

More information to be added soon.

### Ubuntu 20.04

Using a Linux kernel version of `5.8.0-xxx` is recommended for Ubuntu 20.04.

To find your Linux kernel version type:

```bash
hostnamectl | grep Kernel
```

More information to be added soon.

### Ubuntu 21.04

More information to be added soon.

If you have any issues feel free to reach out to the community.


