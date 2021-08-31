import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  return res.send({ message: 'Hey you' });
});

export default router;
