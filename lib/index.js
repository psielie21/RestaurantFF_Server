'use strict';

require('babel-polyfill');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _apolloServerExpress = require('apollo-server-express');

var _graphql = require('graphql');

require('./config/db');

var _schema = require('./graphql/schema');

var _schema2 = _interopRequireDefault(_schema);

var _resolvers = require('./graphql/resolvers');

var _resolvers2 = _interopRequireDefault(_resolvers);

var _constants = require('./config/constants');

var _constants2 = _interopRequireDefault(_constants);

var _middleware = require('./config/middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _overpass = require('./services/overpass');

var _overpass2 = _interopRequireDefault(_overpass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

//const oneFolderUp = __dirname.substring()
app.use('/static', _express2.default.static("/home/ubuntu/workspace" + '/static'));

(0, _middleware2.default)(app);
var server = new _apolloServerExpress.ApolloServer({
    typeDefs: _schema2.default,
    resolvers: _resolvers2.default,
    context: function context(_ref) {
        var req = _ref.req;
        return {
            user: req.user
        };
    },
    playground: true,
    introspection: true
});
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

server.applyMiddleware({ app: app });
app.listen({ port: _constants2.default.PORT }, function () {
    console.log("We listening!");
    console.log(process.env.NODE_ENV);
});