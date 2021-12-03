---
title: "Jouez avec pDiem"
weight: 10003
draft: false
menu:
  docs:
    parent: "pDiem"
---

![](/images/docs/pdiem/docker-compose-structure.png)

L'environnement de pDiem comprend:

- Un réseau local de test Diem : `diem`, `diem-cli`
- Un réseau local de test Phala Network avec le contrat pDiem: `phala-node`, `phala-pruntime`, `phala-phost`
- Un relayeur pour connecter les deux réseaux: `pdiem-relayer`

Avec l'environnement pDiem en cours d'exécution, nous allons envoyer des transactions Diem sur le compte de dépôt pDiem et vérifier si le contrat pDiem les a reçues..

## Créer des comptes Diem

Démarrez le diem-cli à partir du même répertoire avec la commande :

```bash
docker-compose run --rm --entrypoint /bin/bash -- diem-cli ./diem-cli.sh
```

![](/images/docs/pdiem/diem-cli.png)

Exécutez ensuite les commandes suivantes pour préparer les comptes :

```bash
# Create two accounts
diem% account create
diem% account create
# Mint some funds
diem% account mint 0 100 XUS
diem% account mint 1 100 XUS
```

L'outil `diem-cli` est un porte-feuille léger qui se connecte au nœud Diem via RPC. Il peut être utilisé pour gérer des comptes, transférer des jetons, et interroger la blockchain. Dans les étapes ci-dessus, nous avons créé deux comptes (indexés par 0 et 1), et nous avons transféré des jetons de test `XUS` sur les comptes.


