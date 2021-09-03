import express from 'express';
import user from './user';
import stripe from './stripe';
import { swGetApiInfo } from './get-api-info';

export const swApiRouter = {
  '/api': {
    get: {
      ...swGetApiInfo,
    },
  },
};

const router = express.Router();

router.get('/', async (req, res) => {
  return res.send({ message: 'Hey you' });
});

router.use('/user', user);
router.use('/stripe', stripe);

export default router;
