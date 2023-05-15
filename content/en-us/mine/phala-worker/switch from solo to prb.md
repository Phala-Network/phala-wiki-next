---
title: "Switch workers from Solo to PRB mode"
weight: 1050
menu:
  mine:
    parent: "phala-worker"
---

Solo workers need to run node, pherry, and pRuntime simultaneously. If you want to switch your worker to PRB mode, you need to perform three steps:

1. Set up at least one PRB Server, details:
2. Disable the Node and pherry in the Solo miner, leaving only pRuntime running
3. Add the Worker to the PRB UI, details:

If you are using the docker compose content under this Wiki:
The command to disable Node and pherry is as follows:
```
sudo docker container rm -f node
sudo docker container rm -f phala-pherry
```
> If you have customized the docker compose content, please use `sudo docker container ps` to query the running service names and replace `node` and `phala-pherry` in the above commands.