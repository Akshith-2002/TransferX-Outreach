import { useState, useEffect } from 'react'
import { Mail, Users, Calendar, TrendingUp, Activity, Sparkles, ArrowRight, Zap } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getKPISummary, getStats, getRateLimits } from '../services/api'

function StatCard({ title, value, icon: Icon, trend, color = 'primary', gradient }) {
  const gradients = {
    primary: 'from-purple-500 to-indigo-600',
    green: 'from-emerald-500 to-teal-600',
    blue: 'from-blue-500 to-cyan-600',
    purple: 'from-violet-500 to-purple-600',
    orange: 'from-orange-500 to-pink-600',
  }

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-gray-500 text-sm font-medium mb-2">{title}</p>
            <h3 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {value}
            </h3>
            {trend && (
              <p className="text-sm text-emerald-600 mt-3 flex items-center font-medium">
                <TrendingUp size={16} className="mr-1.5" />
                {trend}
              </p>
            )}
          </div>
          <div className={`bg-gradient-to-br ${gradients[color]} p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform`}>
            <Icon className="text-white" size={28} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Dashboard() {
  const [kpis, setKpis] = useState(null)
  const [stats, setStats] = useState(null)
  const [rateLimits, setRateLimits] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [kpiRes, statsRes, limitsRes] = await Promise.all([
        getKPISummary(),
        getStats(),
        getRateLimits()
      ])

      setKpis(kpiRes.data)
      setStats(statsRes.data)
      setRateLimits(limitsRes.data)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

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

  // Sample data for charts
  const emailTrendData = [
    { name: 'Mon', sent: 15, responses: 3 },
    { name: 'Tue', sent: 22, responses: 5 },
    { name: 'Wed', sent: 18, responses: 4 },
    { name: 'Thu', sent: 25, responses: 7 },
    { name: 'Fri', sent: 30, responses: 8 },
    { name: 'Sat', sent: 12, responses: 2 },
    { name: 'Sun', sent: 8, responses: 1 },
  ]

  const contactTypeData = [
    { name: 'Transfer Centers', value: stats?.contacts_by_type?.transfer_center || 0, color: '#8b5cf6' },
    { name: 'Professors', value: stats?.contacts_by_type?.professor || 0, color: '#3b82f6' },
    { name: 'Clubs', value: stats?.total_clubs || 0, color: '#10b981' },
    { name: 'Students', value: stats?.contacts_by_type?.student || 0, color: '#f59e0b' },
  ]

  return (
    <div className="space-y-8">
      {/* Header with gradient */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative bg-gradient-to-br from-white to-purple-50/30 rounded-2xl p-8 shadow-lg border border-purple-100/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="text-purple-600" size={28} />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
              </div>
              <p className="text-gray-600 text-lg">TransferX Outreach Automation Overview</p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg">
                <Zap size={20} />
                <span className="font-semibold">System Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Emails Sent"
          value={kpis?.emails_sent || 0}
          icon={Mail}
          trend="+12% from last week"
          color="primary"
        />
        <StatCard
          title="Email Responses"
          value={kpis?.email_responses || 0}
          icon={Activity}
          trend={`${kpis?.email_response_rate?.toFixed(1) || 0}% response rate`}
          color="green"
        />
        <StatCard
          title="Meetings Scheduled"
          value={kpis?.meetings_scheduled || 0}
          icon={Calendar}
          trend="+3 this week"
          color="blue"
        />
        <StatCard
          title="Total Contacts"
          value={stats?.total_contacts || 0}
          icon={Users}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Trends */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Email Activity</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Last 7 Days</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={emailTrendData}>
              <defs>
                <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="sent" stroke="#8b5cf6" strokeWidth={3} fill="url(#colorSent)" />
              <Line type="monotone" dataKey="responses" stroke="#10b981" strokeWidth={3} fill="url(#colorResponses)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Contact Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Contact Distribution</h2>
            <Users className="text-purple-600" size={24} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={contactTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {contactTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rate Limits */}
      <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-2xl shadow-lg p-6 border border-purple-100/50">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Activity className="text-purple-600" size={24} />
          Rate Limits Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Rate Limit */}
          {rateLimits?.email && (
            <div className="bg-white rounded-xl p-5 shadow-md">
              <div className="flex justify-between mb-3">
                <span className="font-semibold text-gray-700">Email (Daily)</span>
                <span className="text-gray-600 font-medium">
                  {rateLimits.email.daily.count} / {rateLimits.email.daily.limit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 h-3 rounded-full transition-all duration-500 shadow-lg"
                  style={{
                    width: `${(rateLimits.email.daily.count / rateLimits.email.daily.limit) * 100}%`
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2 font-medium">
                {rateLimits.email.daily.remaining} remaining
              </p>
            </div>
          )}

          {/* LinkedIn Rate Limit */}
          {rateLimits?.linkedin && (
            <div className="bg-white rounded-xl p-5 shadow-md">
              <div className="flex justify-between mb-3">
                <span className="font-semibold text-gray-700">LinkedIn (Daily)</span>
                <span className="text-gray-600 font-medium">
                  {rateLimits.linkedin.daily.count} / {rateLimits.linkedin.daily.limit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 h-3 rounded-full transition-all duration-500 shadow-lg"
                  style={{
                    width: `${(rateLimits.linkedin.daily.count / rateLimits.linkedin.daily.limit) * 100}%`
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2 font-medium">
                {rateLimits.linkedin.daily.remaining} remaining
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2">
            <Mail size={20} />
            Create Campaign
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2">
            <Sparkles size={20} />
            Run Discovery
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2">
            <Zap size={20} />
            Send Test Email
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
