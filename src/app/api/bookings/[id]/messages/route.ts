import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = request.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const user = getUserFromToken(token);
  if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const db = getDb();
  const messages = db.prepare(`
    SELECT m.*, u.full_name as sender_name
    FROM event_messages m JOIN users u ON m.sender_id = u.id
    WHERE m.event_id = ?
    ORDER BY m.created_at ASC
  `).all(id);

  return NextResponse.json({ messages });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = await params;
  const token = request.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const user = getUserFromToken(token);
  if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const { message, message_type } = await request.json();
  if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 });

  const db = getDb();
  const msgId = uuidv4();

  db.prepare(`
    INSERT INTO event_messages (id, event_id, sender_id, sender_role, message, message_type)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(msgId, eventId, user.id, user.role, message, message_type || 'message');

  // If admin sends an info_request, update event status to 'info_requested'
  if (user.role === 'admin' && message_type === 'info_request') {
    db.prepare("UPDATE events SET status = 'pending', notes = 'Information requested from customer', updated_at = datetime('now') WHERE id = ?").run(eventId);
  }

  // If admin approves, update event status to 'confirmed'
  if (user.role === 'admin' && message_type === 'approval') {
    db.prepare("UPDATE events SET status = 'confirmed', updated_at = datetime('now') WHERE id = ?").run(eventId);
  }

  // If admin rejects, update event status to 'cancelled'
  if (user.role === 'admin' && message_type === 'rejection') {
    db.prepare("UPDATE events SET status = 'cancelled', updated_at = datetime('now') WHERE id = ?").run(eventId);
  }

  const newMsg = db.prepare(`
    SELECT m.*, u.full_name as sender_name
    FROM event_messages m JOIN users u ON m.sender_id = u.id
    WHERE m.id = ?
  `).get(msgId);

  return NextResponse.json({ message: newMsg }, { status: 201 });
}
