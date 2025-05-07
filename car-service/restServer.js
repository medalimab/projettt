const express = require('express');
const mongoose = require('mongoose');
const carRoutes = require('./routes/carRoutes');

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/car_db')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routes REST
app.use('/cars', carRoutes);

// Démarrage du serveur REST
app.listen(3002, () => console.log('REST API sur http://localhost:3002/cars'));
