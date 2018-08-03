import bodyParser from 'body-parser';
import jwt from "express-jwt";
import constants from "./constants"


export default app => {
  app.use(bodyParser.json());
  app.use(jwt({ secret: constants.JWT_SECRET,
          getToken: function fromHeaderOrQuerystring (req) {
            if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
               return req.headers.authorization.split(' ')[1];
            }
            return null;
  }}));
}