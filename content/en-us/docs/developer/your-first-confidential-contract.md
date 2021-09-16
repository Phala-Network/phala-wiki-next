---
title: "1.2 Hello World: your first confidential contract"
menu:
  docs:
    parent: "developer"
---

> Basic understanding of Rust language programming and smart contract development knowledge is necessary to follow this tutorial.

## Overview

In this tutorial, we are going to continue on the development environment we have set up in the previous chapter, and explore how a confidential smart contract is made. By the end of this tutorial, you will:

- Learn how to develop a confidential contract
- Interact with the contract from the Web UI
- Build your own confidential contract

For a high-level overview of Phala Network, please check the previous chapters.

## Environment and Build

Please set up a development environment by following the previous chapter [Run a Local Development Network](Run-a-Local-Development-Network). Make sure you are at the `helloworld` branch on both `phala-blockchain` and `apps-ng` repo.

## Walk-through

### Contract

The HelloWorld contract commit is available at [here](https://github.com/Phala-Network/phala-blockchain/commit/b9c576702ec1b9f0ee4a274b5d7aecc30e40fcb4).

HelloWorld contract stores a counter which can be incremented by anyone, but only authorized user can read it. The typical model of the confidential contracts in Phala Network is consisted of the following three components which we will discuss in detail.

- States
- Commands
- Queries

The **States** of a contract is described by certain variables. In this case, we define a 32-bit unsigned variable as the counter, while you are free to use variables of any types in your contracts.

```rust
pub struct HelloWorld {
    counter: u32,
}
```

There are two kinds of operations which can be used to interact with confidential contracts: **Commands** and **Queries**. The most significant difference between them is whether or not they change the states of the contracts, and we explain them separately.

The **Commands** are supposed to change the states of contracts. They are also called **Transactions**, and they are just like the transactions on traditional smart contract blockchains like Ethereum: they must be sent to the blockchain first before their executions. In our HelloWorld contract, we define a `Increment` command which changes the value of counter.

```rust
pub enum Command {
    /// Increments the counter in the contract by some number
    Increment {
        value: u32,
    },
}
```

> It is worth noting that you can define more than one commands for a contract. For example, we can add a `Decrement` command to decrease the counter as follow.
>
> ```rust
> pub enum Command {
>     /// Increments the counter in the contract by some number
>     Increment {
>         value: u32,
>     },
>     /// Decrements the counter in the contract by some number
>     Decrement {
>         value: u32,
>     },
> }
> ```

All the commands are processed by the `handle_command` method which must be implemented. In this case, we allow any user to use this command, so we just increase the counter without checking the `_origin`.

```rust
fn handle_command(&mut self, _origin: &chain::AccountId, _txref: &TxRef, cmd: Command) -> TransactionStatus {
    match cmd {
        // Handle the `Increment` command with one parameter
        Command::Increment { value } => {
            // Simply increment the counter by some value.
            self.counter += value;
            // Returns TransactionStatus::Ok to indicate a successful transaction
            TransactionStatus::Ok
        },
    }
}
```

Opposed to commands, **Queries** shall not change the states of contacts. Queries are one of the innovations of Phala Network. They are designed to allow a quick examination of the states of contracts. To define a query, you need to define both the `Request` and the according `Response`.

```rust
pub enum Request {
    /// Ask for the value of the counter
    GetCount,
}

/// Query responses.
pub enum Response {
    /// Returns the value of the counter
    GetCount {
        count: u32,
    },
    /// Something wrong happened
    Error(Error)
}
```

`handle_query` method is supposed to handle all the queries. Unlike commands, Queries go directly to the contracts without the necessity to be sent to the blockchain. In confidential contracts queries are usually required to be signed to indicate the identities of the requesters. Therefore queries can be responded conditionally, which gives the developer great flexible control over the data in confidential contracts. The identity of the requester can be accessed from `origin`, the second argument of `handle_query`.

We are going to cover more about `origin` later in this tutorial, but it also supports anonymous queries where `origin` is `None` as shown below. The `GetCount` query simply returns the current value of the counter.

```rust
fn handle_query(&mut self, _origin: Option<&chain::AccountId>, req: Request) -> Response {
    let inner = || -> Result<Response, Error> {
        match req {
            // Handle the `GetCount` request.
            Request::GetCount => {
                // Respond with the counter in the contract states.
                Ok(Response::GetCount { count: self.counter })
            },
        }
    };
    match inner() {
        Err(error) => Response::Error(error),
        Ok(resp) => resp
    }
}
```

> Unlike Ethereum, queries in confidential contracts are capable to carry arbitrary computation. So we recommend to introduce an authority check here to avoid potential Denial-of-Service attack with a huge amount of query requests.

### Frontend

- Web UI commit: <https://github.com/Phala-Network/apps-ng/commit/4a806c8e49edb8f12bd5ed54d1700edf81a6af56>

Interact with the contract: how to send command and queries.

## Implement a secret notebook

After a general understanding of the model of confidential contracts, let's make something practical and implement a contract which can store the secret note of each visitor. In this contract, we allow any user to store one note, and only the user himself is allowed to read his note.

> The SecretNote contract commit is available at <https://github.com/Phala-Network/phala-blockchain/commit/d91f94c9ed21290b7353991899f7a6da18cfab61> **(CHANGE THIS)**. We thank [Laurent](https://github.com/LaurentTrk) for his implementation of this contract.

### Contract

We use a map to store the users with their notes, and provide two interface `SetNote` and `GetNote` for them to operate their notes. We frist define the contract state structure `struct SecretNote`, with a map `notes` to store a mapping from the account to the notes. In Phala contracts, an account can be represented by an `AccountIdWrapper`.

```rust
pub struct SecretNote {
    notes: BTreeMap<AccountIdWrapper, String>,
}
```

> In Rust's std collection library, there are two map implementations: `HashMap` and `BTreeMap`. Since our `AccountIdWrapper` does not derive `Hash` needed by `HashMap`, we use `BTreeMap` to store the mapping between user accounts and their notes.

Here we recall the difference between commands and queries. In SecretNote, `SetNote` changes the states, so it is a command, and `GetNote` is a query. For each user, we only keep the latest note. So in `SetNote`, we call the `insert` to add a note if no previous one exists or directly overwrite the existing one.

```rust
pub enum Command {
    /// Set the note for current user
    SetNote {
        note: String,
    },
}

impl contracts::Contract<Command, Request, Response> for SecretNote {
    fn handle_command(&mut self, origin: &chain::AccountId, _txref: &TxRef, cmd: Command) -> TransactionStatus {
        match cmd {
            // Handle the `SetNote` command with one parameter
            Command::SetNote { note } => {
                // Simply increment the counter by some value
                let current_user = AccountIdWrapper(origin.clone());
                // Insert the note, we only keep the latest note
                self.notes.insert(current_user, note);
                // Returns TransactionStatus::Ok to indicate a successful transaction
                TransactionStatus::Ok
            },
        }
    }
}
```

Now we can move to the `GetNote` handler. It's a little tricky since we only allow the owner of the note to access his note. In other words, we need to ensure that the user has signed the query, and then we respond with his note. For a signed query, the `origin` argument in `handle_query` method contains the account id of requester.

We implement `handle_query` as shown below. It first checks if the query is signed by checking `origin`, and then returns the note stored in the contract states. It returns an `NotAuthorized` response if the query is not signed.

```rust
/// Queries are not supposed to write to the contract states.
#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum Request {
    /// Read the note for current user
    GetNote,
}

/// Query responses.
#[derive(Serialize, Deserialize, Debug)]
pub enum Response {
    /// Return the note for current user
    GetNote {
        note: String,
    },
    /// Something wrong happened
    Error(Error)
}

impl contracts::Contract<Command, Request, Response> for SecretNote {

    fn handle_query(&mut self, origin: Option<&chain::AccountId>, req: Request) -> Response {
        let inner = || -> Result<Response, Error> {
            match req {
                // Handle the `GetNote` request
                Request::GetNote => {
                    // Unwrap the current user account
                    if let Some(account) = origin {
                        let current_user = AccountIdWrapper(account.clone());
                        if self.notes.contains_key(&current_user) {
                            // Respond with the note in the notes
                            let note = self.notes.get(&current_user);
                            return Ok(Response::GetNote { note: note.unwrap().clone() })
                        }
                    }

                    // Respond NotAuthorized when no account is specified
                    Err(Error::NotAuthorized)
                },
            }
        };
        match inner() {
            Err(error) => Response::Error(error),
            Ok(resp) => resp
        }
    }
}
```

### Frontend

1. Set note UI
2. Query UI
3. Handle error

## Put everything together

```rust
use serde::{Serialize, Deserialize};

use crate::contracts;
use crate::types::TxRef;
use crate::TransactionStatus;
use crate::contracts::AccountIdWrapper;

use crate::std::collections::BTreeMap;
use crate::std::string::String;

/// SecretNote contract states.
#[derive(Serialize, Deserialize, Debug, Default)]
pub struct SecretNote {
    notes: BTreeMap<AccountIdWrapper, String>,
}

/// The commands that the contract accepts from the blockchain. Also called transactions.
/// Commands are supposed to update the states of the contract.
#[derive(Serialize, Deserialize, Debug)]
pub enum Command {
    /// Set the note for current user
    SetNote {
        note: String,
    },
}

/// The errors that the contract could throw for some queries
#[derive(Serialize, Deserialize, Debug)]
pub enum Error {
    NotAuthorized,
}

/// Query requests. The end users can only query the contract states by sending requests.
/// Queries are not supposed to write to the contract states.
#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum Request {
    /// Read the note for current user
    GetNote,
}

/// Query responses.
#[derive(Serialize, Deserialize, Debug)]
pub enum Response {
    /// Return the note for current user
    GetNote {
        note: String,
    },
    /// Something wrong happened
    Error(Error)
}


impl SecretNote {
    /// Initializes the contract
    pub fn new() -> Self {
        Default::default()
    }
}

impl contracts::Contract<Command, Request, Response> for SecretNote {
    // Returns the contract id
    fn id(&self) -> contracts::ContractId { contracts::SECRET_NOTE }

    // Handles the commands from transactions on the blockchain. This method doesn't respond.
    fn handle_command(&mut self, origin: &chain::AccountId, _txref: &TxRef, cmd: Command) -> TransactionStatus {
        match cmd {
            // Handle the `SetNote` command with one parameter
            Command::SetNote { note } => {
                // Simply increment the counter by some value
                let current_user = AccountIdWrapper(origin.clone());
                // Insert the note, we only keep the latest note
                self.notes.insert(current_user, note);
                // Returns TransactionStatus::Ok to indicate a successful transaction
                TransactionStatus::Ok
            },
        }
    }

    // Handles a direct query and responds to the query. It shouldn't modify the contract states.
    fn handle_query(&mut self, origin: Option<&chain::AccountId>, req: Request) -> Response {
        let inner = || -> Result<Response, Error> {
            match req {
                // Handle the `GetNote` request
                Request::GetNote => {
                    // Unwrap the current user account
                    if let Some(account) = origin {
                        let current_user = AccountIdWrapper(account.clone());
                        if self.notes.contains_key(&current_user) {
                            // Respond with the note in the notes
                            let note = self.notes.get(&current_user);
                            return Ok(Response::GetNote { note: note.unwrap().clone() })
                        }
                    }

                    // Respond NotAuthorized when no account is specified
                    Err(Error::NotAuthorized)
                },
            }
        };
        match inner() {
            Err(error) => Response::Error(error),
            Ok(resp) => resp
        }
    }
}
```

## Summary

In this tutorial, we have covered a walk-through for the `HelloWorld` contract template, and demostrate how we can build a bit more advanced contract `SecretNote` that leverages the confidentiality of Phala contract. Now it's your turn to build something new!

### Submit your work

This tutorial is a part of [Polkadot "Hello World" virtual hackathon challenge](https://gitcoin.co/hackathon/polkadot/onboard) at gitcoin.co. In order to win the task, please do the followings:

1. Fork [the core blockchain](https://github.com/Phala-Network/phala-blockchain/tree/helloworld) and [the Web UI](https://github.com/Phala-Network/apps-ng/tree/helloworld) repo (helloworld branch) into your own GitHub account
2. Develop your own contract on the templates at “helloworld” branch (must be a different one from existing submissions)
3. Launch your full development stack and take screenshots of your dapps
4. Push your work to your forked repos. They must be open source
5. Make a tweet with the link to your repos, the screenshots, and describe what you are building on Twitter
6. Join our [Discord server](https://discord.gg/zQKNGv4) and submit the the link to your tweet
