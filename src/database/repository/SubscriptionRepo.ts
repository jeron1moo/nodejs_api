import { Subscription, SubscriptionModel } from '../model/Subscription';
import { Types } from 'mongoose';

export default class SubscriptionRepo {

  public static async create(): Promise<Subscription> {
    const props: Subscription = {
      hasTrial: false,
    }
    const subscription = await SubscriptionModel.create(props);
    return subscription.toObject();
  }

   public static async update(subscription: Subscription | undefined, plan: string, hasTrial: boolean, endDate: Date): Promise<Subscription | null> {
    const updatedSubscription = await SubscriptionModel.findOneAndUpdate(subscription, {
      $set: {
        plan,
        hasTrial,
        endDate
      },
      new: true,
    })
    return updatedSubscription;
  }
}
