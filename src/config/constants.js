export default {
  PORT: process.env.PORT || 8080,
  DB_URL: process.env.MONGODB_URI + "/rffserver",
  GRAPHQL_PATH: "/graphql",
  JWT_SECRET: "thisisasecret",
  MAX_LATITUDE_DELTA: 0.02,
  MAX_LONGITUDE_DELTA: 0.03,
}
