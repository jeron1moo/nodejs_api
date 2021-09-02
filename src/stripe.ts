import { stripiSecret, rootUrl, stripiKey } from './config';
import Stripe from 'stripe';
const stripe = new Stripe(stripiSecret, { apiVersion: '2020-08-27' });



export const publishableKey = async () => {
  return {
    publishableKey: stripiKey,
  };
};

export const createPayment = async () => {
  const payment = await stripe.paymentIntents.create({
    amount: 1000,
    currency: 'usd',
    payment_method_types: ['card'],
    receipt_email: 'jeron1mo18322@gmail.com',
  });
  return payment;
};

export const addNewCustomer = async (email: string) => {
  const customer = await stripe.customers.create({
    email,
  });
  return customer;
};

export const getCustomerById = async (id: string) => {
  const customer = await stripe.customers.retrieve(id);
  return customer;
};

export const createSession = async (customer: any, price: string) => {
  const session = await stripe.checkout.sessions.create({
    success_url: `${rootUrl}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${rootUrl}/stripe/failed`,
    payment_method_types: ['card'],
    line_items: [{ price, quantity: 1 }],
    customer,
    mode: 'subscription',
  });
  return session;
};

export const retriveSession = async (session: any) => {
  const retrivedSession = await stripe.checkout.sessions.retrieve(session, {
    expand: ['payment_intent', 'payment_intent.payment_method'],
  });

  return retrivedSession;
};

export const createSubscription = async (customerId: string) => {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [],
    expand: ['latest_invoice.payment_intent', 'pending_setup_intent'],
  });
  return subscription;
};

export const forceCancelSubscription = async (subscriptionId: string) => {
  const subscription = await stripe.subscriptions.del(subscriptionId);
  return subscription;
};

export const cancelSubscription = async (subscriptionId: string) => {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
  return subscription;
};

export default {
  publishableKey,
  createPayment,
  addNewCustomer,
  getCustomerById,
  createSession,
  retriveSession,
  createSubscription,
  forceCancelSubscription,
  cancelSubscription,
};
