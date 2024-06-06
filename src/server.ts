/**
 * Setup express server.
 */

import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';
import mongoose from 'mongoose';
import { ItemsRouter } from '@src/routes/items';
import { CategoriesRouter } from '@src/routes/categories';
import accessRoute from '@src/middleware/access-route';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';

import 'express-async-errors';

import BaseRouter from '@src/routes/api';
import Paths from '@src/constants/Paths';

import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import { NodeEnvs } from '@src/constants/misc';
import { RouteError } from '@src/other/classes';




// **** Variables **** //

const app = express();


// **** Database **** //
// Connect to MongoDB
mongoose.set('strictQuery', false);
const mongoDB = EnvVars.MongoUri;

async function connectToDB(){
  try {
    await mongoose.connect(mongoDB);
  } catch (err) {
    console.error(err);
  }
}
connectToDB();

// **** Setup **** //

// Set View Engine

app.set('view engine', 'pug');

// Prod middleware

// Basic middleware
app.use(accessRoute);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(EnvVars.CookieProps.Secret));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(compression());
  app.use(helmet());
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 20,
  });
  app.use(limiter);
}

// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter);

app.get('/', (req: Request, res: Response) => {
  res.render('home');
});

app.use('/items', ItemsRouter);
app.use('/categories', CategoriesRouter);

// Add error handler
app.use((
  err: Error,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
  }
  return res.status(status).json({ error: err.message });
});


// ** Front-End Content ** //

// Set views directory (html)
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

// Set static directory (js and css).
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));


// **** Export default **** //

export default app;
