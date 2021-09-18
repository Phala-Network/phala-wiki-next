---
title: "Advanced: Hardware Mode"
weight: 8
draft: false
menu:
  docs:
    parent: "pDiem"
---

By default, the demo is built with SGX SDK software mode. It's designed for development environment. However, to protect the data and logic inside the Enclave, it must run in hardware mode.

{{< tip >}}
Intel SGX SDK comes with three modes:

- **Software**: it runs in the simulation environment, and offers no protection to the code or data
- **Hardware Dev**: it runs in the real hardware environment, but allows debuggers to attach to it and thus no protection as well
- **Hardware Prod**: it runs in the real hardware environment and disallows debugger to attach, but has to be signed with production certificates

To run SGX programs in the hardware mode, you need to install the SGX driver first.
{{< /tip >}}

In `pdiem-m3` branch, in addition to the default software mode, we also offer hardware mode build. In this case, you should specify the correct docker-compose file:

- `docker-compose.hw.ias.yml`: HW dev mode running with the [IAS Driver](https://01.org/intel-softwareguard-extensions/downloads/intel-sgx-linux-2.13-release)
- `docker-compose.hw.dcap.yml`: HW dev mode running with the [DCAP Driver](https://01.org/intel-softwareguard-extensions/downloads/intel-sgx-dcap-1.10-release)

`IAS` and `DCAP` are the two different SGX driver. Please choose the docker-compose file that matches your platform. Then, you can specify the config files when running any docker-compose command by `-f`.

For example, run the following command to build the image for the IAS Driver:

```bash
docker-compose -f docker-compose.hw.ias.yml build
```

There are also HW version of `phala-console.sh`, which should be used according to your platform:

- `phala-console.hw.ias.sh`
- `phala-console.hw.dcap.sh`

{{< tip >}}
Some platforms support the both drivers, but the others only support one of them. You can always try one of them, and switch to another if it doesn't work. Make sure to uninstall the current driver before another installation because they conflict with each other.

The IAS driver creates a device at `/dev/isgx`, while the DCAP driver creates two devices under `/dev/sgx` directory. You can check which one is installed in your system by this trick.
{{< /tip >}}
