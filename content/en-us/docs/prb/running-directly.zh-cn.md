---
title: "在Linux中直接部署"
weight: 3
---

由于无论是在开发环境还是生产环境中使用Docker部署都会更加方便，因此我们不建议直接在Linux中直接部署`prb`。

## 系统要求

- git
- Redis 5 or newer
- Node.js 14 (Latest LTS)
- pnpm

## 安装依赖并生成Protobuf接口代码

```bash
git submodule init
git submodule update
pnpm install
pnpm proto:build # use `pnpm proto:darwin:build` in macOS
pnpm proto:build_prpc # use `pnpm proto:darwin:build_prpc` in macOS
```

## 启动服务

使用`pnpm start_module`来启动prb进程, 所有参数都将从当前Shell中的环境变量读取。

```bash
PHALA_MODULE=fetch # module to start
NODE_ENV=development
PHALA_DB_HOST=io # hostname/ip to io service
PHALA_DB_PORT_BASE=9000
PHALA_LOGGER_LEVEL=debug
PHALA_PARENT_CHAIN_ENDPOINT=ws://127.0.0.0:9945 # parent chain substrate websocket endpoint
PHALA_CHAIN_ENDPOINT=ws://127.0.0.0:9945 # parachain substrate websocket endpoint
PHALA_REDIS_ENDPOINT=redis://127.0.0.1:6379 # redis endpoint for mq and rpc

# for `io`
PHALA_DB_PREFIX=/var/data # path to data directory
PHALA_DB_TYPE=rocksdb # rocksdb or leveldb
```
