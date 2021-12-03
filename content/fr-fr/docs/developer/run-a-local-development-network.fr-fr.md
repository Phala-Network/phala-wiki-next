---
title: "1.1 Lançer un réseau de développement local"
---

> Une compréhension de base du shell Linux et de la compilation est nécessaire pour suivre ce tutoriel.

## Aperçu

Dans ce tutoriel, nous allons mettre en place un environnement de développement "Hello World". Nous allons déployer une pile complète de la blockchain principale et connecter l'interface utilisateur Web à la blockchain. À la fin du tutoriel, vous serez en mesure :

- D'envoyer des transactions confidentielles
- D'obtenir une version prêt-à-hacker de Phala Network pour construire vos propres applications confidentielles.

Une pile Phala Network complète comprend trois composants, plus une interface Web. Les composants de base se trouvent sur [Phala-Network/phala-blockchain](https://github.com/Phala-Network/phala-blockchain):

- `phala-node`: Le nœud de la blockchain Substrate
- `pRuntime`: Le runtime TEE. Les contrats s'exécutent dans pRuntime
- `phost`: Le relais de pont Substrate-TEE. Connecte la blockchain et pRuntime

L'interface utilisateur Web se trouve sur [Phala-Network/apps-ng](https://github.com/Phala-Network/apps-ng). L'interface Web doit se connecter à la fois à la blockchain et au pRuntime afin d'envoyer des transactions et des requêtes.


## Environnement

L'environnement de développement de Phala Network nécessite Linux, parce qu'il s'appuie sur [Linux Intel SGX SDK](https://01.org/intel-software-guard-extensions/downloads). Les machines virtuelles devraient généralement fonctionner. Phala Network ne fonctionne pas nativement sur Windows ou macOS (désolé, amateurs de Mac), mais nous n'avons pas encore testé WLS. Faites-nous savoir si vous êtes le premier à l'exécuter avec succès sur WLS !

Dans ce tutoriel, nous supposons que le système d'exploitation est *Ubuntu 18.04*. Bien qu'il n'ait pas encore été testé, il devrait fonctionner avec Ubuntu 20.04 prêt à l'emploi. D'autres distributions Linux devraient également fonctionner, mais les instructions peuvent varier.

Il est nécessaire d'avoir au moins 4 cœurs et 8 Go de RAM pour construire le projet, y compris le noyau de la blockchain et l'interface Web. Si vous avez moins de 4 Go de RAM, vous risquez de ne pas pouvoir construire l'interface utilisateur Web.

Suivez les commandes ci-dessous pour préparer l'environnement. Certaines peuvent être ignorées si elles sont déjà installées.

* Installer les dépendances au niveau du système

    ```bash
    sudo apt update
    sudo apt install -y build-essential ocaml ocamlbuild automake autoconf libtool wget python libssl-dev git cmake perl pkg-config curl llvm-10 clang-10 libclang-10-dev
    ```

    > Notes sur LLVM : Nous avons besoin d'au moins LLVM-9, mais les versions supérieures sont également prises en charge. Les versions plus anciennes comme LLVM 6.0 ne permettent pas la compilation de la blockchain.

* Installez Rust. Veuillez choisir la chaîne d'outils par défaut

    ```bash
    curl https://sh.rustup.rs -sSf | sh
    source ~/.cargo/env
    ```

* Installer le SDK Intel SGX

    ```bash
    wget https://download.01.org/intel-sgx/sgx-linux/2.12/distro/ubuntu18.04-server/sgx_linux_x64_sdk_2.12.100.3.bin
    chmod +x ./sgx_linux_x64_sdk_2.12.100.3.bin
    echo -e 'no\n/opt/intel' | sudo ./sgx_linux_x64_sdk_2.12.100.3.bin
    source /opt/intel/sgxsdk/environment
    ```

    > Vous pouvez ajouter `source /opt/sgxsdk/environment` à votre `~/.bashrc` (ou `~/.zshrc` dépend du shell que vous utilisez).

* Install Node.js (>= v12) & yarn 2

    ```bash
    curl -sL https://deb.nodesource.com/setup_current.x | sudo -E bash -
    sudo apt-get install -y nodejs
    sudo npm install -g yarn
    yarn set version berry
    ```

Vous pouvez tester l'installation en exécutant les commandes suivantes. La sortie devrait correspondre aux sorties de l'échantillon, ou avec une version légèrement supérieure.

```bash
rustup --version
# rustup 1.22.1 (b01adbbc3 2020-07-08)

cargo --version
# cargo 1.46.0 (149022b1d 2020-07-17)

echo $SGX_SDK
# /opt/intel/sgxsdk

# LLVM-9 or higher versions are fine
llvm-ar-10 --version
# LLVM (http://llvm.org/):
#   LLVM version 10.0.0

node --version
# v12.16.3

yarn --version
# 2.1.1
```

Enfin, clonons le code et exécutons le script d'initialisation pour mettre à jour la toolchain Rust. Veuillez noter que l'ensemble du tutoriel se trouve sur la branche **`helloworld`** à la fois pour la blockchain et le repo Web UI.

```bash
# Clone the core blockchain repo
git clone --branch helloworld https://github.com/Phala-Network/phala-blockchain.git
# Clone the Web UI repo
git clone --branch helloworld https://github.com/Phala-Network/apps-ng.git

# Run the init script to update Rust toolchain and git submodule
cd phala-blockchain/
git submodule update --init
./scripts/init.sh
cd ..

# Update the git submodule
cd apps-ng/
git submodule update --init
cd ..
```

## Construire le noyau de la blockchain

Maintenant nous avons déjà les deux dépôts `phala-blockchain` et `apps-ng` dans le répertoire de travail. Commençons par construire le noyau de la blockchain. La blockchain sur la branche **`helloworld`** est basée sur une ancienne version de Substrate, donc nous utiliserons une ancienne version de Rust pour la construire.

```bash
# Build the core blockchain
rustup install nightly-2020-10-01-x86_64-unknown-linux-gnu
rustup target add wasm32-unknown-unknown --toolchain nightly-2020-10-01
cd phala-blockchain/
cargo +nightly-2020-10-01 build --release

# Build pRuntime (TEE Enclave)
cd ./pruntime/
SGX_MODE=SW make
```

> **Notes sur la construction du noyau de la blockchain**
>
> Vous utilisez généralement la dernière version de Substrate et le compilateur Rust pour construire le noyau de la blockchain. La construction serait donc simplifiée avec :
> ```bash
> # Build the core blockchain
> cd phala-blockchain/
> cargo build --release
> ```

La compilation prend entre 20 et 60 minutes, selon votre connexion Internet et les performances de votre processeur. Après la compilation, vous obtiendrez les trois fichiers binaires :

- `./target/release/phala-node`: The Substrate node
- `./target/release/phost`: The Substrate-to-TEE bridge relayer
- `./pruntime/bin/app`: The TEE worker

> **Notes sur `SGX_MODE`**
>
Le SDK SGX supporte le mode de simulation logiciel et le mode matériel. `SGX_MODE=SW` active le mode de simulation. Le mode logiciel est destiné à un développement facile, où l'enclave matérielle n'est pas nécessaire. Vous pouvez même l'exécuter sur une machine virtuelle ou un ordinateur avec un cpu AMD. Cependant, seul le mode matériel peut garantir la sécurité et la confidentialité de l'exécution de confiance. Pour activer le mode matériel, vous devez installer [Intel SGX DCAP Driver](https://download.01.org/intel-sgx/sgx-dcap/1.8/linux/distro/ubuntu18.04-server/) et le logiciel de plateforme fourni avec le pilote, et passer `SGX_MODE=HW` à la chaîne d'outils.

Les trois composants centraux de la blockchain fonctionnent ensemble pour apporter toutes les fonctionnalités. Parmi eux, `phala-node` et `pruntime` doivent être lancés en premier, et `phost` suit :

```bash
# In terminal window 1: phala-node
./target/release/phala-node --dev

# In terminal window 2: pruntime
cd pruntime/bin
./app

# In terminal window 3: phost
./target/release/phost --dev
```

![](/images/docs/developer/core-terminal.gif)

(Les composants de base s'exécutent et produisent des journaux)

Une fois qu'ils sont lancés avec succès, ils devraient produire des logs comme montré dans le GIF ci-dessus. Remarquez que nous passons le drapeau `--dev` à `phala-node` et `phost` pour indiquer que nous sommes dans le réseau de développement.

Les trois composants principaux de la blockchain sont connectés via TCP (WebSocket et HTTP). Veuillez vous assurer que les ports TCP de votre système ne sont pas occupés par d'autres programmes. Par défaut, ils utilisent les ports suivants :

- `phala-node`
    - 9944 : Port RPC de Substrate WebSocket
    - 30333 : Port réseau P2P Substrate
- `pruntime`
    - 8000 : Port HTTP Restful RPC

`phost` n'écoute aucun port mais se connecte au port WebSocket de `phala-node` et au port HTTP RPC de `pruntime`.

Vous pouvez arrêter les trois programmes en toute sécurité par <kbd>Ctrl</kbd> + <kbd>C</kbd>. `phala-node` sauvegarde la base de données blockchain sur votre disque. Donc, si la blockchain se dérègle, vous pouvez la réinitialiser par :

```bash
./target/release/phala-node purge-chain --dev
```

## Build the Web UI

L'interface Web est développée avec `node.js`, `yarn` et `react`. Il est facile de construire et de lancer le frontal.

```bash
cd apps-ng
yarn
yarn dev
```

Cela peut prendre quelques minutes pour télécharger les dépendances et construire le frontend. Par défaut, la page est servie à <http://localhost:3000>. Assurez-vous donc que le port 3000 est disponible. Ensuite, il devrait produire quelques logs comme ci-dessous :

```log
ready - started server on http://localhost:3000
> Using "webpackDevMiddleware" config function defined in default.
> Using external babel configuration
event - compiled successfully
event - build page: /[...slug]
event - build page: /
event - compiled successfully
```

![](/images/docs/developer/apps-ng-landing.png)
(Page d'accueil de l'interface utilisateur Web)

L'interface Web se connecte à la fois à `phala-node` et à `pruntime` par leurs points de terminaison RPC par défaut. Si tout est configuré correctement, vous verrez l'écran de déverrouillage du portefeuille dans la page d'accueil comme indiqué ci-dessus. Vous devriez être en mesure de sélectionner les comptes de développement bien connus (Alice, Bob, etc) dans la boîte de dépôt.

> **Notes pour l'accès à distance**
>
> Dans le cas où vous exécuteriez votre blockchain et l'interface Web sur votre REMOTE_SERVER et essayez d'y accéder ailleurs, vous pouvez transférer les ports avec la commande `ssh`. Par exemple,
> ```bash
> ssh -N -f USER@REMOTE_SERVER -L 3000:localhost:3000 -L 9944:localhost:9944 -L 8000:localhost:8000
> ```
> Cela permet de transférer tous les ports nécessaires :
> - 3000 : port HTTP de l'interface Web
> - 9944 : Port Substrate WebSocket RPC de `phala-node`.
> - 8000 : Port HTTP Restful RPC de `pruntime`.
>
> et vous pouvez visiter l'interface Web à l'adresse <http://localhost:3000>.

## Envoyez des jetons secrets.

Dans les deux dernières sections, nous avons construit et lancé `phala-node`, `pruntime`, et `phost` en mode développement, et connecté l'interface Web au réseau de développement. Maintenant, nous sommes prêts à essayer la fonctionnalité de porte-monnaie secret dans le réseau Phala !

Sélectionnons Alice et déverrouillons le porte-monnaie. Alice est un compte test intégré avec 10,000 PHA sur la blockchain. Ce jeton PHA est le jeton natif. Il est transparent sur la chaîne comme une blockchain Substrate typique, géré par la palette Balances.

![](/images/docs/developer/apps-ng-init-wallet.png)
(Dapp de portefeuille secret)

Cependant, le portefeuille "actifs secrets" ci-dessous est très différent. Les actifs secrets sont stockés dans des contrats confidentiels à l'intérieur des enclaves TEE. Comme son nom l'indique, les actifs secrets sont privés et invisibles sur la blockchain.

Cliquez sur le bouton "Convert to Secret PHA" pour transférer **PHA** vers **Secret PHA**. Vous verrez d'abord votre solde PHA diminuer, et après une dizaine de secondes, le solde PHA secret augmentera du même montant, à l'exception de quelques frais de transaction.

> Que vient-il de se passer ?
>
> > Vous avez créé une transaction Substrate pour envoyer des fonds à la palette Phala. Les fonds sont stockés dans la palette, et cela a déclenché une transaction **confidentielle** pour émettre le même montant de jeton dans le portefeuille secret dans les enclaves TEE.
>
> Il faut ~6s pour inclure une transaction Substrate dans la blockchain, puis encore 6s pour finaliser le bloc. Une fois la transaction finalisée, elle déclenche un événement "TransferToTee", relayé à `pruntime` via le relais, et le contrat confidentiel augmente le solde. Enfin, l'interface Web interroge le contrat confidentiel pour obtenir le solde mis à jour.

Il y a beaucoup d'autres choses que vous pouvez essayer avec le porte-feuille secret :

- reconvertir les actifs secrets en actifs sur la chaîne ;
- transférer les actifs secrets comme des actifs ordinaires sur chaque blockchain Substrate ;
- et même émettre ou détruire vos propres jetons secrets.

Toutes les fonctions ci-dessus sont réalisées par transaction confidentielle. Personne ne peut voir le contenu de la transaction, car le corps de celle-ci est crypté. En cliquant sur le bouton "Polkadot UI" dans la barre de navigation, cela vous amènera aux applications polkadot.js que vous connaissez. Après avoir envoyé une transaction chiffrée en cliquant sur le bouton "Secret Transfer", vous pouvez trouver la transaction chiffrée enveloppée par l'extrinsèque `phalaModel.pushCommand` à partir de l'explorateur de blocs comme indiqué ci-dessous.

<img src="/images/docs/polkadotjs-pushCommand.png" style="max-height: 200px;">

(Une transaction confidentielle cryptée sur un explorateur de blockchain)

## Conclusion

Félicitations ! Enfin, vous avez suivi le tutoriel pour :

- Préparer un environnement de développement prêt-à-hacker.
- Télécharger, construire et démarrer un mode de développement full stack Phala Network
- Se connecter au réseau via l'interface Web et essayer le dapp secret wallet.

Vous êtes maintenant familiarisé avec la construction et le fonctionnement d'un réseau de développement. Tenez bon ! Dans le prochain chapitre, nous allons construire ensemble le premier contrat confidentiel !

### Soumettez votre travail.

>Ce hackathon s'est terminé le 13 novembre 2020

Ce tutoriel fait partie du [Polkadot "Hello World" virtual hackathon challenge](https://gitcoin.co/hackathon/polkadot/onboard) à gitcoin.co. Afin de gagner la tâche, veuillez faire les choses suivantes :

1. Faites des captures d'écran de la fenêtre du terminal avec la blockchain principale en cours d'exécution (`phala-node`, `pruntime`, et `phost`).
2. Prenez une capture d'écran de votre jeton secret émis par l'utilisateur.
3. Envoyez la capture d'écran et partagez votre sentiment sur Twitter.
4. Rejoignez notre [serveur Discord](https://discord.gg/zzhfUjU) et envoyez le lien vers votre tweet.

