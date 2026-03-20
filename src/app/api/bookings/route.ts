import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { calculateVenueCost } from '@/lib/pricing';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const user = getUserFromToken(token);
  if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const db = getDb();

  let events;
  if (user.role === 'admin') {
    events = db.prepare(`
      SELECT e.*, u.full_name as customer_name, u.email as customer_email, u.phone as customer_phone, u.country as customer_country
      FROM events e JOIN users u ON e.user_id = u.id
      ORDER BY e.event_date DESC
    `).all();
  } else {
    events = db.prepare('SELECT * FROM events WHERE user_id = ? ORDER BY event_date DESC').all(user.id);
  }

  return NextResponse.json({ events });
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const user = getUserFromToken(token);
  if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  try {
    const body = await request.json();
    const { event_type, event_name, event_date, end_date, duration_type, duration_value, guest_count, special_requests, services } = body;

    if (!event_type || !event_name || !event_date || !duration_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = getDb();
    const eventId = uuidv4();
    const venueCost = calculateVenueCost(duration_type, duration_value || 1);

    db.prepare(`
      INSERT INTO events (id, user_id, event_type, event_name, event_date, end_date, duration_type, duration_value, guest_count, special_requests, total_venue_cost, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(eventId, user.id, event_type, event_name, event_date, end_date || null, duration_type, duration_value || 1, guest_count || null, special_requests || null, venueCost);

    let totalServicesCost = 0;
    if (services && Array.isArray(services)) {
      for (const svc of services) {
        const svcId = uuidv4();
        const cost = svc.price * (svc.quantity || 1);
        totalServicesCost += cost;
        db.prepare(`
          INSERT INTO event_services (id, event_id, service_type, service_name, description, price, quantity)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(svcId, eventId, svc.type, svc.name, svc.description || null, svc.price, svc.quantity || 1);
      }
    }

    db.prepare('UPDATE events SET total_services_cost = ? WHERE id = ?').run(totalServicesCost, eventId);

    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(eventId);
    return NextResponse.json({ event }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Booking failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
