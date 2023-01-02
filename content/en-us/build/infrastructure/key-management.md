---
title: "Secret Key Hierarchy"
weight: 6004
menu:
  build:
    parent: "infra"
---

## Key Hierarchy Management

The world's first key hierarchy for blockchain-TEE hybrid system was proposed by the [Ekiden [paper](https://ieeexplore.ieee.org/document/8806762) in 2019 and serves as the basis for the Oasis project. As a compute cloud, Phala improves this design to make it viable for a network of ~100k nodes. We also introduce novel mechanisms like key rotation to further improve the robustness of the cloud.

Before we really dig into the details of our contract key management, it's important for readers to know that every entity in our system has its own identity key. Every user has their account, and every worker and gatekeeper (which are elected by the workers) has its own sr25519 WorkerKey pair, which is generated inside pRuntime (so also in SGX) and the private key never leaves the SGX. The identity key is used to:

- Identify an entity's message with signing;
- Establish an encrypted communication channel between users, workers, and gatekeepers with ECDH key agreement. **By default, any communication between any entities is encrypted in Phala**.

![](https://miro.medium.com/max/4800/0*Kncy1jrLZ6ZiLltq)

MasterKey is the root of trust for the whole network. All the contract-related keys, including ClusterKey and ContractKey, are derived from MasterKey. MasterKey is generated and shared by all the gatekeepers (through the encrypted communication channel mentioned above), making the security of MasterKey totally dependent on the security of gatekeepers. This is why gatekeepers are distinguished from other workers in that:

- Gatekeepers are workers of top confidence level: they are immune to all known SGX vulnerabilities;
- Unlike normal workers, the endpoints of gatekeepers are not public and you cannot deploy contracts to them. This reduces remote access to gatekeepers;
- Increased staking amounts are required from gatekeepers to discourage bad behavior from their operators.

In Phala, workers are grouped into clusters to provide serverless computing services. A unique ClusterKey is generated for each cluster using the MasterKey (through [key derivation](https://en.wikipedia.org/wiki/Key_derivation_function)), but you cannot revert this process to infer the MasterKey given the ClusterKey. The ClusterKey is shared with all the workers in that cluster.

Finally, when a contract is deployed to a cluster, it's deployed to all the workers in that cluster. These workers will follow the deterministic process and derive the ClusterKey to get the same ContractKey. The ContractKeys are unique for different contracts.

> *What are the consequences if certain keys are leaked?*
>
> If a WorkerKey is leaked, the attackers can decrypt all the messages sent to it such as the ClusterKey of its cluster, which can be used to access the ContractKeys of that cluster. Attackers could even impersonate a worker to provide false results to users. Such malicious activity can be detected by comparing the results from multiple workers, and then the chain would slash the compromised worker and confiscate that worker's staked PHA;
>
> If a ContractKey is leaked, the attackers can decrypt the states and all the historical inputs of that contract;
>
> If a ClusterKey is leaked, the attackers can know the above information of all the contracts in that cluster;
>
> If the MasterKey is leaked, then all historical data is leaked.

> *What can we do if the worst case happens?*
>
> Phala has implemented the Key Rotation for gatekeepers, which means that with the permission of the Council, gatekeepers can update the MasterKey, then correspondingly the ClusterKeys and ContractKeys.
>
> So when the worst case happens, we will first register the new gatekeepers with the latest hardware, deregister all the old ones (since they are likely to be vulnerable) and switch to a new MasterKey.

## Future Security Mechanism

- Use Multi-Party Computation to manage MasterKey
  - Currently, the same MasterKey is shared across all gatekeepers, so it's leaked if any one of them is compromised. By turning this into MPC, the attackers will have to compromise a majority of the gatekeepers to access the MasterKey.
