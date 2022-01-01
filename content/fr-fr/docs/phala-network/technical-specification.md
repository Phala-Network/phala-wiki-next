---
title: "Spécifications techniques"
weight: 2001
draft: false
menu:
  docs:
    parent: "phala-network"
---

Ce document décrit les spécifications techniques de Phala Network, y compris le protocole global et la structure de données et l'algorithme détaillés. C'est un travail encore en cours.

## Blockchain Entities

Dans Phala Network, il existe trois types d'entités :

- _Client_, qui fonctionne sur des appareils normaux sans aucune exigence matérielle particulière ;
- _Worker_, qui fonctionne sur TEE (_Trusted Execution Environment_) et sert de nœuds de calcul pour les contrats intelligents confidentiels ;
- _Gatekeeper_, qui fonctionne sur TEE et sert d'autorités et de gestionnaires de clés ;

Nous présentons les interactions entre les différentes entités comme suit.

![Phala Network](/images/docs/spec/phala-design.png)

La conception de base de Phala Network visait à garantir la sécurité et la confidentialité de la blockchain et des contrats intelligents qu'elle contient. Grâce à l'introduction de nouvelles améliorations en matière de sécurité, Phala Network est capable de se défendre contre des attaques avancées.

### Initialisation de la clé d'entité

Dans Phala, la communication entre toutes les entités doit être chiffrée. Chaque entité génère ainsi les paires de clés d'entité suivantes au moyen d'un générateur de nombres pseudo-aléatoires lors de l'initialisation :

1. `IdentityKey`
   - une paire de clés `secp256k1` pour identifier de façon unique une entité ;
2. `EcdhKey`
   - une paire de clés `secp256r1` pour la communication sécurisée ;

