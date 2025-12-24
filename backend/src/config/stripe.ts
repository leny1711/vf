import Stripe from 'stripe';
import { config } from './env';

const stripe = new Stripe(config.stripeSecretKey, {
  apiVersion: '2023-10-16',
});

export default stripe;
