# Projet SOA - Architecture avec Car-Service et Rental-Service

Ce projet est une architecture orientée services (SOA) composée de deux services principaux :

- **Car-Service** : Un service Node.js pour la gestion des voitures.
- **Rental-Service** : Un service Laravel pour la gestion des locations.

## Prérequis

- Docker et Docker Compose installés sur votre machine.
- Accès à une base de données MongoDB pour le service Car-Service.
- Accès à une base de données MySQL pour le service Rental-Service.

## Technologies utilisées

- Node.js : Utilisé pour le service Car-Service.
- Laravel : Utilisé pour le service Rental-Service.
- Docker : Utilisé pour conteneuriser les services.
- MongoDB : Base de données pour Car-Service.
- MySQL : Base de données pour Rental-Service.
- Kafka : Utilisé pour la communication interservices.
- REST, gRPC, GraphQL : Protocoles utilisés pour l'interaction avec les services.

## Car-Service

### Description
Le service Car-Service est développé en Node.js et utilise Mongoose pour interagir avec une base de données MongoDB. Il expose des API REST et gRPC pour gérer les données des voitures.

### Fonctionnalités principales
- Ajouter, modifier et supprimer des voitures.
- Récupérer les informations d'une voiture via REST, gRPC, ou GraphQL.

### Démarrage du service
1. Construisez et démarrez le conteneur Docker :
   ```bash
   docker-compose up -d car-service
Accédez au service REST à l'adresse :

arduino
Copier
Modifier
http://localhost:3000
Accédez au service gRPC à l'adresse :

makefile
Copier
Modifier
localhost:4000
Tester l'API GraphQL
Démarrez le service Car-Service comme indiqué précédemment.

Accédez à l'interface GraphQL à l'adresse suivante :

bash
Copier
Modifier
http://localhost:3000/graphql
Exemple de requête GraphQL
graphql
Copier
Modifier
mutation AddCar {
    addCar(brand: "tesla", year:2025, model: "tesla", available: false) {
        id
        brand
        model
        year
        available
    }
}
Rental-Service
Description
Le service Rental-Service est développé en Laravel et utilise une base de données MySQL. Il expose des API REST pour gérer les locations et consomme des messages Kafka pour la communication interservices.

Démarrage du service
Construisez et démarrez le conteneur Docker :

bash
Copier
Modifier
docker-compose up -d rental-service
Accédez au service REST à l'adresse :

bash
Copier
Modifier
http://localhost:81/api/rentals
Base de données
Car-Service
Utilise MongoDB.

Rental-Service
Utilise MySQL.

Commandes utiles
Démarrer tous les services
bash
Copier
Modifier
docker-compose up -d
Arrêter tous les services
bash
Copier
Modifier
docker-compose down
Vérifier les logs d'un service
bash
Copier
Modifier
docker logs <nom_du_conteneur>
Architecture du Projet (Diagramme Mermaid)
mermaid
Copier
Modifier
graph TD
    subgraph Car-Service
    A1[Car-Service] -->|REST API| B1[MongoDB]
    A1 -->|gRPC| B1
    A1 -->|GraphQL| B1
    end
    
    subgraph Rental-Service
    C1[Rental-Service] -->|REST API| D1[MySQL]
    C1 -->|Kafka| E1[Car-Service]
    end
    
    subgraph Kafka
    E1[Kafka] -->|Message| C1
    end

    A1 -->|Communicates| C1
    B1 -->|Stores Car Data| C1
Ce diagramme montre comment les services sont structurés et communiquent entre eux via REST, gRPC, GraphQL, et Kafka. Le service Car-Service gère les voitures via MongoDB et expose des API REST, gRPC et GraphQL. Le service Rental-Service gère les locations et communique avec Car-Service via Kafka pour synchroniser les données.

Structure du projet
car-service/ : Contient le code du service Car-Service.

rental-service/ : Contient le code du service Rental-Service.

docker-compose.yml : Fichier de configuration Docker Compose pour orchestrer les services.