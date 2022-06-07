---
title: "Introduction au Fat Contract"
weight: 2000
draft: false
menu:
  docs:
    parent: "phala-network"
---

# Un appel Smart Contract de nouvelle génération

Qu'attendez-vous des contrats intelligents ?

Ma réponse serait :

> Fournir des fonctionnalités riches comme des programmes normaux avec de meilleures performances et une puissance de calcul plus importante grâce à la simultanéité de plusieurs nœuds de calcul.

Les contrats intelligents introduits par la blockchain Ethereum sont vraiment une innovation pour étendre la capacité de la blockchain. Pour la première fois, toutes les règles sont définies et appliquées avec un code non modifiable et des transactions irréversibles. En conséquence, nous avons vu sa large adoption dans la finance décentralisée, où la confiance est si précieuse. Malgré le succès rencontré dans ce domaine, du point de vue des développeurs, les plateformes actuelles de contrats intelligents sont fermées : il est impossible d'accéder facilement aux données et aux services qu'elles contiennent. Pour résoudre ce problème, il faut même créer des blockchains ad hoc [Oracle] (https://fr.wikipedia.org/wiki/Oracle_de_blockchain) ! Sans parler des platitudes visant à améliorer les performances des blockchains existantes.

Phala s'engage à fournir un réseau informatique décentralisé universel qui peut être librement combiné avec des contrats intelligents décentralisés, des protocoles de stockage et des services d'indexation des données. Ce que nous avons réalisé est un cloud sans confiance de plus de 20 000 workers TEE. Ces nœuds de calcul sont organisés dans un cadre qui permet de *découpler l'exécution et le consensus* : Contrairement aux plateformes existantes où tous les contrats sont exécutés par un seul mineur au cours du processus de production des blocs (avec d'autres mineurs effectuant une exécution dupliquée pour la validation), Phala impose une exécution fidèle dans chaque worker TEE sans (ou seulement avec un petit facteur de) duplication, ainsi sa puissance de calcul augmente linéairement avec le nombre de workers TEE. Nous pensons qu'il s'agit là d'une condition préalable à la mise en place d'un cloud informatique décentralisé capable de porter le monde du Web3.

![](https://i.imgur.com/3p6M1DQ.png)

Phala était connu comme la blockchain confidentielle en combinant TEE et blockchain, et cela peut facilement faire ignorer aux gens la valeur réelle de notre conception : Déplacer le calcul hors de la chaîne supprime les limitations du contrat intelligent actuel, ce qui nous conduit au puissant *Fat Contract* doté de riches fonctionnalités :

- Prise en charge des tâches nécessitant des calculs intensifs. Pour la première fois, même un seul contrat peut utiliser pleinement la puissance de calcul d'un worker TEE, sans craindre de bloquer l'ensemble de la blockchain. Par exemple, les exigences en matière de rendu d'images et de vidéos sont renforcées par la popularité du NFT et du Metaverse, alors que les tâches de rendu sont coûteuses et nécessitent une grande puissance de calcul. En tirant parti du [Projet Gramine] (https://github.com/gramineproject/gramine), nous avons terminé la preuve de concept pour exécuter le moteur de rendu open-source non modifié [Blender] (https://www.blender.org/) dans nos workers TEE. Grâce à la programmation concurrente, il est possible de combiner la puissance de plusieurs workers TEE et d'exécuter les tâches les plus lourdes ;
- Servir des calculs en temps réel à faible latence. Le temps de réponse pour le Metaverse et l'interaction avec le jeu ne doit pas dépasser une seconde. Cependant, les contrats intelligents traditionnels de la blockchain ne peuvent pas répondre à l'exigence de ces services à faible latence (puisqu'ils sont exécutés à intervalles de blocs). Fat Contract peut atteindre des réponses en lecture et en écriture de l'ordre de la milliseconde, ce qui en fait un choix parfait pour déployer des services Metaverse et des jeux ;
- Accéder à des services Internet. Les workers TEE sécurisés hors chaîne peuvent déléguer en toute sécurité des demandes asynchrones compliquées pour Fat Contract. Dans notre hackathon, nous avons présenté un [demo bot] (https://github.com/Phala-Network/phala-blockchain/tree/encode-hackathon-2021) du prix du BTC. Vous pouvez envoyer une requête HTTP pour demander le prix du BTC à partir du service Web existant, puis le signaler à votre compte Telegram via l'API HTTP correspondante. Toutes ces opérations sont réalisées dans un délai de 100 LoC dans le Fat Contrat.

Plus important encore, ces puissants Fat Contracts sont exécutés à l'intérieur de nos *workers TEE sécurisés*, qui ne peuvent pas regarder les données des clients ou manipuler l'exécution pour fournir de faux résultats, de sorte que la confidentialité et l'irréversibilité bien-aimées sont toujours promises pendant l'exécution du contrat. Pour l'instant, nous nous appuyons sur l'environnement d'exécution de confiance (TEE), en particulier Intel SGX, comme workers TEE sécurisés, et cette conception peut supporter d'autres workers TEE comme AMD SEV, ou même des solutions basées sur [MPC](https://fr.wikipedia.org/wiki/Calcul_multipartite_s%C3%A9curis%C3%A9)- ou [ZKP](https://fr.wikipedia.org/wiki/Preuve_%C3%A0_divulgation_nulle_de_connaissance)-.

Pour en revenir à notre question de départ, nous essayons de sortir du stéréotype du contrat intelligent actuel et de repenser la manière dont le contrat devrait se comporter dans un véritable cloud informatique. C'est la raison pour laquelle nous concevons et mettons en œuvre le Fat Contract : il devrait d'abord se comporter comme un programme normal au lieu d'un contrat intelligent, et ensuite nous lui donnerons la nature décentralisée et sans-confiance de la blockchain. Nous l'appelons "Fat" pour montrer la richesse des fonctionnalités qu'il peut offrir par rapport aux smart contracts existants. Pour clarifier encore une fois :

> Fat Contract est une sorte de programme décentralisé plutôt qu'un smart contract, qui prend en charge des tâches intensives de calcul, en temps réel et a accès à tous les services même s'ils sont en dehors des blockchains.
Notre foi dans le Fat Contract vient également du retour d'information de notre communauté. Lors de notre dernier hackathon, nous avons vu les [créations](https://github.com/Phala-Network/Encode-Hackathon-2021/issues/21) de certains développeurs talentueux avec le puissant Fat Contract.
Pour l'instant, il y a deux façons de jouer avec le Fat Contract :
- Vous pouvez maintenant revisiter notre hackathon [tutoriel] (https://wiki.phala.network/en-us/docs/developer/) et le suivre pour forker notre code de base et effectuer des changements. Cela vous donnera une expérience immédiate des capacités de Fat Contract ;
- Notre support pour *Parity's [Ink ! Contract](https://github.com/paritytech/ink)* est en route. Vous pouvez développer votre contrat avec le langage de programmation Rust, sûr et efficace, et profiter de l'amélioration des performances de nos workers TEE hors chaîne sans avoir à forker notre large codebase.

Tout comme le Fat Contract, Phala se veut ouvert et en constante amélioration. Nous accueillons les commentaires des développeurs du monde entier afin d'ajouter de nouvelles fonctionnalités au Fat Contract. Pourquoi ne pas rejoindre notre communauté dès maintenant et mettre les mains dans le cambouis avec le Fat Contract ?
