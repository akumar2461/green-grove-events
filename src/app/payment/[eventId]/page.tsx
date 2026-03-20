'use client';

import { useState, useEffect, use } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

interface EventData {
  id: string;
  event_name: string;
  event_type: string;
  event_date: string;
  status: string;
  total_venue_cost: number;
  total_services_cost: number;
}

interface PaymentRecord {
  id: string;
  amount: number;
  status: string;
  payment_type: string;
  created_at: string;
}

function CheckoutForm({ event, onSuccess }: { event: EventData; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentType, setPaymentType] = useState<'advance' | 'full'>('advance');
  const [succeeded, setSucceeded] = useState(false);

  const totalCost = (event.total_venue_cost || 0) + (event.total_services_cost || 0);
  const advanceAmount = Math.ceil(totalCost * 0.25);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: event.id, payment_type: paymentType }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: cardElement },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent?.status === 'succeeded') {
        await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payment_id: data.paymentId, status: 'succeeded' }),
        });
        setSucceeded(true);
        onSuccess();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    }

    setLoading(false);
  };

  if (succeeded) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center" style={{ border: '1px solid #D2D2D7', borderLeft: '4px solid #7C3AED' }}>
        <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-[#1D1D1F] mb-2">Payment Successful!</h3>
        <p className="text-[#86868B]">Your payment has been processed. You will receive a confirmation email shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Type Selection */}
      <div>
        <label className="block text-sm font-medium text-[#1D1D1F] mb-3">Payment Option</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button type="button" onClick={() => setPaymentType('advance')}
            className={`p-4 rounded-2xl text-left transition ${paymentType === 'advance' ? 'bg-violet-50 border-2 border-violet-500' : 'bg-white hover:bg-[#F5F5F7]'}`}
            style={paymentType === 'advance' ? undefined : { border: '1px solid #D2D2D7' }}>
            <p className="font-semibold text-[#1D1D1F]">25% Advance</p>
            <p className="text-2xl font-bold text-violet-600 mt-1">&#8377;{advanceAmount.toLocaleString('en-IN')}</p>
            <p className="text-[#86868B] text-xs mt-1">Pay the balance before the event</p>
          </button>
          <button type="button" onClick={() => setPaymentType('full')}
            className={`p-4 rounded-2xl text-left transition ${paymentType === 'full' ? 'bg-violet-50 border-2 border-violet-500' : 'bg-white hover:bg-[#F5F5F7]'}`}
            style={paymentType === 'full' ? undefined : { border: '1px solid #D2D2D7' }}>
            <p className="font-semibold text-[#1D1D1F]">Full Payment</p>
            <p className="text-2xl font-bold text-violet-600 mt-1">&#8377;{totalCost.toLocaleString('en-IN')}</p>
            <p className="text-[#86868B] text-xs mt-1">Pay everything upfront</p>
          </button>
        </div>
      </div>

      {/* Card Input */}
      <div>
        <label className="block text-sm font-medium text-[#1D1D1F] mb-2">Card Details</label>
        <div className="rounded-xl p-4 bg-white" style={{ border: '1px solid #D2D2D7' }}>
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#1D1D1F',
                '::placeholder': { color: '#86868B' },
              },
            },
          }} />
        </div>
      </div>

      {error && (
        <div className="bg-white text-red-700 text-sm rounded-xl p-3" style={{ border: '1px solid #D2D2D7', borderLeft: '4px solid #dc2626' }}>{error}</div>
      )}

      <div className="rounded-2xl p-4" style={{ backgroundColor: '#F5F5F7', border: '1px solid #D2D2D7' }}>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[#86868B]">Venue Cost</span>
          <span className="text-[#1D1D1F]">&#8377;{(event.total_venue_cost || 0).toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[#86868B]">Services Cost</span>
          <span className="text-[#1D1D1F]">&#8377;{(event.total_services_cost || 0).toLocaleString('en-IN')}</span>
        </div>
        <div className="pt-2 mt-2 flex justify-between font-semibold" style={{ borderTop: '1px solid #D2D2D7' }}>
          <span className="text-[#1D1D1F]">Amount to Pay</span>
          <span className="text-violet-600">&#8377;{(paymentType === 'advance' ? advanceAmount : totalCost).toLocaleString('en-IN')}</span>
        </div>
      </div>

      <button type="submit" disabled={!stripe || loading}
        className="w-full bg-violet-600 text-white py-3 rounded-full font-semibold hover:bg-violet-700 transition disabled:opacity-50">
        {loading ? 'Processing Payment...' : `Pay \u20B9${(paymentType === 'advance' ? advanceAmount : totalCost).toLocaleString('en-IN')}`}
      </button>

      <p className="text-xs text-[#86868B] text-center">
        Payments are securely processed by Stripe. Your card details are never stored on our servers.
      </p>
    </form>
  );
}

