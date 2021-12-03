---
title: "Déployer le réseau de test en local"
weight: 10002
draft: false
menu:
  docs:
    parent: "pDiem"
---

Il y a deux options pour exécuter la démo de pdiem :

1. Utiliser notre fichier Docker Compose
2. Construire à partir des sources et l'exécuter directement

Ce guide ne couvrira que l'approche Docker Compose car elle gère tout automatiquement pour vous. Il installe les dépendances, construit le code, démarre le réseau avec les composants correctement connectés, et les lancent.

{{< tip >}} Dans l'environnement de développement, nous construisons le code de manière native. Les utilisateurs professionnels qui souhaitent modifier notre code peuvent consulter les fichiers Dockerfiles et docker-compose pour apprendre comment le système est configuré. Si vous avez besoin d'aide, n'hésitez pas à demander dans notre groupe Discord #dev. {{< /tip >}} 

## préparation

Conditions requises pour exécuter la démo :

1. Un ordinateur Linux sur lequel Docker et Docker Compose sont installés.
    - [Guide d'installation de Docker](https://docs.docker.com/engine/install/)
    - [Guide d'installation de Docker Compose](https://docs.docker.com/compose/install/)
2. 50G d'espace disque libre (un SSD est préférable car la compilation prend plus de temps sur les disques HDDs)
3. Un processeur puissant

Assurez-vous que les commandes `docker` et `docker-compose` sont disponibles pour votre utilisateur :

```bash
docker --version
# > Docker version 20.10.5, build 55c4c88
docker-compose --version
# > docker-compose version 1.28.5, build c4eb3a1f
```

Pour démarrer l'environnement complet, clonez d'abord le dépôt phala-docker sur la branche `pdiem-m3`.

```bash
git clone -b pdiem-m3 https://github.com/Phala-Network/phala-docker.git
```

Ouvrez le dépôt, construisez les images docker.

```bash
cd phala-docker && docker-compose build
```

{{< tip >}}La création des 5 projets distincts peut prendre jusqu'à 1 à 2 heures. Un processeur puissant peut le construire en 30 minutes environ.{{< /tip >}}

Pour **démarrer** l'environnement complet de pdiem :

```bash
docker-compose up
```

Pour **arrêter** l'environnement complet de pdiem (et supprimer l'historique de la blockchain diem) :

```bash
docker-compose down --volume
```

Pour vérifier l'état des services :

```bash
docker-compose ps
```

{{< tip >}}
Astuces:
- L'état de `diem-cli` devrait être "Exit 0" car nous le lancerons manuellement à la demande.
- Ne laissez pas fonctionner `diem-cli` trop longtemps. Il écrit ~1 Mo/s sur le disque.
- `pdiem-m3` prend également en charge le [SGX Hardware mode]({{< relref "docs/pdiem/hardware-mode" >}})
{{< /tip >}}
