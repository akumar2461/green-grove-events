'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Analytics {
  totals: { total_bookings: number; total_venue_revenue: number; total_services_revenue: number; total_revenue: number; avg_guests: number };
  byEventType: Array<{ event_type: string; count: number; revenue: number }>;
  byStatus: Array<{ status: string; count: number }>;
  monthlyTrend: Array<{ month: string; count: number; revenue: number }>;
  byCountry: Array<{ country: string; customers: number; bookings: number }>;
  popularServices: Array<{ service_name: string; count: number; total_revenue: number }>;
  satisfaction: { avg_overall: number; avg_venue: number; avg_service: number; avg_value: number; total_responses: number; would_recommend: number };
  customerCount: { count: number };
  upcoming: Array<{ id: string; event_name: string; event_type: string; event_date: string; customer_name: string; status: string; guest_count: number }>;
  insights: string[];
}

interface EventRow {
  id: string; event_name: string; event_type: string; event_date: string; end_date: string;
  status: string; guest_count: number; customer_name: string; customer_email: string;
  customer_phone: string; customer_country: string; total_venue_cost: number;
  total_services_cost: number; special_requests: string; notes: string; user_id: string;
}

interface UserRow {
  id: string; email: string; full_name: string; phone: string; country: string; city: string;
  marketing_opt_in: number; created_at: string; booking_count: number; total_spent: number;
}

interface ContactMsg {
  id: string; name: string; email: string; phone: string; subject: string; message: string;
  status: string; created_at: string;
}

interface SurveyRow {
  id: string; full_name: string; email: string; event_name: string; event_type: string;
  overall_rating: number; venue_rating: number; service_rating: number; value_rating: number;
  recommend: number; feedback: string; status: string; sent_at: string; submitted_at: string;
}

