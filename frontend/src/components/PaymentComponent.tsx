import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { paymentsAPI } from '../services/api';
import '../styles/Payment.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface CheckoutFormProps {
  missionId: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ missionId, amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create PaymentIntent
    const createPaymentIntent = async () => {
      try {
        const response = await paymentsAPI.createIntent({ missionId, amount });
        setClientSecret(response.data.clientSecret);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to initialize payment');
      }
    };

    createPaymentIntent();
  }, [missionId, amount]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setProcessing(true);
    setError('');

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Card element not found');
      setProcessing(false);
      return;
    }

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        setProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Confirm payment in backend
        await paymentsAPI.confirm({
          paymentIntentId: paymentIntent.id,
          missionId,
        });

        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment failed');
      setProcessing(false);
    }
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  return (
    <div className="payment-container">
      <h3>Complete Payment</h3>
      <p className="payment-amount">Amount: ${amount.toFixed(2)}</p>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card-element-container">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>

        <div className="payment-actions">
          <button
            type="submit"
            disabled={!stripe || processing || !clientSecret}
            className="btn-primary"
          >
            {processing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={processing}
          >
            Cancel
          </button>
        </div>
      </form>

      <p className="payment-note">
        💳 Test card: 4242 4242 4242 4242, any future date, any CVC
      </p>
    </div>
  );
};

interface PaymentComponentProps {
  missionId: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentComponent: React.FC<PaymentComponentProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
};

export default PaymentComponent;
