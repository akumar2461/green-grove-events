import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-02-25.clover',
});

export async function POST(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const user = getUserFromToken(token);
  if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  try {
    const { event_id, payment_type } = await request.json();

    const db = getDb();
    const event = db.prepare('SELECT * FROM events WHERE id = ? AND user_id = ?').get(event_id, user.id) as Record<string, unknown> | undefined;
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

    const totalCost = ((event.total_venue_cost as number) || 0) + ((event.total_services_cost as number) || 0);

    // Calculate amount based on payment type
    let amount: number;
    if (payment_type === 'advance') {
      amount = Math.ceil(totalCost * 0.25); // 25% advance
    } else if (payment_type === 'balance') {
      const paidResult = db.prepare(
        "SELECT COALESCE(SUM(amount), 0) as paid FROM payments WHERE event_id = ? AND status = 'succeeded'"
      ).get(event_id) as { paid: number };
      amount = Math.ceil(totalCost - paidResult.paid);
    } else {
      amount = Math.ceil(totalCost);
    }

    if (amount <= 0) {
      return NextResponse.json({ error: 'No payment due' }, { status: 400 });
    }

    // Amount in paise (smallest currency unit for INR)
    const amountInPaise = amount * 100;

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPaise,
      currency: 'inr',
      metadata: {
        event_id: event_id,
        user_id: user.id,
        event_name: event.event_name as string,
        payment_type,
      },
      description: `Green Grove Events - ${event.event_name} (${payment_type})`,
    });

    // Save payment record
    const paymentId = uuidv4();
    db.prepare(`
      INSERT INTO payments (id, event_id, user_id, stripe_payment_intent_id, stripe_client_secret, amount, payment_type, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'processing')
    `).run(paymentId, event_id, user.id, paymentIntent.id, paymentIntent.client_secret, amount, payment_type);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentId,
      amount,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Payment creation failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
