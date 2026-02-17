import { useState } from 'react'
import { Mail, Send, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { sendTestEmail } from '../services/api'

function EmailTest() {
  const [email, setEmail] = useState('akshithy888@gmail.com')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState(null)

  const handleSendTest = async (e) => {
    e.preventDefault()
    setSending(true)
    setResult(null)

    try {
      const response = await sendTestEmail(email)
      setResult({
        success: true,
        message: response.data.message || 'Test email sent successfully!',
        details: response.data
      })
    } catch (error) {
      setResult({
        success: false,
        message: error.response?.data?.detail || 'Failed to send test email',
        error: error.message
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Email Configuration Test</h1>
        <p className="text-gray-600 mt-1">Test your Gmail SMTP configuration</p>
      </div>

      {/* Gmail Configuration Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Mail className="text-primary-600" size={24} />
          Current Gmail Configuration
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-gray-700">Email Provider:</span>
            <span className="font-medium text-gray-900">Gmail</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-gray-700">Sender Email:</span>
            <span className="font-medium text-gray-900">Austin@jointransferx.com</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-gray-700">Method:</span>
            <span className="font-medium text-gray-900">SMTP</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-gray-700">Daily Limit:</span>
            <span className="font-medium text-gray-900">500 emails (System: 100)</span>
          </div>
        </div>
      </div>

      {/* Test Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Send Test Email</h2>
        <form onSubmit={handleSendTest} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="recipient@example.com"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter an email address to receive the test email
            </p>
          </div>

          <button
            type="submit"
            disabled={sending}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium ${
              sending
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            <Send size={20} />
            {sending ? 'Sending Test Email...' : 'Send Test Email'}
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
              <p className={`mb-3 ${
                result.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {result.message}
              </p>

              {result.success && (
                <div className="space-y-2">
                  <p className="text-green-700 font-medium">
                    ✅ Check your inbox at: {email}
                  </p>
                  <p className="text-sm text-green-600">
                    The test email should arrive within 30 seconds. Check your spam folder if you don't see it.
                  </p>
                </div>
              )}

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

      {/* Troubleshooting */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center gap-2">
          <AlertCircle className="text-yellow-600" size={20} />
          Troubleshooting
        </h3>
        <div className="space-y-3 text-sm text-yellow-800">
          <div>
            <p className="font-medium">If the test fails, check the following:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Verify the Gmail App Password is correct in the .env file</li>
              <li>Ensure 2-Factor Authentication (2FA) is enabled on the Google Account</li>
              <li>Check that the email address is correct: Austin@jointransferx.com</li>
              <li>Verify network connectivity and firewall settings</li>
              <li>Check Docker logs: <code className="bg-yellow-100 px-1 rounded">docker-compose logs api</code></li>
            </ul>
          </div>

          <div className="pt-3 border-t border-yellow-300">
            <p className="font-medium">Gmail App Password Setup:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1 ml-4">
              <li>Go to <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-yellow-900 underline">Google App Passwords</a></li>
              <li>Enable 2-Factor Authentication if not already enabled</li>
              <li>Generate a new App Password for "Mail"</li>
              <li>Copy the 16-character password (remove spaces)</li>
              <li>Update GMAIL_APP_PASSWORD in your .env file</li>
              <li>Restart Docker: <code className="bg-yellow-100 px-1 rounded">docker-compose restart</code></li>
            </ol>
          </div>
        </div>
      </div>

      {/* Email Preview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Test Email Preview</h2>
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Subject:</span>
              <span className="text-sm font-medium">🚀 TransferX Outreach Automation - System Test</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">From:</span>
              <span className="text-sm font-medium">Austin - TransferX &lt;Austin@jointransferx.com&gt;</span>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-4">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-t-lg text-center">
              <h1 className="text-2xl font-bold">🚀 TransferX</h1>
              <p className="mt-2">Outreach Automation System</p>
            </div>

            <div className="bg-white p-6 rounded-b-lg border border-gray-200">
              <h2 className="text-xl font-bold text-green-600 mb-3">✅ System Test Successful!</h2>
              <p className="text-gray-700 mb-3">Hello,</p>
              <p className="text-gray-700 mb-4">
                This is a test email from the TransferX Outreach Automation System. If you're receiving this,
                it means <strong>Gmail integration is working perfectly!</strong>
              </p>

              <div className="bg-gray-50 border-l-4 border-purple-600 p-4 mb-4">
                <h3 className="font-bold text-purple-600 mb-2">📊 System Configuration</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>✅ <strong>Email Provider:</strong> Gmail SMTP</li>
                  <li>✅ <strong>Sender:</strong> Austin@jointransferx.com</li>
                  <li>✅ <strong>Daily Limit:</strong> 500 emails (system set to 100)</li>
                  <li>✅ <strong>Status:</strong> Fully Operational</li>
                </ul>
              </div>

              <p className="text-xs text-gray-500 mt-4 border-t border-gray-200 pt-4">
                This is an automated test email. The system is configured and ready for production use.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailTest
