import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { corsUrl, environment } from './config';
import './database';
import routesV1 from './routes/v1';

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors({ origin: corsUrl }));

app.use('api/v1/', routesV1);

app.use((req, res, next) => next());

export default app;