interface EventMessage {
  id: string; sender_name: string; sender_role: string; message: string;
  message_type: string; created_at: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-emerald-100 text-emerald-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

type Tab = 'dashboard' | 'calendar' | 'events' | 'customers' | 'messages' | 'surveys' | 'analytics';

// Calendar Component
function EventCalendar({ events }: { events: EventRow[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const monthName = currentDate.toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  const eventsByDate = useMemo(() => {
    const map: Record<string, EventRow[]> = {};
    events.forEach(ev => {
      const d = ev.event_date?.split('T')[0];
      if (d) {
        if (!map[d]) map[d] = [];
        map[d].push(ev);
      }
    });
    return map;
  }, [events]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const [today] = useState(() => new Date().toISOString().split('T')[0]);

  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E8E2D9' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth} className="p-2 hover:bg-black/[0.04] rounded-xl transition">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
        </button>
        <h3 className="text-lg font-semibold text-gray-900">{monthName}</h3>
        <button onClick={nextMonth} className="p-2 hover:bg-black/[0.04] rounded-xl transition">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-xs font-medium text-gray-500 py-2">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} className="h-24"></div>;

          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayEvents = eventsByDate[dateStr] || [];
          const isToday = dateStr === today;

          return (
            <div key={dateStr} className={`h-24 rounded-xl p-1 overflow-hidden ${isToday ? 'bg-emerald-50' : 'hover:bg-black/[0.02]'}`}
              style={{ border: isToday ? '2px solid #059669' : '1px solid #F3F0EB' }}>
              <p className={`text-xs font-medium mb-0.5 ${isToday ? 'text-emerald-700' : 'text-gray-700'}`}>{day}</p>
              {dayEvents.slice(0, 2).map(ev => (
                <div key={ev.id} className={`text-[10px] px-1 py-0.5 rounded mb-0.5 truncate ${ev.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : ev.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700'}`}>
                  {ev.event_name}
                </div>
              ))}
              {dayEvents.length > 2 && (
                <p className="text-[10px] text-gray-500">+{dayEvents.length - 2} more</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 pt-4" style={{ borderTop: '1px solid #E8E2D9' }}>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-emerald-100 rounded" style={{ border: '1px solid #A7F3D0' }}></div><span className="text-xs text-gray-500">Confirmed</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-yellow-100 rounded" style={{ border: '1px solid #FDE68A' }}></div><span className="text-xs text-gray-500">Pending</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-gray-100 rounded" style={{ border: '1px solid #E5E7EB' }}></div><span className="text-xs text-gray-500">Other</span></div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMsg[]>([]);
  const [surveys, setSurveys] = useState<SurveyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [today] = useState(() => new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }));

  // Event detail panel
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [eventMessages, setEventMessages] = useState<EventMessage[]>([]);
  const [adminMessage, setAdminMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) { router.push('/login'); return; }
    if (!user) return;
    loadData();
  }, [user, authLoading, router]);

  const loadData = async () => {
    setLoading(true);
    const [analyticsData, eventsData, usersData, messagesData, surveysData] = await Promise.all([
      fetch('/api/admin/analytics').then(r => r.json()),
      fetch('/api/bookings').then(r => r.json()),
      fetch('/api/admin/users').then(r => r.json()),
      fetch('/api/contact').then(r => r.json()),
      fetch('/api/surveys').then(r => r.json()),
    ]);
    setAnalytics(analyticsData);
    setEvents(eventsData.events || []);
    setUsers(usersData.users || []);
    setContactMessages(messagesData.messages || []);
    setSurveys(surveysData.surveys || []);
    setLoading(false);
  };

  const loadEventMessages = async (eventId: string) => {
    const res = await fetch(`/api/bookings/${eventId}/messages`);
    const data = await res.json();
    setEventMessages(data.messages || []);
    setSelectedEvent(eventId);
    setAdminMessage('');
  };

  const sendAdminAction = async (eventId: string, messageType: 'message' | 'info_request' | 'approval' | 'rejection', message: string) => {
    if (!message.trim()) return;
    setActionLoading(true);
    await fetch(`/api/bookings/${eventId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, message_type: messageType }),
    });
    setAdminMessage('');
    await loadEventMessages(eventId);
    await loadData();
    setActionLoading(false);
  };

  const sendSurvey = async (eventId: string, userId: string) => {
    await fetch('/api/surveys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_id: eventId, user_id: userId }),
    });
    loadData();
  };

  if (authLoading || loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><div className="text-gray-500">Loading admin panel...</div></div>;
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'events', label: 'Events' },
    { id: 'customers', label: 'Customers' },
    { id: 'messages', label: 'Messages' },
    { id: 'surveys', label: 'Surveys' },
    { id: 'analytics', label: 'AI Analytics' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F7F3' }}>
      {/* Admin Header */}
      <div className="bg-white" style={{ borderBottom: '1px solid #E8E2D9' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin Panel</h1>
            <p className="text-gray-500 text-sm">Green Grove Events Management</p>
          </div>
          <button onClick={loadData} className="bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-emerald-700 transition">Refresh Data</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white sticky top-16 z-40" style={{ borderBottom: '1px solid #E8E2D9' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSelectedEvent(null); }}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${tab === t.id ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t.label}
              {t.id === 'messages' && contactMessages.filter(m => m.status === 'new').length > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{contactMessages.filter(m => m.status === 'new').length}</span>
              )}
              {t.id === 'events' && events.filter(e => e.status === 'pending').length > 0 && (
                <span className="ml-1.5 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">{events.filter(e => e.status === 'pending').length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
        {/* Dashboard */}
        {tab === 'dashboard' && analytics && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #E8E2D9' }}><p className="text-3xl font-bold text-gray-900">{analytics.totals?.total_bookings || 0}</p><p className="text-gray-500 text-sm">Total Bookings</p></div>
              <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #E8E2D9' }}><p className="text-3xl font-bold text-emerald-600">&#8377;{(analytics.totals?.total_revenue || 0).toLocaleString('en-IN')}</p><p className="text-gray-500 text-sm">Total Revenue</p></div>
              <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #E8E2D9' }}><p className="text-3xl font-bold text-blue-600">{analytics.customerCount?.count || 0}</p><p className="text-gray-500 text-sm">Customers</p></div>
              <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #E8E2D9' }}><p className="text-3xl font-bold text-amber-600">{analytics.satisfaction?.avg_overall ? Number(analytics.satisfaction.avg_overall).toFixed(1) : 'N/A'}</p><p className="text-gray-500 text-sm">Avg Rating</p></div>
            </div>

            {/* Pending approvals alert */}
            {events.filter(e => e.status === 'pending').length > 0 && (
              <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #E8E2D9', borderLeft: '4px solid #d97706' }}>
                <h3 className="font-semibold text-gray-900 mb-2">Pending Approval ({events.filter(e => e.status === 'pending').length})</h3>
                <p className="text-gray-500 text-sm mb-3">These bookings need your review.</p>
                <button onClick={() => setTab('events')} className="bg-amber-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-amber-700 transition">Review Events</button>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E8E2D9' }}>
              <h3 className="font-semibold text-gray-900 mb-4">Upcoming Events</h3>
              {analytics.upcoming?.length > 0 ? (
                <div className="space-y-3">
                  {analytics.upcoming.map(e => (
                    <div key={e.id} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: '#F9F7F3', border: '1px solid #E8E2D9' }}>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{e.event_name}</p>
                        <p className="text-gray-500 text-xs">{e.customer_name} &middot; {e.event_type} &middot; {e.guest_count} guests</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{new Date(e.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[e.status]}`}>{e.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (<p className="text-gray-500 text-sm">No upcoming events.</p>)}
            </div>

            <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E8E2D9', borderLeft: '4px solid #059669' }}>
              <h3 className="font-semibold text-gray-900 mb-4">AI Insights & Recommendations</h3>
              <div className="space-y-3">
                {analytics.insights?.map((insight, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-white text-xs font-bold">{i + 1}</span></div>
                    <p className="text-gray-700 text-sm">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Calendar Tab */}
        {tab === 'calendar' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Event Calendar</h2>
            <EventCalendar events={events} />
          </div>
        )}

        {/* Events Tab with approval workflow */}
        {tab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Events List */}
            <div className={`${selectedEvent ? 'lg:col-span-1' : 'lg:col-span-3'} space-y-3`}>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">All Events</h2>
              {events.length === 0 ? (
                <p className="text-gray-500 bg-white rounded-2xl p-8 text-center" style={{ border: '1px solid #E8E2D9' }}>No events yet.</p>
              ) : (
                events.map(event => (
                  <div key={event.id} onClick={() => loadEventMessages(event.id)}
                    className={`bg-white rounded-2xl p-4 cursor-pointer transition hover:bg-black/[0.01] ${selectedEvent === event.id ? 'ring-2 ring-emerald-500' : ''}`}
                    style={{ border: '1px solid #E8E2D9' }}>
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">{event.event_name}</h3>
                        <p className="text-gray-500 text-xs">{event.customer_name} &middot; {new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                        {event.special_requests && <p className="text-amber-600 text-xs mt-1 truncate">Special: {event.special_requests}</p>}
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[event.status]}`}>{event.status}</span>
                        <p className="text-emerald-700 font-bold text-sm mt-1">&#8377;{((event.total_venue_cost || 0) + (event.total_services_cost || 0)).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Event Detail Panel */}
            {selectedEvent && (() => {
              const event = events.find(e => e.id === selectedEvent);
              if (!event) return null;
              return (
                <div className="lg:col-span-2 space-y-4">
                  {/* Event Info Card */}
                  <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E8E2D9' }}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{event.event_name}</h3>
                        <p className="text-gray-500 text-sm">{event.customer_name} ({event.customer_email})</p>
                        {event.customer_phone && <p className="text-gray-500 text-xs">{event.customer_phone}</p>}
                        {event.customer_country && <p className="text-gray-500 text-xs">From: {event.customer_country}</p>}
                      </div>
                      <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl p-3" style={{ backgroundColor: '#F9F7F3', border: '1px solid #E8E2D9' }}><p className="text-gray-500 text-xs">Event Type</p><p className="font-medium capitalize">{event.event_type?.replace('_', ' ')}</p></div>
                      <div className="rounded-xl p-3" style={{ backgroundColor: '#F9F7F3', border: '1px solid #E8E2D9' }}><p className="text-gray-500 text-xs">Date</p><p className="font-medium">{new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
                      <div className="rounded-xl p-3" style={{ backgroundColor: '#F9F7F3', border: '1px solid #E8E2D9' }}><p className="text-gray-500 text-xs">Guests</p><p className="font-medium">{event.guest_count}</p></div>
                      <div className="rounded-xl p-3" style={{ backgroundColor: '#F9F7F3', border: '1px solid #E8E2D9' }}><p className="text-gray-500 text-xs">Total Cost</p><p className="font-medium text-emerald-700">&#8377;{((event.total_venue_cost || 0) + (event.total_services_cost || 0)).toLocaleString('en-IN')}</p></div>
                    </div>
                    {event.special_requests && (
                      <div className="mt-3 rounded-xl p-3" style={{ backgroundColor: '#F9F7F3', border: '1px solid #E8E2D9', borderLeft: '4px solid #d97706' }}>
                        <p className="text-gray-900 text-xs font-medium mb-1">Special Requests</p>
                        <p className="text-gray-700 text-sm">{event.special_requests}</p>
                      </div>
                    )}
                    <div className="mt-3"><span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[event.status]}`}>Status: {event.status}</span></div>
                  </div>

                  {/* Admin Actions */}
                  {event.status === 'pending' && (
                    <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E8E2D9' }}>
                      <h4 className="font-semibold text-gray-900 mb-4">Actions</h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <button disabled={actionLoading}
                          onClick={() => sendAdminAction(event.id, 'approval', adminMessage || 'Your booking has been approved! You can now proceed with payment.')}
                          className="bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50">
                          Accept Booking
                        </button>
                        <button disabled={actionLoading}
                          onClick={() => {
                            if (!adminMessage.trim()) { setAdminMessage('We need more details about your event. Could you please provide: '); return; }
                            sendAdminAction(event.id, 'info_request', adminMessage);
                          }}
                          className="bg-amber-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-amber-600 transition disabled:opacity-50">
                          Request More Info
                        </button>
                        <button disabled={actionLoading}
                          onClick={() => sendAdminAction(event.id, 'rejection', adminMessage || 'Unfortunately, we are unable to accommodate your booking for the requested dates.')}
                          className="bg-red-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition disabled:opacity-50">
                          Decline
                        </button>
                      </div>
                      <textarea value={adminMessage} onChange={e => setAdminMessage(e.target.value)}
                        placeholder="Add a message to the customer (optional for accept/decline, required for info request)..."
                        rows={3} className="w-full rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                        style={{ border: '1px solid #E8E2D9' }} />
                    </div>
                  )}

                  {/* Quick actions for other statuses */}
                  {(event.status === 'confirmed' || event.status === 'completed' || event.status === 'in_progress') && (
                    <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E8E2D9' }}>
                      <h4 className="font-semibold text-gray-900 mb-4">Actions</h4>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => sendAdminAction(event.id, 'message', adminMessage || 'Event is now in progress.')}
                          className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition">Send Message</button>
                        {String(event.status) === 'completed' && (
                          <button onClick={() => sendSurvey(event.id, event.user_id)}
                            className="bg-amber-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-amber-600 transition">Send Survey</button>
                        )}
                      </div>
                      <textarea value={adminMessage} onChange={e => setAdminMessage(e.target.value)}
                        placeholder="Type a message..." rows={2}
                        className="w-full mt-3 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                        style={{ border: '1px solid #E8E2D9' }} />
                    </div>
                  )}

                  {/* Messages Thread */}
                  <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E8E2D9' }}>
                    <h4 className="font-semibold text-gray-900 mb-4">Conversation History</h4>
                    {eventMessages.length === 0 ? (
                      <p className="text-gray-500 text-sm">No messages yet.</p>
                    ) : (
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {eventMessages.map(msg => (
                          <div key={msg.id} className={`flex ${msg.sender_role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-xl px-4 py-2.5 ${
                              msg.sender_role === 'admin'
                                ? msg.message_type === 'approval' ? 'bg-emerald-600 text-white'
                                : msg.message_type === 'info_request' ? 'bg-amber-500 text-white'
                                : msg.message_type === 'rejection' ? 'bg-red-500 text-white'
                                : 'bg-blue-600 text-white'
                                : 'bg-white text-gray-900'
                            }`} style={msg.sender_role !== 'admin' ? { border: '1px solid #E8E2D9', backgroundColor: '#F9F7F3' } : undefined}>
                              {msg.message_type !== 'message' && (
                                <p className="text-xs font-bold mb-1 opacity-80">
                                  {msg.message_type === 'info_request' ? 'Information Requested' : msg.message_type === 'approval' ? 'Booking Approved' : msg.message_type === 'rejection' ? 'Booking Declined' : ''}
                                </p>
                              )}
                              <p className="text-sm">{msg.message}</p>
                              <p className={`text-xs mt-1 ${msg.sender_role === 'admin' ? 'opacity-70' : 'text-gray-400'}`}>
                                {msg.sender_name} &middot; {new Date(msg.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Customers Tab */}
        {tab === 'customers' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Database</h2>
            {users.length === 0 ? (
              <p className="text-gray-500 bg-white rounded-2xl p-8 text-center" style={{ border: '1px solid #E8E2D9' }}>No customers yet.</p>
            ) : (
              <div className="bg-white rounded-2xl overflow-x-auto" style={{ border: '1px solid #E8E2D9' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E8E2D9', backgroundColor: '#F9F7F3' }}>
                      <th className="text-left px-4 py-3 font-medium text-gray-700">Name</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-700">Email</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-700">Phone</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-700">Country</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-700">Bookings</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-700">Spent</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-700">Marketing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-black/[0.02]" style={{ borderBottom: '1px solid #E8E2D9' }}>
                        <td className="px-4 py-3 font-medium text-gray-900">{u.full_name}</td>
                        <td className="px-4 py-3 text-gray-500">{u.email}</td>
                        <td className="px-4 py-3 text-gray-500">{u.phone || '-'}</td>
                        <td className="px-4 py-3 text-gray-500">{u.country || '-'}</td>
                        <td className="px-4 py-3">{u.booking_count}</td>
                        <td className="px-4 py-3 text-emerald-700 font-medium">&#8377;{(u.total_spent || 0).toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${u.marketing_opt_in ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{u.marketing_opt_in ? 'Opted In' : 'Opted Out'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {tab === 'messages' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Messages</h2>
            {contactMessages.length === 0 ? (
              <p className="text-gray-500 bg-white rounded-2xl p-8 text-center" style={{ border: '1px solid #E8E2D9' }}>No messages yet.</p>
            ) : (
              <div className="space-y-4">
                {contactMessages.map(msg => (
                  <div key={msg.id} className="bg-white rounded-2xl p-5" style={{ border: '1px solid #E8E2D9', borderLeft: msg.status === 'new' ? '4px solid #d97706' : '1px solid #E8E2D9' }}>
                    <div className="flex items-start justify-between">
                      <div><p className="font-medium text-gray-900">{msg.name}</p><p className="text-gray-500 text-sm">{msg.email} {msg.phone && `| ${msg.phone}`}</p>{msg.subject && <p className="text-gray-500 text-xs mt-1">Subject: {msg.subject}</p>}</div>
                      <div className="text-right"><span className={`px-2 py-0.5 rounded-full text-xs ${msg.status === 'new' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>{msg.status}</span><p className="text-gray-400 text-xs mt-1">{new Date(msg.created_at).toLocaleDateString('en-IN')}</p></div>
                    </div>
                    <p className="text-gray-700 text-sm mt-3 rounded-xl p-3" style={{ backgroundColor: '#F9F7F3', border: '1px solid #E8E2D9' }}>{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Surveys Tab */}
        {tab === 'surveys' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Surveys</h2>
            {surveys.length === 0 ? (
              <p className="text-gray-500 bg-white rounded-2xl p-8 text-center" style={{ border: '1px solid #E8E2D9' }}>No surveys yet. Complete events and send surveys from the Events tab.</p>
            ) : (
              <div className="space-y-4">
                {surveys.map(s => (
                  <div key={s.id} className="bg-white rounded-2xl p-5" style={{ border: '1px solid #E8E2D9' }}>
                    <div className="flex items-start justify-between">
                      <div><p className="font-medium text-gray-900">{s.full_name}</p><p className="text-gray-500 text-sm">{s.event_name} ({s.event_type})</p></div>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${s.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>{s.status}</span>
                    </div>
                    {s.status === 'completed' && (
                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
                        <div className="rounded-xl p-2 text-center" style={{ backgroundColor: '#F9F7F3', border: '1px solid #E8E2D9' }}><p className="text-gray-500 text-xs">Overall</p><p className="font-bold text-amber-600">{s.overall_rating}/5</p></div>
                        <div className="rounded-xl p-2 text-center" style={{ backgroundColor: '#F9F7F3', border: '1px solid #E8E2D9' }}><p className="text-gray-500 text-xs">Venue</p><p className="font-bold">{s.venue_rating}/5</p></div>
                        <div className="rounded-xl p-2 text-center" style={{ backgroundColor: '#F9F7F3', border: '1px solid #E8E2D9' }}><p className="text-gray-500 text-xs">Service</p><p className="font-bold">{s.service_rating}/5</p></div>
                        <div className="rounded-xl p-2 text-center" style={{ backgroundColor: '#F9F7F3', border: '1px solid #E8E2D9' }}><p className="text-gray-500 text-xs">Value</p><p className="font-bold">{s.value_rating}/5</p></div>
                        <div className="rounded-xl p-2 text-center" style={{ backgroundColor: '#F9F7F3', border: '1px solid #E8E2D9' }}><p className="text-gray-500 text-xs">Recommend</p><p className="font-bold">{s.recommend ? 'Yes' : 'No'}</p></div>
                      </div>
                    )}
                    {s.feedback && <p className="text-gray-500 text-sm mt-3 italic">&ldquo;{s.feedback}&rdquo;</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {tab === 'analytics' && analytics && (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-gray-900">AI-Powered Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E8E2D9' }}>
                <h3 className="font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-gray-500 text-sm">Venue Rentals</span><span className="font-bold text-emerald-700">&#8377;{(analytics.totals?.total_venue_revenue || 0).toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 text-sm">Add-on Services</span><span className="font-bold text-blue-700">&#8377;{(analytics.totals?.total_services_revenue || 0).toLocaleString('en-IN')}</span></div>
                  <div className="pt-3 flex justify-between" style={{ borderTop: '1px solid #E8E2D9' }}><span className="text-gray-900 font-medium">Total Revenue</span><span className="font-bold text-lg">&#8377;{(analytics.totals?.total_revenue || 0).toLocaleString('en-IN')}</span></div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E8E2D9' }}>
                <h3 className="font-semibold text-gray-900 mb-4">Bookings by Event Type</h3>
                {analytics.byEventType?.length > 0 ? (
                  <div className="space-y-2">{analytics.byEventType.map((et, i) => (
                    <div key={i}><div className="flex justify-between text-sm"><span className="text-gray-700 capitalize">{et.event_type?.replace('_', ' ')}</span><span className="text-gray-500">{et.count}</span></div>
                    <div className="h-2 rounded-full mt-1" style={{ backgroundColor: '#F3F0EB' }}><div className="h-2 bg-emerald-500 rounded-full" style={{ width: `${(et.count / (analytics.totals?.total_bookings || 1)) * 100}%` }}></div></div></div>
                  ))}</div>
                ) : (<p className="text-gray-500 text-sm">No data yet.</p>)}
              </div>
              <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E8E2D9' }}>
                <h3 className="font-semibold text-gray-900 mb-4">Customer Geography</h3>
                {analytics.byCountry?.length > 0 ? (
                  <div className="space-y-3">{analytics.byCountry.map((c, i) => (
                    <div key={i} className="flex justify-between"><span className="text-gray-700 text-sm">{c.country || 'Unknown'}</span><span className="text-gray-900 font-medium">{c.customers} customer(s)</span></div>
                  ))}</div>
                ) : (<p className="text-gray-500 text-sm">No data yet.</p>)}
              </div>
              <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E8E2D9' }}>
                <h3 className="font-semibold text-gray-900 mb-4">Popular Services</h3>
                {analytics.popularServices?.length > 0 ? (
                  <div className="space-y-3">{analytics.popularServices.map((s, i) => (
                    <div key={i} className="flex justify-between"><span className="text-gray-700 text-sm">{s.service_name}</span><span className="text-emerald-700 font-medium">&#8377;{(s.total_revenue || 0).toLocaleString('en-IN')}</span></div>
                  ))}</div>
                ) : (<p className="text-gray-500 text-sm">No data yet.</p>)}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E8E2D9', borderLeft: '4px solid #059669' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">AI Weekly Report & Insights</h3>
                <span className="text-xs text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full font-medium">Auto-generated</span>
              </div>
              <div className="space-y-3">
                {analytics.insights?.map((insight, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl p-3" style={{ backgroundColor: '#F9F7F3', border: '1px solid #E8E2D9' }}>
                    <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-white text-xs font-bold">{i + 1}</span></div>
                    <p className="text-gray-700 text-sm">{insight}</p>
                  </div>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-4">Report generated on {today}.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
