const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLInt, GraphQLID, GraphQLBoolean, GraphQLNonNull } = require('graphql');
const axios = require('axios');

// Car type
const CarType = new GraphQLObjectType({
  name: 'Car',
  fields: () => ({
    id: { type: GraphQLID },
    brand: { type: GraphQLString },
    model: { type: GraphQLString },
    year: { type: GraphQLInt },
    available: { type: GraphQLBoolean },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    cars: {
      type: new GraphQLList(CarType),
      resolve(parent, args) {
        console.log('Appel à l\'API REST pour récupérer les voitures...');
        return axios.get('http://localhost:3000/cars')
          .then(res => {
            console.log('Réponse de l\'API REST :', res.data);
            return res.data.map(car => ({
              id: car._id, // Mapper _id à id
              brand: car.brand,
              model: car.model,
              year: car.year,
              available: car.available
            }));
          })
          .catch(err => {
            console.error('Erreur lors de l\'appel à l\'API REST :', err);
            throw new Error('Impossible de récupérer les voitures');
          });
      },
    },
    car: {
      type: CarType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return axios.get(`http://localhost:3000/cars/${args.id}`).then(res => res.data);
      },
    },
  },
});

// Mutation Root
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addCar: {
      type: CarType,
      args: {
        brand: { type: new GraphQLNonNull(GraphQLString) },
        model: { type: new GraphQLNonNull(GraphQLString) },
        available: { type: new GraphQLNonNull(GraphQLBoolean) },
      },
      resolve(parent, args) {
        console.log('Données reçues pour addCar:', args);
        return axios.post('http://localhost:3000/cars', {
          brand: args.brand,
          model: args.model,
          available: args.available,
        }).then(res => {
          console.log('Réponse de l\'API REST pour addCar:', res.data);
          return {
            id: res.data._id, // Mapper _id à id
            brand: res.data.brand,
            model: res.data.model,
            available: res.data.available,
          };
        }).catch(err => {
          console.error('Erreur lors de l\'appel à l\'API REST pour addCar:', err);
          throw new Error('Impossible d\'ajouter la voiture');
        });
      },
    },
    updateCar: {
      type: CarType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        available: { type: new GraphQLNonNull(GraphQLBoolean) },
      },
      resolve(parent, args) {
        return axios.put(`http://localhost:3000/cars/${args.id}/availability`, {
          available: args.available
        }).then(() => {
          // Récupérer les données mises à jour après la modification
          return axios.get(`http://localhost:3000/cars/${args.id}`).then(res => ({
            id: res.data._id, // Mapper _id à id
            brand: res.data.brand,
            model: res.data.model,
            available: res.data.available
          }));
        }).catch(err => {
          console.error('Erreur lors de la mise à jour de la voiture :', err);
          throw new Error('Impossible de mettre à jour la voiture');
        });
      },
    },
    deleteCar: {
      type: CarType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return axios.get(`http://localhost:3000/cars/${args.id}`)
          .then(res => {
            const car = res.data;
            return axios.delete(`http://localhost:3000/cars/${args.id}`).then(() => ({
              id: car._id, // Mapper _id à id
              brand: car.brand,
              model: car.model,
              available: car.available
            }));
          })
          .catch(err => {
            console.error('Erreur lors de la suppression de la voiture :', err);
            throw new Error('Impossible de supprimer la voiture');
          });
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation });