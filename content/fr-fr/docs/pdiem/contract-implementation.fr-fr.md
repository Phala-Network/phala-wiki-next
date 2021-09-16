---
title: "Mise en œuvre du contrat"
weight: 5
draft: false
---


Le contrat pDiem agit comme un porte-feuille Diem ordinaire. Il détient les clés privées dans son contrat confidentiel Phala Network. Le contrat peut donc contrôler certains portefeuilles pour recevoir ou envoyer des fonds sur la blockchain Diem.

## Contract storage

Le [contrat pDiem](https://github.com/Phala-Network/phala-blockchain/blob/master/standalone/pruntime/enclave/src/contracts/diem.rs) est implémenté comme un contrat intelligent confidentiel natif. Il définit les éléments de stockage suivants :

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

## Implémentation du client léger

Le client léger Diem maintient le dernier état du registre (`LedgerInfo`). Il transmet aux accumulateurs des transactions historiques, des états et des événements. Un état de registre est mis à jour chaque fois que la base de données de la blockchain Diem est modifiée. Par conséquent, avec le dernier état du registre, tous les faits survenus précédemment peuvent être validés.

L'état du registre de genèse est initialisé par `Command::SetTrustedState` une fois seulement, il est persistant et peut être examiné par n'importe qui pendant tout le cycle de vie du bridge. L'état actuel du registre est utilisé pour valider la signature d'un état plus récent du registre jusqu'à ce qu'un validateur configure un changement (par exemple, via une élection sur la chaîne). Lorsqu'il y a un changement d'ensemble de validateurs, le dernier état du registre dans la même période peut être validé, et le nouvel ensemble de validateurs élu peut être extrait du stockage de la blockchain dans lequel il s'engage. Ceci est géré par `verify_trusted_state()`.

Il n'y a pas de commande spécifique pour mettre à jour l'état du registre. Au lieu de cela, une `LedgerInfoWithSignature` et une `EpochChangeProof` sont extraites de la `TransactionWithProof` à partir d'un appel `Command::VerifyTransaction`, lorsqu'un relais synchronise une nouvelle transaction avec pDiem. Ainsi, au fur et à mesure que les nouvelles transactions sont synchronisées avec le contrat pDiem, celui-ci maintient toujours le dernier état du registre.

{{< tip >}}
La sérialisation spécifique de Diem, la cryptographie et les logiques de vérification sont extraites de la base de code originale de Diem. elles sont portées sur la cible de construction SGX par l'équipe pDiem, située dans le répertoire [/Diem] (https://github.com/Phala-Network/phala-blockchain/tree/master/diem).
{{< /tip >}}
## Recevoir des transactions de dépôt

Avant qu'un utilisateur puisse déposer des actifs Diem sur pDiem, une adresse de dépôt doit être générée, comme pour un échange de jetons dans le monde réel. Ceci est fait par le contrat pDiem. Tout utilisateur peut demander au contrat de générer une adresse de dépôt. Le contrat génère une nouvelle clé privée, la sauvegarde dans le stockage du contrat et révèle l'adresse à l'utilisateur.

{{< tip >}}
Dans pDiem-m3, nous avons codé en dur l'adresse de dépôt dans le contrat.
{{< /tip >}}

Lorsqu'une adresse de dépôt est créée, un utilisateur peut transférer certains actifs de Diem à pDiem :

1. L'utilisateur envoie une transaction Diem pour transférer des jetons à l'adresse de dépôt.
2. Le relayeur pDiem surveille l'adresse de dépôt, remarque la transaction de dépôt, et la relaie au contrat pDiem par `Command::VerifyTransaction`.
3. Le contrat extrait le dernier état du registre avec la preuve et le valide avec l'état précédent du registre (`verify_trusted_state()`).
4. Enfin, il extrait la preuve de la transaction, et confirme le dépôt si la preuve peut passer la validation par rapport au dernier état du registre (`verify_transaction_state_proof`).

Une fois qu'un dépôt est validé, nous ajoutons le montant reçu au solde disponible de l'utilisateur. Les transactions acceptées et le solde peuvent être interrogés par `Request::FreeBalance` et `Request::VerifiedTransactions`.

{{< tip "Attention" >}}
Les transactions sont classées par séquence ou par identifiant d'événement. Les ids des comptes sont enregistrés dans le contrat pour éviter les transactions manquantes.
{{< /tip >}}

## Signer les transactions de retrait

WIP: [Pull Request](https://github.com/Phala-Network/phala-blockchain/pull/171) est en train de fusionner.

## Transfert d'actifs

Dans pDiem-m3 nous n'avons pas implémenté le transfert de jetons. Nous le laisserons à la prochaine étape, et il sera géré par les [contrats confidentiels `Assets`](https://github.com/Phala-Network/phala-blockchain/blob/master/standalone/pruntime/enclave/src/contracts/assets.rs), qui implémente également la norme des actifs interopérables définie dans XCM. De cette façon, les actifs bridgés par pDiem peuvent être utilisés dans n'importe quel parachain de l'écosystème Polkadot.

## Référence

Commandes:

- `AccountData` : définit les comptes de la liste blanche, dans bcs encodé en base64 
- `SetTrustedState` : Définit l'état de confiance. Le propriétaire ne peut initialiser le pont avec l'état genesis qu'une seule fois.
- `VerifyTransaction` : vérifie une transaction de dépôt

Requêtes:

- `FreeBalance` : Obtient le solde total disponible contrôlé par le contrat.
- `VerifiedTransactions` : Récupère toutes les transactions vérifiées, dans une chaîne de hachage Hexadécimale.
