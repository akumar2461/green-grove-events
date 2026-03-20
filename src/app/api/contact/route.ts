import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
    }

    const db = getDb();
    const id = uuidv4();
    db.prepare('INSERT INTO contact_messages (id, name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?)').run(id, name, email, phone || null, subject || null, message);

    return NextResponse.json({ message: 'Message sent successfully' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { getUserFromToken } = require('@/lib/auth');
  const user = getUserFromToken(token);
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Admin access required' }, { status: 403 });

  const db = getDb();
  const messages = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
  return NextResponse.json({ messages });
}
