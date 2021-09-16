---
title: "Développement du contrat"
weight: 100
draft: false
---

## Qu'est-ce qu'un contrat confidentiel ?

```rust
pub struct HelloWorld {
  counter: u32,
}

fn handle_command(&mut self, origin: &chain::AccountId, txref: &TxRef, cmd: Command) -> TransactionStatus {
  match cmd {
    Command::Increment { value } => {
      self.counter += value;
      TransactionStatus::Ok
    },
  }
}
```

> **Note**: Certains codes passe-partout ont été supprimés pour plus de simplicité.

Un contrat confidentiel n'est rien de plus qu'un contrat intelligent ordinaire, mais avec une confidentialité. Cet exemple montre un contrat simple dans lequel est stocké un compteur. N'importe qui peut l'incrémenter mais seul l'utilisateur autorisé peut le lire. Le snippet ci-dessus définit le stockage du contrat et la commande `Increment`.

Les contrats Phala sont écrits en Rust, un langage de programmation qui peut tout faire sur la blockchain. Vous pouvez utiliser pleinement votre gestionnaire de paquets préféré Cargo et les bibliothèques sur [crates.io](https://crates.io).

Jusqu'à présent, nous avons un contrat HelloWorld avec un compteur, mais ce n'est que la première moitié ! Maintenant, vous vous demandez peut-être quelle est la différence entre les contrats confidentiels et les autres smart contracts. La seconde moitié dévoile le secret.

```rust
fn handle_query(&mut self, origin: Option<&chain::AccountId>, req: Request) -> Response {
  match req {
    Request::GetCount => {
      if origin != Some(ROOT_ACCOUNT) {
        Response::Error(Error::NotAuthorized)
      } else {
        Response::GetCount { count: self.counter })
      }
    }
}
```

Contrairement aux smart contracts traditionnels, les états d'un contrat confidentiel ne sont pas accessibles directement en dehors du contrat car ils sont cryptés sur la blockchain. Toutefois, les contrats Phala disposent de "requêtes", qui sont des fonctions exécutées dans le TEE pour accepter la demande, lire l'état brut et répondre. Dans une requête, vous pouvez définir qui a la permission d'accéder à quelle partie des données. Dans cet exemple, nous n'autorisons que le compte spécial `ROOT_ACCOUNT` à lire le compteur, sinon le demandeur recevra une erreur `NotAuthorized`.

En fait, outre les états du contrat, les entrées et les sorties du contrat sont également signées et cryptées de bout en bout. Comme les requêtes sont signées, le contrat peut savoir qui est l'expéditeur d'une requête, de sorte que les développeurs de contrats peuvent concevoir un contrôle d'accès arbitraire dans les gestionnaires de requêtes, tout comme la programmation d'un service backend ordinaire. Cela n'était pas possible auparavant dans un contrat intelligent traditionnel.

> **Notes secondaires : Les variables privées ne sont pas privées sur Ethereum.**
>
> Bien que vous puissiez définir des variables avec un attribut "privé", les données restent publiques sur la blockchain. Selon la [documentation de solidity](https://solidity.readthedocs.io/en/v0.7.3/contracts.html):
> > Tout ce qui se trouve à l'intérieur d'un contrat est visible par tous les observateurs externes à la blockchain. Rendre quelque chose privé empêche seulement les autres contrats de lire ou de modifier l'information, mais elle sera toujours visible pour le monde entier en dehors de la blockchain.

## La racine de la confiance : TEE

Phala offre une garantie de confidentialité basée sur des hardwares de confiance, ou *Trusted Execution Environment*, ce qui signifie que votre code et vos données sont en sécurité même si votre système d'exploitation est compromis. Un contrat exécuté dans le TEE est comme le prêtre dans le confessionnal : Vous savez qui il est, vous pouvez lui dire ce que vous voulez et il vous répondra, mais seul Dieu sait ce qui s'y passe. La chose la plus importante est la suivante : Tous vos secrets sont en sécurité.

Phala adopte l'une des implémentations les plus populaires de TEE, à savoir Intel SGX. Intel SGX introduit un petit ensemble d'instructions pour crypter les données en mémoire, et les attaquants ne peuvent pas les décrypter sans craquer le processeur et extraire la clé secrète qu'il contient. Contrairement aux blockchains existantes dans lesquelles tous les états des contrats sont publics sur la chaîne, les états des contrats confidentiels sont cryptés et scellés dans SGX.

## Le réseau Phala en détail

Le réseau Phala est composé de trois éléments : les phala-nodes qui constituent la blockchain Phala, pRuntime et phost. Parmi eux, seul pRuntime vit dans TEE. Bien que les attaquants ne puissent pas pénétrer dans TEE, ils peuvent tromper les contrats dans TEE en forgeant des transactions ou en rejouant/réorganisant des transactions valides. Il est important de s'assurer que les contrats confidentiels n'acceptent que les transactions valides et traitent les transactions dans l'ordre attendu. C'est pourquoi nous introduisons la blockchain Phala et phost.

La blockchain Phala sert de source canonique de transactions valides. Seules les transactions soumises peuvent être acceptées par pRuntime, et elles seront traitées dans le même ordre que sur la blockchain. Nous implémentons un client de validation léger dans pRuntime afin qu'il soit capable de déterminer si les transactions valides sont acceptées dans l'ordre prévu. Un mécanisme de rotation des clés sera également introduit pour empêcher le rejeu des transactions historiques. Ce qui est génial, c'est que pRuntime vous cache tous ces détails d'implémentation compliqués, de sorte que vous pouvez simplement implémenter des contrats confidentiels comme vous développez des programmes ordinaires.

phost fonctionne comme un pont entre la blockchain Phala et pRuntime. Il garantit que toutes les transactions sur la blockchain sont fidèlement transmises à pRuntime et que toutes les instances TEE exécutent une version non modifiée de pRuntime.
