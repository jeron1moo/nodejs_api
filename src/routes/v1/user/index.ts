import { Types } from 'mongoose';
import express from 'express';
import { BadRequestError } from '../../../core/ApiError';
import UserRepo from '../../../database/repository/UserRepo';
import { User } from '../../../database/model/User';
import bcrypt from 'bcrypt';
import { addNewCustomer } from '../../../stripe';
import { swGetUserApi } from './get-user-info';

export const swUserRouter = {
  '/api/user': {
    get: {
      ...swGetUserApi,
    },
    post: {
      ...swGetUserApi,
    },
  },
};

const router = express.Router();

router.get('/:id', async (req, res) => {
  const user = await UserRepo.findById(new Types.ObjectId(req?.params?.id));

  if (!user) throw new BadRequestError('User not registered');
  return res?.send(user);
});

router.post('/', async (req, res) => {
  const user = await UserRepo.findByEmail(req.body.email);
  if (user) throw new BadRequestError('User already registered');
  const passwordHash = await bcrypt.hash(req.body.password, 10);

  const createdUser = await UserRepo.create({
    name: req.body.name,
    email: req.body.email,
    profilePicUrl: req.body.profilePicUrl,
    password: passwordHash,
  } as User);

  const customer = await addNewCustomer(req?.body?.email);
  req.session.customerID = customer;

  return res.send(createdUser);
});

router.post('/updatePlan', async (req, res) => {
  const users = await UserRepo.updatePlan(
    // @ts-ignore
    req?.session?.passport?.user?.email,
    '',
  );

  if (!users) throw new BadRequestError('No users defined');

  return res.send(users);
});

router.get('/', async (req, res) => {
  const users = await UserRepo.getUsers();

  if (!users) throw new BadRequestError('No users defined');

  return res.send(users);
});

export default router;
