import { model, Schema, Document } from 'mongoose';

export const DOCUMENT_NAME = 'Subscription';
export const COLLECTION_NAME = 'subscription';

export interface Subscription {
  plan?: string;
  hasTrial?: boolean;
  endDate?: Date;
}

type SubscriptionType = Subscription & Document;

const subscriptionSchema = new Schema({
  plan: { type: String, enum: ['none', 'basic', 'pro'], default: 'none' },
  hasTrial: { type: Boolean, default: false },
  endDate: { type: Date, default: null }
})

export const SubscriptionModel = model<SubscriptionType>(
  DOCUMENT_NAME,
  subscriptionSchema,
  COLLECTION_NAME,
);