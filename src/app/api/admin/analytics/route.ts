import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const user = getUserFromToken(token);
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Admin access required' }, { status: 403 });

  const db = getDb();

  // Total bookings and revenue
  const totals = db.prepare(`
    SELECT
      COUNT(*) as total_bookings,
      SUM(total_venue_cost) as total_venue_revenue,
      SUM(total_services_cost) as total_services_revenue,
      SUM(COALESCE(total_venue_cost, 0) + COALESCE(total_services_cost, 0)) as total_revenue,
      AVG(guest_count) as avg_guests
    FROM events WHERE status != 'cancelled'
  `).get();

  // Bookings by event type
  const byEventType = db.prepare(`
    SELECT event_type, COUNT(*) as count,
    SUM(COALESCE(total_venue_cost, 0) + COALESCE(total_services_cost, 0)) as revenue
    FROM events WHERE status != 'cancelled'
    GROUP BY event_type ORDER BY count DESC
  `).all();

  // Bookings by status
  const byStatus = db.prepare('SELECT status, COUNT(*) as count FROM events GROUP BY status').all();

  // Monthly bookings trend
  const monthlyTrend = db.prepare(`
    SELECT strftime('%Y-%m', event_date) as month, COUNT(*) as count,
    SUM(COALESCE(total_venue_cost, 0) + COALESCE(total_services_cost, 0)) as revenue
    FROM events WHERE status != 'cancelled'
    GROUP BY month ORDER BY month DESC LIMIT 12
  `).all();

  // Customer demographics
  const byCountry = db.prepare(`
    SELECT u.country, COUNT(DISTINCT u.id) as customers, COUNT(e.id) as bookings
    FROM users u LEFT JOIN events e ON u.id = e.user_id
    WHERE u.role = 'customer'
    GROUP BY u.country ORDER BY customers DESC
  `).all();

  // Popular services
  const popularServices = db.prepare(`
    SELECT service_name, COUNT(*) as count, SUM(price * quantity) as total_revenue
    FROM event_services GROUP BY service_name ORDER BY count DESC
  `).all();

  // Survey satisfaction
  const satisfaction = db.prepare(`
    SELECT
      AVG(overall_rating) as avg_overall,
      AVG(venue_rating) as avg_venue,
      AVG(service_rating) as avg_service,
      AVG(value_rating) as avg_value,
      COUNT(*) as total_responses,
      SUM(CASE WHEN recommend = 1 THEN 1 ELSE 0 END) as would_recommend
    FROM surveys WHERE status = 'completed'
  `).get();

  // Total customers
  const customerCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'customer'").get();

  // Upcoming events
  const upcoming = db.prepare(`
    SELECT e.*, u.full_name as customer_name
    FROM events e JOIN users u ON e.user_id = u.id
    WHERE e.event_date >= date('now') AND e.status IN ('confirmed', 'pending')
    ORDER BY e.event_date ASC LIMIT 10
  `).all();

  // AI-generated insights
  const insights = generateInsights({
    totals, byEventType, byCountry, popularServices, satisfaction, monthlyTrend
  });

  return NextResponse.json({
    totals,
    byEventType,
    byStatus,
    monthlyTrend,
    byCountry,
    popularServices,
    satisfaction,
    customerCount,
    upcoming,
    insights,
  });
}

function generateInsights(data: Record<string, unknown>): string[] {
  const insights: string[] = [];
  const totals = data.totals as Record<string, number>;
  const byEventType = data.byEventType as Array<Record<string, unknown>>;
  const byCountry = data.byCountry as Array<Record<string, unknown>>;
  const popularServices = data.popularServices as Array<Record<string, unknown>>;
  const satisfaction = data.satisfaction as Record<string, number>;

  if (totals?.total_bookings > 0) {
    insights.push(`Total of ${totals.total_bookings} bookings generating ₹${(totals.total_revenue || 0).toLocaleString('en-IN')} in revenue.`);
  }

  if (byEventType?.length > 0) {
    insights.push(`${byEventType[0].event_type} events are the most popular category with ${byEventType[0].count} bookings.`);
  }

  if (byCountry?.length > 0) {
    const topCountries = byCountry.filter(c => c.country).slice(0, 3).map(c => c.country);
    if (topCountries.length > 0) {
      insights.push(`Top customer regions: ${topCountries.join(', ')}. Consider targeted marketing in these areas.`);
    }
  }

  if (popularServices?.length > 0) {
    insights.push(`${popularServices[0].service_name} is the most requested add-on service. Consider bundle pricing.`);
  }

  if (satisfaction?.avg_overall) {
    const score = Number(satisfaction.avg_overall).toFixed(1);
    insights.push(`Customer satisfaction score: ${score}/5. ${Number(score) >= 4 ? 'Excellent!' : 'Room for improvement.'}`);
    if (satisfaction.total_responses > 0 && satisfaction.would_recommend) {
      const nps = Math.round((satisfaction.would_recommend / satisfaction.total_responses) * 100);
      insights.push(`${nps}% of surveyed customers would recommend Green Grove to others.`);
    }
  }

  if (totals?.avg_guests) {
    insights.push(`Average event size: ${Math.round(totals.avg_guests)} guests. Plan staffing and catering accordingly.`);
  }

  if (insights.length === 0) {
    insights.push('No bookings yet. Start promoting the venue to build your customer base!');
    insights.push('Target NRI communities in the Middle East, Europe, US, and Australia for maximum reach.');
    insights.push('Consider partnering with wedding planners and corporate event coordinators.');
  }

  return insights;
}
