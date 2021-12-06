---
title: "1.3 Dépannage"
weight: 11013
menu:
  docs:
    parent: "developer"
---

## `Blockchain Phala`

### Probleme : "la cible `wasm32-unknown-unknown` n'est peut-être pas installée".

Vous devez ajouter la cible `wasm-unknown-unknown` à votre toolchain rust. Faites-le de cette façon (sous le repo du code) :

```bash
rustup target add wasm32-unknown-unknown
```

### Probleme: "(signal: 9, SIGKILL: kill)" lors de la construction du substrat

Le compilateur peut manquer de mémoire. Habituellement, chaque thread prend jusqu'à 2GB de RAM. Si vous n'avez pas assez de mémoire, vous pouvez limiter la concurrence en spécifiant un `N` plus petit que vos cœurs disponibles :

```bash
cargo build --release --j N
```

### Probleme: "consider giving `accuracy` a type" lors de la construction du substrat

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

Il s'agit d'un [problème connu](https://github.com/paritytech/substrate/issues/7287) causé par la régression Nightly de Rust. Pour contourner ce problème, passez à une toolchain Nightly plus ancienne. Nous recommandons `nightly-2020-09-27`. Cela peut être fait comme ci-dessous :

```bash
rustup toolchain install nightly-2020-09-27
rustup default nightly-2020-09-27
rustup target add wasm32-unknown-unknown --toolchain nightly-2020-09-27
```

### Probleme: "duplicate lang item"

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

Ceci est dû à l'introduction accidentelle de dépendances "std". Il y a généralement deux causes communes à cette erreur.

Le plus souvent, le code comporte des erreurs de syntaxe et ne peut pas être compilé. Parfois, ces erreurs peuvent embrouiller le compilateur Rust en mode "no_std" et le compilateur peut accidentellement introduire des dépendances aléatoires, ce qui casse notre SDK. Si c'est le cas, faites défiler la page et corrigez les autres erreurs de compilation, et cette erreur devrait disparaître.

Si la correction des autres erreurs n'aide pas, vous devriez vérifier si vous avez accidentellement introduit la dépendance "std" dans le code d'exécution. Le sdk de l'enclave matérielle utilisé par Phala n'autorise pas les dépendances "std" directes ou indirectes. Vous pouvez envisager de passer à un paquet qui supporte "no_std" et désactiver sa fonctionnalité std dans `Cargo.toml`, ou porter manuellement le paquet de dépendance pour utiliser `tstd` de `teaclave-sgx-sdk` à la place. `tstd` est un sous-ensemble de `std` mais c'est suffisant dans la plupart des cas.

### ICE: "found unstable fingerprints for predicates_of..."

Please disable incremental build. This is due to a bug introduced in rustc:

<https://blog.rust-lang.org/2021/05/10/Rust-1.52.1.html>

## `apps-ng` related

### Probelm: '@polkadot/dev/config/tsconfig' not found

```log
ready - started server on http://localhost:3000
error TS6053: File '@polkadot/dev/config/tsconfig' not found.
```

Vous avez oublié d'initialiser le submodule git. Veuillez exécuter `git submodule update --init`.
