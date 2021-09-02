import mongoose from 'mongoose';
import Logger from '../core/Logger';
import { dbURI } from '../config';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

mongoose
  .connect(dbURI, options)
  .then(() => {
    Logger.info('Mongoose connection done');
  })
  .catch((e) => {
    Logger.info('Mongoose connection error');
    Logger.error(e);
  });

mongoose.connection.on('connected', () => {
  Logger.info('Mongoose default connection open to ' + dbURI);
});

mongoose.connection.on('error', (err) => {
  Logger.error('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
  Logger.info('Mongoose default connection disconnected');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    Logger.info(
      'Mongoose default connection disconnected through app termination',
    );
    process.exit(0);
  });
});
