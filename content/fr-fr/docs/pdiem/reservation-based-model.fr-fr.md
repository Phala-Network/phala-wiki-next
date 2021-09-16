---
title: "Modèle basé sur la réservation"
weight: 3
draft: false
---

Un bridge relie la blockchain locale à une blockchain distante. pDiem suit le modèle de transfert d'actifs cross-chain " réservation d'actifs " (voir le modèle équivalent défini dans [XCM Format](https://github.com/paritytech/xcm-format#depositreserveasset)). Dans notre cas, pDiem (et sa parachain) est la blockchain locale, et Diem est la blockchain distante.

Le bridge pDiem contrôle un ensemble de comptes souverains (voir [XCM Format - Definitions](https://github.com/paritytech/xcm-format#definitions)) du côté de Diem, qui détiennent tous les actifs de Diem transférés côté pDiem. Le contrat pDiem a un registre intégré pour stocker le propriétaire des actifs Diem dans les comptes souverains.

## Dépôt

Lorsqu'un utilisateur transfère des actifs Diem du côté de Polkadot, il envoie d'abord les actifs à son adresse de dépôt générée par le contrat pDiem (donc un compte souverain), indiquée par une transaction de dépôt. Ensuite, un ou plusieurs relais pDiem relaient la transaction de dépôt ainsi que la preuve cryptographique suffisante au contrat pDiem. Le contrat valide la transaction de dépôt qu'il reçoit, et ajoute le montant correspondant au registre.

## Transfert

Le registre pDiem expose une série de p-tokens du côté parachain (*pXUS* à *XUS* sur Diem), qui peuvent être transférés entre les comptes Polkadot comme n'importe quel token typique. Le contrat pDiem suit également la norme des jetons Polkadot XCM. Il peut donc être transféré entre n'importe quel parachain qui accepte les actifs XCM standard.

> Actuellement, Diem a un jeton natif intégré `XUS`, mais sa conception supporte plusieurs jetons. Lorsque plusieurs jetons existent, pDiem peut accepter n'importe quel nombre de jetons différents, et le registre du contrat pDiem reflétera tous les actifs de la réserve en conséquence.

## Retrait

Lorsqu'un utilisateur souhaite retirer *pXUS* sur la blockchain Diem, il envoie une demande au contrat pDiem. Le contrat brûlera le jeton, et signera une transaction Diem pour débloquer le jeton du compte souverain vers le compte de retrait. La transaction sera diffusée par les relais et prendra effet une fois confirmée par la blockchain Diem.
