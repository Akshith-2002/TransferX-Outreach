import { useState, useEffect } from 'react'
import {
  Calendar, Clock, Users, Link2, Copy, CheckCircle,
  ChevronLeft, ChevronRight, ExternalLink, AlertCircle
} from 'lucide-react'
import {
  getCalendlyUser,
  getCalendlyEventTypes,
  getCalendlyScheduledEvents,
} from '../services/api'
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameMonth, isSameDay, addMonths, subMonths,
  startOfWeek, endOfWeek, parseISO, isAfter
} from 'date-fns'

function StatCard({ title, value, icon: Icon, color = 'primary' }) {
  const gradients = {
    primary: 'from-purple-500 to-indigo-600',
    green: 'from-emerald-500 to-teal-600',
    blue: 'from-blue-500 to-cyan-600',
  }
  return (
    <div className="group relative bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-gray-500 text-sm font-medium mb-2">{title}</p>
            <h3 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {value}
            </h3>
          </div>
          <div className={`bg-gradient-to-br ${gradients[color]} p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform`}>
            <Icon className="text-white" size={28} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Calendly() {
  const [user, setUser] = useState(null)
  const [eventTypes, setEventTypes] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [userRes, typesRes, eventsRes] = await Promise.all([
        getCalendlyUser(),
        getCalendlyEventTypes(),
        getCalendlyScheduledEvents(),
      ])
      setUser(userRes.data)
      setEventTypes(typesRes.data.event_types || [])
      setEvents(eventsRes.data.events || [])
    } catch (err) {
      console.error('Error loading Calendly data:', err)
      setError(err.response?.data?.detail || 'Failed to load Calendly data. Check your API token.')
    } finally {
      setLoading(false)
    }
  }

  const copyLink = () => {
    if (user?.scheduling_url) {
      navigator.clipboard.writeText(user.scheduling_url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Calendar helpers
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getEventsForDay = (day) =>
    events.filter(e => isSameDay(parseISO(e.start_time), day))

  const now = new Date()
  const upcomingEvents = events.filter(e => isAfter(parseISO(e.start_time), now))
  const todayEvents = events.filter(e => isSameDay(parseISO(e.start_time), now))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 absolute top-0 left-0"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Calendly</h1>
          <p className="text-gray-600 mt-1">Manage your scheduling</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-red-900">Connection Error</h3>
              <p className="text-red-700 mt-1">{error}</p>
              <p className="text-sm text-red-600 mt-3">
                Make sure <code className="bg-red-100 px-1 rounded">CALENDLY_API_TOKEN</code> is set in your .env file.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Calendly</h1>
        <p className="text-gray-600 mt-1">View your scheduling dashboard and bookings</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Event Types" value={eventTypes.length} icon={Calendar} color="primary" />
        <StatCard title="Upcoming Events" value={upcomingEvents.length} icon={Clock} color="blue" />
        <StatCard title="Today's Events" value={todayEvents.length} icon={Users} color="green" />
      </div>

      {/* Scheduling Link */}
      {user?.scheduling_url && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Link2 className="text-purple-600" size={24} />
            Your Scheduling Link
          </h2>
          <div className="flex items-center gap-3">
            <input
              type="text"
              readOnly
              value={user.scheduling_url}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none"
            />
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 font-medium shadow-md transition-all"
            >
              {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <a
              href={user.scheduling_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 transition-all"
            >
              <ExternalLink size={18} />
              Open
            </a>
          </div>
        </div>
      )}

      {/* Calendar View */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Calendar</h2>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft size={20} />
            </button>
            <span className="text-lg font-medium w-40 text-center">{format(currentMonth, 'MMMM yyyy')}</span>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="bg-gray-50 p-2 text-center text-xs font-medium text-gray-500 uppercase">{d}</div>
          ))}
          {calendarDays.map((day, i) => {
            const dayEvents = getEventsForDay(day)
            const isToday = isSameDay(day, now)
            return (
              <div
                key={i}
                className={`bg-white p-2 min-h-[80px] ${!isSameMonth(day, currentMonth) ? 'opacity-40' : ''}`}
              >
                <span className={`text-sm font-medium inline-flex items-center justify-center ${isToday ? 'bg-purple-600 text-white w-7 h-7 rounded-full' : 'text-gray-700'}`}>
                  {format(day, 'd')}
                </span>
                {dayEvents.slice(0, 2).map((ev, j) => (
                  <div key={j} className="mt-1 text-xs bg-purple-100 text-purple-700 rounded px-1 py-0.5 truncate">
                    {format(parseISO(ev.start_time), 'h:mm a')} - {ev.name}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-400 mt-1">+{dayEvents.length - 2} more</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Upcoming Bookings Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {upcomingEvents.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No upcoming events</td>
              </tr>
            ) : (
              upcomingEvents.slice(0, 20).map((event, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{event.name}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {format(parseISO(event.start_time), 'MMM d, yyyy h:mm a')}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {Math.round((new Date(event.end_time) - new Date(event.start_time)) / 60000)} min
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {event.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Event Types */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Event Types</h2>
        {eventTypes.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No event types configured</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventTypes.map((et, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: et.color || '#8b5cf6' }}></div>
                  <h3 className="font-medium text-gray-900">{et.name}</h3>
                </div>
                <p className="text-sm text-gray-500">{et.duration} min</p>
                {et.scheduling_url && (
                  <a href={et.scheduling_url} target="_blank" rel="noopener noreferrer"
                     className="text-sm text-purple-600 hover:underline mt-2 inline-flex items-center gap-1">
                    <ExternalLink size={14} /> Booking page
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Calendly
