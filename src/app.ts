import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { corsUrl, environment } from './config';
import './database';
import routesV1 from './routes/v1';
import Logger from './core/Logger';
import helmet from 'helmet';
import setupGoogle from './google';
import { ApiError, InternalError, NotFoundError } from './core/ApiError';

const ROOT_URL = `http://localhost:5000`;

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors({ origin: corsUrl }));
app.use(helmet());

app.use('/api', routesV1);

setupGoogle(app, ROOT_URL);

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
    next();
  }
});

export default app;
