---
title: "Light Validation Client"
weight: 10005
draft: true
menu:
  docs:
    parent: "pDiem"
---

## The Basics

A minimal cross-chain bridge can transfer assets between the two blockchains. In the reservation-based model, it requires that the local blockchain can confirm some deposit to its sovereign accounts, and the remote blockchain can confirm the withdraw commands from the local blockchain. The validation of the blockchain is done by full nodes, but they are too heavy to fit into a smart contract or blockchain, in terms of the computation and the storage. Instead, the validation is is usually done by a _light client_.

A light client is a mini client that can verify some claims on a blockchain, but doesn't require a full sync and validation of the blockchain history. On PoW blockchains, the validation can be done by SPV clients. On PoS blockchains, it can be done with light validation clients. The clients are designed to work with the corresponding consensus algorithm.

The pDiem bridge has a Diem light client to validate the incoming deposit transactions. However it doesn't require a light client on the remote side, because it can act as a Diem wallet and sign ordinary transactions to withdraw the assets.

## Light Client

A blockchain runs by reaching consensus between the peers in the network. A typical consensus system manages the ordering and the finalization of the transactions from the users. When a transaction is finalized, its existence and behavior is finalized and protected from being changed. Therefore a light client validates the finalization of a transaction.

> A typical pattern is to group the transactions by blocks. So we also say a block is finalized, instead of saying a transaction is finalized. However this is not always the case, and Diem is an example.

Transactions are finalized because they receive enough votes. The voting power can vary on different consensys system. On PoS blockchain with [BFT-family](https://en.wikipedia.org/wiki/Byzantine_fault) consensus algorithm, a block is finalized if it can get more than 2/3 of the signatures by the validators. To validate the finalization of a blockchain, we validate the signature against the public key of the validators.

A light client itself can only validate the inclusion of a certain block on a blockchain. To validate some other claims, e.g. the existence of a transaction or an output by a smart contract invocation, it relies on some special digests in the block headers. A common practise is to include a transaction merkle root, and a state merkle root in the block header. In this way, as long as the block header is validated by a light client, and there's a valid merkle proof from the claim to the merkle root, we can be convinced the the claim is a truth.

## The Diem Blockchain

The Diem blockchain runs a typical BFT-family consensus system. Diem validators are responsibe to produce and finalize blocks, and timestamp the transactions. Although blocks are actually produced and used in the consensus process, a notable difference is that the system only expose the transactions rather than the blocks.

On Diem, each transaction mutats the blockchain states, and creates a new view of the blockchain, called [the state of the ledger](https://developers.diem.com/docs/core/diem-protocol#transactions-and-states). The blockchain database is versioned. At each version of the ledger state, it also produces the metadata including the merkle root of the full historical transactions and storage state, for the same purpose as the block header.

The information of the ledger state at each version is stored in a `LedgerInfo` and get signed by the validators. `LedgerInfo` can be verified with the public key of the validator set. Once a `LedgerInfo` is considered valid, the metadata it contains can be used to further validate various claims at the current blockchain states, or some historical states, including:

- transactions
- logs (the events emitted by a transaction)
- storage (some data stored in the Account Resources)

See also: [Diem blockchain storage hierarchy](https://github.com/diem/diem/tree/master/storage)
