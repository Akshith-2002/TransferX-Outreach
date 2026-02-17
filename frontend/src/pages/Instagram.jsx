import { useState, useEffect } from 'react'
import { Instagram as InstagramIcon, Send, Users, Activity, Shield, AlertCircle, Clock } from 'lucide-react'
import { getRateLimits } from '../services/api'

function Instagram() {
  const [rateLimits, setRateLimits] = useState(null)

  useEffect(() => {
    loadRateLimits()
  }, [])

  const loadRateLimits = async () => {
    try {
      const res = await getRateLimits()
      setRateLimits(res.data?.instagram || null)
    } catch {
      // ignore
    }
  }

  const dailyStats = rateLimits?.daily || {}
  const hourlyStats = rateLimits?.hourly || {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Instagram Outreach</h1>
        <p className="text-gray-600 mt-1">Manage Instagram DM automation for student clubs and organizations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Daily DMs Sent</p>
              <p className="text-3xl font-bold text-pink-600">
                {dailyStats.current || 0}
                <span className="text-lg text-gray-400">/{dailyStats.limit || 30}</span>
              </p>
            </div>
            <div className="bg-pink-100 p-3 rounded-full">
              <Send className="text-pink-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hourly DMs Sent</p>
              <p className="text-3xl font-bold text-purple-600">
                {hourlyStats.current || 0}
                <span className="text-lg text-gray-400">/{hourlyStats.limit || 5}</span>
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Activity className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Module Status</p>
              <p className="text-xl font-bold text-yellow-600">Coming Soon</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <InstagramIcon className="text-pink-600" size={24} />
          Instagram DM Automation
        </h2>
        <p className="text-gray-600 mb-6">
          The Instagram module will enable automated outreach to student clubs and organizations via Instagram DMs.
          The database and configuration are already set up — browser automation is being developed.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-green-200 rounded-lg p-4 bg-green-50">
            <h3 className="font-semibold text-green-900 mb-2">Ready</h3>
            <ul className="space-y-1.5 text-sm text-green-800">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                Instagram handles stored in contacts & clubs
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                Rate limiting configured (30/day, 5/hour)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                Campaign type &quot;instagram&quot; supported
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                KPI tracking for Instagram DMs & responses
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                Environment variables configured
              </li>
            </ul>
          </div>

          <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
            <h3 className="font-semibold text-yellow-900 mb-2">In Progress</h3>
            <ul className="space-y-1.5 text-sm text-yellow-800">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                Browser automation (Playwright)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                Session persistence & login flow
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                DM sending via Instagram web
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                Celery task for queue processing
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                Test DM endpoint
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Clubs with Instagram */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="text-pink-600" size={24} />
          Target Audience
        </h2>
        <p className="text-gray-600 mb-4">
          Instagram outreach targets student clubs and organizations that have Instagram handles in the database.
          These are discovered during the contact discovery process.
        </p>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-pink-600">30</p>
              <p className="text-xs text-gray-500">Daily DM Limit</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">5</p>
              <p className="text-xs text-gray-500">Hourly DM Limit</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">2-5 min</p>
              <p className="text-xs text-gray-500">Delay Between DMs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">7 days</p>
              <p className="text-xs text-gray-500">Block Cooldown</p>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Info */}
      <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-pink-900 mb-3 flex items-center gap-2">
          <AlertCircle className="text-pink-600" size={20} />
          Configuration
        </h3>
        <div className="space-y-2 text-sm text-pink-800">
          <p>The following environment variables should be set in your <code className="bg-pink-100 px-1 rounded">.env</code> file:</p>
          <div className="bg-pink-100 rounded p-3 font-mono text-xs space-y-1">
            <p>INSTAGRAM_USERNAME=your_username</p>
            <p>INSTAGRAM_PASSWORD=your_password</p>
          </div>
          <p className="mt-2">
            Once browser automation is implemented, Instagram campaigns can be created from the <strong>Campaigns</strong> page
            by selecting the &quot;Instagram&quot; channel type.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Instagram
