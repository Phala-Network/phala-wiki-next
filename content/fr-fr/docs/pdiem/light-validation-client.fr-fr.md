---
title: "Client pour la validation légère"
weight: 10005
draft: false
menu:
  docs:
    parent: "pDiem"
---

## Les bases.

Un bridge cross-chain peut transférer des actifs entre les deux blockchains. Dans le modèle basé sur la réservation, il faut que la blockchain locale puisse confirmer certains dépôts sur ses comptes souverains, et que la blockchain distante puisse confirmer les commandes de retrait de la blockchain locale. La validation de la blockchain est effectuée par des nœuds complets. Cependant ils sont trop lourds pour être intégrés dans un contrat intelligent ou une blockchain, en termes de calcul et de stockage. À la place, la validation est généralement effectuée par un *client léger*.

Un client léger est un mini-client qui peut vérifier certaines déclarations sur une blockchain, mais qui ne nécessite pas une synchronisation et une validation complètes de l'historique de la blockchain. Sur les blockchains PoW, la validation peut être effectuée par des clients SPV. Sur les blockchains PoS, elle peut être effectuée par des clients de validation légers. Les clients sont conçus pour fonctionner avec l'algorithme de consensus correspondant.

Le pont pDiem possède un client léger Diem pour valider les transactions de dépôt entrantes. Cependant, il n'a pas besoin d'un client léger du côté distant, car il peut agir comme un porte-monnaie Diem et signer des transactions ordinaires pour retirer les actifs.

## Le client léger.

Une blockchain fonctionne en obtenant un consensus entre les pairs du réseau. Un système de consensus typique gère l'ordonnancement et la finalisation des transactions des utilisateurs. Lorsqu'une transaction est finalisée, son existence et son comportement sont finalisés et protégés contre toute modification. Par conséquent, un client léger valide la finalisation d'une transaction.

> Un modèle typique consiste à regrouper les transactions par blocs. Ainsi, nous disons également qu'un bloc est finalisé, au lieu de dire qu'une transaction est finalisée. Cependant, ce n'est pas toujours le cas, et Diem en est un exemple.

Les transactions sont finalisées parce qu'elles reçoivent suffisamment de votes. Le pouvoir de vote peut varier selon le système consensuel. Sur la blockchain PoS avec l'algorithme de consensus de la [famille BFT](https://fr.wikipedia.org/wiki/Panne_byzantine), un bloc est finalisé s'il peut obtenir plus de 2/3 des signatures par les validateurs. Pour valider la finalisation d'une blockchain, nous validons la signature contre la clé publique des validateurs.

Un client léger ne peut valider que l'inclusion d'un certain bloc sur une blockchain. Pour valider d'autres demandes, par exemple l'existence d'une transaction ou d'une sortie par l'invocation d'un contrat intelligent, il s'appuie sur des résumés spéciaux dans les en-têtes de bloc. Une pratique courante consiste à inclure un [arbre de Merkle](https://fr.wikipedia.org/wiki/Arbre_de_Merkle#:~:text=En%20informatique%20et%20en%20cryptographie,par%20Ralph%20Merkle%20en%201979). de transaction et un arbre de Merkle d'état dans l'en-tête de bloc. De cette façon, tant que l'en-tête de bloc est validé par un client léger et qu'il existe une preuve Merkle valide entre la demande et l'arbre de Merkle, nous pouvons être convaincus que la demande est vraie.

## La blockchain Diem

La blockchain Diem utilise un système de consensus typique de la famille BFT. Les validateurs de Diem sont responsables de la production et de la finalisation des blocs, et de l'horodatage des transactions. Bien que les blocs soient effectivement produits et utilisés dans le processus de consensus, une différence notable est que le système n'expose que les transactions plutôt que les blocs.

Sur Diem, chaque transaction modifie les états de la blockchain et crée une nouvelle vue de la blockchain, appelée [l'état du registre](https://developers.diem.com/docs/core/diem-protocol#transactions-and-states). La base de données de la blockchain est versionnée. À chaque version de l'état du registre, elle produit également les métadonnées comprenant l'arbre Merkle des transactions historiques complètes et l'état de stockage, dans le même but que l'en-tête de bloc.

Les informations de l'état du registre sont stockées à chaque version dans un `LedgerInfo` et sont signées par les validateurs. `LedgerInfo` peut être vérifié avec la clé publique de l'ensemble des validateurs. Une fois qu'un `LedgerInfo` est considéré comme valide, les métadonnées qu'il contient peuvent être utilisées pour valider d'autres demandes de la blockchain ou certains états historiques, dont :

- les transactions
- les logs (les événements émis par une transaction)
- le stockage (certaines données stockées dans les ressources du compte)

Voir également : [Hiérarchie de stockage de la blockchain Diem](https://github.com/diem/diem/tree/master/storage)
