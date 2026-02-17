import { useState } from 'react'
import { Settings as SettingsIcon, Mail, Linkedin, Instagram, Save, AlertCircle } from 'lucide-react'

function Settings() {
  const [settings, setSettings] = useState({
    // Email Settings
    email_provider: 'gmail',
    gmail_email: 'Austin@jointransferx.com',
    email_daily_limit: 100,
    email_hourly_limit: 50,

    // LinkedIn Settings
    linkedin_daily_limit: 25,
    linkedin_hourly_limit: 5,

    // Instagram Settings
    instagram_daily_limit: 30,
    instagram_hourly_limit: 5,

    // System Settings
    auto_discover: false,
    auto_send: false,
    slack_notifications: true
  })

  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    // In a real app, this would call an API endpoint
    console.log('Saving settings:', settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-1">Configure your automation system</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Email Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Mail className="text-primary-600" size={24} />
            Email Configuration
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Provider
              </label>
              <select
                value={settings.email_provider}
                onChange={(e) => handleChange('email_provider', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="gmail">Gmail</option>
                <option value="sendgrid">SendGrid</option>
              </select>
            </div>

            {settings.email_provider === 'gmail' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gmail Email Address
                </label>
                <input
                  type="email"
                  value={settings.gmail_email}
                  onChange={(e) => handleChange('gmail_email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="your-email@gmail.com"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Configure App Password in .env file
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Email Limit
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={settings.email_daily_limit}
                  onChange={(e) => handleChange('email_daily_limit', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Max: 500 (Gmail limit)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Email Limit
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={settings.email_hourly_limit}
                  onChange={(e) => handleChange('email_hourly_limit', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 50
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* LinkedIn Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Linkedin className="text-blue-600" size={24} />
            LinkedIn Configuration
          </h2>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={18} />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">⚠️ Important: LinkedIn Rate Limits</p>
                <p className="mt-1">
                  Exceeding 25 DMs/day can result in account restrictions. Use conservative limits to avoid blocks.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily LinkedIn DM Limit
              </label>
              <input
                type="number"
                min="1"
                max="25"
                value={settings.linkedin_daily_limit}
                onChange={(e) => handleChange('linkedin_daily_limit', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-red-500 mt-1 font-medium">
                Max: 25 (STRICT - avoid account bans)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hourly LinkedIn DM Limit
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.linkedin_hourly_limit}
                onChange={(e) => handleChange('linkedin_hourly_limit', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 5
              </p>
            </div>
          </div>
        </div>

        {/* Instagram Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Instagram className="text-pink-600" size={24} />
            Instagram Configuration
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Instagram DM Limit
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.instagram_daily_limit}
                onChange={(e) => handleChange('instagram_daily_limit', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 30
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hourly Instagram DM Limit
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.instagram_hourly_limit}
                onChange={(e) => handleChange('instagram_hourly_limit', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 5
              </p>
            </div>
          </div>
        </div>

        {/* Automation Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <SettingsIcon className="text-gray-600" size={24} />
            Automation Settings
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Auto-Discover Contacts</p>
                <p className="text-sm text-gray-600">
                  Automatically run contact discovery for new colleges
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.auto_discover}
                  onChange={(e) => handleChange('auto_discover', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Auto-Send Campaigns</p>
                <p className="text-sm text-gray-600">
                  Automatically send campaigns when scheduled (requires manual approval)
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.auto_send}
                  onChange={(e) => handleChange('auto_send', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Slack Notifications</p>
                <p className="text-sm text-gray-600">
                  Send daily reports and alerts to Slack
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.slack_notifications}
                  onChange={(e) => handleChange('slack_notifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
          >
            <Save size={20} />
            Save Settings
          </button>

          {saved && (
            <div className="flex items-center gap-2 text-green-600">
              <AlertCircle size={18} />
              <span className="text-sm font-medium">Settings saved successfully!</span>
            </div>
          )}
        </div>

        {/* Info Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Some settings (like API keys and passwords) must be configured in the{' '}
            <code className="bg-blue-100 px-1 py-0.5 rounded">.env</code> file. Changes to those settings require
            restarting the Docker containers.
          </p>
        </div>
      </form>
    </div>
  )
}

export default Settings
