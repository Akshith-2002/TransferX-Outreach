import { useState, useEffect } from 'react'
import { Search, Users, Mail, Briefcase, TrendingUp } from 'lucide-react'
import { discoverContacts, getContacts, getStats } from '../services/api'

function Discovery() {
  const [collegeName, setCollegeName] = useState('')
  const [limit, setLimit] = useState(10)
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState(null)
  const [stats, setStats] = useState({
    total_contacts: 0,
    with_email: 0,
    professors: 0,
    clubs: 0
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [contactsRes, statsRes] = await Promise.all([
        getContacts(),
        getStats()
      ])
      const contacts = contactsRes.data
      const adminStats = statsRes.data
      setStats({
        total_contacts: adminStats.total_contacts || contacts.length,
        with_email: contacts.filter(c => c.email).length,
        professors: adminStats.contacts_by_type?.professor || contacts.filter(c => c.contact_type === 'professor').length,
        clubs: adminStats.total_clubs || 0
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleDiscover = async (e) => {
    e.preventDefault()
    setRunning(true)
    setResults(null)

    try {
      const response = await discoverContacts({
        college_name: collegeName || undefined,
        limit: limit
      })
      setResults(response.data)
      loadStats()

      // Reset form for specific college
      if (collegeName) {
        setCollegeName('')
      }
    } catch (error) {
      console.error('Error discovering contacts:', error)
      alert('Failed to discover contacts. Check console for details.')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Contact Discovery</h1>
        <p className="text-gray-600 mt-1">Automatically discover contacts from college websites</p>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Contacts</p>
              <p className="text-3xl font-bold text-primary-600">{stats.total_contacts}</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
              <Users className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">With Email</p>
              <p className="text-3xl font-bold text-green-600">{stats.with_email}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Mail className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Professors</p>
              <p className="text-3xl font-bold text-blue-600">{stats.professors}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clubs</p>
              <p className="text-3xl font-bold text-purple-600">{stats.clubs}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Briefcase className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Discovery Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Run Discovery</h2>
        <form onSubmit={handleDiscover} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              College Name (Optional)
            </label>
            <input
              type="text"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              placeholder="Leave blank to discover all colleges"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Leave blank to run discovery for all colleges in the database
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Limit (Number of Colleges)
            </label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              min="1"
              max="100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Max number of colleges to process (1-100)
            </p>
          </div>

          <button
            type="submit"
            disabled={running}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium ${
              running
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            <Search size={20} />
            {running ? 'Discovering Contacts...' : 'Start Discovery'}
          </button>
        </form>
      </div>

      {/* Discovery Process Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">What Gets Discovered</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-full mt-1">
              <Mail className="text-blue-600" size={16} />
            </div>
            <div>
              <p className="font-medium text-blue-900">Transfer Center Emails</p>
              <p className="text-sm text-blue-700">
                Finds official transfer center contact emails from college websites
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-full mt-1">
              <TrendingUp className="text-blue-600" size={16} />
            </div>
            <div>
              <p className="font-medium text-blue-900">Indian-Origin Professors</p>
              <p className="text-sm text-blue-700">
                Discovers professors in Business, CS, and Marketing departments with Indian names
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-full mt-1">
              <Briefcase className="text-blue-600" size={16} />
            </div>
            <div>
              <p className="font-medium text-blue-900">Student Clubs</p>
              <p className="text-sm text-blue-700">
                Finds Business, Marketing, Entrepreneurship, and International student organizations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-600">Discovery Complete!</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-700">Colleges Processed:</span>
              <span className="font-bold text-gray-900">{results.colleges_processed || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded">
              <span className="text-gray-700">Transfer Centers Found:</span>
              <span className="font-bold text-green-600">{results.transfer_centers_found || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
              <span className="text-gray-700">Professors Discovered:</span>
              <span className="font-bold text-blue-600">{results.professors_found || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
              <span className="text-gray-700">Clubs Discovered:</span>
              <span className="font-bold text-purple-600">{results.clubs_found || 0}</span>
            </div>
          </div>

          {results.errors && results.errors.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
              <p className="font-medium text-red-900 mb-2">Some errors occurred:</p>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {results.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Discovery
