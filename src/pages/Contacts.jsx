import { useState, useEffect } from 'react'
import { Search, Filter, Mail, Linkedin, Instagram } from 'lucide-react'
import { getContacts, getClubs } from '../services/api'

function Contacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadContacts()
  }, [filter])

  const loadContacts = async () => {
    try {
      if (filter === 'club') {
        // Clubs are in a separate table
        const response = await getClubs()
        const clubsAsContacts = response.data.map(club => ({
          id: club.id,
          first_name: null,
          last_name: null,
          institution_name: club.institution_name,
          email: club.email,
          contact_type: 'club',
          status: club.contacted ? 'contacted' : 'active',
          linkedin_url: null,
          instagram_handle: club.instagram_handle,
          club_name: club.club_name,
          club_type: club.club_type,
          description: club.description,
        }))
        setContacts(clubsAsContacts)
      } else {
        const params = filter !== 'all' ? { contact_type: filter } : {}
        const response = await getContacts(params)
        setContacts(response.data)
      }
    } catch (error) {
      console.error('Error loading contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredContacts = contacts.filter(contact =>
    (contact.institution_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     contact.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     contact.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     contact.club_name?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const contactTypes = [
    { value: 'all', label: 'All Contacts' },
    { value: 'transfer_center', label: 'Transfer Centers' },
    { value: 'professor', label: 'Professors' },
    { value: 'club', label: 'Clubs' },
    { value: 'student', label: 'Students' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Contacts</h1>
        <p className="text-gray-600 mt-1">Manage your outreach contacts</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {contactTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name / Institution
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filteredContacts.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No contacts found
                </td>
              </tr>
            ) : (
              filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {contact.club_name
                          ? contact.club_name
                          : contact.first_name && contact.last_name
                            ? `${contact.first_name} ${contact.last_name}`
                            : contact.institution_name || 'Unknown'}
                      </div>
                      {contact.institution_name && (contact.first_name || contact.club_name) && (
                        <div className="text-sm text-gray-500">{contact.institution_name}</div>
                      )}
                      {contact.club_type && (
                        <div className="text-xs text-purple-500 mt-1">{contact.club_type}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                      {contact.contact_type?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {contact.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail size={16} className="mr-1" />
                          {contact.email}
                        </div>
                      )}
                      {contact.linkedin_url && (
                        <Linkedin size={16} className="text-blue-600" />
                      )}
                      {contact.instagram_handle && (
                        <Instagram size={16} className="text-pink-600" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      contact.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {contact.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Contact Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-2xl font-bold text-primary-600">{filteredContacts.length}</p>
            <p className="text-sm text-gray-600">Total Showing</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {filteredContacts.filter(c => c.email).length}
            </p>
            <p className="text-sm text-gray-600">With Email</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {filteredContacts.filter(c => c.linkedin_url).length}
            </p>
            <p className="text-sm text-gray-600">With LinkedIn</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {filteredContacts.filter(c => c.status === 'active').length}
            </p>
            <p className="text-sm text-gray-600">Active</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contacts
