import { User, UserModel, GoogleToken } from '../model/User';
import generateSlug from '../../utils/slugify';
import _ from 'lodash';
import { Types } from 'mongoose';
import { addNewCustomer } from '../../stripe';
import SubscriptionRepo from './SubscriptionRepo';
export default class UserRepo {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public static async signInOrSignUp(user: User): Promise<User> {
    const isUser = await UserModel.findOne({
      googleId: user.googleId,
    }).exec();
    if (isUser) {
      const modifier: GoogleToken = {};

      if (user?.googleToken?.access_token) {
        modifier.access_token = user?.googleToken?.access_token;
      }

      if (user?.googleToken?.refresh_token) {
        modifier.refresh_token = user?.googleToken?.refresh_token;
      }

      if (_.isEmpty(modifier)) {
        return user;
      }

      await UserModel.updateOne(
        { googleId: user?.googleId },
        { $set: modifier },
      );

      return user;
    }

    const slug = await generateSlug(UserModel, user.name || '');

    const userProps = {
      ...user,
      slug,
    };
    const createdUser = await UserModel.create(userProps);
    await addNewCustomer(user.email);

    return createdUser;
  }

  public static async create(user: User): Promise<User> {
    const slug = await generateSlug(UserModel, user.name || '');

    const createdUser = await UserModel.create({
      ...user,
      slug,
    });

    return createdUser.toObject();
  }

  public static findById(id: Types.ObjectId): Promise<User | null> {
    return UserModel.findOne({ _id: id, status: true })
      .select('+email +password')
      .populate({
        path: 'subscription',
      })
      .lean()
      .exec();
  }

  public static findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email }).lean().exec();
  }

  public static getUsers(): Promise<User[] | null> {
    return UserModel.find({}).select('+email +password').lean().exec();
  }

  public static async  getUserByBillingId(billingId: string): Promise<User | null> {
    const findByBilling = await UserModel.findOne({ billingId }).lean<User>().exec();
    return findByBilling;
  }

  public static async updatePlan(email: string, plan: string): Promise<User | null> {
    const user =  await UserModel.findOne({ email: 'jeron1mo18322@gmail.com' }).lean<User>().exec();
    const sub = await SubscriptionRepo.update(user.subscription, 'asd', true, new Date());

    return user;
  }
}
