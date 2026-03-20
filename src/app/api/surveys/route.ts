import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const user = getUserFromToken(token);
  if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const db = getDb();
  let surveys;
  if (user.role === 'admin') {
    surveys = db.prepare(`
      SELECT s.*, u.full_name, u.email, e.event_name, e.event_type
      FROM surveys s
      JOIN users u ON s.user_id = u.id
      JOIN events e ON s.event_id = e.id
      ORDER BY s.sent_at DESC
    `).all();
  } else {
    surveys = db.prepare('SELECT * FROM surveys WHERE user_id = ?').all(user.id);
  }

  return NextResponse.json({ surveys });
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const user = getUserFromToken(token);
  if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const body = await request.json();

  // If admin is sending a survey
  if (user.role === 'admin' && body.event_id && body.user_id) {
    const db = getDb();
    const id = uuidv4();
    db.prepare('INSERT INTO surveys (id, event_id, user_id) VALUES (?, ?, ?)').run(id, body.event_id, body.user_id);
    return NextResponse.json({ survey: { id } }, { status: 201 });
  }

  // If customer is submitting a survey response
  if (body.survey_id) {
    const db = getDb();
    db.prepare(`
      UPDATE surveys SET overall_rating = ?, venue_rating = ?, service_rating = ?, value_rating = ?,
      recommend = ?, feedback = ?, submitted_at = datetime('now'), status = 'completed'
      WHERE id = ? AND user_id = ?
    `).run(
      body.overall_rating, body.venue_rating, body.service_rating, body.value_rating,
      body.recommend ? 1 : 0, body.feedback || null, body.survey_id, user.id
    );
    return NextResponse.json({ message: 'Survey submitted' });
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}
