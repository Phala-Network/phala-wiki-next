---
title: "Deploy Local Testnet"
weight: 10002
draft: true
menu:
  docs:
    parent: "pDiem"
---

There are two options to run the pdiem demo:

1. Use our Docker Compose file
2. Build from the source and run it directly

This guide will only cover the Docker Compose approach because it handles everything automatically for you. It installs the dependencies, builds the code, starts the network with the components connected correctly, and start them.

{{< tip >}} In the development environment we build the code natively. The pro users who want to hack on our code can look into the Dockerfiles and docker-compose file to learn how the system is configured. If you need any help, don't hesitate to ask in our Discord #dev group. {{< /tip >}}

## Prepare

Requirements to run the demo:

1. A Linux computer with Docker and Docker Compose installed
   - [Docker installation guide](https://docs.docker.com/engine/install/)
   - [Docker Compose installation guide](https://docs.docker.com/compose/install/)
2. 50G free disk space (SSD is preferred because the compilation takes longer on HDDs)
3. A powerful CPU

Maker sure the `docker` and `docker-compose` commands are available for your user:

```bash
docker --version
# > Docker version 20.10.5, build 55c4c88
docker-compose --version
# > docker-compose version 1.28.5, build c4eb3a1f
```

To start the full stack, first clone the phala-docker repo on `pdiem-m3` branch.

```bash
git clone -b pdiem-m3 https://github.com/Phala-Network/phala-docker.git
```

Cd to the repo, build the docker images.

```bash
docker-compose build
```

{{< tip >}} It may take up to 1-2 hours to build 5 separate projects. A powerful CPU can build it in around 30 mins. {{< /tip >}}

To **start** the pdiem full stack:

```bash
docker-compose up
```

To **stop** the pdiem full stack (and remove diem blockchain history):

```bash
docker-compose down --volume
```

To check the service states:

```bash
docker-compose ps
```

{{< tip >}}
Tips:

- The state of `diem-cli` should be "Exit 0" because we will start it manually on demand.
- Don't keep it running for a long time. Diem writes ~1MB/s to the disk.
- `pdiem-m3` also supports [SGX Hardware mode]({{< relref "docs/pdiem/hardware-mode" >}})
  {{< /tip >}}
