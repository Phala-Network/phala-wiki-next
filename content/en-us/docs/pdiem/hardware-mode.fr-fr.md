---
title: "Avancé: Mode Matériel"
weight: 8
draft: false
---

Par défaut, la démo est construite avec le mode logiciel SGX SDK. Elle est conçue pour un environnement de développement. Cependant, pour protéger les données et la logique à l'intérieur de l'Enclave, elle doit fonctionner en mode matériel.

{{< tip >}}
Le SDK Intel SGX est livré avec trois modes :

- **Software** : il s'exécute dans l'environnement de simulation, et n'offre aucune protection au code ou aux données.
- **Hardware Dev** : il s'exécute dans l'environnement matériel réel, mais permet aux débogueurs de s'y attacher et n'offre donc aucune protection.
- **Hardware Prod** : il s'exécute dans l'environnement matériel réel et n'autorise pas les débogueurs à s'y attacher, mais doit être signé avec des certificats de production.

Pour exécuter des programmes SGX en mode matériel, vous devez d'abord installer le pilote SGX.
{{< /tip >}}

Dans la branche `pdiem-m3`, en plus du mode logiciel par défaut, nous proposons également la construction en mode matériel. Dans ce cas, vous devez spécifier le bon fichier docker-compose :

- `docker-compose.hw.ias.yml` : Mode HW dev fonctionnant avec le [IAS Driver](https://01.org/intel-softwareguard-extensions/downloads/intel-sgx-linux-2.13-release)
- `docker-compose.hw.dcap.yml` : Mode de développement HW fonctionnant avec le [pilote DCAP](https://01.org/intel-softwareguard-extensions/downloads/intel-sgx-dcap-1.10-release)

`IAS` et `DCAP` sont deux pilotes SGX différents. Veuillez choisir le fichier docker-compose qui correspond à votre plateforme. Ensuite, vous pouvez spécifier les fichiers de configuration lorsque vous exécutez une commande docker-compose par `-f`.

Par exemple, exécutez la commande suivante pour construire l'image du pilote IAS :

``bash
docker-compose -f docker-compose.hw.ias.yml build
```

Il existe également une version HW de `phala-console.sh`, qui doit être utilisée en fonction de votre plateforme :

- `phala-console.hw.ias.sh`
- `phala-console.hw.dcap.sh`

{{< tip >}}
Certaines plateformes prennent en charge les deux pilotes, mais les autres ne prennent en charge qu'un seul d'entre eux. Vous pouvez toujours essayer l'un d'entre eux, et passer à l'autre si cela ne fonctionne pas. Assurez-vous de désinstaller le pilote actuel avant une autre installation car ils entrent en conflit l'un avec l'autre.

Le pilote IAS crée un périphérique dans le répertoire `/dev/isgx`, tandis que le pilote DCAP crée deux périphériques dans le répertoire `/dev/sgx`. Vous pouvez vérifier lequel est installé dans votre système par cette astuce.
{{< /tip >}}
