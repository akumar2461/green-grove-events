import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = request.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const user = getUserFromToken(token);
  if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const db = getDb();
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

  const services = db.prepare('SELECT * FROM event_services WHERE event_id = ?').all(id);

  return NextResponse.json({ event, services });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = request.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const user = getUserFromToken(token);
  if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const body = await request.json();
  const db = getDb();

  const updates: string[] = [];
  const values: unknown[] = [];

  for (const [key, value] of Object.entries(body)) {
    if (['status', 'notes', 'special_requests'].includes(key)) {
      updates.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (updates.length > 0) {
    updates.push("updated_at = datetime('now')");
    values.push(id);
    db.prepare(`UPDATE events SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  }

  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
  return NextResponse.json({ event });
}
