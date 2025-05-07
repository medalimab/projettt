const express = require('express');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
const carRoutes = require('./routes/carRoutes');
const { startGrpcServer } = require('./grpc/server');
const schema = require('./schema');
const { Kafka, Partitioners } = require('kafkajs');

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Middleware global pour capturer toutes les requêtes
app.use((req, res, next) => {
    console.log(`Requête reçue : ${req.method} ${req.url}`);
    next();
});

// Fonction pour gérer la connexion à MongoDB
const connectDB = async () => {
    try {
        const mongoUrl = "mongodb://admin:password@mongodb:27017/car_db?authSource=admin"; // Utilisation du nom de service Docker pour MongoDB
        await mongoose.connect(mongoUrl);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    }
};

// Appel de la fonction pour établir la connexion à MongoDB
connectDB();

// Configuration Kafka
const kafka = new Kafka({
    clientId: 'car-service',
    brokers: ['kafka:9092'],
});

const producer = kafka.producer(); // Supprimez l'option createPartitioner

// Fonction pour envoyer un message à Kafka
const sendMessage = async (message) => {
    try {
        console.log('Connexion au producteur Kafka...');
        await producer.connect();
        console.log('Envoi du message à Kafka...');
        await producer.send({
            topic: 'car-updates',
            messages: [{ value: JSON.stringify(message) }],
        });
        console.log('Message envoyé à Kafka:', message);
        await producer.disconnect();
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message à Kafka:', error);
        throw error; // Relance l'erreur pour qu'elle soit capturée dans la route
    }
};

// Rétablissement de la logique complète de la route /cars/notify
app.post('/cars/notify', async (req, res) => {
    console.log('Requête reçue sur /cars/notify:', req.body);

    const { carId, status } = req.body;

    if (!carId || !status) {
        console.error('Corps de requête invalide:', req.body);
        return res.status(400).send('Invalid request body');
    }

    const message = { carId, status };
    console.log('Message préparé pour Kafka:', message);

    try {
        await sendMessage(message);
        console.log('Message envoyé à Kafka avec succès:', message);
        res.status(200).send('Notification envoyée à Kafka');
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message à Kafka:', error);
        res.status(500).send('Erreur interne du serveur');
    }
});

// Routes REST existantes
app.use('/cars', carRoutes);

// Route GraphQL
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true, // UI pour tester les requêtes
}));

// Gestionnaire global pour capturer les erreurs non gérées
app.use((err, req, res, next) => {
    console.error('Erreur non gérée :', err);
    res.status(500).send('Erreur interne du serveur');
});

// Démarrage du serveur gRPC
startGrpcServer();

// Démarrage du serveur HTTP
app.listen(3000, () => console.log('GraphQL Gateway sur http://localhost:3000/graphql'));
