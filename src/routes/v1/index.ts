import express from 'express';
import user from './user';
import stripe from './stripe';

const router = express.Router();

router.get('/', (req, res) => {
  return res.send({ message: 'Hey you' });
});

router.use('/user', user);
router.use('/stripe', stripe);

export default router;
