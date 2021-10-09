---
title: "Spécifications techniques"
weight: 1
draft: false
---

Ce document décrit les spécifications techniques du Phala-Network, y compris le protocole global, la structure et l'algorithme détaillés des données. Ce travail est encore en cours.

## Les entités Blockchain

Dans Phala-Network, il existe trois types d'entités :

- _Client_, qui fonctionne sur des appareils normaux sans aucune exigence matérielle particulière ;
- _Worker_, qui fonctionne sur TEE (_Trusted Execution Environment_ / Environnement d'exécution de confiance) et sert de nœuds de calcul pour les contrats intelligents confidentiels ;
- _Gatekeeper_, qui opère sur TEE et sert d'autorités et de gestionnaires de clés ;

Nous présentons les interactions entre les différentes entités comme ci-dessous :
![Phala Network](/images/docs/spec/phala-design.png)

La conception de base de Phala Network visait à assurer la sécurité et la confidentialité de la blockchain et des contrats intelligents qui s'y trouvent. Avec ces améliorations de sécurité, Phala Network est capable de se défendre des attaques avancées.

### Initialisation d'une clé d'entité

Dans Phala, la communication entre toutes les entités doit être cryptée, de sorte que chaque entité génère les paires de clés d'entité ci-dessous à l'aide d'un générateur de nombres pseudo-aléatoires lors de l'initialisation :

1. `Clé d'identité`
   - une paire de clés "secp256k1" pour identifier de manière unique une entité ;
2. `Clé Ecdh`
   - une paire de clés "secp256r1" pour une communication sécurisée ;

> **[Amélioration]**
>
> Changez à la fois `IdentityKey` et `EcdhKey` en `sr25519` à l'avenir. [Le groupe Ristretto](https://ristretto.group/) dispose d'un bon écosystème en Rust (qui peut être facilement compilé en WASM) et JavaScript, même avec le support ECDH.

Pour les clients, les paires de clés sont générées par le portefeuille de l'utilisateur. Alors que pour les workers et les gateKeepers, les paires de clés sont entièrement gérées par `pRuntime` et leur utilisation est strictement limitée.

### L'Initialisation de `pRuntime`

Lors de l'initialisation, `pRuntime` génère automatiquement les paires de clés d'entité ci-dessus avec un générateur de nombres pseudo-aléatoires. Les paires de clés générées sont gérées dans `pRuntime` dans TEE, ce qui signifie que les workers et les contrôleurs d'accès ne peuvent l'utiliser qu'avec les API limitées exportées par `pRuntime`, et ne peuvent jamais obtenir les paires de clés en clair pour lire les données chiffrées hors de TEE.

Les paires de clés générées peuvent être chiffrées localement et mises en cache sur le disque par « SGX Sealing / Scellage SGX ». Elles peuvent être déchiffrées et chargées lors du redémarrage. Cela s'applique à la fois aux gateKeepers et aux workers.

### Les canaux de communication sécurisés

La clé publique « EcdhKey » dans le « pRuntime » d'un worker ou d'un gateKeeper est accessible au public. Par conséquent, un [protocole d'accord de clé ECDH](https://wiki.openssl.org/index.php/Elliptic_Curve_Diffie_Hellman) peut être appliqué pour établir un canal de communication sécurisé entre un worker (ou gateKeeper) et toute autre entité de manière non interactive.

Un canal entre deux entités « A » et « B » est désigné par $Channel(Pk_A, Pk_B)$, où $Pk_A$ et $Pk_B$ sont les clés publiques de leurs paires de clés ECDH correspondantes. Un secret partagé peut être dérivé de sa clé privée ECDH et de la clé publique de son homologue via l'algorithme Diffie Hellman. Ensuite, la clé de communication finale `CommKey(A, B)` peut être calculée via une fonction unidirectionnelle. `CommKey(A, B)` est utilisé pour crypter les messages entre les deux entités.

{{< tip >}}
Dans le pré-mainnet, la « EcdhKey » est une paire de clés « secp256r1 ». Nous pouvons adopter les [fonctions de dérivation de clé enfant (CKD)](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#child-key-derivation-ckd-functions) de Bitcoin BIP32 pour dériver `CommKey(A, B)` la clé convenue par ECDH.

Les messages sont E2EE avec `aes-gcm-256`.
{{< /tip >}}

> **[Amélioration]**
> Lorsque nous passons à sr25519, nous devrions adopter l'algorithme de dérivation de clé de Substrate au lieu de BIP32.

La clé publique des entités est enregistrée sur la chaîne. Nous pouvons donc construire des canaux de communication en chaîne ou hors chaîne :

- Communication en chaîne

1. « A » et « B » connaissent chacun la clé publique de l'autre à partir de la blockchain. Ils peuvent dériver `CommKey(A, B)`;
2. « A » envoie un message chiffré crypté par « CommKey(A, B) » à la blockchain ;
3. « B » le reçoit et le déchiffre avec « CommKey(A, B) » ;

- Hors chaîne (`A` est hors chaîne et `B` est un worker en chaîne) Communication

1. « A » peut connaître la clé publique de « B » à partir de la blockchain et dériver « CommKey(A, B) » ;
2. « A » connait le point de terminaison API de « B » à partir de son « WorkerInfo » dans « WorkerState » sur la chaîne ;
3. « A » envoi un message chiffré signé (crypté par « CommKey(A, B) ») avec sa clé publique à « B » directement ;
4. « B » obtient la clé publique de « A » à partir du message et dérive « CommKey(A, B) » pour la déchiffrer ;

#### #### Exemple de charge utile client-worker

Un client communique avec un worker uniquement pour l'invocation d'un contrat. Un appel est composé d'au moins des charges utiles suivantes.

```js
{
    from: Client_IdentityKey,
    payload: {
        to: Contract_IdentityKey,
        input: "0xdeadbeef",
    },
    nonce: 12345,
    sig: UserSignature,
}
```

- `nonce` est nécessaire pour se défendre contre les doubles dépenses et les attaques par répétition.
- Le champ `from` affiche l'identité de l'appelant et peut être vérifié avec `sig`. `from` sera ensuite transmis au contrat.

- Étant donné qu'un worker peut exécuter plusieurs contrats (ou même différentes instances du même contrat), `to` est nécessaire pour spécifier la cible d'appel.
- `input` code la fonction et les arguments invoqués, il doit être sérialisé selon l'ABI des contrats.

> **[Amélioration]**
>
> ### Sérialisation
>
> Actuellement, les charges utiles sont sérialisées dans un Un JSON adapté aux navigateurs, mais c'est très peu efficace en termes d'espace. Utilisez plutôt un format binaire compact (par exemple Protobuf, parity-scale-codec).
>
> ### `EcdhKey` Rotation
>
> Contrairement à la `IdentityKey` qui montre l'identité d'un worker ou d'un gateKeeper, celle-ci ne doit pas être modifiée, nous recommandons une rotation régulière de la `EcdhKey` pour assurer la sécurité des canaux de communication entre les différentes entités. À l'avenir, `pRuntime` fera automatiquement tourner la clé gérée `EcdhKey` après un certain intervalle de temps.

## Worker

### Enregistrement du Worker

Avant qu'un worker ou un gateKeeper puisse rejoindre le réseau, il doit être enregistré. Toutes les parties avec des appareils pris en charge par TEE peuvent servir de worker. Pour s'inscrire en tant que worker vérifié dans la blockchain, les mineurs TEE doivent exécuter « pRuntime » et envoyer un rapport d'attestation signé aux gateKeepers.

`pRuntime` demande une attestation à distance avec un hachage du `WorkerInfo` validé dans le rapport d'attestation. `WorkerInfo` inclut la clé publique de `IdentityKey` et `EcdhKey`, ainsi que des données collectées à partir de l'enclave. En vérifiant le rapport, les contrôleurs peuvent connaître les informations matérielles des workers et s'assurer qu'ils exécutent un « pRuntime » non modifié.

### Attestation à distance

Le rapport d'attestation est relayé à la blockchain par l'appel `register_worker()`. La blockchain dispose des certificats de confiance pour valider le rapport d'attestation. Il valide les points suivants :

1. La signature du rapport doit être correcte ;
2. Le hachage intégré dans le rapport doit correspondre au hachage du `WorkerInfo` soumis ;

`register_worker()` est appelé par les workers, et un worker ne peut se voir attribuer des contrats que lorsqu'il dispose d'un certain nombre de jetons PHA de jalonnement. Sur la blockchain, il existe une carte « WorkerState » du worker à l'entrée `WorkerInfo`. Les gateKeepers mettront à jour la carte `WorkerState` après avoir reçu et vérifié les `WorkerInfo` soumis.

### Détection des workers hors ligne

Le « pRuntime » d'un worker est régulièrement requis pour répondre au défi en ligne en tant qu'événement de pulsation sur la chaîne. La blockchain détecte la vivacité des workers en surveillant l'intervalle de leurs pulsations. Un worker est puni par la perte de ses jetons de jalonnement s'il se déconnecte pendant l'exécution du contrat.

> **[Amélioration]**
>
> Les déployeurs de contrat sont autorisés à définir un délai d'expiration configurable pour l'exécution du contrat. Par conséquent, une exécution est considérée comme ayant échoué si le worker ne fournit pas les résultats dans le délai imparti. Une pénalité mineure (par rapport à une pénalité hors ligne) doit être payée.

> **[À FAIRE : Implémentation actuelle]**
>
> Maintenant, nous avons un défi aléatoire pour les workers. Si un worker répond correctement au défi, il est récompensé (basé sur la tokenomique). Sinon, s'il ne répond pas dans un délai imparti, il est coupé.
>
> Sous réserve de modifications : on peut vouloir occuper à 100% les cycles CPU.

## GateKeeper

### Élection du gateKeeper

Les gatekeepers partagent le même « pRuntime » que les workers normaux. Pour distinguer les gatekeepers, leurs clés publiques "IdentityKey" sont enregistrées dans la liste "GatekeeperState" sur la blockchain.

Dans le pré-mainnet de Phala Network, la liste des gatekeepers est codée en dur dans le bloc de genèse de la blockchain.

> **[Amélioration]**
>
> Les gatekeepers sont élus sur la blockchain par un mécanisme NPoS similaire à Polkadot. Ceci est fait par la palette `Staking`, où les nominateurs peuvent mettre en jeu leurs jetons et voter pour leurs gatekeepers de confiance. Une fois qu'un gatekeeper est élu, lui-même et les nominateurs peuvent obtenir une récompense PoS de l'inflation PHA.

### Génération de la `MasterKey`.

La `MasterKey` est utilisée pour dériver les clés permettant de crypter les états des smart contracts confidentiels et de communiquer. Dans le réseau Phala, seul le `pRuntime` d'un gatekeeper est autorisé à gérer la `MasterKey`. Notez que puisque `MasterKey` est géré par `pRuntime` et que son utilisation est limitée, même un gatekeeper malveillant ne pourrait décrypter un état de contrat sans compromettre complètement le TEE et `pRuntime`.

`MasterKey` est une paire de clés `secp256k1` générée et gérée par les gatekeepers.

> **[Amélioration]**
>
> Passez à `sr25519` dans le futur.

Dans le pré-mainnet du réseau Phala, tous les gatekeepers partagent la même `MasterKey` pré-générée.

> **[Amélioration]**
>
> Introduire DKG (_[distributed key generation](https://en.wikipedia.org/wiki/Distributed_key_generation)_) de sorte que plus d'un gatekeeper soit nécessaire pour produire la `MasterKey`, et que chaque gatekeeper ne détienne qu'une part de la clé. Lorsque DKG est activé, les parts de clé du contrat sont fournies aux workers par les gatekeepers séparément.

> **[Amélioration]**
> Rotation de la `MasterKey` partagée
>
> De la même manière que pour la rotation de la `EcdhKey`, la `MasterKey` doit être tournée régulièrement afin de réaliser l'envoi du secret , et de défendre toute tentative de fuite de la `MasterKey` et de décryptage des états du contrat.
>
> La rotation de la `MasterKey` est déclenchée après un certain intervalle de hauteur de bloc. La clé pour la rotation de la `MasterKey` est le ré-encryptage des états de contrat sauvegardés. Cela peut prendre plusieurs blocs pour se terminer. La rotation de la `MasterKey` se compose des étapes suivantes :
>
> - Les gatekeepers génèrent une nouvelle `MasterKey` ;
> - Les gatekeepers utilisent l'ancienne `MasterKey` pour décrypter les états de contrat sauvegardés, et utilisent la nouvelle `MasterKey` pour les crypter en parallèle ;
> - L'ancienne `MasterKey` et les états de contrat sauvegardés sont abandonnés ;
>
> Encore une fois, puisque toutes ces opérations se produisent à l'intérieur de `pRuntime` dans TEE, les gatekeepers eux-mêmes ne peuvent pas observer les états du contrat.

### Migration d'état

Nous devons nous assurer que les données peuvent être migrées vers une nouvelle version de la blockchain et de pRuntime sans en révéler le contenu. La migration de l'état est déclenchée par une décision de gouvernance sur la chaîne, dénotée par un événement, et peut être réalisée de la même manière que nous avons proposé pour la rotation de `MasterKey`.

### Smart Contracts confidentiels

### Génération de la clé du contrat

Un client doit télécharger le code du contrat signé avec le hash du code sur la blockchain. Lorsqu'un client télécharge un contrat confidentiel sur la blockchain, il émet un événement `ContractUploaded(deployer_id, code_hash, sequence)`. Les gatekeepers restent à l'écoute de ces événements, et génèrent une clé de contrat pour chaque contrat nouvellement déployé.

The contract key is generated by a KDF (_[key derivation function](https://en.wikipedia.org/wiki/Key_derivation_function)_). In pre-mainnet, we adopt the [child key derivation (CKD) functions](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#child-key-derivation-ckd-functions) from Bitcoin, and extra data like `deployer_id` serves as entropy during key derivation:

$$
ContractKey_{deployer\\_id, code\\_hash, sequence} = KDF(MasterKey, deployer\\_id, code\\_hash, sequence)
$$

Les clés suivantes sont nécessaires pour un contrat, et sont dérivées de la `ContractKey` :

- `IdentityKey`
  - une paire de clés `secp256k1`, utilisée pour signer les messages de sortie du contrat ;
- `EcdhKey`
  - une paire de clés `secp256r1`, utilisée pour chiffrer les entrées-sorties du contrat (y compris les commandes et les requêtes) ;
- `StorageKey`
  - une clé `aes-256-gcm`. `StorageKey` peut être générée de la même manière que `EcdhKey` en introduisant un paramètre 'nonce' supplémentaire, elle est utilisée pour crypter les états du contrat (c'est-à-dire les paires clé-valeur dans le stockage du contrat) ;

Dans le pré-mainnet du Réseau Phala, les clés de contrat ci-dessus n'ont pas besoin d'être stockées dans le stockage `pRuntime` des gatekeepers car il est facile de les générer à la volée.

Lorsque la clé est générée, la clé publique `ContractKey` qui est incluse dans le `ContractInfo`. `ContractInfo` doit également inclure l'identité du déployeur du contrat, la séquence, le hachage du code du contrat et (facultatif) le code source du contrat. Les gatekeepers peuvent facilement reproduire `ContractKey` à la volée en donnant le `ContractInfo` (puisque `MasterKey` est géré par eux) pour une vérification et une migration futures.

### Assignement de la clé de contrat

Pour assigner un contrat à un worker, les gatekeepers récupèrent d'abord le `ContractInfo` du contrat et génèrent `ContractKey` à la volée.

Les gatekeepers ne fourniront les clés qu'aux workers qualifiés. Il établit un canal de communication sécurisé sur la chaîne et transmet les paires de clés `ContractInfo` et `ContractKey`.

> **[Amélioration]**
>
> Permettre aux déployeurs de spécifier les exigences matérielles et le nombre de réplications dans `ContractInfo` et les gatekeepers devraient affecter les workers souhaités.

 <!-- ==TODO2 : une manière plus légère d'assigner les tâches avant de travailler sur un véritable algorithme ?== -->

> **[TODO]**
>
> Permettre de créer une liste blanche de workers (sous-réseau), permettre aux utilisateurs de choisir quelle liste pour déployer les contrats. Tous les workers d'un sous-réseau sont des répliques.

Les gatekeepers émettent un événement `ContractDeployed(Worker_IdentityKey, ContractKey)` (plusieurs événements devraient être émis s'il y a plusieurs workers). Nous gardons une carte `ContractState` de `ContractKey` au workers sur la chaîne. Les gatekeepers garderont la carte `ContractState` à jour pour que les déployeurs puissent localiser les workers assignés.

Invocation des commandes ####

Un client effectue l'étape suivante pour envoyer des commandes au contrat :

1. Utiliser la clé `EcdhKey` du contrat et la clé privée du client pour appliquer Ecdh ;
2. Utiliser la clé générée pour chiffrer les données d'invocation ;
3. Poster un événement `ContractCommand(ContractKey, Client_IdentityKey, encrypted_data)` sur la chaîne ;

Notez que puisque les données d'invocation sont cryptées avec un secret généré par la clé privée du client et la clé publique du contrat, seul le contrat exécuté lui-même (pas le worker assigné) peut décrypter les données d'invocation. De plus, de nouveaux workers peuvent être assignés pour la ré-exécution si le worker assigné précédemment est hors ligne.

Le worker doit continuer à écouter les événements `ContractCommand` pour le contrat après le déploiement.

#### Invocation de requêtes

Un client peut envoyer un `ContractQuery(query_id, ContractKey, Client_IdentityKey, encrypted_data)` de la même manière que ci-dessus. Les workers doivent écouter ces événements et retourner un `ContractReturn(return_id, query_id, encrypted_return_value)` en conséquence.

> **[Amélioration]**
>
> Nous inclurons le point de terminaison de l'API des workers dans `WorkerState`. Un client peut directement obtenir les workers de certains contrats en écoutant les événements `ContractDeployed`, puis il établit un canal de communication sécurisé avec les workers et envoie des requêtes.

<!-- ==TODO : supposez que tous les workers ont un endpoint API *public accessible== -->

> **[TODO]**
>
> Assurer la connectivité des workers.

> **[TODO]**
>
> Comment punir les workers inaccessibles ?
>
> > Avant d'avoir un moyen de rendre la connectivité stable, nous devons soit utiliser une liste blanche (l'utilisateur peut faire confiance aux opérateurs), soit autoriser les requêtes sur la blockchain (latence très élevée et coûteuse).

### Exécution du contrat

La clé de l'exécution confidentielle du contrat est le décryptage et la mise à jour des états du contrat (c'est-à-dire toutes les paires clé-valeur dans le stockage du contrat).

Pour l'instant, nous préférons adopter le modèle de stockage confidentiel suivant : la clé et la valeur sont d'abord cryptées par `StorageKey` du contrat, puis insérées dans le stockage trie, de sorte que le moteur de base de données sous-jacent puisse être agnostique quant au cryptage. Chaque paire clé-valeur est chiffrée avec une clé différente dérivée de `StorageKey` :

- $StorageKey_{key} = KDF(StorageKey, key)$

#### Mise à jour de l'état

La mise à jour d'état écrite en retour à la chaîne doit être signée avec `ContractKey`, ainsi un worker ne peut pas fournir une fausse mise à jour d'état sans craquer TEE et `pRuntime`. Une solution triviale pour la mise à jour de l'état est que le worker réécrive toutes les mises à jour des paires clé-valeur après l'exécution d'une commande. Le worker devrait également mettre à jour l'horodatage (c'est-à-dire la hauteur de bloc de la dernière transaction traitée) dans le stockage afin que nous puissions savoir quelles transactions ont déjà été traitées.

Cette solution s'applique à la situation où peu de contrats sont déployés et où peu de commandes sont traitées.

> **[Amélioration]**
>
> Avec l'augmentation du nombre de contrats, un certain mécanisme de cache est nécessaire, c'est-à-dire que le worker peut mettre en cache et fusionner toutes les modifications de l'état du contrat (par clés, seule la dernière valeur d'une clé est préservée) et ne mettre à jour le stockage du substrat qu'après un certain intervalle. L'intervalle doit être choisi avec soin pour éviter que tous les workers mettent à jour les états dans le même bloc (par exemple, [13 ou 17] (https://zh.wikipedia.org/wiki/%E5%91%A8%E6%9C%9F%E8%9D%89) blocs). Il est à noter que plus l'intervalle est long, moins la mise à jour sera appliquée au stockage, tandis qu'il y aura plus de tâches de relecture si le worker est en panne.

> **[Amélioration]**
>
> #### Arbitrage de la mise à jour de l'état
>
> Les conflits de mise à jour d'état observables de plusieurs workers sont automatiquement gérés par [consensus] (https://substrate.dev/docs/en/knowledgebase/advanced/consensus). Si un seul worker exécute le contrat, il peut fournir une mise à jour d'état erronée sans être remarqué. Notez que cela ne peut être réalisé que si le worker malveillant parvient à extraire la `ContractKey` de `pRuntime`. Dans ce cas, nous permettons aux déployeurs de contrat de lancer un arbitrage contre les mises à jour d'état suspectes en postant un `ArbitrationRequest` sur la chaîne dans une fenêtre de temps limitée. Les gatekeepers resteront à l'écoute de ces demandes et assigneront des workers supplémentaires pour la ré-exécution et la validation. S'il s'avère que la mise à jour de l'état est erronée, les gatekeepers voteront pour le bon état final et élimineront les workers malveillants.

#### Décryptage de l'état

Puisque le `pRuntime` du worker reçoit le `ContractKey` des gatekeepers pendant le déploiement du contrat, et qu'il est utilisé pour récupérer le `IdentityKey`, le `EcdhKey`, et le `StorageKey`, il peut décrypter n'importe quelle paire clé-valeur du contrat dans le trie. Notez que l'utilisation de `ContractKey` pour le décryptage est totalement gérée par `pRuntime`, et que seul le code du contrat dans l'interpréteur WASM dans `pRuntime` peut accéder au texte en clair.

Quand un worker essaie de reprendre l'exécution d'un contrat, il doit d'abord récupérer le dernier état d'un contrat de la blockchain. Nous pouvons récupérer toutes les paires clé-valeur pour le moment.

> **[Amélioration]**
>
> Introduire un mécanisme de cache. Les mécanismes de cache, tels que celui basé sur la localité de FIFO, peuvent être choisis après avoir évalué le modèle d'accès commun des contrats dans le pré-mainnet. Nous pouvons également permettre aux développeurs de choisir la méthode la plus appropriée.

Puisque l'état du contrat est stocké avec l'horodatage, le worker a seulement besoin de rejouer les transactions après cela.

> **[Amélioration]**
>
> ## rotation de `ContractKey`
>
> Le mécanisme de rotation des clés du réseau Phala est crucial pour la sécurité et la confidentialité des contrats intelligents. En combinant l'attribution aléatoire des contrats et la rotation des clés, le réseau Phala est capable de se défendre contre les attaques avancées connues contre Intel SGX, puisque les attaquants doivent localiser la cible et divulguer le secret dans une fenêtre de temps limitée. En outre, le mécanisme de rotation permet de garantir la confidentialité des informations, même si certains secrets sont divulgués.
>
> ### Rotation des clés
>
> Dans le pré-mainnet du réseau Phala, la `MasterKey` et la `ContractKey` sont liées, et n'importe quelle `ContractKey` peut être générée à la volée à partir de la `MasterKey` et des `ContractInfo` correspondantes. Lors de la rotation des clés, nous détachons le mappage entre `MasterKey` et `ContractKey` et les faisons tourner séparément. C'est-à-dire que `ContractKey` est tourné après une certaine période en augmentant le numéro de séquence dans la génération de la clé. Une fois que la `ContractKey` est générée par `MasterKey`, elle est stockée dans les gatekeepers et ne sera pas affectée par la rotation suivante de `MasterKey`. Les gatekeepers conservent un certain nombre des dernières `ContractKey`s et font tourner la `MasterKey` après un certain intervalle de temps.
>
> Le détachement de la `MasterKey` et de la `ContractKey` signifie que les `ContractKey` historiques ne peuvent pas être générées à nouveau après la rotation de la `MasterKey`, ce qui garantit le secret de la transmission, mais cela nécessite également un mécanisme supplémentaire pour assurer la disponibilité de la liste `ContractKey` : une réélection des gatekeepers et la sauvegarde de la liste `ContractKey` sont immédiatement déclenchées si 1/3 des gatekeepers sont hors service.
>
> ### Optimisation des performances pour la rotation de `MasterKey`.
>
> Comme `MasterKey` est une clé de distribution, la rotation de `MasterKey` nécessite plusieurs tours de communication entre les gatekeepers, ce qui peut être coûteux. En tirant parti de la propriété d'homomorphisme, un tel coût peut être considérablement réduit. Par exemple, l'un des algorithmes DKG les plus utilisés est [Shamir's Secret Sharing] (https://en.wikipedia.org/wiki/Shamir%27s_Secret_Sharing), et il a été prouvé qu'il était [(+, +)-homorphe] (http://www.cs.cornell.edu/courses/cs754/2001fa/homo.pdf) en 1998. Cela signifie que nous pouvons faire tourner les secrets de Shamir sans aucune communication entre les gatekeepers si la conception est correcte.
>
> ### Re-cryptage roulant des états du contrat
>
> La rotation de `ContractKey` nécessite le ré-encryptage régulier des états du contrat. Pour minimiser l'impact sur les performances du ré-encryptage des états, nous essayons d'amortir le coût en périodes. C'est-à-dire que les paires clé-valeur des contrats sont cryptées avec la `ContractKey` de la période en cors. Les workers peuvent obtenir les `ContractKey` historiques à partir de la liste de clés des gatekeepers. Après un certain nombre de périodes (par exemple, 1000 périodes), seules les paires clé-valeur intactes cryptées avec les `ContractKey` périmées doivent être re-cryptées.
