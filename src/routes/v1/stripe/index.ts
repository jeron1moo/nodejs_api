import express from 'express';
import { stripeWebhookSecret } from '../../../config';
import Logger from '../../../core/Logger';
import * as stripe from '../../../stripe';
import { swGetStripeApi } from './get-stripe-info';

export const swStripeRouter = {
  '/api/stripe': {
    get: {
      ...swGetStripeApi,
    },
    post: {
      ...swGetStripeApi,
    },
  },
};

const router = express.Router();

const productToPriceMap = {
  BASIC_MONTH: 'price_1JVDGhCQ5wbCcXj8jG12nQH0',
  BASIC: 'price_1JVDGhCQ5wbCcXj8lCAhA5jI',
  PRO_MONTH: 'price_1JVDHJCQ5wbCcXj8sqSvmKun',
  PRO: 'price_1JVDHJCQ5wbCcXj82VAYIqS8',
};

router.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

router.get('/config', async (req, res) => {
  const key = await stripe.publishableKey();
  res.send(key);
});

router.get('/', async (req, res) => {
  const paymentIntent = stripe.createPayment();
  return res.send(paymentIntent);
});

router.post('/createCustomer', async (req, res) => {
  const customer = await stripe.addNewCustomer(req.body.email);
  res.send(customer);
});

router.get('/retriveSession', async (req, res) => {
  const session = stripe.retriveSession(req.session);
  return res.send(session);
});

router.get('/createSubscription', async (req, res) => {
  const subscription = stripe.createSubscription(req.body.customerId);
  return res.send(subscription);
});

router.get('/cancelSubscription', async (req, res) => {
  const session = stripe.cancelSubscription('');
  return res.send(session);
});

router.get('/forceCancelSubscription', async (req, res) => {
  const subscription = stripe.forceCancelSubscription(req.body.subscriptionId);
  return res.send(subscription);
});

router.get('/checkout', async (req, res) => {
  // @ts-ignore
  const { customer } = req.session;
  const session = await stripe.createSession(
    customer,
    productToPriceMap.BASIC_MONTH,
  );

  res.send({ sessionId: session.id });
});

router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    let event;

    try {
      // @ts-ignore
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers['stripe-signature'],
        stripeWebhookSecret,
      );
    } catch (err) {
      Logger.info(err);
      Logger.info(`⚠️  Webhook signature verification failed.`);
      Logger.info(
        `⚠️  Check the env file and enter the correct webhook secret.`,
      );
      return res.sendStatus(400);
    }

    const data = event.data.object;

    // Handle the event
    // Review important events for Billing webhooks
    // https://stripe.com/docs/billing/webhooks
    // Remove comment to see the various objects sent for this sample
    switch (event.type) {
      case 'payment_intent.succeeded':
        Logger.info(`PaymentIntent for ${data.amount} was successful!`);
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case 'payment_intent.incomplete':
        Logger.info(`PaymentIntent for ${data.amount} was incomplete!`);
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case 'customer.subscription.created': {
        // const user = await UserRepo.getUserByBillingID(data.customer);

        // if (data.plan.id === productToPriceMap.BASIC_MONTH) {
        //   user.plan = 'basic';
        // }

        // if (data.plan.id === productToPriceMap.PRO_MONTH) {
        //   user.plan = 'pro';
        // }

        // user.hasTrial = true;
        // user.endDate = new Date(data.current_period_end * 1000);
        // await user.save();

        break;
      }
      case 'invoice.paid':
        // Used to provision services after the trial has ended.
        // The status of the invoice will show up as paid. Store the status in your
        // database to reference when a user accesses your service to avoid hitting rate limits.
        break;
      case 'invoice.payment_failed':
        // If the payment fails or the customer does not have a valid payment method,
        //  an invoice.payment_failed event is sent, the subscription becomes past_due.
        // Use this webhook to notify your user that their payment has
        // failed and to retrieve new card details.
        break;
      case 'invoice.finalized':
        // If you want to manually send out invoices to your customers
        // or store them locally to reference to avoid hitting Stripe rate limits.
        break;
      case 'customer.subscription.deleted':
        if (event.request != null) {
          // handle a subscription cancelled by your request
          // from above.
        } else {
          // handle subscription cancelled automatically based
          // upon your subscription settings.
        }
        break;
      case 'customer.subscription.trial_will_end':
        // Send notification to your user that the trial will end
        break;
      default:
      // Unexpected event type
    }
    res.sendStatus(200);
  },
);

export default router;
