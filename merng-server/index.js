const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

mongoose
  .connect(process.env.MONGODB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('MongoDB connected');
    return server.listen({ port: process.env.PORT || 5000 });
  })
  .then((res) => {
    console.log(`server running as ${res.url}`);
  })
  .catch((err) => {
    console.error(err);
  });
