import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const user = getUserFromToken(token);
  if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const db = getDb();
  const url = new URL(request.url);
  const eventId = url.searchParams.get('event_id');

  let payments;
  if (user.role === 'admin') {
    if (eventId) {
      payments = db.prepare('SELECT p.*, u.full_name FROM payments p JOIN users u ON p.user_id = u.id WHERE p.event_id = ? ORDER BY p.created_at DESC').all(eventId);
    } else {
      payments = db.prepare('SELECT p.*, u.full_name, e.event_name FROM payments p JOIN users u ON p.user_id = u.id JOIN events e ON p.event_id = e.id ORDER BY p.created_at DESC').all();
    }
  } else {
    if (eventId) {
      payments = db.prepare('SELECT * FROM payments WHERE user_id = ? AND event_id = ? ORDER BY created_at DESC').all(user.id, eventId);
    } else {
      payments = db.prepare('SELECT p.*, e.event_name FROM payments p JOIN events e ON p.event_id = e.id WHERE p.user_id = ? ORDER BY p.created_at DESC').all(user.id);
    }
  }

  return NextResponse.json({ payments });
}
