import { swApiRouter } from './routes/v1';
import { swStripeRouter } from './routes/v1/stripe';
import { swUserRouter } from './routes/v1/user';

const swagger = {
  openapi: '3.0.0',
  info: {
    title: 'Express API',
    version: '1.0.0',
    description: 'The REST API for service',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server',
    },
  ],
  paths: {
    ...swApiRouter,
    ...swStripeRouter,
    ...swUserRouter,
  },
};

export default swagger;
