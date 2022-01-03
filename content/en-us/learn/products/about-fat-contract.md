---
title: About Fat Contract
weight: 10001
draft: false
menu:
  learn:
    parent: "products"
---

## The Next Generation Smart Contract

The smart contracts introduced by Ethereum blockchain are really an innovation to extend the capability of blockchain. First, all the rules are defined and enforced with unchangeable code and irreversible transactions. Correspondingly, we have seen its wide adoption in decentralized finance, where trust is valuable. However, despite the success in trust-needed financial cases, developers' perspective, the current smart contract platforms are closed: you cannot easily access the data and services out of them. Such a problem even requires creating some ad-hoc [Oracle](https://en.wikipedia.org/wiki/Blockchain_oracle) blockchains to solve! Let alone the platitudes to improve the performance of existing blockchains.

Phala is committed to providing a universal decentralized computing network that can be freely combined with decentralized smart contracts, storage protocols, and data indexing services. What we have achieved is a trustless cloud of more than 20,000 workers. These computing nodes are organized under a framework that enables the decoupling of execution and consensus: Unlike existing platforms where a single miner executes all the contracts during the block production process (with other miners doing duplicated execution for validation), Phala enforces the faithful execution in each worker without (or only with a small factor of) duplication; thus its computing power increases linearly to the number of workers. We believe this is the prerequisite towards a decentralized computing cloud with the power to carry the Web3 world.


![](https://i.imgur.com/3p6M1DQ.png)

Phala was well-known as the confidential blockchain by combining TEE and blockchain, and this can easily make people ignore the real value of our design: To move the computation off-chain removes the limitations on the current smart contract, leading to the powerful *Fat Contract* with rich features:

- Support computation-intensive tasks. For the first time, even a single contract can fully utilize the computing power of a worker, needless to worry about blocking the whole blockchain. For example, the requirements for image/video rendering are boosted with the popularity of the NFT and Metaverse, while the rendering jobs are CPU-intensive and expensive. By leveraging the [Gramine Project](https://github.com/gramineproject/gramine), we have finished the proof-of-concept to run the unmodified open-source renderer [Blender](https://www.blender.org/) in our workers. With concurrent programming, it is possible to combine the power of multiple workers and serve the heavy jobs;
- Serve low-latency real-time computation. The response time for Metaverse and game interaction should not exceed one second. However, traditional blockchain smart contracts cannot meet the requirement of low-latency services (since they are executed at block intervals). Fat Contract can achieve millisecond-level read and write responses, making it a perfect choice to deploy Metaverse and game services;
- Access Internet services. The off-chain secure workers can safely delegate complicated asynchronous requests for Fat Contract. In our hackathon, we have presented a [demo bot](https://github.com/Phala-Network/phala-blockchain/tree/encode-hackathon-2021) of BTC price. You can send an HTTP request to query the BTC price from the existing web service, and then report it to your Telegram account through the corresponding HTTP API. All these operations are achieved within 100 LoC in the Fat Contract.

Most importantly, such powerful Fat Contracts are executed inside our *secure workers*, which cannot peek at the customers' data or manipulate the execution to provide false results, so the beloved confidentiality and irreversibility are still promised during contract execution. For now, we rely on the trusted execution environment (TEE), specifically Intel® SGX, as the secure workers, and this design can support other workers like AMD SEV, or even [MPC](https://en.wikipedia.org/wiki/Secure_multi-party_computation)- or [ZKP](https://en.wikipedia.org/wiki/Zero-knowledge_proof)-based solutions.

Back to our starting question, we try to jump out of the stereotype of the current smart contract and rethink how the contract should be like in a real computing cloud. This is the motivation that we design and implement Fat Contract: it should first behave like a normal program instead of a smart contract, and then we will empower it with the decentralized and trustless nature of blockchain. We call it "fat" to show the rich features it can provide compared with the existing smart contracts. To clarify again:

> Fat Contract is a kind of decentralized program instead of the smart contract, which supports real-time computation-intensive tasks and have the access to all the services even they are out of the blockchains.