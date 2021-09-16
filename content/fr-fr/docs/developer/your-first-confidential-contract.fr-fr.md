---
title: "1.2 Hello World : votre premier contrat confidentiel"
---

> Une connaissance de base de la programmation en langage Rust et du développement de contrats intelligents est nécessaire pour suivre ce tutoriel.

## Vue d'ensemble

Dans ce tutoriel, nous allons continuer sur l'environnement de développement que nous avons mis en place dans le chapitre précédent, et explorer comment un contrat intelligent confidentiel est fait. À la fin de ce tutoriel, vous allez :

- Apprendre à développer un contrat confidentiel.
- Interagir avec le contrat à partir de l'interface Web.
- Construire votre propre contrat confidentiel

Pour un aperçu de haut niveau du réseau Phala, veuillez consulter les chapitres précédents.

## Environnement et construction

Veuillez configurer un environnement de développement en suivant le chapitre précédent [Run a Local Development Network] (Run-a-Local-Development-Network). Assurez-vous que vous êtes dans la branche `helloworld` sur les deux repo `phala-blockchain` et `apps-ng`.

## Visite guidée

### Contrat

Le contrat HelloWorld est disponible à l'adresse [ici](https://github.com/Phala-Network/phala-blockchain/commit/b9c576702ec1b9f0ee4a274b5d7aecc30e40fcb4).

Le contrat HelloWorld stocke un compteur qui peut être incrémenté par n'importe qui, mais seul l'utilisateur autorisé peut le lire. Le modèle typique des contrats confidentiels dans Phala Network est constitué des trois composants suivants que nous allons aborder en détail.

- États
- Commandes
- Requêtes

Les **États** d'un contrat sont décrits par certaines variables. Dans ce cas, nous définissons une variable non signée de 32 bits comme compteur, mais vous êtes libre d'utiliser des variables de n'importe quel type dans vos contrats.


```rust
pub struct HelloWorld {
    counter: u32,
}
```

Il existe deux types d'opérations qui peuvent être utilisées pour interagir avec les contrats confidentiels : les **Commandes** et les **requêtes**. La différence la plus importante entre elles est qu'elles modifient ou non les états des contrats, et nous les expliquons séparément.

Les **Commandes** sont censées changer les états des contrats. Elles sont également appelées **Transactions**, et elles sont exactement comme les transactions sur les blockchains de contrats intelligents traditionnelles comme Ethereum : elles doivent être envoyées à la blockchain avant leur exécution. Dans notre contrat HelloWorld, nous définissons une commande `Increment` qui change la valeur du compteur.

```rust
pub enum Command {
    /// Increments the counter in the contract by some number
    Increment {
        value: u32,
    },
}
```

>Il est important de noter que vous pouvez définir plusieurs commandes pour un contrat. Par exemple, nous pouvons ajouter une commande `Decrement` pour diminuer le compteur comme suit.
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

Toutes les commandes sont traitées par la méthode `handle_command` qui doit être implémentée. Dans ce cas, nous permettons à n'importe quel utilisateur d'utiliser cette commande, donc nous augmentons simplement le compteur sans vérifier l'`_origin`.

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

Contrairement aux commandes, les **requêtes** ne changent pas l'état des contacts. Les requêtes sont l'une des innovations du réseau Phala. Elles sont conçues pour permettre un examen rapide des états des contrats. Pour définir une requête, vous devez définir à la fois le `Request` et la `Response` correspondante.


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

La méthode `handle_query` est censée traiter toutes les requêtes. Contrairement aux commandes, les requêtes vont directement aux contrats sans avoir besoin d'être envoyées à la blockchain. Dans les contrats confidentiels, les requêtes doivent généralement être signées pour indiquer l'identité des demandeurs. Par conséquent, les requêtes peuvent faire l'objet d'une réponse conditionnelle, ce qui donne au développeur un contrôle très souple des données dans les contrats confidentiels. L'identité du demandeur est accessible à partir de `origin`, le deuxième argument de `handle_query`.

Nous allons parler plus en détail de `origin` plus tard dans ce tutoriel, mais il supporte aussi les requêtes anonymes où `origin` est `None` comme montré ci-dessous. La requête `GetCount` renvoie simplement la valeur actuelle du compteur.

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

Contrairement à Ethereum, les requêtes dans les contrats confidentiels sont capables d'effectuer des calculs arbitraires. Nous recommandons donc d'introduire une vérification de l'autorité ici pour éviter une attaque potentielle par déni de service avec une énorme quantité de requêtes.

