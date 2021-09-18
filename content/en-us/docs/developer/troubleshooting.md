---
title: "1.3 Troubleshooting"
weight: 11013
menu:
  docs:
    parent: "developer"
---

## `phala-blockchain`

### Problem: "the `wasm32-unknown-unknown` target may not be installed"

You need to add the `wasm-unknown-unknown` target to your rust toolchain. Do it by this (under the code repo):

```bash
rustup target add wasm32-unknown-unknown
```

### Problem: "(signal: 9, SIGKILL: kill)" when building substrate

The compiler may run out-of-memory. Usually each thread takes up to 2GB RAM. If you don't have enough memory, you can limit the concurrency specifying a smaller `N` than your available cores:

```bash
cargo build --release --j N
```

### Probelm: "consider giving `accuracy` a type" when building substrate

```log
  error[E0282]: type annotations needed
      --> .../substrate/primitives/arithmetic/src/fixed_point.rs:541:9
       |
  541  |                   let accuracy = P::ACCURACY.saturated_into();
       |                       ^^^^^^^^ consider giving `accuracy` a type
  ...
  1604 | / implement_fixed!(
  1605 | |     FixedI128,
  1606 | |     test_fixed_i128,
  1607 | |     i128,
  ...    |
  1611 | |         [-170141183460469231731.687303715884105728, 170141183460469231731.687303715884105727]_",
  1612 | | );
       | |__- in this macro invocation
       |
       = note: this error originates in a macro (in Nightly builds, run with -Z macro-backtrace for more info)
```

This is a [known issue](https://github.com/paritytech/substrate/issues/7287) caused by Rust nightly regression. To walkaround it, switch to an older nightly toolchain. We recommend `nightly-2020-09-27`. It can be done like below:

```bash
rustup toolchain install nightly-2020-09-27
rustup default nightly-2020-09-27
rustup target add wasm32-unknown-unknown --toolchain nightly-2020-09-27
```

### Probelm: "duplicate lang item"

```log
error: duplicate lang item in crate `std`: `f32_runtime`.
  |
  = note: the lang item is first defined in crate `sgx_tstd` (which `enclaveapp` depends on)

error: duplicate lang item in crate `std`: `f64_runtime`.
  |
  = note: the lang item is first defined in crate `sgx_tstd` (which `enclaveapp` depends on)

error: duplicate lang item in crate `std`: `panic_impl`.
  |
  = note: the lang item is first defined in crate `sgx_tstd` (which `enclaveapp` depends on)

error: duplicate lang item in crate `std`: `begin_panic`.
  |
  = note: the lang item is first defined in crate `sgx_tstd` (which `enclaveapp` depends on)

error: duplicate lang item in crate `std`: `oom`.
  |
  = note: the lang item is first defined in crate `sgx_tstd` (which `enclaveapp` depends on)

error: aborting due to 6 previous errors
```

This is due to accidentally introduced "std" dependencies. Usually there are two common causes of this error.

Most likely the code has some syntax errors and cannot build. Sometimes these errors can confuse the Rust compiler in "no_std" mode and the compiler may accidentally introduce some random dependencies, which breaks our SDK. If this is the case, scroll up and fix the other compiling errors, and then this error should disappear.

If fixing the other errors doesn't help, you should check if you accidentally introduce the "std" dependency to the runtime code. The hardware enclave sdk Phala is using doesn't allow direct or indirect "std" dependencies. You may consider to switch to a package that supports "no_std" and disable its std feature in `Cargo.toml`, or manually port the dependency package to use `teaclave-sgx-sdk`'s `tstd` instead. `tstd` is a subset of `std` but it's enough in the most cases.

### ICE: "found unstable fingerprints for predicates_of..."

Please disable incremental build. This is due to a bug introduced in rustc:

<https://blog.rust-lang.org/2021/05/10/Rust-1.52.1.html>

## `apps-ng` related

### Probelm: '@polkadot/dev/config/tsconfig' not found

```log
ready - started server on http://localhost:3000
error TS6053: File '@polkadot/dev/config/tsconfig' not found.
```

You forgot to init the git submodule. Please run `git submodule update --init`.
