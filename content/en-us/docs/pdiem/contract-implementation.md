---
title: "Contract Implementation"
weight: 5
draft: false
menu:
  docs:
    parent: "pDiem"
---

The pdiem contract implements a Diem light client and wallet. On the one hand, the pdiem relayers talks to the contract to sync the transactiosn between Diem side and pdiem side. On the other hand, it provides the interface for users to manage their cross-chain assets.

The pdiem contract acts as a regular Diem wallet. It holds the private keys inside its Phala Network confidential contract. So the contract can control some wallets to receive or send funds on the Diem blockchain.

## Contract storage

The [pdiem contract](https://github.com/Phala-Network/phala-blockchain/blob/master/standalone/pruntime/enclave/src/contracts/diem.rs) is implemented as a native confidential smart contract. It defines the following storage items:

```rust
pub struct Diem {
    // Light client

    /// The genesis TrustedState
    init_trusted_state: Option<TrustedState>,
    /// The latest TrustedState
    trusted_state: Option<TrustedState>,

    // Accounts

    /// Controlled accounts
    accounts: Vec<AccountInfo>,
    /// Account sequence id
    seq_number: BTreeMap<String, u64>,

    // Transactions

    /// Known transactions
    transactions: BTreeMap<String, Vec<Transaction>>,
    /// Transaction verification result
    verified: BTreeMap<String, bool>,
}
```

## Light client implementation

The Diem light client maintains the latest ledger state (`LedgerInfo`). It commits to the accumulators of the historical transactions, states, and the events. A ledger state is updated whenver the Diem blockchain database is mutated. Therefore with the latest ledger state, all the facts happened earlier can be validated.

The genesis ledger state is initialized by `Command::SetTrustedState` only at once, and is persistent and can be examed by anyone in the entire lifecycle of the bridge. The current ledger state is used to validate the signature of a newer ledger state until a validator set change (e.g. via an on-chain election). When there's a validator set change, the last ledger state in the same epoch can be validated, and the newly elected validator set can be extracted from the blockchain storage it commits to. This is handled by `verify_trusted_state()`.

There's no specific command to update the ledger state. Instead, a `LedgerInfoWithSignature` and a `EpochChangeProof` are extracted from the `TransactionWithProof` from a `Command::VerifyTransaction` call, when a relayer syncs a new transaction to pdiem. Therefore as the new transactions get synced to the pdiem contract, it always maintains the latest ledger state.

{{< tip >}}
The Diem specific serialization, the cryptographics, and the verification logics are extracted from the original Diem codebase, and ported to SGX build target by the pdiem team, located at [/diem](https://github.com/Phala-Network/phala-blockchain/tree/master/diem) directory.
{{< /tip >}}

## Receive deposit transactions

Before a user can deposit Diem assets to pdiem, a deposit address must be generated, similar to a token exchange in the real world. This is done by the pdiem contract. Any user can ask the contract to generate a deposit address. The contract will generate a new private key, save it in the contract storage, and reveal the address to the user.

{{< tip >}}
In pdiem-m3, we hard-coded the deposit address in the contract.
{{< /tip >}}

When a deposit address, a user can transfer some Diem assets to pdiem:

1. The user sends a Diem transaction to transfer some token to the deposit address
2. The pdiem relayer watches the deposit address, notices the deposit transaction, and relay it to the pdiem contract by `Command::VerifyTransaction`
3. The contract extracts the latest ledger state with proof and validates it with the previous ledger state (`verify_trusted_state()`)
4. Finally it extracts the transaction proof, and confirm the deposit if the proof can pass the validation against the latest ledger state (`verify_transaction_state_proof`)

Once a deposit is validated, we will add the received amount to the user's available balance. The accepted transactions and the balance can be queried by `Request::FreeBalance` and `Request::VerifiedTransactions`.

{{< tip "warning" >}}
The transactions are ordered by sequence or event id. The ids of the accounts are recorded in the contract to avoid missing transactions.
{{< /tip >}}

## Sign withdraw transactions

WIP: The [Pull Request](https://github.com/Phala-Network/phala-blockchain/pull/171) is getting merged.

## Assets transfer

In pdiem-m3 we didn't implement token transferring. We will leave it to the next milestone, and it will be handled by the [`Assets` confidential contracts](https://github.com/Phala-Network/phala-blockchain/blob/master/standalone/pruntime/enclave/src/contracts/assets.rs), which also implements the standard interoperable assets standard defined in XCM. In this way, the assets bridged by pdiem can be used in any parachains in the Polkadot ecosystem.

## Reference

Commands:

- `AccountData`: Sets the whitelisted accounts, in bcs encoded base64
- `SetTrustedState`: Sets the trusted state. The owner can only initialize the bridge with the genesis state once.
- `VerifyTransaction`: Verifies a deposit transactions

Queries:

- `FreeBalance`: Gets the total available balance controlled by the contract.
- `VerifiedTransactions`: Gets all the verified transactions, in hex hash string.
