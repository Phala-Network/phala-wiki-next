---
title: "pDiem"
weight: 99
draft: false
---

pDiem est une couche conforme de préservation de la vie privée pour [Diem](https://en.wikipedia.org/wiki/Diem_(digital_currency)) sur l'écosystème Polkadot. Alimentée par le contrat confidentiel de Phala Network, elle protège la vie privée des utilisateurs de Diem. Plus précisément, pDiem est :

- Un pont cross-chain reliant l'écosystème Polkadot aux millions d'utilisateurs de Diem, offrant ainsi une multitude de services et d'applications basés sur Polkadot aux détenteurs de Diem, mais aussi une rampe d'accès à une base d'utilisateurs massive pour Polkadot.
- Un stablecoin préservant la vie privée sur Polkadot qui est à la fois conforme (une seule transaction est limitée en valeur jusqu'aux exigences no-KYC du FATF-GAFI) et permet des transferts de valeur évolutifs en actifs stables (pensez aux transferts de fonds, aux dépenses quotidiennes, aux micro-paiements pour des services.). Imaginez que vous utilisiez votre compte courant sans qu'aucune banque ou fournisseur de crédit ne puisse suivre vos achats/dépenses.
- Un écosystème DApp préservant la vie privée, plus ouvert et plus libre que Novi (anciennement connu sous le nom de Calibra), exploité par Facebook.

> Le projet a été initialement nommé pLIBRA. "En décembre 2020, Libra a été rebaptisé Diem." Depuis lors, nous avons suivi le changement de nom de Diem, et ainsi renommé le projet en pDiem.

## Essayez-le

pDiem se situe à [l'étape 3](#web3-foundation-grants) du programme de subvention de la Fondation Web3. Cette étape se concentre sur le cœur du bridge : la validation des transactions de dépôt. Dans cette démo, vous pouvez connecter pDiem au testnet Diem, valider et accepter les transactions de dépôt entrantes.


{{< button "deploy-local-testnet" "Déployer un réseau de test en local" >}}

{{< button "play-with-pdiem" "Jouer avec pDiem" >}}


## Le système

![](/images/docs/pdiem/pdiem-system-design.png)

- **Le contrat pDiem** : Le cœur de pDiem, un contrat confidentiel qui valide et accepte les dépôts Diem et traite les demandes de retrait ;
- **Les relayeurs pDiem** : Les nœuds qui relaient les transactions de dépôt Diem au contrat pDiem, et diffusent les transactions de retrait à Diem ;
- **Phala Network** : Il exécute le contrat pDiem et relaie les transactions XCM entre pDiem et les autres parachains Polkadot.
- **Polkadot** : La chaîne de relais qui relie les parachains, y compris le réseau de Phala-Network ;
- **Parachains** : Autres blockchains de l'écosystème Polkadot que nous souhaitons servir ;
- **XCMP** : [Cross-chain Messaging Protocol](https://wiki.polkadot.network/docs/en/learn-crosschain).

Parmi les composants énumérés dans le diagramme, le **contrat pDiem** et les **relayeurs pDiem** constituent le cœur du protocole de bridge pDiem. Le contrat est déployé sur Phala Network. Il gère les transactions de dépôt et les demandes de retrait des utilisateurs sur Diem . Les relayeurs sont les contributeurs qui exécutent le programme "pDiem Relayer", qui relaient les transactions entre la blockchain Diem et le contrat pDiem.

pDiem reçoit des actifs de la blockchain Diem, génère des **tokens pdiem bridgés** du côté de Polkadot, et peut également les transférer pour racheter les actifs originaux. Ceci est réalisé par une combinaison de différents composants. Dans la documentation, nous présenterons :

- [Le modèle basé sur la réservation]({{< relref "docs/pdiem/reservation-based-model" >}}),
- [Le client de validation léger]({{< relref "docs/pdiem/light-validation-client.md" >}},
- et sa [Mise en œuvre du contrat]({{< relref "docs/pdiem/contract-implementation.md" >}}),
- [Le relais]({{< relref "docs/pdiem/the-relayer.md" >}}),
- et enfin, les [Travaux futurs](< relref "docs/pdiem/future-works.md" >).

Supplément:

- [Avancé : Mode matériel]({{< relref "docs/pdiem/hardware-mode" >}})

## Le programme de subvention de la Foundation Web3

pDiem a reçu [une subvention générale](https://github.com/w3f/General-Grants-Program/blob/8a23ef68c7512fa0d437554640601ef28cea3fca/grants/speculative/pLIBRA.md) de la Web3 Foundataion le 28 août 2019. Dans le plan de subvention, nous avons divisé la progression du développement en quelques étapes, comme indiqué ci-dessous.
<table>
    <thead>
        <tr>
            <th></th>
            <th>Date</th>
            <th>Etape</th>
            <th>Avancement</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>✅</td>
            <td>Sep 2019</td>
            <td>M1</td>
            <td>
                Le livre blanc technique. (<a href="https://files.phala.network/phala-paper.pdf">PDF</a>, <a href="https://docs.google.com/document/d/e/2PACX-1vRpkf-xvEwDSglNHMKI2J8qC7F4JiB7kLv5kOwO_mJzg-bYRL545_3JxWaM-0rCX_iyHDb68zk3Sw75/pub">One Pager</a>)
            </td>
        </tr>
        <tr>
            <td>✅</td>
            <td>Mar 2020</td>
            <td>M2</td>
            <td>
                Une mise en œuvre minimale de Contrat Confidentiel (Phala Network) sur Substrat. (<a href="https://github.com/Phala-Network/phala-blockchain">Repo</a>)
            </td>
        </tr>
        <tr>
            <td>✅</td>
            <td>2021Q1</td>
            <td>M3</td>
            <td>
                Le bridge avec un client de validation leger dans un contrat confidentiel. (<a href="https://github.com/Phala-Network/phala-blockchain/blob/master/standalone/pruntime/enclave/src/contracts/diem.rs">Contract</a>, <a href="https://github.com/Phala-Network/phala-blockchain/tree/master/diem">Light Client</a>, <a href="https://github.com/Phala-Network/pdiem-relayer">Relayer</a>)
            </td>
        </tr>
        <tr>
            <td>⌛</td>
            <td>Est. 2021Q2</td>
            <td>M4</td>
            <td>
                Un réseau de test finalisé avec son interface graphique (integré avec le  <a href="https://app.phala.network"> portefeuille anonyme de Phala</a>)
            </td>
        </tr>
    </tbody>
</table>

<a href="https://github.com/w3f/General-Grants-Program/blob/8a23ef68c7512fa0d437554640601ef28cea3fca/grants/speculative/pLIBRA.md">
    <img src="/static/images/docs/web3%20foundation_grants_badge_black.svg" alt="w3f grant receiver" style="background-color: withe; height: 100px;">
</a>
