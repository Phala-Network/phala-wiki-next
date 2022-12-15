---
title: "Run Unittest Locally"
weight: 3005
menu:
  build:
    parent: "phat-stateless"
---

Before you deploy your contract to our Testnet or release it on mainnet, a thorough local unittest can help you fix most of the bugs.

## Unittest Basics

Let's take the unittest in our Phat Hello World as an example:

```rust
/// Unit tests in Rust are normally defined within such a `#[cfg(test)]`
/// module and test functions are marked with a `#[test]` attribute.
/// The below code is technically just normal Rust code.
#[cfg(test)]
mod tests {
    /// Imports all the definitions from the outer scope so we can use them here.
    use super::*;
    /// Imports `ink_lang` so we can use `#[ink::test]`.
    use ink_lang as ink;

    /// We test a simple use case of our contract.
    #[ink::test]
    fn it_works() {
        // when your contract is really deployed, the Phala Worker will do the HTTP requests
        // mock is needed for local test
        pink_extension_runtime::mock_ext::mock_all_ext();

        let phat_hello = PhatHello::new();
        let account = String::from("0xD0fE316B9f01A3b5fd6790F88C2D53739F80B464");
        let res = phat_hello.get_eth_balance(account.clone());
        assert!(res.is_ok());

        // run with `cargo +nightly test -- --nocapture` to see the following output
        println!("Account {} gets {} Wei", account, res.unwrap());
    }
}
```

A Phat Contract unittest makes little difference compared with normal Rust programs. It is labelled by `#[cfg(test)]`, and you just write each test as a function headed by `#[ink::test]`.

You can easily create a new contract instance in unittest by calling its constructor (e.g. `PhatHello::new()`). Then you can call any functions (no matter query/transaction handlers) in that contract directly.

## Setup Context of Blockchain

The [ink_env](https://paritytech.github.io/ink/ink_env/test/index.html) crate contains all the functions to setup the blockchain calling context like the caller of the contract functions, the balance of certain account, e.t.c.

We recommend to read the [ink! official document](https://ink.substrate.io/basics/contract-testing/) to learn about its basic usages. And you can refer to the unittests in [ink! Examples](https://github.com/paritytech/ink/tree/master/examples) to find useful pieces.

Also, we prepare a cheatsheet for you here:

```rust
// this gives you the default test accounts [alice, bob, charlie, django, eve, frank]
let accounts = ink_env::test::default_accounts::<ink_env::DefaultEnvironment>();

let phat_hello = PhatHello::new();

// control the caller of the contract

// by default, the caller is `accounts.alice`
let account = String::from("0xD0fE316B9f01A3b5fd6790F88C2D53739F80B464");
let res = phat_hello.get_eth_balance(account.clone());
assert!(res.is_ok());

// 1. get contract address
let contract = ink_env::account_id::<ink_env::DefaultEnvironment>();
// 2. set caller to bob and callee to the contract
ink::env::test::set_callee::<ink::env::DefaultEnvironment>(contract);
ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.bob);
// now the caller will be `accounts.bob`
let res = phat_hello.get_eth_balance(account.clone());
assert!(res.is_ok());
```

## Mock Pink Extension Functions

By default, the functions in pink-extension are delegated to the runtime for real execution, thus your unittest can fail if your functions include any invoke to these functions.

In the example above, that's why we call
```rust
pink_extension_runtime::mock_ext::mock_all_ext();
```
before we really call the contract functions. `mock_all_ext()` will redirect all the runtime requests to your local machine. For example, after that is called, `phat_hello.get_eth_balance()` will send HTTP request from your computer to read the Ethereum balance from Etherscan.

Sometimes, you do not want the contract to really send the HTTP request / generate random number, instead, you want it to use the pre-defined values. In such cases, you can use the code example below:
```rust
use pink_extension::chain_extension::{mock, HttpResponse};

mock::mock_http_request(|request| {
    if request.url == "https://localhost" {
        HttpResponse::ok(b"user-controlled response".to_vec())
    } else {
        HttpResponse::not_found()
    }
});

// a not-that-random generator
mock::mock_getrandom(|length| {
    vec![0u8; length as usize]
})
```
