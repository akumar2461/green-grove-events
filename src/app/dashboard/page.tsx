'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface EventMessage {
  id: string;
  sender_name: string;
  sender_role: string;
  message: string;
  message_type: string;
  created_at: string;
}

interface Event {
  id: string;
  event_type: string;
  event_name: string;
  event_date: string;
  duration_type: string;
  duration_value: number;
  guest_count: number;
  status: string;
  total_venue_cost: number;
  total_services_cost: number;
  special_requests: string;
}

interface Survey {
  id: string;
  event_id: string;
  status: string;
  overall_rating: number | null;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [surveyForm, setSurveyForm] = useState<{ id: string; overall: number; venue: number; service: number; value: number; recommend: boolean; feedback: string } | null>(null);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [messages, setMessages] = useState<EventMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (!user) return;
    if (user.role === 'admin') { router.push('/admin'); return; }

    Promise.all([
      fetch('/api/bookings').then(r => r.json()),
      fetch('/api/surveys').then(r => r.json()),
    ]).then(([evData, svData]) => {
      setEvents(evData.events || []);
      setSurveys(svData.surveys || []);
    }).finally(() => setLoading(false));
  }, [user, authLoading, router]);

  const loadMessages = async (eventId: string) => {
    if (expandedEvent === eventId) { setExpandedEvent(null); return; }
    const res = await fetch(`/api/bookings/${eventId}/messages`);
    const data = await res.json();
    setMessages(data.messages || []);
    setExpandedEvent(eventId);
    setNewMessage('');
  };

  const sendMessage = async (eventId: string) => {
    if (!newMessage.trim()) return;
    await fetch(`/api/bookings/${eventId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: newMessage, message_type: 'message' }),
    });
    setNewMessage('');
    loadMessages(eventId);
  };

  const submitSurvey = async () => {
    if (!surveyForm) return;
    await fetch('/api/surveys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        survey_id: surveyForm.id,
        overall_rating: surveyForm.overall,
        venue_rating: surveyForm.venue,
        service_rating: surveyForm.service,
        value_rating: surveyForm.value,
        recommend: surveyForm.recommend,
        feedback: surveyForm.feedback,
      }),
    });
    setSurveyForm(null);
    const svData = await fetch('/api/surveys').then(r => r.json());
    setSurveys(svData.surveys || []);
  };

  if (authLoading || loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><div className="text-[#86868B]">Loading...</div></div>;
  }

  const pendingSurveys = surveys.filter(s => s.status === 'sent');

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#F5F5F7' }}>
      <div className="max-w-[980px] mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">My Dashboard</h1>
            <p className="text-[#86868B] text-sm mt-1">Welcome back, {user?.full_name}</p>
          </div>
          <Link href="/booking" className="bg-violet-600 text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-violet-700 transition">New Booking</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #D2D2D7' }}>
            <p className="text-2xl font-bold text-[#1D1D1F]">{events.length}</p>
            <p className="text-[#86868B] text-sm">Total Bookings</p>
          </div>
          <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #D2D2D7' }}>
            <p className="text-2xl font-bold text-violet-600">{events.filter(e => e.status === 'confirmed').length}</p>
            <p className="text-[#86868B] text-sm">Confirmed</p>
          </div>
          <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #D2D2D7' }}>
            <p className="text-2xl font-bold text-yellow-600">{events.filter(e => e.status === 'pending').length}</p>
            <p className="text-[#86868B] text-sm">Pending</p>
          </div>
          <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #D2D2D7' }}>
            <p className="text-2xl font-bold text-[#1D1D1F]">
              &#8377;{events.reduce((s, e) => s + (e.total_venue_cost || 0) + (e.total_services_cost || 0), 0).toLocaleString('en-IN')}
            </p>
            <p className="text-[#86868B] text-sm">Total Value</p>
          </div>
        </div>

        {/* Pending Surveys */}
        {pendingSurveys.length > 0 && !surveyForm && (
          <div className="bg-white rounded-2xl p-6 mb-8" style={{ border: '1px solid #D2D2D7', borderLeft: '4px solid #d97706' }}>
            <h3 className="font-semibold text-[#1D1D1F] mb-2">You have {pendingSurveys.length} survey(s) to complete</h3>
            <p className="text-[#86868B] text-sm mb-4">Help us improve by sharing your experience!</p>
            {pendingSurveys.map(s => (
              <button key={s.id} onClick={() => setSurveyForm({ id: s.id, overall: 5, venue: 5, service: 5, value: 5, recommend: true, feedback: '' })}
                className="bg-amber-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-amber-700 transition mr-2">
                Complete Survey
              </button>
            ))}
          </div>
        )}

        {/* Survey Form */}
        {surveyForm && (
          <div className="bg-white rounded-2xl p-8 mb-8" style={{ border: '1px solid #D2D2D7' }}>
            <h3 className="text-xl font-semibold tracking-tight text-[#1D1D1F] mb-6">Event Feedback Survey</h3>
            <div className="space-y-4">
              {[
                { label: 'Overall Experience', key: 'overall' as const },
                { label: 'Venue Quality', key: 'venue' as const },
                { label: 'Service Quality', key: 'service' as const },
                { label: 'Value for Money', key: 'value' as const },
              ].map(item => (
                <div key={item.key}>
                  <label className="block text-sm font-medium text-[#1D1D1F] mb-2">{item.label}</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} onClick={() => setSurveyForm({...surveyForm, [item.key]: n})}
                        className={`w-10 h-10 rounded-xl font-bold text-sm transition ${surveyForm[item.key] >= n ? 'bg-amber-400 text-white' : 'text-[#86868B]'}`}
                        style={surveyForm[item.key] >= n ? undefined : { border: '1px solid #D2D2D7' }}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-[#1D1D1F]">Would you recommend Green Grove?</label>
                <button onClick={() => setSurveyForm({...surveyForm, recommend: !surveyForm.recommend})}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${surveyForm.recommend ? 'bg-violet-100 text-violet-700' : 'text-[#86868B]'}`}
                  style={surveyForm.recommend ? undefined : { border: '1px solid #D2D2D7' }}>
                  {surveyForm.recommend ? 'Yes' : 'No'}
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1D1D1F] mb-1">Additional Feedback</label>
                <textarea rows={3} value={surveyForm.feedback} onChange={e => setSurveyForm({...surveyForm, feedback: e.target.value})}
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                  style={{ border: '1px solid #D2D2D7' }} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setSurveyForm(null)} className="px-6 py-2.5 rounded-full text-sm font-medium text-[#1D1D1F] hover:bg-[#F5F5F7] transition" style={{ border: '1px solid #D2D2D7' }}>Cancel</button>
                <button onClick={submitSurvey} className="px-6 py-2.5 bg-violet-600 text-white rounded-full text-sm font-medium hover:bg-violet-700 transition">Submit Survey</button>
              </div>
            </div>
          </div>
        )}

        {/* Bookings List */}
        <h2 className="text-xl font-semibold tracking-tight text-[#1D1D1F] mb-4">My Bookings</h2>
        {events.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center" style={{ border: '1px solid #D2D2D7' }}>
            <p className="text-[#86868B] mb-4">No bookings yet.</p>
            <Link href="/booking" className="text-violet-600 font-medium hover:underline">Make your first booking</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map(event => (
              <div key={event.id} className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #D2D2D7' }}>
                <div className="p-6">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="font-semibold text-[#1D1D1F]">{event.event_name}</h3>
                      <p className="text-[#86868B] text-sm">{event.event_type} &middot; {new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      <p className="text-[#86868B] text-xs mt-1">{event.duration_value} {event.duration_type} &middot; {event.guest_count} guests</p>
                      {event.special_requests && <p className="text-[#86868B] text-xs mt-1 italic">Note: {event.special_requests}</p>}
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[event.status] || 'bg-gray-100 text-gray-600'}`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1).replace('_', ' ')}
                      </span>
                      <p className="text-violet-600 font-bold mt-2">
                        &#8377;{((event.total_venue_cost || 0) + (event.total_services_cost || 0)).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4" style={{ borderTop: '1px solid #D2D2D7' }}>
                    <button onClick={() => loadMessages(event.id)}
                      className={`text-xs px-4 py-1.5 rounded-full font-medium transition ${expandedEvent === event.id ? 'bg-violet-600 text-white' : 'bg-violet-50 text-violet-700 hover:bg-violet-100'}`}>
                      {expandedEvent === event.id ? 'Hide Messages' : 'Messages'}
                    </button>
                    {event.status === 'confirmed' && (
                      <Link href={`/payment/${event.id}`}
                        className="text-xs bg-violet-50 text-violet-700 px-4 py-1.5 rounded-full font-medium hover:bg-violet-100 transition">
                        Make Payment
                      </Link>
                    )}
                  </div>
                </div>

                {/* Messages Thread */}
                {expandedEvent === event.id && (
                  <div className="p-6" style={{ borderTop: '1px solid #D2D2D7', backgroundColor: '#F5F5F7' }}>
                    <h4 className="font-medium text-[#1D1D1F] text-sm mb-3">Conversation with Admin</h4>
                    {messages.length === 0 ? (
                      <p className="text-[#86868B] text-sm mb-4">No messages yet. Send a message to the admin below.</p>
                    ) : (
                      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                        {messages.map(msg => (
                          <div key={msg.id} className={`flex ${msg.sender_role === 'customer' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-xl px-4 py-2.5 ${msg.sender_role === 'customer' ? 'bg-violet-600 text-white' : msg.message_type === 'info_request' ? 'bg-amber-100 text-amber-900' : msg.message_type === 'approval' ? 'bg-green-100 text-green-900' : msg.message_type === 'rejection' ? 'bg-red-100 text-red-900' : 'bg-[#F5F5F7] text-[#1D1D1F]'}`}
                              style={msg.sender_role !== 'customer' ? { border: '1px solid #D2D2D7' } : undefined}>
                              {msg.message_type === 'info_request' && <p className="text-xs font-bold mb-1">Information Request</p>}
                              {msg.message_type === 'approval' && <p className="text-xs font-bold mb-1">Booking Approved</p>}
                              {msg.message_type === 'rejection' && <p className="text-xs font-bold mb-1">Booking Declined</p>}
                              <p className="text-sm">{msg.message}</p>
                              <p className={`text-xs mt-1 ${msg.sender_role === 'customer' ? 'text-violet-200' : 'text-[#86868B]'}`}>
                                {msg.sender_name} &middot; {new Date(msg.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage(event.id)}
                        placeholder="Type a message..."
                        className="flex-1 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                        style={{ border: '1px solid #D2D2D7' }} />
                      <button onClick={() => sendMessage(event.id)}
                        className="bg-violet-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-violet-700 transition">Send</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
