graph TD
    subgraph Client
        U[Utilisateur]
    end

    subgraph Car-Service_Car-Service_Node.js
        A1[API REST / gRPC / GraphQL]
        DB1[(MongoDB)]
    end

    subgraph Kafka_Kafka_Broker
        K1((Kafka))
    end

    subgraph Rental-Service_Rental-Service_Laravel
        B1[REST API]
        DB2[(MySQL)]
    end

    U --> A1
    A1 --> DB1
    A1 --> K1
    K1 --> B1
    B1 --> DB2

    style A1 fill:#dff0d8,stroke:#333,stroke-width:1px
    style B1 fill:#d9edf7,stroke:#333,stroke-width:1px
    style K1 fill:#fcf8e3,stroke:#333,stroke-width:1px
