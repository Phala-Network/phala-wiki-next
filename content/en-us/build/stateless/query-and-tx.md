---
title: "Query and Transaction"
weight: 3003
menu:
  build:
    parent: "phat-stateless"
---

## What's Query

For all existing smart contracts, a user need to send a transaction on-chain and wait for it to be processed by the contract.

The most significant difference between Phat Contract and other smart contracts is that it runs off-chain. This enables it to directly receive and process users' off-chain requests (called *Query*), other than the traditional on-chain transactions. For the first time, you can process these two kinds of requests in one contract.

> If you do not know what's transaction and how they are processed in traditional smart contracts, refer to [Ethereum's introduction on smart contract](https://ethereum.org/en/developers/docs/smart-contracts/). The transactions are processed in exactly the same way in Phat Contract.

![](/images/build/general-node-design.png)

Since query is never submitted on-chain, it has unique features compared with transaction:
- it is never recorded on-chain, thus volatile. So query handling logic is not allowed to change the contract states on-chain (but you are free to read these states when processing queries);
- it requires no gas fee for users to send queries to contract;
- there is zero latency in query processing since it does not need to wait for block production.

Both the advantages and disadvantages of query are clear:
- Pros: Query removes the performance and functional limitations on transaction processing, while is still able to read the contract states;
- Cons: You need to be extremely careful when you allow query to affect your contract states since concurrent query handling can lead to unexpected execution results.

That's why we choose to start with stateless DApp building: it totally avoids the weakness of query. We leave the stateful application building as an advanced topic.


## Handle Query and Transaction in Phat Contract

Despite the obscure underlying mechanism, from the code side, to handle the queries and transactions can be really easy in Phat Contract.

```rust
#[ink(message)]
pub fn query_handler(&self, arg1: AccountId, arg2: u32) {
    // actual implementation
}

#[ink(message)]
pub fn transaction_handler(&mut self, arg1: AccountId, arg2: u32) {
    // actual implementation
}
```

In Phat Contract, to define a user request handler as simple as labeling a function with `#[ink(message)]`. The only difference between a transaction handler and a query handler is how they refer to the contract state:
- Query handler holds immutable reference `&self`, they can read the current contract states but should not change them;
- Transaction handler holds mutable reference `&mut self`, so they are allowed to update the contract states.


## Pink Extension Function Support

Phat Contract has unique capabilities, and they are provided as functions in [pink-extension](https://github.com/Phala-Network/phala-blockchain/tree/master/crates/pink) (short for Phala ink! Extension). You can use all these functions in your query handler functions, but some of them are disabled in transaction handlers since they can lead to inconsistent on-chain states.

Check the detailed list in the [following section](/en-us/build/stateless/pink-extension/#pink-extension-functions).
