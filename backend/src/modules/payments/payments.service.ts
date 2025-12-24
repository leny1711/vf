import stripe from '../../config/stripe';
import prisma from '../../config/database';
import { config } from '../../config/env';

export class PaymentsService {
  async createPaymentIntent(missionId: string) {
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: {
        client: true,
      },
    });

    if (!mission) {
      throw new Error('Mission not found');
    }

    if (mission.status !== 'COMPLETED') {
      throw new Error('Mission must be completed before payment');
    }

    const existingPayment = await prisma.payment.findUnique({
      where: { missionId },
    });

    if (existingPayment) {
      throw new Error('Payment already exists for this mission');
    }

    const amount = mission.price * 100; // Convert to cents
    const platformFee = mission.price * config.platformCommissionRate;
    const providerAmount = mission.price - platformFee;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: 'eur',
      metadata: {
        missionId: mission.id,
        clientId: mission.clientId,
        providerId: mission.providerId || '',
      },
    });

    const payment = await prisma.payment.create({
      data: {
        missionId,
        amount: mission.price,
        platformFee,
        providerAmount,
        stripePaymentIntent: paymentIntent.id,
        status: 'PENDING',
      },
    });

    return {
      payment,
      clientSecret: paymentIntent.client_secret,
    };
  }

  async confirmPayment(paymentIntentId: string) {
    const payment = await prisma.payment.findFirst({
      where: { stripePaymentIntent: paymentIntentId },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'SUCCEEDED' },
      });
    } else if (paymentIntent.status === 'canceled') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      });
    }

    return payment;
  }

  async getPaymentByMission(missionId: string) {
    const payment = await prisma.payment.findUnique({
      where: { missionId },
      include: {
        mission: {
          include: {
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            provider: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    return payment;
  }

  async getProviderEarnings(providerId: string) {
    const payments = await prisma.payment.findMany({
      where: {
        mission: {
          providerId,
        },
        status: 'SUCCEEDED',
      },
      include: {
        mission: {
          select: {
            id: true,
            title: true,
            completedAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalEarnings = payments.reduce((sum, payment) => sum + payment.providerAmount, 0);

    return {
      payments,
      totalEarnings,
    };
  }
}