export default function PaymentPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [event, setEvent] = useState<EventData | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    Promise.all([
      fetch(`/api/bookings/${eventId}`).then(r => r.json()),
      fetch(`/api/payments?event_id=${eventId}`).then(r => r.json()),
    ]).then(([evData, payData]) => {
      setEvent(evData.event || null);
      setPayments(payData.payments || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (!user) return;
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, router, eventId]);

  if (authLoading || loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-[#86868B]">Loading...</p></div>;
  }

  if (!event) {
    return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-[#86868B]">Event not found.</p></div>;
  }

  const totalCost = (event.total_venue_cost || 0) + (event.total_services_cost || 0);
  const totalPaid = payments.filter(p => p.status === 'succeeded').reduce((s, p) => s + p.amount, 0);
  const balance = totalCost - totalPaid;

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#F5F5F7' }}>
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        <button onClick={() => router.push('/dashboard')} className="text-violet-600 text-sm font-medium mb-4 hover:underline">&larr; Back to Dashboard</button>

        <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F] mb-2">Payment</h1>
        <p className="text-[#86868B] mb-8">for {event.event_name}</p>

        {/* Event Summary */}
        <div className="bg-white rounded-2xl p-6 mb-6" style={{ border: '1px solid #D2D2D7' }}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-[#1D1D1F]">{event.event_name}</h3>
              <p className="text-[#86868B] text-sm">{event.event_type} &middot; {new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-[#1D1D1F]">&#8377;{totalCost.toLocaleString('en-IN')}</p>
              <p className="text-violet-600 text-sm">Paid: &#8377;{totalPaid.toLocaleString('en-IN')}</p>
              {balance > 0 && <p className="text-amber-600 text-sm">Balance: &#8377;{balance.toLocaleString('en-IN')}</p>}
            </div>
          </div>
        </div>

        {/* Payment History */}
        {payments.length > 0 && (
          <div className="bg-white rounded-2xl p-6 mb-6" style={{ border: '1px solid #D2D2D7' }}>
            <h3 className="font-semibold text-[#1D1D1F] mb-3">Payment History</h3>
            <div className="space-y-2">
              {payments.map(p => (
                <div key={p.id} className="flex justify-between items-center text-sm p-3 rounded-xl" style={{ backgroundColor: '#F5F5F7', border: '1px solid #D2D2D7' }}>
                  <div>
                    <span className="capitalize font-medium text-[#1D1D1F]">{p.payment_type}</span>
                    <span className="text-[#86868B] ml-2">{new Date(p.created_at).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#1D1D1F]">&#8377;{p.amount.toLocaleString('en-IN')}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${p.status === 'succeeded' ? 'bg-green-100 text-green-700' : p.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Form */}
        {balance > 0 && event.status === 'confirmed' ? (
          <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #D2D2D7' }}>
            <h3 className="font-semibold text-[#1D1D1F] mb-4">Make a Payment</h3>
            <Elements stripe={stripePromise}>
              <CheckoutForm event={event} onSuccess={loadData} />
            </Elements>
          </div>
        ) : balance <= 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center" style={{ border: '1px solid #D2D2D7', borderLeft: '4px solid #7C3AED' }}>
            <p className="text-[#1D1D1F] font-medium">This booking is fully paid. Thank you!</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 text-center" style={{ border: '1px solid #D2D2D7', borderLeft: '4px solid #d97706' }}>
            <p className="text-[#1D1D1F] font-medium">Payment will be available once the booking is confirmed by admin.</p>
            <p className="text-[#86868B] text-sm mt-1">Current status: {event.status}</p>
          </div>
        )}
      </div>
    </div>
  );
}
