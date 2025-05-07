# Projet SOA - Architecture avec Car-Service et Rental-Service

Ce projet est une architecture orientée services (SOA) composée de deux services principaux :

- **Car-Service** : Un service Node.js pour la gestion des voitures.
- **Rental-Service** : Un service Laravel pour la gestion des locations.

## Prérequis

- Docker et Docker Compose installés sur votre machine.
- Accès à une base de données MongoDB pour le service Car-Service.
- Accès à une base de données MySQL pour le service Rental-Service.

---

## Car-Service

### Description
Le service Car-Service est développé en Node.js et utilise Mongoose pour interagir avec une base de données MongoDB. Il expose des API REST et gRPC pour gérer les données des voitures.

### Fonctionnalités principales
- Ajouter, modifier et supprimer des voitures.
- Récupérer les informations d'une voiture via REST ou gRPC.

### Démarrage du service

1. Construisez et démarrez le conteneur Docker :
   ```bash
   docker-compose up -d car-service
   ```

2. Accédez au service REST à l'adresse :
   ```
   http://localhost:3000
   ```

3. Accédez au service gRPC à l'adresse :
   ```
   localhost:4000
   ```

### GraphQL dans Car-Service

Le service Car-Service inclut également une API GraphQL pour interagir avec les données des voitures.

### Accéder à l'API GraphQL

1. Démarrez le service Car-Service comme indiqué précédemment.
2. Accédez à l'interface GraphQL à l'adresse suivante :
   ```
   http://localhost:3000/graphql
   ```

### Tester l'API GraphQL

Utilisez un outil comme [GraphiQL](https://github.com/graphql/graphiql) ou [Postman](https://www.postman.com/) pour envoyer des requêtes GraphQL. Voici un exemple de requête pour récupérer les informations d'une voiture :

```graphql
query {
  car(id: "<ID_DE_LA_VOITURE>") {
    id
    brand
    model
    available
  }
}
```

Remplacez `<ID_DE_LA_VOITURE>` par l'ID de la voiture que vous souhaitez interroger.

### Tester le service gRPC

Utilisez un outil comme BloomRPC ou Postman pour tester les méthodes gRPC :

1. **Avec BloomRPC** :
   - Chargez le fichier `car-service/grpc/car.proto`.
   - Configurez l'URL du serveur gRPC : `localhost:4000`.
   - Appelez les méthodes disponibles en fournissant les paramètres nécessaires.

2. **Avec Postman** :
   - Installez l'extension gRPC de Postman si ce n'est pas déjà fait.
   - Configurez une nouvelle requête gRPC avec l'URL : `localhost:4000`.
   - Importez le fichier `car-service/grpc/car.proto` pour découvrir les méthodes disponibles.
   - Appelez les méthodes en configurant les paramètres requis.

---

## Rental-Service

### Description
Le service Rental-Service est développé en Laravel et utilise une base de données MySQL. Il expose des API REST pour gérer les locations et consomme des messages Kafka pour la communication interservices.

### Fonctionnalités principales
- Créer, modifier et supprimer des locations.
- Consommer des messages Kafka pour synchroniser les données.

### Démarrage du service

1. Construisez et démarrez le conteneur Docker :
   ```bash
   docker-compose up -d rental-service
   ```

2. Accédez au service REST à l'adresse :
   ```
   http://localhost:81
   ```

### Tester Kafka

Pour consommer des messages Kafka, exécutez la commande suivante :
```bash
docker exec -it projettt-rental-service-1 php artisan kafka:consume
```

Assurez-vous que Kafka est correctement configuré et en cours d'exécution avant d'exécuter cette commande.

---

## Base de données

### Car-Service
- Utilise MongoDB.
- Configurez la connexion dans le fichier `car-service/schema.js`.

### Rental-Service
- Utilise MySQL.
- Configurez la connexion dans le fichier `rental-service/config/database.php`.
- Exécutez les migrations pour créer les tables nécessaires :
  ```bash
  docker exec -it projettt-rental-service-1 php artisan migrate
  ```

---

## Commandes utiles

### Démarrer tous les services
```bash
docker-compose up -d
```

### Arrêter tous les services
```bash
docker-compose down
```

### Vérifier les logs d'un service
```bash
docker logs <nom_du_conteneur>
```

Remplacez `<nom_du_conteneur>` par `projettt-car-service-1` ou `projettt-rental-service-1` selon le service.

---

## Structure du projet

- **car-service/** : Contient le code du service Car-Service.
- **rental-service/** : Contient le code du service Rental-Service.
- **docker-compose.yml** : Fichier de configuration Docker Compose pour orchestrer les services.

---

