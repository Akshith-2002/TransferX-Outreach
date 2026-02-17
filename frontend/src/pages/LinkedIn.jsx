import { useState, useEffect } from 'react'
import { Linkedin, Send, CheckCircle, XCircle, AlertCircle, Users, Activity, Shield } from 'lucide-react'
import api, { getRateLimits } from '../services/api'

function LinkedIn() {
  const [profileUrl, setProfileUrl] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [triggering, setTriggering] = useState(false)
  const [result, setResult] = useState(null)
  const [rateLimits, setRateLimits] = useState(null)

  useEffect(() => {
    loadRateLimits()
  }, [])

  const loadRateLimits = async () => {
    try {
      const res = await getRateLimits()
      setRateLimits(res.data?.linkedin || null)
    } catch {
      // ignore
    }
  }

  const handleTestDM = async (e) => {
    e.preventDefault()
    setSending(true)
    setResult(null)
    try {
      const params = new URLSearchParams({ profile_url: profileUrl })
      if (message.trim()) params.append('message', message)
      const res = await api.post(`/admin/test-linkedin?${params.toString()}`)
      setResult({ success: res.data.success, message: res.data.message || 'Test DM sent!', details: res.data })
    } catch (error) {
      setResult({
        success: false,
        message: error.response?.data?.detail || error.response?.data?.error || 'Failed to send test DM',
        error: error.message,
      })
    } finally {
      setSending(false)
    }
  }

  const handleTriggerQueue = async () => {
    setTriggering(true)
    try {
      await api.post('/admin/trigger-linkedin-queue')
      alert('LinkedIn queue processing triggered!')
    } catch (error) {
      alert('Failed: ' + (error.response?.data?.detail || error.message))
    } finally {
      setTriggering(false)
    }
  }

  const dailyStats = rateLimits?.daily || {}
  const hourlyStats = rateLimits?.hourly || {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">LinkedIn Outreach</h1>
        <p className="text-gray-600 mt-1">Manage LinkedIn DM automation and test connections</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Daily DMs Sent</p>
              <p className="text-3xl font-bold text-blue-600">
                {dailyStats.current || 0}
                <span className="text-lg text-gray-400">/{dailyStats.limit || 25}</span>
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Send className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hourly DMs Sent</p>
              <p className="text-3xl font-bold text-indigo-600">
                {hourlyStats.current || 0}
                <span className="text-lg text-gray-400">/{hourlyStats.limit || 5}</span>
              </p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <Activity className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Account Status</p>
              <p className="text-xl font-bold text-green-600">Active</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Shield className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Trigger Queue */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="text-blue-600" size={24} />
          Queue Processing
        </h2>
        <p className="text-gray-600 mb-4">
          Manually trigger processing of pending LinkedIn DMs. This runs automatically once daily at 10 AM,
          but you can trigger it here if needed.
        </p>
        <button
          onClick={handleTriggerQueue}
          disabled={triggering}
          className={`px-6 py-3 rounded-lg text-white font-medium flex items-center gap-2 ${
            triggering ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <Send size={18} />
          {triggering ? 'Triggering...' : 'Process LinkedIn Queue'}
        </button>
      </div>

      {/* Test DM Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Linkedin className="text-blue-600" size={24} />
          Send Test DM
        </h2>
        <form onSubmit={handleTestDM} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              required
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (optional - uses default test message if empty)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter a custom message or leave empty for default test message..."
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium ${
              sending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Send size={20} />
            {sending ? 'Sending Test DM...' : 'Send Test DM'}
          </button>
        </form>
      </div>

      {/* Result */}
      {result && (
        <div className={`rounded-lg shadow-md p-6 ${
          result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            {result.success ? (
              <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
            ) : (
              <XCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
            )}
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-2 ${
                result.success ? 'text-green-900' : 'text-red-900'
              }`}>
                {result.success ? 'Success!' : 'Failed'}
              </h3>
              <p className={result.success ? 'text-green-700' : 'text-red-700'}>
                {result.message}
              </p>
              {!result.success && result.error && (
                <div className="mt-3 p-3 bg-red-100 rounded">
                  <p className="text-sm font-medium text-red-900 mb-1">Error Details:</p>
                  <p className="text-sm text-red-700 font-mono">{result.error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <AlertCircle className="text-blue-600" size={20} />
          How LinkedIn Automation Works
        </h3>
        <div className="space-y-2 text-sm text-blue-800">
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Uses Playwright browser automation with persistent sessions</li>
            <li>Sends up to <strong>25 DMs/day</strong> and <strong>5 DMs/hour</strong> to avoid restrictions</li>
            <li>Human-like typing delays and random waits between messages</li>
            <li>Auto-detects account blocks and pauses for 7 days if restricted</li>
            <li>Create LinkedIn campaigns from the <strong>Campaigns</strong> page (select "LinkedIn DM" channel)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default LinkedIn
