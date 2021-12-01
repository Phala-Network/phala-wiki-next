---
title: "Contract Development"
weight: 11000
draft: false
menu:
  docs:
    parent: "developer"
---
## Developer Community
If you have any questions, the following Phala developer communities are good places to ask.

- Phala Discord #dev and #hackathon group: <https://discord.gg/Bpckh7R5Rf>
- Phala Developers in Telegram: <https://t.me/phaladeveloper>
- Phala-blockchain Github Issues: <https://github.com/Phala-Network/phala-blockchain/issues>

## Introduction to Confidential Contract

The smart contract is one of the most popular blockchain applications. Existing smart contract platforms, like Ethereum, ensure the correctness of contract execution results with duplicated execution: an invocation is executed by multiple miners to ensure that they all produce the same result.
To achieve this goal, all the transactions and contract states are stored as plaintext so any miner can validate them.
Unfortunately, such a design greatly limits the capabilities of smart contracts. For example, the following *GuessNumber* contract cannot be implemented on existing platforms since skilled players can always peek at the answer.

> **Side notes: Private variables are not private on Ethereum.**
>
> Though you can define variables with the "private" attribute, the data is still public on the blockchain. According to [the solidity doc](https://solidity.readthedocs.io/en/v0.7.3/contracts.html):
> > Everything that is inside a contract is visible to all observers external to the blockchain. Making something private only prevents other contracts from reading or modifying the information, but it will still be visible to the whole world outside of the blockchain.

Phala has solved this problem and introduced confidentiality to the smart contract world. By leveraging *Trusted Execution Environment (TEE)*, which is powered by secure hardware, Phala supports confidential contracts, which are just like ordinary smart contracts but their input and states are encrypted and protected by hardware. Now let's see how it looks like!

> **Note:** The example here is called a *native contract* because it is tightly coupled with Phala blockchain: to deploy it, you need to change the source code of phala-blockchain and re-compile it.
> An easy-to-deploy contract solution is still ongoing. Shortly, Phala will release the support of wasm-based [ink! contract](https://github.com/paritytech/ink).
> The good news is that these two kinds of contracts share the same contract model and programming language (your favorite Rust), so give it a try and keep following!

## How does a Confidential Contract look like?

```rust
/// Contract state
pub struct GuessNumber {
    random_number: RandomNumber,
}
```

> **Note**: Some boilerplate code was removed for simplicity

Simple, right? A confidential contract is nothing more than an ordinary smart contract, but with confidentiality, thus it can power some interesting applications. This example shows a contract that stores a secret number for participants to guess. You can store a secret `random_number` in a confidential contract since it will be encrypted by TEE and no one can know it.
The Phala contracts are written in Rust, a popular and secure programming language with great performance. You can make full use of your favorite package manager Cargo and libraries at [crates.io](https://crates.io).

So far, we have a *GuessNumber* contract with a secret number, but it's only the first half! Now let's define how users can interact with it.
The contract accepts two kinds of requests: Command and Query. The key difference between Command and Query is that whether it changes the state of the contract. Let's show them separately.

```rust
fn handle_command(
    &mut self,
    context: &mut NativeContext,
    origin: MessageOrigin,
    cmd: Command
    ) -> TransactionResult {
    info!("Command received: {:?}", &cmd);

    // we want to limit the sender who can use the Commands to the pre-define root account
    let sender = match &origin {
        MessageOrigin::AccountId(account) => AccountId::from(*account.as_fixed_bytes()),
        _ => return Err(TransactionError::BadOrigin),
    };

    match cmd {
        Command::NextRandom => {
            if sender != root && sender != self.owner {
                return Err(TransactionError::BadOrigin);
            }
            self.random_number = GuessNumber::gen_random_number(context);
            Ok(())
        }
    }
}
```

In our example, the contract accepts the Command `NextRandom`, which changes its state of `random_number`. The Command is like the transaction of Ethereum. Since the Command can affect the contract state, it needs to be witnessed by the blockchain. To send a Command, a user needs to first send it to the blockchain, then the Command is automatically distributed to the target contract.
Note that in Phala, all the Commands are end-to-end encrypted, which means only the contract itself can decrypt them when it is executed in TEE. Such encryption is delegated to our SDK and you don't need to take care of it: confidentiality at zero cost!

We get the identity of the sender from the `origin` and only allow the root account or contract owner to refresh the random number. What we have not shown in this example is that you can get important information like block height and timestamp through the `context`.

```rust
fn handle_query(
    &mut self,
    origin: Option<&chain::AccountId>,
    req: Request
    ) -> Result<Response, Error> {
    match req {
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
            let sender = origin.ok_or(Error::OriginUnavailable)?;
            if sender != &root && sender != &self.owner {
                return Err(Error::NotAuthorized);
            }
            Ok(Response::RandomNumber(self.random_number))
        }
    }
}
```

In contrast to Command, the Query is not allowed to change the contract state, but it is still powerful! The great thing about Queries is that they are directly sent to the contract, so you can always get the real-time state of the contract. All the Queries are end-to-end encrypted like Commands.
In this example, any users can try to guess the number and immediately get the response, then they can try again. Also, we allow the root account and contract owner to peek at the secret, just get the sender identity from `origin` and check it in the same way. Access control even in Queries, really cool!

## Advanced Features of Phala Contract

Contracts in Phala support more unique features other than confidentiality, give it a try!

- Ability to access network. This may be the world's first smart contract model which supports direct network access. The contracts in Phala can send arbitrary HTTP requests. The response will be posted on the blockchain, witnessed, and distributed to the contract. The `surf` crate with asynchronous primer in Rust makes the job simple. See how we achieve this in our [Telegram Bot example](https://github.com/Phala-Network/phala-blockchain/blob/encode-hackathon-2021/crates/phactory/src/contracts/btc_price_bot.rs).
- High performance. Since our contracts are executed off-chain, it can make full use of the hardware. Phala can support computation-intensive applications. In general, the programs in Intel SGX suffer a performance loss of ~20% compared with native execution, which is far less than the existing smart contract platform. We think such performance losses are a real bargain for the security and confidentiality promise.
## The Root of Trust: TEE

Phala provides a confidentiality guarantee based on trusted hardware, or *Trusted Execution Environment*, which means your code and data are safe even if your operating system is compromised. A contract executing in the TEE is just like the priest in the confessional room: You know who he is, you can tell him what you want and he will reply, but only God knows what's going on there. The most important thing is: All your secrets are safe.

Phala adopts one of the most popular implementations of TEE, i.e., Intel SGX. Intel SGX introduces a small set of instructions to encrypt the data in memory, and attackers cannot decrypt it without cracking the CPU and extracting the secret key in it. Unlike existing blockchains in which all contract states are public on-chain, the states of confidential contracts are encrypted and sealed in SGX.

If you are interested in the details of Intel SGX, we recommend the excellent [SGX 101](https://sgx101.gitbook.io/sgx101/).
