---
title: "Hardware Requirements"
weight: 1002
menu:
  mine:
    parent: "khala-mining"
---

## General Khala Hardware Requirements

A system can potentially mine Phala if it meets these general requirements:

<table>
    <thead>
        <tr>
            <th>CPU</th>
            <th>System</th>
            <th>Memory</th>
            <th>Storage</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>SGX-compatible Processor</td>
        </tr>
        <tr>
            <td>SGX-compatible BIOS</td>
            <td rowspan=3>Ubuntu 20.04</td>
            <td rowspan=3>&ge; 2G per core</td>
            <td rowspan=3>&ge; 1T</td>
        </tr>
        <tr>
            <td>&ge; 2 cores</td>
        </tr>
    </tbody>
</table>

### Requirements Checklist

- [x] An [Intel® SGX](https://www.intel.com/content/www/us/en/architecture-and-technology/software-guard-extensions.html)  compatible processor.
   - [Lookup your CPU](#1-lookup-your-processor) and see if it is compatible.
   - [How to find new Intel® SGX processors](#2-confirm-the-cpu-supports-intel-sgx) if mine is not compatible.
- [x] A motherboard and BIOS that supports [Intel® SGX](https://www.intel.com/content/www/us/en/architecture-and-technology/software-guard-extensions.html) to run the [Trusted Execution Environment (TEE)](https://murdoch.is/talks/rhul14tee.pdf) is required.
   - [Check BIOS compatability](#check-your-bios).
- [x] A Solid-state drive (SSD) storage device
   - Storing your blockchain data on a mechanical HDD will result in extremely slow synchronization speeds. At a minimum a 1TB SSD drive is recommended.
      - Refer to [issue #554](https://github.com/Phala-Network/phala-blockchain/issues/554) for more info.
- [x] Have a supported version of Ubuntu (18.04, 20.04, 21.04) installed and booted from it.
   - See [Supported OS requirements](#supported-operating-systems).
- [x] You require [$S_{min}=k \sqrt{P}$](/en-us/learn/tokenomics/tokenomics/#minimum-stake) tokens to stake when starting your worker.
   - As an example an [Intel® Core™ i7-8700 CPU @ 3.20GHz](https://ark.intel.com/content/www/us/en/ark/products/126686/intel-core-i78700-processor-12m-cache-up-to-4-60-ghz.html) had a `P` value (worker/ worker score) between `1400` and `1700` during testing.
   - Feel free to use our [spreadsheet](#TODO) (coming soon) containing the formulas from the PHA [tokenomics section](/en-us/learn/tokenomics/tokenomics/) to estimate your required minimum tokens to stake.
    - Alternatively, you may also use a [pool and delegate](https://app.phala.network/delegate/). There is a guide [here](/en-us/learn/tokenomics/mining-staking/) on how to delegate.

> Alternatively, you can test mining through [renting hardware](/en-us/general/mining/paas-miner/).

## Check Your CPU

> Currently, only [Intel® SGX](https://www.intel.com/content/www/us/en/architecture-and-technology/software-guard-extensions.html) is supported, hence an [Intel® SGX compatible CPU](https://www.intel.com/content/www/us/en/support/articles/000028173/processors.html) is a requirement.

### 1. Lookup Your Processor

#### Windows

<details><summary>See how to lookup your CPU on Windows</summary>
<p>

> `Start` > :gear:`Settings` > :control_knobs:`Control Panel`
>> Note that you require a [supported Linux OS](#supported-operating-systems) to run a Phala worker.

On Windows, head over to 'Control Panel/Settings,' or right-click on the Start icon and select 'System.'

</p>
</details>

#### Linux

<details><summary>See how to lookup your CPU's model on Linux</summary>
<p>

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

</p>
</details>

### 2. Confirm the CPU Supports Intel® SGX

> Once you know your CPU's model name:
> -  Lookup your Processor's Intel® SGX compatability in the [Intel® product specifications (ARK)](https://ark.intel.com/content/www/us/en/ark.html#@Processors)

On the [Intel® product specifications (ARK)](https://ark.intel.com/content/www/us/en/ark.html#@Processors)
website, you will find information about your CPU's Intel® SGX compatibility. In addition, under the 'Security & Reliability' section, it will mention if your CPU is compatible or not.
Below is an example of the [Intel® Core™ i7-8700 CPU @ 3.20GHz](https://ark.intel.com/content/www/us/en/ark/products/126686/intel-core-i78700-processor-12m-cache-up-to-4-60-ghz.html), a screenshot taken from the Intel® product specifications (ARK).

<p class="aligncenter">
<img src="/images/docs/khala-mining/SGX_comptible_ARK.png" >
</p>

(This image shows a CPU that supports Intel® SGX.)

:information_source: If you do not have an Intel® SGX compatible CPU yet, you may use the [advanced search](https://ark.intel.com/content/www/us/en/ark/search/featurefilter.html?productType=873&2_SoftwareGuardExtensions=Yes%20with%20Intel%C2%AE%20ME&3_CoreCount-Min=8&2_StatusCodeText=4) option at the Intel® website to find your next processor. In general terms, the newer the processor is and the more cores it has, the greater the compatibility and the worker rating.

## Check Your BIOS

> A motherboard supporting Intel® SGX and the BIOS settings listed below is required.

### 1. Boot into BIOS

   > Refer to these resources to 'boot into BIOS mode' from [Microsoft©](https://docs.microsoft.com/en-us/windows-hardware/manufacture/desktop/boot-to-uefi-mode-or-legacy-bios-mode?view=windows-11) or [wikiHow](https://www.wikihow.com/Enter-BIOS).

   Look for instructions to boot into your BIOS on the screen immediately after a cold boot; this varies by manufacturer.

### 2. Disable Secure Boot

   > In the BIOS settings go to: `Security` > `Secure Boot` and set it to `Disabled`
   > -  The terms in the BIOS menu may differ depending on your motherboard manufacturer.

### 3. Use UEFI Boot

   > In the BIOS menu under `Boot` > `Boot Mode` set it to `UEFI`.
   > -  Refer to ['boot into UEFI mode'](https://docs.microsoft.com/en-us/windows-hardware/manufacture/desktop/boot-to-uefi-mode-or-legacy-bios-mode?view=windows-11) for additional information.

### 4. Save & Reboot

> Do not forget to save your BIOS settings.
> - Reboot your machine after the settings are saved.

### 5. Enable Intel® SGX Extensions

   > Go to `Security` > `Intel® SGX` (The exact name may vary by manufacturer), set it to `Enabled`.
   >
   >> <details><summary> Expand for critical additional information :information_source: </summary> <p>
   >>
   >> - Note: If you only see the Intel® `SGX: Software Controlled` or similar, you need to run the [Intel® Software Guard Extensions Software Enabling Application for Linux](https://github.com/intel/sgx-software-enable) after booting into your Ubuntu OS. Before executing the script, refer to the [Supported Operating Systems](#supported-operating-systems) section.
   >>
   >> - Phala also provides a prebuilt binary [here](https://github.com/Phala-Network/sgx-tools/releases/tag/0.1).
   >>  You can download and execute it with the following commands:
   >> ```bash
   >> wget https://github.com/Phala-Network/sgx-tools/releases/download/0.1/sgx_enable
   >> chmod +x sgx_enable
   >> sudo ./sgx_enable
   >> ```
   >> </p>
</details>

## Supported Operating Systems

Ubuntu is recommended. You need to be able to boot your computer into a supported version of Ubuntu to mine. The following OS versions of Ubuntu have been reported to be compatible to mine.

> More information on how to [install Ubuntu Desktop](https://ubuntu.com/tutorials/install-ubuntu-desktop#1-overview).
> - If you have no GUI or physicall access to the machine, you may want to use SSH.
>   - <a href="https://youtu.be/hQWRp-FdTpc?t=40" target="_blank">SSH crash course</a> expaining what SSH is and how to use it, may be a usefull resource.
>   - <a href="https://academy.hackthebox.com/course/preview/linux-fundamentals" target="_blank">Linux Fundamentals</a> provides an overview of Linux and how to use the shell.

[//]: # (May need to convert to shortcode to reduce code & reusability in future.)

<ul class="nav nav-tabs" id="myTab" role="tablist">
<!--  <li class="nav-item" role="presentation">
    <button class="nav-link" id="messages-tab" data-bs-toggle="tab" data-bs-target="#messages" type="button" role="tab" aria-controls="messages" aria-selected="false">Ubuntu 18.04</button>
  </li> -->
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Ubuntu 20.04</button>
  </li>
<!--  <li class="nav-item" role="presentation">
    <button class="nav-link" id="settings-tab" data-bs-toggle="tab" data-bs-target="#settings" type="button" role="tab" aria-controls="settings" aria-selected="false">Ubuntu 21.04</button>
  </li> -->
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Ubuntu 21.10</button>
  </li>
</ul>

<!-- <div class="tab-content">
  <div class="tab-pane active" id="home" role="tabpanel" aria-labelledby="home-tab">
  <br>

### Ubuntu 18.04

<details><summary>Expand for installation instructions for Ubuntu 18.04</summary>
<p>

More information to be added soon.

</p>
</details>

<br> -->

<div class="tab-content">
  <div class="tab-pane active" id="home" role="tabpanel" aria-labelledby="home-tab">
  <br>

### Ubuntu 20.04

Using a Linux kernel version of `5.8.0-xxx` is recommended for Ubuntu 20.04.

To find your Linux kernel version type:

```bash
hostnamectl | grep Kernel
```

Get the Linux Kernel utilities for Ubuntu 20.04.

```bash
git clone https://github.com/mtompkins/linux-kernel-utilities.git
```

```bash
cd linux-kernel-utilities/
chmod +x *.sh
```

To see a list of available Kernel versions for your machine, execute the following command:

```bash
./compile_linux_kernel.sh
```

It is recommended to follow the instructions and select to install Ubuntu 20.04 Kernel version 5.8.

<br>

<!-- <div class="tab-content">
  <div class="tab-pane active" id="home" role="tabpanel" aria-labelledby="home-tab">
  <br>

### Ubuntu 21.04

<details><summary>Expand for installation instructions for Ubuntu 21.04</summary>
<p>

More information to be added soon.

</p>
</details>

<br> -->

  </div>
  <div class="tab-pane" id="profile" role="tabpanel" aria-labelledby="profile-tab">
  <br>

### Ubuntu 21.10

<!-- Ubuntu 21.10 is currently the recommended Ubuntu version to use for mining. -->

For Ubuntu 21.10 we recommend kernel version `5.13.0-xxx`.

To find your Linux kernel version type:

```bash
hostnamectl | grep Kernel
```
Some packages do not come natively installed. It is therefore recommended to install the most crucial ones now as instructed below.

#### DCAP Driver for Intel® SGX

First, install Rust with [rustup](https://rustup.rs/). This is needed to install the driver.

To install rustup:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Follow the instructions in the script.

> Do not forget to execute `source $HOME/.cargo/env` for the installation to work.

After successfully installing Rust, you need to install Rust nightly with the following command:

```bash
rustup default nightly
```

To install the Foranix EDP target through executing:

```bash
rustup target add x86_64-fortanix-unknown-sgx --toolchain nightly
```

Now you are ready to Install the Intel® SGX driver.

```bash
echo "deb https://download.fortanix.com/linux/apt xenial main" | sudo tee -a /etc/apt/sources.list.d/fortanix.list >/dev/null
curl -sSL "https://download.fortanix.com/linux/apt/fortanix.gpg" | sudo -E apt-key add -
sudo apt-get update
sudo apt-get install intel-sgx-dkms
```

Follow the instructions in the installation script. You may need to reboot after successful completion.

You are now ready to proceed to the next section.

<br>

  </div>
</div>

<script>
  var firstTabEl = document.querySelector('#myTab li:last-child a')
  var firstTab = new bootstrap.Tab(firstTabEl)

  firstTab.show()
</script>


\
\
:point_down: If you have any issues feel free to reach out to the community. :point_down:

<div class="mediaList">
   <div class="item">
     <a href="https://discord.gg/C6E4hQjk" target="_blank">
        <svg width="27" height="22" viewBox="0 0 27 22" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M9.8 1.3l.3.3C5.9 2.8 4 4.6 4 4.6l1.3-.7c2.5-1 4.5-1.4 5.3-1.4h.4a19.5 19.5 0 0111.6 2.1s-1.8-1.7-5.7-3l.3-.3s3.1 0 6.5 2.4c0 0 3.3 6 3.3 13.5 0 0-2 3.3-7 3.5 0 0-1-1-1.6-1.9 3-.8 4.2-2.7 4.2-2.7-1 .6-1.9 1-2.7 1.3a16.2 16.2 0 01-12.7 0 13.5 13.5 0 01-1.8-.8h-.1l-.1-.1-.6-.4s1 1.8 4 2.7l-1.5 2C1.9 20.4 0 17.1 0 17.1 0 9.8 3.3 3.7 3.3 3.7c3.2-2.4 6.2-2.4 6.5-2.4zm-.6 8.6c-1.3 0-2.4 1.2-2.4 2.6 0 1.4 1 2.5 2.4 2.5 1.3 0 2.3-1.1 2.3-2.5s-1-2.6-2.3-2.6zm8.4 0c-1.3 0-2.3 1.2-2.3 2.6 0 1.4 1 2.5 2.3 2.5C19 15 20 14 20 12.5s-1-2.6-2.4-2.6z" fill="#8C8C8C"></path>
        </svg>
     </a>
  </div>
  <div class="item">
     <a href="https://t.me/phalaminer" target="_blank">
        <svg width="25" height="21" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M9.35464 19.5529L9.73964 13.7367L20.2996 4.22167C20.7671 3.79542 20.2034 3.58917 19.5846 3.96042L6.54964 12.1967L0.912142 10.4092C-0.297858 10.0654 -0.311608 9.22667 1.18714 8.62167L23.1459 0.151666C24.1496 -0.302084 25.1121 0.399166 24.7271 1.93917L20.9871 19.5529C20.7259 20.8042 19.9696 21.1067 18.9246 20.5292L13.2321 16.3217L10.4959 18.9754C10.1796 19.2917 9.91839 19.5529 9.35464 19.5529Z" fill="#8C8C8C"></path>
        </svg>
     </a>
  </div>
  <div class="item">
     <a href="https://forum.phala.network/c/mai/42-category/42" target="_blank">
        <svg width="27" height="24" viewBox="0 0 27 24" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path fill-rule="evenodd" clip-rule="evenodd" d="M25.7165 18.488C25.1981 18.488 24.779 18.0689 24.779 17.5505C24.779 16.8202 23.4328 15.2574 20.9662 14.9967C20.489 14.947 20.1262 14.5449 20.1262 14.0649V11.9611C20.1262 11.6405 20.2903 11.3424 20.5603 11.1699C22.4915 9.94079 22.8965 7.66454 22.8965 5.97235C22.8965 2.84485 19.9575 2.6011 19.0565 2.6011C18.5381 2.6011 18.119 2.1811 18.119 1.6636C18.119 1.1461 18.5381 0.726105 19.0565 0.726105C21.6928 0.726105 24.7715 2.09954 24.7715 5.97235C24.7715 8.85142 23.8153 11.078 22.0012 12.4505V13.2652C24.8175 13.8642 26.654 15.8583 26.654 17.5495C26.654 18.0689 26.235 18.488 25.7165 18.488ZM13.3275 23.2739C11.2818 23.2739 5.0587 23.2739 5.0587 19.2024C5.0587 17.3058 7.7437 16.057 10.5215 15.5902C8.51245 13.9402 8.23964 11.1277 8.23964 8.80642C8.23964 5.52142 10.1746 3.55923 13.4156 3.55923H13.5778C16.8187 3.55923 18.7537 5.52048 18.7537 8.80642C18.7537 11.1277 18.4809 13.9411 16.4718 15.5902C19.2487 16.0561 21.9328 17.3049 21.9328 19.2024C21.9337 21.9042 19.0378 23.2739 13.3275 23.2739ZM0.426514 17.5505C0.426514 18.0689 0.846514 18.488 1.36401 18.488C1.88151 18.488 2.30151 18.0689 2.30151 17.5514C2.30151 16.8202 3.64683 15.2574 6.11433 14.9977C6.59245 14.948 6.95433 14.5458 6.95433 14.0658V11.962C6.95433 11.6414 6.79026 11.3433 6.52026 11.1708C4.58901 9.94173 4.18401 7.66548 4.18401 5.97329C4.18401 2.84485 7.12308 2.60204 8.02401 2.60204C8.54151 2.60204 8.96151 2.18204 8.96151 1.66454C8.96151 1.14704 8.54151 0.727042 8.02401 0.727042C5.38776 0.727042 2.30901 2.10142 2.30901 5.97329C2.30901 8.85236 3.26433 11.0789 5.07933 12.4514V13.2661C2.26308 13.8642 0.426514 15.8583 0.426514 17.5505Z" fill="#8C8C8C"></path>
        </svg>
     </a>
  </div>
  <div class="item">
     <a href="https://github.com/Phala-Network/solo-mining-scripts" target="_blank">
        <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M23.43 11.88C23.4521 14.3236 22.6757 16.7077 21.219 18.6698C19.8159 20.6299 17.8249 22.092 15.5347 22.8443C15.3307 22.9011 15.1119 22.8616 14.9407 22.737C14.817 22.6194 14.7507 22.4537 14.7592 22.2833V19.1153C14.8259 18.3223 14.5391 17.5403 13.9755 16.9785C14.4927 16.9278 15.0056 16.8396 15.51 16.7145C16.0051 16.5817 16.4797 16.3818 16.9207 16.1205C17.3828 15.8685 17.794 15.5328 18.1335 15.1305C18.5063 14.6595 18.7862 14.122 18.9585 13.5465C19.1774 12.8105 19.2831 12.0455 19.272 11.2778C19.2977 10.1289 18.8676 9.01665 18.0757 8.184C18.4479 7.18651 18.4063 6.08169 17.9602 5.115C17.5487 5.03997 17.124 5.09775 16.7475 5.28C16.2648 5.45357 15.8005 5.67466 15.3615 5.94L14.7922 6.29475C12.9034 5.76673 10.906 5.76673 9.01723 6.29475C8.85223 6.17925 8.64598 6.0555 8.38198 5.8905C7.97102 5.65096 7.54048 5.44672 7.09498 5.28C6.69553 5.07717 6.24242 5.00502 5.79973 5.07375C5.35491 6.04992 5.31632 7.16287 5.69248 8.1675C4.91161 9.01313 4.4862 10.1269 4.50448 11.2778C4.49272 12.0401 4.59846 12.7998 4.81798 13.53C4.99699 14.1027 5.27634 14.639 5.64298 15.114C5.9749 15.5282 6.38749 15.8706 6.85573 16.1205C7.30251 16.3702 7.77567 16.5694 8.26648 16.7145C8.77358 16.8401 9.28921 16.9284 9.80923 16.9785C9.37742 17.3851 9.11269 17.9381 9.06673 18.5295C8.84969 18.6328 8.61917 18.705 8.38198 18.744C8.11 18.7952 7.83372 18.82 7.55698 18.8183C7.17796 18.8207 6.80805 18.7022 6.50098 18.48C6.15906 18.2322 5.87713 17.9108 5.67598 17.5395C5.49392 17.2285 5.24615 16.961 4.94998 16.7558C4.72927 16.5863 4.47678 16.4628 4.20748 16.3928H3.91048C3.76173 16.3841 3.61281 16.4066 3.47323 16.4588C3.39073 16.5083 3.36598 16.566 3.39898 16.632C3.43803 16.7057 3.48507 16.7748 3.53923 16.8383C3.59899 16.9077 3.66529 16.9713 3.73723 17.028L3.84448 17.094C4.10341 17.2333 4.32869 17.4276 4.50448 17.6633C4.68861 17.8982 4.84631 18.1528 4.97473 18.4223L5.12323 18.7688C5.24028 19.1409 5.47112 19.467 5.78323 19.701C6.0801 19.9162 6.42106 20.0627 6.78148 20.13C7.12335 20.2016 7.47171 20.2375 7.82098 20.2373C8.09714 20.2423 8.37321 20.223 8.64598 20.1795L8.99248 20.1218V22.2833C8.99566 22.4561 8.92337 22.6218 8.79448 22.737C8.61978 22.8608 8.39893 22.9001 8.19223 22.8443C5.90917 22.0824 3.92918 20.6111 2.54098 18.645C1.07673 16.6962 0.299242 14.3174 0.329979 11.88C0.317931 9.85051 0.853767 7.85538 1.88098 6.105C2.88982 4.34759 4.34757 2.88985 6.10498 1.881C7.85535 0.85379 9.85049 0.317954 11.88 0.330002C13.9095 0.317954 15.9046 0.85379 17.655 1.881C19.4124 2.88985 20.8701 4.34759 21.879 6.105C22.907 7.85506 23.4428 9.85041 23.43 11.88Z" fill="#8C8C8C"></path>
        </svg>
     </a>
  </div>
</div>
