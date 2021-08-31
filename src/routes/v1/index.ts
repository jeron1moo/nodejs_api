import express from 'express';
const router = express.Router();

/*-------------------------------------------------------------------------*/
// Below all APIs are public APIs protected by api-key
router.use('/', (req, res) => {
  return res.send({ message: 'Hey you' });
});
/*-------------------------------------------------------------------------*/

export default router;
