import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const user = getUserFromToken(token);
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Admin access required' }, { status: 403 });

  const db = getDb();
  const users = db.prepare(`
    SELECT id, email, full_name, phone, country, city, role, marketing_opt_in, created_at,
    (SELECT COUNT(*) FROM events WHERE user_id = users.id) as booking_count,
    (SELECT SUM(COALESCE(total_venue_cost,0) + COALESCE(total_services_cost,0)) FROM events WHERE user_id = users.id AND status != 'cancelled') as total_spent
    FROM users WHERE role = 'customer' ORDER BY created_at DESC
  `).all();

  return NextResponse.json({ users });
}
