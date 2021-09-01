import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { corsUrl, environment, dbURI, name, secret } from './config';
import './database';
import routesV1 from './routes/v1';
import Logger from './core/Logger';
import helmet from 'helmet';
import setupGoogle from './google';
import setupGithub from './github';
import { ApiError, InternalError, NotFoundError } from './core/ApiError';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors({ origin: corsUrl }));
app.use(helmet());
app.use(cookieParser());
app.use(
  session({
    store: MongoStore.create({ mongoUrl: dbURI, ttl: 14 * 24 * 60 }),
    name,
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
    },
  }),
);

setupGoogle(app);
setupGithub(app);

app.use('/api', routesV1);

app.use((req, res, next) => next(new NotFoundError()));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
  } else {
    if (environment === 'development') {
      Logger.error(err);
      return res.status(500).send(err.message);
    }
    ApiError.handle(new InternalError(), res);
  }
  next();
});

export default app;
