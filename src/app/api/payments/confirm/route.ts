import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const user = getUserFromToken(token);
  if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  try {
    const { payment_id, status } = await request.json();

    const db = getDb();
    db.prepare(`
      UPDATE payments SET status = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?
    `).run(status, payment_id, user.id);

    // If payment succeeded, update event payment status
    if (status === 'succeeded') {
      const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(payment_id) as Record<string, unknown>;
      if (payment) {
        const eventId = payment.event_id as string;
        // Check total paid
        const paidResult = db.prepare(
          "SELECT COALESCE(SUM(amount), 0) as paid FROM payments WHERE event_id = ? AND status = 'succeeded'"
        ).get(eventId) as { paid: number };

        const event = db.prepare('SELECT * FROM events WHERE id = ?').get(eventId) as Record<string, unknown>;
        const totalCost = ((event.total_venue_cost as number) || 0) + ((event.total_services_cost as number) || 0);

        // Update notes with payment info
        const paidAmount = paidResult.paid;
        const remaining = totalCost - paidAmount;
        const noteText = `Payment of ₹${(payment.amount as number).toLocaleString('en-IN')} received. Total paid: ₹${paidAmount.toLocaleString('en-IN')}. ${remaining > 0 ? `Balance: ₹${remaining.toLocaleString('en-IN')}` : 'Fully paid.'}`;

        db.prepare("UPDATE events SET notes = ?, updated_at = datetime('now') WHERE id = ?").run(noteText, eventId);
      }
    }

    return NextResponse.json({ message: 'Payment status updated' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Payment confirmation failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
