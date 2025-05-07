const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose'); // Assurez-vous que mongoose est importé
const Car = require('../models/Car');

console.log('Chargement du fichier .proto...');
const packageDefinition = protoLoader.loadSync('./grpc/car.proto');
console.log('Fichier .proto chargé avec succès.');

const carProto = grpc.loadPackageDefinition(packageDefinition).car;

function isValidObjectId(id) {
  // Vérifiez si l'ID est une chaîne valide de 24 caractères hexadécimaux
  return typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id);
}

function getCar(call, callback) {
  console.log('Requête reçue pour getCar avec ID :', call.request.id); // Log de l'ID reçu

  let carId;
  try {
    if (isValidObjectId(call.request.id)) {
      console.log('Validation réussie pour l\'ID :', call.request.id); // Log de validation réussie
      carId = new mongoose.Types.ObjectId(call.request.id); // Utilisation correcte de `new`
      console.log('ID converti en ObjectId :', carId); // Log de l'ID converti
    } else {
      console.error('Format d\'ID invalide :', call.request.id); // Log de l'ID invalide
      return callback({ code: grpc.status.INVALID_ARGUMENT, message: 'Invalid ID format. Must be a 24-character hex string.' });
    }
  } catch (error) {
    console.error('Erreur lors de la conversion de l\'ID :', error.message); // Log de l'erreur
    return callback({ code: grpc.status.INVALID_ARGUMENT, message: 'Error converting ID to ObjectId.', details: error.message });
  }

  Car.findById(carId)
    .then(car => {
      if (!car) {
        console.log('Voiture non trouvée pour ID :', carId); // Log si la voiture n'est pas trouvée
        return callback({ code: grpc.status.NOT_FOUND, message: 'Car not found' });
      }
      console.log('Voiture trouvée :', car); // Log des détails de la voiture trouvée
      callback(null, {
        id: car._id.toString(),
        brand: car.brand,
        model: car.model,
        available: car.available,
      });
    })
    .catch(err => {
      console.error('Erreur interne lors de la recherche de la voiture :', err.message); // Log de l'erreur interne
      callback({ code: grpc.status.INTERNAL, message: 'Internal server error', details: err.message });
    });
}

function startGrpcServer() {
  console.log('Création du serveur gRPC...');
  const server = new grpc.Server();
  server.addService(carProto.CarService.service, { getCar });
  console.log('Service gRPC ajouté.');

  console.log('Tentative de liaison du serveur gRPC au port 4000...');
  server.bindAsync('0.0.0.0:4000', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Erreur lors de la liaison du serveur gRPC :', err);
      return;
    }
    console.log(`Serveur gRPC lié avec succès au port ${port}`);
    server.start();
    console.log('Serveur gRPC démarré avec succès.');
  });
}

module.exports = { startGrpcServer };