{{< tip >}}
Parmi eux, le `compte 0` est un compte spécial qui est codé en dur dans le contrat de démonstration pdiem-m3 comme adresse de dépôt. Habituellement, `diem-cli` génère des comptes aléatoires. Mais dans la démo pdiem-m3, la clé pour générer les portefeuilles est fixée dans un fichier spécial [client.mnemonic](https://github.com/Phala-Network/phala-docker/blob/pdiem-m3/dockerfile.d/client.mnemonic) de sorte qu'il génère, en dur, le même compte à chaque fois.
{{< /tip >}}

## Simple transfert de Diem vers pDiem.

Le transfert simple fait référence au transfert entre l'adresse admin (`compte 0`, codé en dur dans le contrat pdiem-m3) et l'adresse de destination du paiement.

Pour envoyer des actifs Diem à pDiem, transférez-les simplement à l'adresse administrateur (`compte 0`) dans `diem-cli`. Par exemple, nous pouvons envoyer « 10 XUS » au « compte 0 » comme ceci :

```bash
diem% transfer 1 0 10 XUS
```

Et c'est tout!

En arrière-plan, `pdiem-relayer` récupère la transaction de dépôt, envoie une commande Substrate extrinsèque standard au contrat confidentiel `pdiem` sur Phala pour synchroniser la transaction. Après la validation de la transaction entrante et de la preuve, le contrat `pdiem` l'accepte. Habituellement, il faut 30 secondes pour que le relais prenne en compte la transaction et la transmette au contrat `pdiem`.

### Soldes en pDiem

```bash
./phala-console.sh pdiem-balances
```

### Transactions vérifiées

Toutes les transactions reçues par le contrat `pdiem` sont validées par rapport au dernier état du registre de Diem, qui est protégé par un consensus de type PoS. Les transactions validées sont stockées dans le stockage du contrat `pdiem`, et peuvent être vérifiées par n'importe qui :

```bash
./phala-console.sh pdiem-tx
```
## Préparer des sous-comptes pour le transfert bidirectionnel

pdiem-m3 utilise la fonction de sous-compte de Diem pour créer des comptes de dépôt. Tout utilisateur peut créer son sous-compte de dépôt Diem en envoyant une commande 'NewAccount' :

```bash
./phala-console.sh pdiem-new-account 0 '//Bob'
```

La commande ci-dessus enverra `Command::NewAccount` au contrat `pdiem` depuis le compte Substrate "Bob". Vous pouvez créer autant de comptes que vous le souhaitez. Il faut 2-3 blocs pour traiter la commande.

{{< tip >}}
Le premier argument de `pdiem-new-account` est l'identifiant de séquence de la transaction du nouveau compte sur Diem. Comme les autres blockchains, Diem exige également que chaque transaction ait un identifiant de séquence incrémenté. Ainsi, lorsque vous créez un nouveau sous-compte, exécutez `./phala-console.sh pdiem-new-account 1 '//Charlie'`.
{{< /tip >}}


Ensuite, vous pouvez obtenir une liste complète des comptes pDiem par une requête :

```bash
./phala-console.sh pdiem-balances
```

![](/images/docs/pdiem/pdiem-balances.png)

Comme le montre la capture d'écran, Bob vient de créer son adresse Diem de dépôt `4DB6A10FCEB765C55ADC3751474AE8D1`.

## Dépôt (diem → pdiem)

Obtenez votre adresse de dépôt de la dernière étape. Et maintenant, vous pouvez déposer du `XUS` du côté Diem dans diem-cli :

```bash
diem% transfer 0x57c76da2e144c0357336ace2f3f8ac9b 0x4DB6A10FCEB765C55ADC3751474AE8D1 10 XUS
```

{{< tip >}}
La commande de transfert dans `diem-cli` prend le compte source et le compte destination comme les deux premiers arguments. Elle accepte soit deux références de compte (par exemple 0 pour `compte 0` dans le portefeuille local), soit deux adresses codées en hexadécimal. Dans l'exemple ci-dessus, `0x57c76da2e144c0357336ace2f3f8ac9b` est le `compte 1` et `0x4DB6A10FCEB765C55ADC3751474AE8D1` est le sous-compte de dépôt de Bob.
{{< /tip >}}

Le transfert corss-chain prend environ 4 à 6 blocs. Vérifiez le solde avec la commande :

```bash
./phala-console.sh pdiem-balances
```

> Dans cet exemple, le compte Diem de Bob obtiendra « 10 XUS », qui est « 10000000 » sous le champ « free » dans les sorties « pdiem-balances » (6 décimales).

## Retirer (pdiem → diem)

Vous pouvez retirer des actifs de `pdiem` vers diem par `pdiem-withdraw`:

```bash
./phala-console.sh pdiem-withdraw 4DB6A10FCEB765C55ADC3751474AE8D1 '10 XUS' '//Bob'
```

Dans la commande ci-dessus, les arguments sont :

- `4DB6A10FCEB765C55ADC3751474AE8D1`: L'adresse Diem de retrait
- `'10 XUS'`: Le montant de l'actif
- `'//Bob'`: Le surnom de la clé privée du compte Substrat à retirer

{{< tip >}}
La commande `pdiem-withdraw` envoie une transaction `Command::TransferXUS` au contrat `pdiem` via la blockchain Phala Network. Le contrat crée alors une transaction Diem du sous-compte vers la cible de retrait, la signe et la pousse dans une file d'attente. Une fois que le `pdiem-relayer` a remarqué de nouvelles transactions dans la file d'attente, il les relaie vers la blockchain Diem.

Les transactions de retrait sont mises en file d'attente jusqu'à ce qu'elles soient confirmées sur Diem. Une fois confirmées, les transactions sortantes sont observées par le `pdiem-relayer`, et une preuve est renvoyée au contrat `pdiem`. Finalement, le contrat `pdiem` confirmera que les transactions de retrait soient exécutées.
{{< /tip >}}

Vous pouvez consulter votre solde `pdiem` à tout moment :

```bash
./phala-console.sh pdiem-balances
```

![](/images/docs/pdiem/withdraw-lock-confirmed.png)

Vous pouvez toujours voir le montant du retrait sous les soldes "verrouillés" jusqu'à ce que la transaction soit confirmée sur Diem. La capture d'écran ci-dessus a deux côtés. Le côté gauche montre que les fonds de retrait étaient verrouillés et en attente de confirmation, tandis que le côté droit montre que les fonds verrouillés ont été supprimés parce que la tx sortante est confirmée. Enfin, la séquence sous le compte de dépôt a été incrémentée à 1.
