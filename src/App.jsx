import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Home, Users, Mail, BarChart3, Settings, Search, Send, Sparkles, Calendar } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import Contacts from './pages/Contacts'
import Campaigns from './pages/Campaigns'
import Discovery from './pages/Discovery'
import EmailTest from './pages/EmailTest'
import SettingsPage from './pages/Settings'
import CalendlyPage from './pages/Calendly'

function Navigation() {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/contacts', icon: Users, label: 'Contacts' },
    { path: '/campaigns', icon: Mail, label: 'Campaigns' },
    { path: '/discovery', icon: Search, label: 'Discovery' },
    { path: '/calendly', icon: Calendar, label: 'Calendly' },
    { path: '/email-test', icon: Send, label: 'Email Test' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <nav className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white w-72 min-h-screen p-6 shadow-2xl relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 animate-pulse"></div>

      <div className="relative z-10">
        {/* Logo section */}
        <div className="mb-10 pb-6 border-b border-white/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-2.5 rounded-xl shadow-lg">
              <Sparkles size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                TransferX
              </h1>
              <p className="text-purple-200 text-xs font-medium">AI-Powered Outreach</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-purple-700 shadow-lg shadow-purple-500/30 scale-105'
                      : 'text-purple-100 hover:bg-white/10 hover:translate-x-1'
                  }`}
                >
                  <Icon size={20} className={isActive ? '' : 'group-hover:scale-110 transition-transform'} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-purple-600 rounded-full"></div>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Status section */}
        <div className="mt-10 pt-6 border-t border-white/20">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-purple-200 text-sm font-medium">System Status</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-purple-200 text-sm">Backend</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                <span className="text-green-300 text-sm font-medium">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-purple-200 text-sm">API</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                <span className="text-green-300 text-sm font-medium">Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-gray-100">
        <Navigation />
        <main className="flex-1 p-8 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/calendly" element={<CalendlyPage />} />
            <Route path="/email-test" element={<EmailTest />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
