# Architecture Microservices

```mermaid
graph TD
    subgraph Client
        U[Utilisateur]
    end

    subgraph Car-Service [Car-Service (Node.js)]
        A1[API REST / gRPC / GraphQL]
        DB1[MongoDB]
    end

    subgraph Kafka [Kafka (Broker)]
        K1((Kafka))
    end

    subgraph Rental-Service [Rental-Service (Laravel)]
        B1[REST API]
        DB2[MySQL]
    end

    U --> A1
    A1 --> DB1
    A1 --> K1
    K1 --> B1
    B1 --> DB2