> **[Amélioration]**
>
> basculer les deux `IdentityKey` et `EcdhKey` à `sr25519` dans le futur. [Le groupe Ristretto](https://ristretto.group/) a un bon écosystème en Rust (qui peut être facilement compilé en WASM) et JavaScript, même avec le support ECDH.

Pour les clients, les paires de clés sont générées par le portefeuille de l'utilisateur. Pour les workers TEE et les gatekeepers, les paires de clés sont entièrement gérées par `pRuntime` et leur utilisation est strictement limitée.

### Initialisation `pRuntime`

Pendant l'initialisation, `pRuntime` génère automatiquement les paires de clés d'entité ci-dessus avec un générateur de nombres pseudo-aléatoires. Les paires de clés générées sont gérées dans `pRuntime` dans TEE, ce qui signifie que les workers TEE et les gatekeepers ne peuvent les utiliser qu'avec les APIs limitées exportées par `pRuntime`, et ne peuvent jamais obtenir les paires de clés en clair pour lire les données cryptées hors de TEE.

Les paires de clés générées peuvent être cryptées localement et mises en cache sur le disque par `SGX Sealing`, et peuvent être décryptées et chargées lors du redémarrage. Ceci s'applique à la fois aux gatekeepers et aux workers TEE.

### Canaux de communication sécurisés

La clé publique `EcdhKey` dans le `pRuntime` d'un worker TEE ou d'un gatekeeper est publiquement disponible. Par conséquent, un [protocole d'accord de clé ECDH] (https://wiki.openssl.org/index.php/Elliptic_Curve_Diffie_Hellman) peut être appliqué pour établir un canal de communication sécurisé entre un worker TEE (ou un gatekeeper) et toute autre entité de manière non interactive.

Un canal entre deux entités `A` et `B` est désigné par $Channel(Pk_A, Pk_B)$, où $Pk_A$ et $Pk_B$ sont les clés publiques de leurs paires de clés ECDH correspondantes. Un secret partagé peut être dérivé de la clé privée ECDH d'une personne et de la clé publique de son homologue via l'algorithme Diffie Hellman. Ensuite, la clé de communication finale `CommKey(A, B)` peut être calculée par une fonction à sens unique. `CommKey(A, B)` est utilisée pour chiffrer les messages entre les deux entités.

{{< tip >}}
Dans pre-mainnet, la `EcdhKey` est une paire de clés `secp256r1`. Nous pouvons adopter les [fonctions de dérivation de clé enfant (CKD)] (https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#child-key-derivation-ckd-functions) de Bitcoin BIP32 pour dériver `CommKey(A, B)` de la clé convenue par ECDH.

Les messages sont E2EE avec `aes-gcm-256`.
{{< /tip >}}

> **[Amélioration]**
> Lorsque nous passons à sr25519, nous devons adopter l'algorithme de dérivation de clé de Substrate au lieu de BIP32.

Les clés publiques des entités sont enregistrées sur la chaîne. Nous pouvons donc construire des canaux de communication on-chain ou off-chain :

- Communication On-chain
  1. `A` et `B` connaissent tous deux la clé publique de l'autre à partir de la blockchain. Ils peuvent dériver `CommKey(A, B)` ;
  2. `A` poste un message crypté par `CommKey(A, B)` sur la blockchain ;
  3. `B` le reçoit, et le déchiffre avec `CommKey(A, B)` ;
- Communication Off-chain (`A` is off-chain and `B` est un worker on-chain)
  1. `A` peut apprendre la clé publique de `B` à partir de la blockchain et dériver `CommKey(A, B)` ;
  2. `A` apprend le point de terminaison API de `B` à partir de son `WorkerInfo` dans `WorkerState` sur la chaîne ;
  3. `A` envoie un message chiffré signé (chiffré par `CommKey(A, B)`) avec sa clé publique à `B` directement ;
  4. `B` obtient la clé publique de `A` à partir du message, et dérive `CommKey(A, B)` pour le décrypter ;

#### Exemple de charge utile client-worker

Un client communique avec un worker TEE uniquement pour l'invocation d'un contrat. Une invocation est composée des charges utiles suivantes.

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

- `nonce` est nécessaire pour se défendre contre les attaques de type double dépense et relecture.
- Le champ `from` indique l'identité de l'appelant, et peut être vérifié avec `sig`. Le champ `from` sera ensuite passé au contrat.
- Comme un worker TEE peut exécuter plusieurs contrats (ou même différentes instances du même contrat), `to` est nécessaire pour spécifier la cible de l'invocation.
- `input` encode la fonction invoquée et les arguments, il devrait être sérialisé selon l'ABI des contrats.

> **[Amélioration]**
>
> ### Sérialisation
>
> Actuellement, les paylaods sont sérialisés dans un JSON convivial pour les navigateurs, mais c'est très peu efficace en termes d'espace. Utilisez plutôt un format binaire compact (par exemple Protobuf, parity-scale-codec).
>
> ### Rotation `EcdhKey`
>
> Contrairement à la `IdentityKey` qui montre l'identité d'un worker TEE ou d'un gatekeeper et qui ne doit donc pas être changée, nous recommandons une rotation régulière de la `EcdhKey` pour assurer la sécurité des canaux de communication entre les différentes entités. Dans le futur, `pRuntime` fera automatiquement tourner la clé `EcdhKey` gérée après un certain intervalle de temps.

## Worker TEE

### Inscription du Worker

L'inscription est requise avant qu'un worker TEE ou qu'un gatekeeper puisse rejoindre le réseau. Toutes les parties ayant des dispositifs supportés par TEE peuvent servir de workers. Pour s'enregistrer comme worker TEE validé dans la blockchain, les opérateurs TEE doivent exécuter `pRuntime` et le laisser envoyer un rapport d'attestation signé aux gatekeepers.

`pRuntime` demande une attestation à distance avec un hachage du `WorkerInfo` engagé dans le rapport d'attestation. `WorkerInfo` comprend la clé publique de `IdentityKey` et `EcdhKey` et d'autres données collectées dans l'enclave. En vérifiant le rapport, les gatekeepers peuvent connaître les informations matérielles des workers TEE et s'assurer qu'ils exécutent un `pRuntime` non modifié.

### Attestation à distance

Le rapport d'attestation est relayé à la blockchain par l'appel `register_worker()`. La blockchain dispose des certificats de confiance pour valider le rapport d'attestation. Elle valide :

1. La signature du rapport est correcte ;
2. Le hachage intégré dans le rapport correspond au hachage du `WorkerInfo` soumis ;

`register_worker()` est appelé par les workers TEE, et un worker TEE ne peut se voir attribuer des contrats que lorsqu'il dispose d'une certaine quantité de jetons PHA de stackés. Sur la blockchain, il y a une carte `WorkerState` entre le worker et l'entrée `WorkerInfo`. Les gatekeepers mettront à jour la carte `WorkerState` après avoir reçu et vérifié le `WorkerInfo` soumis.

### Détection des worker TEE hors ligne

Le `pRuntime` d'un worker TEE est régulièrement requis pour répondre au défi en ligne comme un événement heartbeat sur la chaîne. La blockchain détecte la vivacité des workers en surveillant l'intervalle de leurs événements de battement de cœur. Un worker est puni avec la pénalité de ses jetons de stakés s'il se déconnecte pendant l'exécution du contrat.

> **[Amélioration]**
>
> Les déployeurs de contrats sont autorisés à définir un délai d'exécution configurable pour l'exécution du contrat. En conséquence, une exécution est considérée comme échouée si le worker ne parvient pas à fournir les résultats dans le délai imparti. Une pénalité mineure (par rapport à la pénalité hors ligne) doit être payée.
> **[TODO: Impl actuelle]**
>
> Maintenant, nous avons un défi aléatoire pour les workers TEE. Si un worker répond correctement au défi, il est récompensé (sur la base de la tokenomique). Dans le cas contraire, s'il ne répond pas dans le délai imparti, il est éliminé.
>
> Sous réserve de modifications : on peut vouloir occuper à 100% les cycles du CPU.

## Gatekeeper

###  Election Gatekeepers

Les gatekeepers partagent le même `pRuntime` que les workers normaux. Pour distinguer les gatekeepers, leurs clés publiques `IdentityKey` sont enregistrées dans la liste `GatekeeperState` de la blockchain.

Dans le pré-mainnet de Phala Network, la liste des gatekeepers est codée en dur dans le bloc genesis de la blockchain.

> **[Amélioration]**
>
> Les gatekeepers sont élus sur la blockchain par un mécanisme NPoS similaire à celui de Polkadot. Ceci est fait par la palette `Staking`, où les nominateurs peuvent mettre en jeu leurs tokens, et voter pour leurs gatekeepers de confiance. Une fois qu'un gatekeeper est élu, lui-même et les nominateurs peuvent obtenir une récompense PoS de l'inflation PHA.

### Génération de la `MasterKey`

La `MasterKey` est utilisée pour dériver les clés permettant de crypter les états des smart contracts confidentiels et de communiquer. Dans Phala Network, seul le `pRuntime` d'un gatekeeper est autorisé à gérer la `MasterKey`. Notez que puisque `MasterKey` est géré par `pRuntime` et que son utilisation est limitée, même un gatekeeper malveillant ne peut décrypter aucun état de contrat sans compromettre complètement le TEE et `pRuntime`.

`MasterKey` est une paire de clés `secp256k1` générée et gérée par les gatekeepers.

> **[Amélioration]**
>
> Passer à `sr25519` dans le futur.

Dans le pré-mainnet de Phala Network, tous les gatekeepers partagent la même `MasterKey` pré-générée.

> **[Amélioration]**
>
> Introduire DKG (_[distributed key generation](https://en.wikipedia.org/wiki/Distributed_key_generation)_) afin que plusieurs gatekeepers soient nécessaires pour produire la `MasterKey`, et que chaque gatekeeper ne détienne qu'une part de la clé. Lorsque DKG est activé, les parts de clé du contrat sont fournies aux workers TEE par les gatekeepers séparément.

> **[Amélioration]**
> Rotation de la `MasterKey` partagée
>
> Similaire à la rotation de `EcdhKey`, la `MasterKey` doit être tournée régulièrement pour atteindre le secret avant, et défendre toute tentative de fuite de `MasterKey` et de décryptage des états du contrat.
>
> La rotation de la `MasterKey` est déclenchée après un certain intervalle de hauteur de bloc. La clé de la rotation de la `MasterKey` est le ré-encryptage des états de contrat sauvegardés. Cela peut prendre plusieurs blocs pour se terminer. La rotation de la `MasterKey` se compose des étapes suivantes :
>
> - Les gatekeepers génèrent une nouvelle `MasterKey` ;
> - Les gatekeepers utilisent l'ancienne `MasterKey` pour décrypter les états de contrat sauvegardés, et utilisent la nouvelle `MasterKey` pour les crypter en parallèle ;
> - L'ancienne `MasterKey` et les états de contrat sauvegardés sont abandonnés ;
>
> Encore une fois, puisque toutes ces opérations se produisent à l'intérieur de `pRuntime` dans TEE, les gatekeepers eux-mêmes ne peuvent pas jeter un coup d'oeil aux états du contrat.

### Migration des États

Nous devons nous assurer que les données peuvent être migrées vers une nouvelle version de la blockchain et du pRuntime sans en révéler le contenu. La migration de l'état est déclenchée par une décision de gouvernance sur la chaîne, dénotée par un événement, et peut être réalisée de la même manière que nous avons proposé pour la rotation de la `MasterKey`.

### Smart Contracts confidentiels

### Génération de la clé du contrat

Un client doit télécharger le code du contrat signé avec le code hash sur la blockchain. Lorsqu'un client télécharge un contrat confidentiel sur la blockchain, il émet un événement `ContractUploaded(deployer_id, code_hash, sequence)`. Les gatekeepers restent à l'écoute de ces événements, et génèrent une clé de contrat pour chaque contrat nouvellement déployé.

La clé du contrat est générée par une KDF (_[key derivation function](https://fr.wikipedia.org/wiki/Fonction_de_d%C3%A9rivation_de_cl%C3%A9)_). Dans pre-mainnet, nous adoptons les [fonctions de dérivation de clé enfant (CKD)](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#child-key-derivation-ckd-functions) de Bitcoin, et des données supplémentaires comme `deployer_id` servent d'entropie pendant la dérivation de la clé :

$$
ContractKey_{deployer\\_id, code\\_hash, sequence} = KDF(MasterKey, deployer\\_id, code\\_hash, sequence)
$$

Les clés suivantes sont nécessaires pour un contrat, et sont dérivées de la `ContractKey` :

- `IdentityKey`
  - une paire de clés `secp256k1`, utilisée pour signer les messages de sortie du contrat ;
- `EcdhKey`
  - une paire de clés `secp256r1`, utilisée pour chiffrer les entrées-sorties du contrat (y compris les commandes et les requêtes) ;
- `StorageKey`
  - une clé `aes-256-gcm`. `StorageKey` peut être générée de la même manière que `EcdhKey` en introduisant un nonce supplémentaire, elle est utilisée pour crypter les états du contrat (c'est-à-dire les paires clé-valeur dans le stockage du contrat) ;

Dans le pré-mainnet de Phala Network, les clés de contrat ci-dessus n'ont pas besoin d'être stockées dans le stockage `pRuntime` des gatekeepers car il est facile de les générer à la volée.

Lorsque la clé est générée, la clé publique `ContractKey` est incluse dans le `ContractInfo`. `ContractInfo` doit également inclure l'identité du déployeur du contrat, la séquence, le hachage du code du contrat et (facultatif) le code source du contrat. Les gatekeepers peuvent facilement reproduire `ContractKey` à la volée en donnant le `ContractInfo` (puisque `MasterKey` est géré par eux) pour une vérification et une migration futures.

### Fourniture de la clé du contrat

Pour attribuer un contrat à un worker TEE, les gatekeepers récupèrent d'abord le `ContractInfo` du contrat et génèrent la `ContractKey` à la volée.

Les gatekeepers ne fourniront les clés qu'aux workers TEE qualifiés. Il établit un canal de communication sécurisé sur la chaîne et transmet les paires de clés `ContractInfo` et `ContractKey`.

> **[Amélioration]**
>
> Permet aux déployeurs de spécifier les exigences matérielles, le nombre de réplications dans `ContractInfo` et les gatekeepers devraient assigner les workers TEE désirés.
> 
 <!-- ==TODO2: une manière plus légère d'assigner les tâches avant de travailler sur un véritable algorithme ?== -->

> **[TODO]**
>
> Permet de créer une liste blanche de workers TEE (sous-réseau), permet aux utilisateurs de choisir la liste pour déployer les contrats. Tous les worker d'un sous-réseau sont répliqués.

Les gatekeepers émettent un événement `ContractDeployed(Worker_IdentityKey, ContractKey)` (plusieurs événements doivent être émis s'il y a plusieurs workers). Nous gardons une carte `ContractState` de `ContractKey` au worker sur la chaîne. Les gatekeepers garderont la carte `ContractState` à jour pour que les déployeurs puissent localiser les workers TEE assignés.

#### Invocation de commandes

Un client effectue l'étape suivante pour envoyer des commandes au contrat :

1. Utiliser la clé `EcdhKey` du contrat et la clé privée du client pour appliquer Ecdh ;
2. Utiliser la clé générée pour chiffrer les données d'invocation ;
3. Poster un événement `ContractCommand(ContractKey, Client_IdentityKey, encrypted_data)` sur la chaîne ;

Notez que puisque les données d'invocation sont cryptées avec un secret généré par la clé privée du client et la clé publique du contrat, seul le contrat exécuté lui-même (pas le worker TEE assigné) peut décrypter les données d'invocation. De plus, de nouveaux workers peuvent être assignés pour la ré-exécution si le worker TEE assigné précédemment est hors ligne.

Le worker TEE doit continuer à écouter les événements `ContractCommand` pour le contrat après le déploiement.

#### Invocation de requêtes

Un client peut envoyer un `ContractQuery(query_id, ContractKey, Client_IdentityKey, encrypted_data)` de la même manière que ci-dessus. Les workers TEE doivent écouter ces événements et retourner un `ContractReturn(return_id, query_id, encrypted_return_value)` en conséquence.

> **[Amélioration]**
>
> Nous inclurons le point de terminaison API des workers TEE dans `WorkerState`. Un client peut obtenir directement les workers d'un certain contrat en écoutant les événements `ContractDeployed`, puis il établit un canal de communication sécurisé avec les workers et envoie des requêtes.

<!-- ==TODO: supposez que tous les workers ont un point de terminaison API *public accessible== -->

> **[TODO]**
>
> Assurer la connectivité des workers.

> **[TODO]**
>
> Comment punir les workers TEE inaccessibles ?
> Avant d'avoir un moyen de rendre la connectivité stable, nous devons soit utiliser une liste blanche (l'utilisateur peut faire confiance aux opérateurs), soit permettre l'interrogation de la blockchain (latence très élevée et coûteuse).

### Exécution du contrat

La clé de l'exécution confidentielle du contrat est le décryptage et la mise à jour des états du contrat (c'est-à-dire toutes les paires clé-valeur dans le stockage du contrat).

Pour l'instant, nous préférons adopter le modèle de stockage confidentiel suivant : la clé et la valeur sont d'abord cryptées par `StorageKey` du contrat puis insérées dans le stockage de trie, de sorte que le moteur de base de données sous-jacent puisse être agnostique quant au cryptage. Chaque paire clé-valeur est chiffrée avec une clé différente dérivée de `StorageKey` :

- $StorageKey_{key} = KDF(StorageKey, key)$

#### Mise à jour de l'état

La mise à jour d'état écrite à la chaîne doit être signée avec `ContractKey`, donc un worker TEE ne peut pas fournir une fausse mise à jour d'état sans craquer TEE et `pRuntime`. Une solution triviale pour la mise à jour de l'état est que le worker réécrive toutes les mises à jour des paires clé-valeur après l'exécution d'une commande. Le worker devrait également mettre à jour l'horodatage (c'est-à-dire la hauteur de bloc de la dernière transaction traitée) dans le stockage afin que nous puissions savoir quelles transactions ont déjà été traitées.

Cette solution s'applique à la situation où peu de contrats sont déployés et où peu de commandes sont traitées.

> **[Amélioration]**
>
> Avec l'augmentation du nombre de contrats, un certain mécanisme de cache est nécessaire, c'est-à-dire que le worker peut mettre en cache et fusionner toutes les modifications de l'état du contrat (par clés, seule la dernière valeur d'une clé est préservée) et ne mettre à jour le stockage du substrat qu'après un certain intervalle. L'intervalle doit être choisi avec soin pour éviter que tous les workers TEE mettent à jour les états dans le même bloc (par exemple, [13 ou 17] (https://zh.wikipedia.org/wiki/%E5%91%A8%E6%9C%9F%E8%9D%89) blocs). Il est à noter que plus l'intervalle est long, moins la mise à jour sera appliquée au stockage, tandis qu'il y aura plus de tâches de relecture si le worker est en panne.

> **[Amélioration]**
>
> #### Arbitrage de la mise à jour de l'état
>
> Les conflits observables de mise à jour d'état de plusieurs workers TEE sont automatiquement gérés par [consensus] (https://substrate.dev/docs/en/knowledgebase/advanced/consensus). Si un seul worker TEE exécute le contrat, il peut fournir une mise à jour d'état erronée sans être remarqué. Notez que cela ne peut être réalisé que si le worker malveillant parvient à extraire la `ContractKey` de `pRuntime`. Dans ce cas, nous permettons aux déployeurs de contrat de lancer un arbitrage contre les mises à jour d'état suspectes en postant un `ArbitrationRequest` sur la chaîne dans une fenêtre de temps limitée. Les gatekeepers resteront à l'écoute de ces demandes et assigneront des workers TEE supplémentaires pour la ré-exécution et la validation. S'il est prouvé que la mise à jour de l'état est fausse, les gatekeepers voteront pour le bon état final et élimineront les workers malveillants.

#### Décryptage de l'état

Puisque le `pRuntime` du worker reçoit la `ContractKey` des gatekeepers pendant le déploiement du contrat, et qu'elle est utilisée pour récupérer la `IdentityKey`, la `EcdhKey`, et la `StorageKey`, elle peut décrypter n'importe quelle paire clé-valeur du contrat dans le trie. Notez que l'utilisation de `ContractKey` pour le décryptage est totalement gérée par `pRuntime`, et que seul le code du contrat dans l'interpréteur WASM dans `pRuntime` peut accéder au texte en clair.

Quand un worker TEE essaie de reprendre l'exécution d'un contrat, il doit d'abord récupérer le dernier état d'un contrat de la blockchain. Nous pouvons récupérer toutes les paires clé-valeur pour le moment.

> **[Amélioration]**
>
> Introduire un mécanisme de cache. Les mécanismes de cache, tels que celui basé sur la localité de FIFO, peuvent être choisis après avoir évalué le modèle d'accès commun des contrats dans le pré-mainnet. Nous pouvons également permettre aux développeurs de choisir la méthode la plus appropriée.

Puisque l'état du contrat est stocké avec un horodatage, le worker n'a qu'à rejouer les transactions par la suite.

> **[Improvement]**
>
> ## `ContractKey` Rotation
>
> The key rotation mechanism of Phala Network is crucial to the security and confidentiality of smart contracts. By combining the random assignment of contracts and key rotation, Phala Network is able to defend known advanced attacks against Intel SGX since attackers have to locate the target and leak the secret within limited time window. Also, forward secrecy is promised with rotation mechanism even if some secrets are leaked.
>
> ### Key Rotation
>
> In the pre-mainnet of Phala Network, the `MasterKey` and `ContractKey` are bound, and any `ContractKey` can be generated on-the-fly given the `MasterKey` and according `ContractInfo`. While in key rotation, we detach the mapping between `MasterKey` and `ContractKey` and rotate them separately. That is, `ContractKey` is rotated after certain epoch by increasing the sequence number in key generation. After the `ContractKey` is generated by `MasterKey`, it is stored in the gatekeepers and will not be affected by the following rotation of `MasterKey`. The gatekeepers keep a certain number of the latest `ContractKey`s and rotate the `MasterKey` after certain time interval.
>
> The detach of `MasterKey` and `ContractKey` means that historical `ContractKey`s cannot be re-generated after the rotation of `MasterKey`, thus ensuring forward secrecy, while this also requires extra mechanism to ensure the availability of `ContractKey` list: a re-election of gatekeepers and the backup of the `ContractKey` list is immediately triggered if 1/3 of the gatekeepers are down.
>
> ### Optimisation des performances pour la rotation de `MasterKey`.
>
> Comme `MasterKey` est une clé de distribution, la rotation de `MasterKey` nécessite plusieurs tours de communication entre les gatekeepers, ce qui peut être coûteux. En tirant parti de la propriété d'homomorphisme, un tel coût peut être considérablement réduit. Par exemple, l'un des algorithmes DKG les plus utilisés est [Shamir's Secret Sharing] (https://fr.wikipedia.org/wiki/Partage_de_cl%C3%A9_secr%C3%A8te_de_Shamir), et il a été prouvé qu'il était [(+, +)-homorphe] (http://www.cs.cornell.edu/courses/cs754/2001fa/homo.pdf) en 1998. Cela signifie que nous pouvons faire tourner les secrets de Shamir sans aucune communication entre les gatekeepers si la conception est correcte.
>
> ### Re-cryptage tournant des états du contrat
>
> La rotation de `ContractKey` nécessite le ré-encryptage régulier des états du contrat. Pour minimiser l'impact sur les performances du ré-encryptage des états, nous essayons d'amortir le coût en périodes. C'est-à-dire que les paires clé-valeur des contrats sont cryptées avec la `ContractKey` de la session en cours. Les workers TEE peuvent obtenir les `ContractKey`s historiques à partir de la liste de clés des gatekeepers. Après un certain nombre de périodes (par exemple, 1000 périodes), seules les paires clé-valeur intactes cryptées avec des `ContractKey` périmées doivent être recryptées.
