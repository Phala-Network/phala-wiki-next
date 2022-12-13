---
title: "Use Cases"
weight: 1003
menu:
  build:
    parent: "phat-general"
---

The Phat Contract is designed for the following use cases:

- Low latency services like GameFi or Metaverse backends
  - Run Decentraland game server in Phala workers with little changes ([catalyst](https://github.com/Phala-Network/catalyst/tree/sgx-shielded) and [catalyst-owner](https://github.com/Phala-Network/catalyst-owner/tree/sgx-shielded))
- Compute-intensive applications like NFT rendering, machine learning and big data analytics
  - See [demo video](https://www.youtube.com/watch?v=corp9wMlkfI&t=1s) of running unmodified [Blender](https://www.blender.org/) in Phala workers, with [source code](https://github.com/Phala-Network/blender-contract)
- Privacy-preserving scenarios like decentralized exchange and others where privacy matters
  - Check our design and implementation of [secret NFT](https://github.com/tenheadedlion/phat-nft) with Phat Contract
![](/images/build/usecase-secret-nft.png)
- Composable applications including Oracle, bots and other applications involving one or more Web2/Web3 services
  - See [demo video](https://www.youtube.com/watch?v=THeM8E-3lec) of using Phat Contract to read other chains' states through indexing services
  - Follow our [Oracle workshop](https://github.com/Phala-Network/phat-offchain-rollup/tree/sub0-workshop/phat) and build the full-functional Oracle for any EVM-compatible chains ([Demo video](https://drive.google.com/file/d/1Hg9HFEBbCiXGiyQZPKPd1Zs1BiJtP7kg/view) for BSC)
