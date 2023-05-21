---
title: "Requirements in Phala/Khala"
weight: 1003
draft: false
menu:
  mine:
    parent: "mine-solo"
---

## Basic Requirements

Whether in Phala or Khala, the following requirements for workers are the same.

### SGX Function

Running a worker requires SGX-capable CPU. Please choose a device that supports SGX and enable SGX in the BIOS.
For more information, refer to:

### Stable network

The network of the worker should be as stable as possible with more than 1GB bandwidth. And it's best to have a public IP address.

### OS Requirements

We strongly recommend that you use Ubuntu 22.04.2 LTS, download link: https://ubuntu.com/download/server

> The desktop version of the OS is less stable than Server version, so we strongly recommend using the server version.

And please make sure that the kernel version is 5.13 or above.

## Device hardware specifications

There are 2 forms of worker operation, including solo-worker operation and batchs of worker management which is called PRB. The requirements of them are different. 

The following describes the device requirements for a solo-worker, and different network requirements also vary.

### For Phala workers

|Types|Requirements|
|:----------:|:----------:|
|RAM Space|8 GB+|
|Harddisk Space|2 TB+|
|Cores|4 Cores+|

> If you have a batch of workers that need to run on Phala, please visit [here]() for more information.

### For Khala workers

|Types|Requirements|
|:----------:|:----------:|
|RAM Space|8 GB+|
|Harddisk Space|4 TB+|
|Cores|4 Cores+|

> If you have a batch of workers that need to run on Khala, please visit [here]() for more information.
