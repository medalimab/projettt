const express = require('express');
const Car = require('../models/Car');
const { Kafka } = require('kafkajs');
const router = express.Router();

const kafka = new Kafka({
  clientId: 'car-service',
  brokers: ['kafka:9092'],
});
const producer = kafka.producer();

router.post('/', async (req, res) => {
  const car = await Car.create(req.body);
  res.json(car);
});

router.get('/', async (req, res) => {
  const cars = await Car.find();
  res.json(cars);
});

// Route pour récupérer une voiture spécifique par son ID
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
const mongoose = require('mongoose');

router.put('/:id', async (req, res) => {
  console.log('Requête reçue pour mise à jour complète :', req.body);

  // Vérifie que l'ID est valide
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid car ID format' });
  }

  try {
    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }

    console.log('Voiture mise à jour :', updatedCar);

    await producer.connect();
    await producer.send({
      topic: 'car-updates',
      messages: [
        {
          value: JSON.stringify({
            car_id: updatedCar._id,
            brand: updatedCar.brand,
            model: updatedCar.model,
            year: updatedCar.year,
            available: updatedCar.available
          })
        },
      ],
    });
    await producer.disconnect();

    res.json({ message: 'Car updated and published to Kafka', car: updatedCar });

  } catch (err) {
    console.error('Erreur lors de la mise à jour :', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});


// Route pour mettre à jour la disponibilité d'une voiture et publier sur Kafka
router.put('/:id/availability', async (req, res) => {
  console.log('Requête reçue pour mettre à jour la disponibilité :', req.body);
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, { available: req.body.available }, { new: true });
    if (!car) {
      console.error('Voiture non trouvée pour ID :', req.params.id);
      return res.status(404).json({ message: 'Car not found' });
    }
    console.log('Disponibilité mise à jour :', car);

    // Publier le changement de disponibilité sur Kafka
    await producer.connect();
    await producer.send({
      topic: 'car-updates',
      messages: [
        { value: JSON.stringify({ car_id: car._id, available: req.body.available }) },
      ],
    });
    await producer.disconnect();

    res.json({ message: 'Availability updated and published to Kafka', car });
  } catch (err) {
    console.error('Erreur lors de la mise à jour de la disponibilité :', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Route pour supprimer une voiture par son ID
router.delete('/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json({ message: 'Car deleted successfully', car });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
