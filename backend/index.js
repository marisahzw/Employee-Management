const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
function formatError(error) {
  return {
    message: error.message,
  };
}

const TypeDefs = require('./schema')
const Resolvers = require('./resolvers')


const { ApolloServer } = require('apollo-server-express')

const dotenv = require('dotenv');
dotenv.config();

const mongodb_atlas_url = process.env.MONGODB_URL;


mongoose.connect(mongodb_atlas_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  writeConcern: { w: 'majority' }
}).then(success => {
  console.log('Success Mongodb connection')
}).catch(err => {
  console.log('Error Mongodb connection')
});

//Apollo Server
const server = new ApolloServer({
  typeDefs: TypeDefs.typeDefs,
  resolvers: Resolvers.resolvers,
  formatError: formatError
})

//Express Server
const app = express();
app.use(bodyParser.json());
app.use('*', cors());


server.applyMiddleware({app})



//Start listen 
app.listen({ port: process.env.PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`));
