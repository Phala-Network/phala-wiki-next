---
title: "Confidential Contract Examples"
draft: true
weight: 11012
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

Please set up a development environment by following the previous chapter [Run a Local Development Network]({{< relref "docs/developer/run-a-local-development-network.md" >}}). Make sure you are at the `encode-hackathon-2021` branch of the `phala-blockchain` and the `master` branch of the `js-sdk` repo.

## Walk-through of the Basic Confidential Contract

### Contract

We have glanced at the main part of the contract in the previous chapter. The complete `GuessNumber` contract is available [here](https://github.com/Phala-Network/phala-blockchain/blob/encode-hackathon-2021/crates/phactory/src/contracts/guess_number.rs).

`GuessNumber` contract stores a secret for any participants to guess, and only authorized users can read it. The typical model of the confidential contracts in Phala Network consists of the following three components which we will discuss in detail.

- States
- Commands
- Queries

The **States** of a contract is described by certain variables. In this case, we define a 32-bit unsigned variable as the secret, while you are free to use variables of any type in your contracts.

```rust
type RandomNumber = u32;

pub struct GuessNumber {
    random_number: RandomNumber,
}
```

There are two kinds of operations that can be used to interact with confidential contracts: **Commands** and **Queries**. The most significant difference between them is whether or not they can change the states of the contracts, and we explain them separately.

The **Commands** are supposed to change the states of contracts. They are also called **Transactions**, and they are just like the transactions on traditional smart contract blockchains like Ethereum: they must be sent to the blockchain first before their executions. In our `GuessNumber` contract, we define a `NextRandom` command which changes the value of the secret.

```rust
pub enum GuessNumberCommand {
    /// Refresh the random number
    NextRandom,
}
```

> It is worth noting that you can define more than one command for a contract. For example, we can add a `SetOwner` command to set the owner of the contract and enable him/her to conduct privileged operations.
>
> ```rust
> pub enum GuessNumberCommand {
>     /// Refresh the random number
>     NextRandom,
>     /// Set the contract owner
>     SetOwner { owner: AccountId },
> }
> ```

All the commands are processed by the `handle_command` method which must be implemented. In this case, we only allow the contract owner and the pre-defined root account (i.e. ALICE) to change the secret, so we check the sender identity from `origin`.

```rust
fn handle_command(&mut self, context: &mut NativeContext, origin: MessageOrigin, cmd: Command) -> TransactionResult {
    // we want to limit the sender who can use the Commands to the pre-define root account
    let sender = match &origin {
        MessageOrigin::AccountId(account) => AccountId::from(*account.as_fixed_bytes()),
        _ => return Err(TransactionError::BadOrigin),
    };
    let alice = contracts::account_id_from_hex(ALICE)
        .expect("should not failed with valid address; qed.");
    match cmd {
        Command::NextRandom => {
            if sender != alice && sender != self.owner {
                return Err(TransactionError::BadOrigin);
            }
            self.random_number = GuessNumber::gen_random_number(context);
            Ok(())
        }
    }
}
```

Opposed to commands, **Queries** shall not change the states of contacts. Queries are one of the innovations of Phala Network. They are designed to allow a quick examination of the states of contracts. To define a query, you need to define both the `Request` and the according `Response`.

```rust
/// The Queries to this contract
pub enum Request {
    /// Query the current owner of the contract
    QueryOwner,
    /// Make a guess on the number
    Guess { guess_number: RandomNumber },
    /// Peek random number (this should only be used by contract owner or root account)
    PeekRandomNumber,
}

/// The Query results
pub enum Response {
    Owner(AccountId),
    GuessResult(GuessResult),
    RandomNumber(RandomNumber),
}
```

`handle_query` method is supposed to handle all the queries. Unlike commands, Queries go directly to the contracts without the necessity to be sent to the blockchain. In confidential contracts, queries are usually required to be signed to indicate the identities of the requesters. Therefore queries can be responded to conditionally, which gives the developer great flexible control over the data in confidential contracts. The identity of the requester can be accessed from `origin`, the second argument of `handle_query`.

We are going to cover more about `origin` later in this tutorial, but it also supports anonymous queries where `origin` is `None` as shown below. The `QueryOwner` query simply returns the current owner of the contract, the `Guess` query returns the guessing result and the `PeekRandomNumber` query only allows authorized users to peek at the secret.

```rust
fn handle_query(&mut self, origin: Option<&chain::AccountId>, req: Request) -> Result<Response, Error> {
    match req {
        Request::QueryOwner => Ok(Response::Owner(self.owner.clone())),
        Request::Guess { guess_number } => {
            if guess_number > self.random_number {
                Ok(Response::GuessResult(GuessResult::TooLarge))
            } else if guess_number < self.random_number {
                Ok(Response::GuessResult(GuessResult::TooSmall))
            } else {
                Ok(Response::GuessResult(GuessResult::Correct))
            }
        }
        Request::PeekRandomNumber => {
            // also, we only allow Alice or contract owner to peek the number
            let sender = origin.ok_or(Error::OriginUnavailable)?;
            let alice = contracts::account_id_from_hex(ALICE)
                .expect("should not failed with valid address; qed.");

            if sender != &alice && sender != &self.owner {
                return Err(Error::NotAuthorized);
            }

            Ok(Response::RandomNumber(self.random_number))
        }
    }
}
```

> Unlike Ethereum, Queries in confidential contracts are capable to carry arbitrary computation. So we recommend introducing an authority check here to avoid potential Denial-of-Service attacks with a huge amount of query requests.

### Frontend SDK

Check our [SDK tutorial](https://github.com/Phala-Network/js-sdk/tree/main/packages/sdk) and the [example frontend of `GuessGame`](https://github.com/Phala-Network/js-sdk/blob/main/packages/example/pages/guess-number.tsx) to see how to send Commands and Queries to interact with the contracts.

The core of the frontend development is the definition of the type mapping between frontend and backend. We recommend reading the [Polkadot.js tutorials on type](https://polkadot.js.org/docs/api/start/types.extend).


## Advanced Feature: Access HTTP Service in Confidential Contracts

In the traditional smart contract model, all the input data to the contract need to be sent from on-chain transactions. If a contract depends on some off-chain information, like the current price of BTC, it needs to get such information from a special kind of infrastructure called [blockchain oracle](https://en.wikipedia.org/wiki/Blockchain_oracle). What's more, a smart contract can't initiate a request to the off-chain service.

Since Phala contracts are running in the off-chain `pRuntime`, it is possible for them to access the network service. While a challenge exists here about the state consistency across multiple instances of the same contract: we need to ensure that each instance performs exactly the same (their states and transaction-sending behavior are consistent at the same block height). Unfortunately, the HTTP request and response operate asynchronously. Even if we send the request at a determined block height, the response can come at any time and its contents may change.

In this section, we use a [`BtcPriceBot` contract example](https://github.com/Phala-Network/phala-blockchain/blob/encode-hackathon-2021/crates/phactory/src/contracts/btc_price_bot.rs) to show how these problems are solved with our `AsyncSideTask`. The `BtcPriceBot` first reads the latest BTC price from a web service, then posts an HTTP request to a Telegram bot for notification. Such behavior is triggered with a `ReportBtcPrice` Command, and we show how it is implemented.

To define an `AsyncSideTask`, several arguments need to be specified. The current `block_number` determines when the task starts, and the `duration` determines when it ends. At the block height of (`block_number` + `duration`), the task must report the results to the chain, no matter succeeded or failed. After the results are first uploaded, they are finalized, which means when other instances try to replay the side task, they directly get the results from the chain instead of re-sending the request. These arguments make the side task deterministic from the view of the blockchain.

```rust
let block_number = context.block.block_number;
let duration = 2;

let task = AsyncSideTask::spawn(
    block_number,
    duration,
    async {
        // async task
    },
    |result, context| {
        // result process
    },
);
```

In the side task body, you can send any asynchronous requests. In this case, our side task sends two HTTP requests: one to <https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD> to get the BTC price, and another to <https://api.telegram.org> to notify the Telegram bot.

```rust
async move {
    // Do network request in this block and return the result.
    // Do NOT send mq message in this block.
    log::info!("Side task starts to get BTC price");
    let mut resp = match surf::get(
        "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD",
    )
    .send()
    .await
    {
        Ok(r) => r,
        Err(err) => {
            return format!("Network error: {:?}", err);
        }
    };
    let result = match resp.body_string().await {
        Ok(body) => body,
        Err(err) => {
            format!("Network error: {:?}", err)
        }
    };
    log::info!("Side task got BTC price: {}", result);

    let price: BtcPrice =
        serde_json::from_str(result.as_str()).expect("broken BTC price result");
    let text = format!("BTC price: ${}", price.usd);
    let uri = format!(
        "https://api.telegram.org/bot{}/{}",
        bot_token, "sendMessage"
    );
    let data = &TgMessage { chat_id, text };

    let mut resp = match surf::post(uri)
        .body_json(data)
        .expect("should not fail with valid data; qed.")
        .await
    {
        Ok(r) => r,
        Err(err) => {
            return format!("Network error: {:?}", err);
        }
    };
    let result = match resp.body_string().await {
        Ok(body) => body,
        Err(err) => {
            format!("Network error: {:?}", err)
        }
    };
    log::info!("Side task sent BTC price: {}", result);
    result
},
```

Finally, the resulting process defines the contract reaction to the side task result, and you can send transactions to the chain if needed. The limitation here is also about state consistency: the resulting process should behave the same given the identical result.
In this case, we define an empty result process since the price is already reported to the bot through an HTTP request.

To put all these together:

```rust
Command::ReportBtcPrice => {
    if sender != alice && sender != self.owner {
        return Err(TransactionError::BadOrigin);
    }

    let bot_token = self.bot_token.clone();
    let chat_id = self.chat_id.clone();

    // This Command triggers the use of `AsyncSideTask`, it first sends an HTTP request to get the current BTC
    // price from https://min-api.cryptocompare.com/, then sends the price to a Telegram bot through another
    // HTTP request
    //
    // To ensure the state consistency, the time to start the task and the time to upload the HTTP response
    // to chain must be determined. In this case, we start the task in the current `block_number`, and report
    // the result, whether succeeded or failed, to the chain after `duration`
    //
    // Report the result after 2 blocks no matter whether has received the HTTP response
    let block_number = context.block.block_number;
    let duration = 2;

    let task = AsyncSideTask::spawn(
        block_number,
        duration,
        async move {
            // Do network request in this block and return the result.
            // Do NOT send mq message in this block.
            log::info!("Side task starts to get BTC price");
            let mut resp = match surf::get(
                "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD",
            )
            .send()
            .await
            {
                Ok(r) => r,
                Err(err) => {
                    return format!("Network error: {:?}", err);
                }
            };
            let result = match resp.body_string().await {
                Ok(body) => body,
                Err(err) => {
                    format!("Network error: {:?}", err)
                }
            };
            log::info!("Side task got BTC price: {}", result);

            let price: BtcPrice =
                serde_json::from_str(result.as_str()).expect("broken BTC price result");
            let text = format!("BTC price: ${}", price.usd);
            let uri = format!(
                "https://api.telegram.org/bot{}/{}",
                bot_token, "sendMessage"
            );
            let data = &TgMessage { chat_id, text };

            let mut resp = match surf::post(uri)
                .body_json(data)
                .expect("should not fail with valid data; qed.")
                .await
            {
                Ok(r) => r,
                Err(err) => {
                    return format!("Network error: {:?}", err);
                }
            };
            let result = match resp.body_string().await {
                Ok(body) => body,
                Err(err) => {
                    format!("Network error: {:?}", err)
                }
            };
            log::info!("Side task sent BTC price: {}", result);
            result
        },
        |_result, _context| {
            // You can send deterministic number of transactions in the result process
            // In this case, we don't send the price since it has already been reported to the TG bot above
        },
    );
    context.block.side_task_man.add_task(task);

    Ok(())
}
```

## Summary

In this tutorial, we have covered a walk-through for the basic `GuessNumber` contract template and the `BtcPriceBot` contract that leverages the advanced network access feature of Phala contracts. Now it's your turn to build something new!

### Submit Your Work

This tutorial is a part of [Phala x Polkadot Encode Club Hackathon](https://www.encode.club/polkadot-club-hackathon). To win the task, please do the following:

1. Fork [the core blockchain](https://github.com/Phala-Network/phala-blockchain/tree/encode-hackathon-2021) and [the Web UI](https://github.com/Phala-Network/js-sdk) repo into your own GitHub account
2. Develop your own contract on the templates at "encode-hackathon-2021" branch (must be a different one from existing submissions)
3. Launch your full development stack and take screenshots of your DApp
4. Push your work to your forked repos. They must be open-sourced
5. Make a tweet with the link to your repos, the screenshots, and describe what you are building on Twitter
6. Join our [Discord server](https://discord.gg/zQKNGv4) and submit the link to your tweet