### Frontend

- Validation de l'interface Web : <https://github.com/Phala-Network/apps-ng/commit/4a806c8e49edb8f12bd5ed54d1700edf81a6af56>

Interagir avec le contrat : comment envoyer des commandes et des requêtes.

## Mettre en place un carnet secret
Après une compréhension générale du modèle des contrats confidentiels, faisons quelque chose de pratique et implémentons un contrat qui peut stocker la note secrète de chaque visiteur. Dans ce contrat, nous permettons à tout utilisateur de stocker une note, et seul l'utilisateur lui-même est autorisé à lire sa note.

> Le commit du contrat SecretNote est disponible à l'adresse suivante <https://github.com/Phala-Network/phala-blockchain/commit/d91f94c9ed21290b7353991899f7a6da18cfab61> **(CHANGEZ CELA)**. Nous remercions [Laurent](https://github.com/LaurentTrk) pour son exécution du présent contrat.

### Contrat

Nous utilisons une carte pour stocker les utilisateurs avec leurs notes, et fournissons deux interfaces `SetNote` et `GetNote` pour qu'ils puissent utiliser leurs notes. Nous définissons d'abord la structure d'état du contrat `struct SecretNote`, avec une carte `notes` pour stocker une correspondance entre le compte et les notes. Dans les contrats Phala, un compte peut être représenté par un `AccountIdWrapper`.

```rust
pub struct SecretNote {
    notes: BTreeMap<AccountIdWrapper, String>,
}
```

Dans la bibliothèque de collection std de Rust, il y a deux implémentations de map : `HashMap` et `BTreeMap`. Puisque notre `AccountIdWrapper` ne dérive pas `Hash` nécessaire à `HashMap`, nous utilisons `BTreeMap` pour stocker le mapping entre les comptes utilisateurs et leurs notes.

Nous rappelons ici la différence entre les commandes et les requêtes. Dans SecretNote, `SetNote` change les états, c'est donc une commande, et `GetNote` est une requête. Pour chaque utilisateur, nous ne gardons que la dernière note. Donc dans `SetNote`, nous appelons la commande `insert` pour ajouter une note si aucune précédente n'existe ou directement écraser la note existante.

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

Maintenant nous pouvons passer au gestionnaire `GetNote`. C'est un peu délicat car nous n'autorisons que le propriétaire de la note à accéder à sa note. En d'autres termes, nous devons nous assurer que l'utilisateur a signé la requête, et ensuite nous répondons avec sa note. Pour une requête signée, l'argument `origin` de la méthode `handle_query` contient l'identifiant du compte du demandeur.

Nous implémentons `handle_query` comme indiqué ci-dessous. Elle vérifie d'abord si la requête est signée en contrôlant `origin`, puis renvoie la note stockée dans les états du contrat. Il retourne une réponse `NotAuthorized` si la requête n'est pas signée.

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

1. Définir l'interface utilisateur de la note
2. Interface utilisateur pour les requêtes
3. Erreur de manipulation

## Mettez tout ensemble

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

## Sommaire

Dans ce tutoriel, nous avons décrit le modèle de contrat `HelloWorld` et montré comment construire un contrat un peu plus avancé `SecretNote` qui exploite la confidentialité des contrats Phala. Maintenant, c'est à votre tour de construire quelque chose de nouveau !

### Soumettez votre travail

>Ce hackathon s'est terminé le 13 novembre 2020

Ce tutoriel fait partie du [Polkadot "Hello World" virtual hackathon challenge](https://gitcoin.co/hackathon/polkadot/onboard) à gitcoin.co. Afin de gagner la tâche, veuillez faire les choses suivantes :

1. Transférez [la blockchain centrale](https://github.com/Phala-Network/phala-blockchain/tree/helloworld) et [l'interface Web](https://github.com/Phala-Network/apps-ng/tree/helloworld) dans votre propre compte GitHub (branche helloworld).
2. Développez votre propre contrat sur les modèles de la branche "helloworld" (il doit s'agir d'un contrat différent des soumissions existantes).
3. Lancez votre pile de développement complète et faites des captures d'écran de vos dapps.
4. Poussez votre travail vers vos dépôts bifurqués. Ils doivent être open source
5. Faites un tweet avec le lien vers vos dépôts, les captures d'écran, et décrivez ce que vous construisez sur Twitter.
6. Rejoignez notre [serveur Discord](https://discord.gg/zQKNGv4) et soumettez le lien vers votre tweet.

