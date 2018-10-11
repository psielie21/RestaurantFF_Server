import "babel-polyfill";

import express from 'express';
import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import { execute } from 'graphql';

import './config/db';
import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';
import constants from './config/constants';
import middlewares from './config/middleware';

import overpass from "./services/overpass";

const app = express();

//const oneFolderUp = __dirname.substring()
app.use('/static', express.static("/home/ubuntu/workspace" + '/static'));

middlewares(app);
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
        user: req.user
     }),
     playground: true,
     introspection: true
})
/*
app.use(
    '/graphiql',
    graphiqlExpress({
      endpointURL: constants.GRAPHQL_PATH,
    }),
  );

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

app.use(
    constants.GRAPHQL_PATH,
    graphqlExpress(req => ({
        schema,
        context: {
            user: req.user
        }
    }))
);


const graphQLServer = createServer(app);

graphQLServer.listen(constants.PORT, err => {
    if(err) {
        console.error(err);
    } else {
        console.log("App listen to port: " + constants.PORT);
    }
})
*/

server.applyMiddleware( {app} );
app.listen({ port: constants.PORT}, () => {
    console.log("We listening!")
    console.log(process.env.NODE_ENV);
})