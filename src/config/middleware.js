import bodyParser from 'body-parser';
import jwt from "express-jwt";
import errorhandler from "errorhandler"

import constants from "./constants"
import { decodeToken } from "../services/auth"


async function auth(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (token != null) {
      const user = await decodeToken(token);
      req.user = user;
    } else {
      req.user = null;
    }
    
    return next();
  } catch (error) {
      req.user = null;
      return next();
  }
}

export default app => {
  app.use(bodyParser.json());
  app.use(auth);
  if (process.env.NODE_ENV === 'development') {
  // only use in development
    app.use(errorhandler())
  }
}