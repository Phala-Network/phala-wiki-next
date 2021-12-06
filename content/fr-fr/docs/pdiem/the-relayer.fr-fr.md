---
title: "Le Relayeur"
weight: 10007
draft: false
menu:
  docs:
    parent: "pDiem"
---

Le relayeur pdiem est le composant qui synchronise les données entre pdiem et la blockchain Diem. Il s'exécute hors chaîne, se connecte aux deux blockchains et surveille les transactions liées.

Code : [Phala-Network/pdiem-relayer](https://github.com/Phala-Network/pdiem-relayer).

## Qui fait fonctionner le relayeur ?

Tout le monde peut gérer un relais, et en théorie, un seul relayeur honnête est nécessaire pour faire fonctionner le bridge pDiem, car tous les messages soumis par le relayeur sont validés par la blockchain Diem ou le contrat pDiem. Cependant, plus il y a de relayeurs, plus la garantie de disponibilité peut être élevée.

Dans pdiem-m3, nous n'avons pas ajouté d'incitations pour les relais, mais étant donné qu'un relais doit soumettre des transactions sur les blockchains, ce qui entraîne des frais de gaz, nous envisagerions de permettre aux relais de prendre une petite partie des frais de transaction sur les transactions inter-chaînes comme une incitation de base.

Une solution alternative pourrait être de demander à l'utilisateur lui-même d'être son propre relais. Cependant, cela nécessite que l'utilisateur soit en ligne pendant un temps relativement long (probablement quelques minutes), et provoque ainsi une mauvaise expérience utilisateur.
