import { useState, useEffect, useRef, useCallback } from 'react'
import { Plus, Send, Users, TrendingUp, Trash2, Eye, Play, X, Paperclip, AlertTriangle, MessageSquare } from 'lucide-react'
import {
  getCampaigns,
  createCampaign,
  startCampaign,
  deleteCampaign,
  previewCampaign,
  getCampaignProgress,
  getTemplates,
  importTemplates,
} from '../services/api'

const CONTACT_TYPES = [
  { value: 'club', label: 'Clubs' },
  { value: 'professor', label: 'Professors' },
  { value: 'transfer_center', label: 'Transfer Centers' },
  { value: 'international', label: 'International Offices' },
  { value: 'president', label: 'College Presidents' },
  { value: 'student_govt', label: 'Student Government' },
]

function Campaigns() {
  const [campaigns, setCampaigns] = useState([])
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(null)
  const [showPreview, setShowPreview] = useState(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [starting, setStarting] = useState(null)
  const [progressMap, setProgressMap] = useState({})
  const pollingRef = useRef({})

  const [formData, setFormData] = useState({
    name: '',
    campaign_type: 'email',
    template_id: null,
    target_contact_type: '',
    attach_pdf: true,
  })

  useEffect(() => {
    loadCampaigns()
    loadTemplates()
    return () => {
      Object.values(pollingRef.current).forEach(clearInterval)
    }
  }, [])

  const loadCampaigns = async () => {
    try {
      const response = await getCampaigns()
      setCampaigns(response.data)
      // Start polling for active campaigns
      response.data.forEach((c) => {
        if (c.status === 'active') startPolling(c.id)
      })
    } catch (error) {
      console.error('Error loading campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTemplates = async () => {
    try {
      const response = await getTemplates()
      setTemplates(response.data)
    } catch (error) {
      console.error('Error loading templates:', error)
    }
  }

  const handleImportTemplates = async () => {
    try {
      await importTemplates()
      await loadTemplates()
      alert('Templates imported successfully!')
    } catch (error) {
      alert('Failed to import templates: ' + (error.response?.data?.detail || error.message))
    }
  }

  const startPolling = useCallback((campaignId) => {
    if (pollingRef.current[campaignId]) return
    const poll = async () => {
      try {
        const res = await getCampaignProgress(campaignId)
        setProgressMap((prev) => ({ ...prev, [campaignId]: res.data }))
        if (res.data.pending === 0) {
          clearInterval(pollingRef.current[campaignId])
          delete pollingRef.current[campaignId]
          loadCampaigns()
        }
      } catch {
        // ignore polling errors
      }
    }
    poll()
    pollingRef.current[campaignId] = setInterval(poll, 5000)
  }, [])

  const isLinkedIn = formData.campaign_type === 'linkedin'

  const filteredTemplates = templates.filter((t) => {
    // Filter by campaign type
    const tplType = (t.template_type || 'email').toLowerCase()
    if (isLinkedIn && tplType !== 'linkedin') return false
    if (!isLinkedIn && tplType === 'linkedin') return false

    if (!formData.target_contact_type) return true
    const name = (t.name || '').toLowerCase()
    const ct = formData.target_contact_type
    return name.includes(ct) || name.includes(ct.replace('_', ' '))
  })

  const handlePreview = async () => {
    if (!formData.template_id || !formData.target_contact_type) {
      alert('Please select a category and template first.')
      return
    }
    setPreviewLoading(true)
    try {
      const res = await previewCampaign({
        template_id: formData.template_id,
        target_contact_type: formData.target_contact_type,
      })
      setShowPreview(res.data)
    } catch (error) {
      alert('Preview failed: ' + (error.response?.data?.detail || error.message))
    } finally {
      setPreviewLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.template_id) {
      alert('Please select a template.')
      return
    }
    setCreating(true)
    try {
      const payload = {
        name: formData.name,
        campaign_type: formData.campaign_type,
        template_id: formData.template_id,
        target_contact_type: formData.target_contact_type,
        attachment_path: (!isLinkedIn && formData.attach_pdf) ? '/app/data/TransferX_College_Deck.pdf' : null,
      }
      await createCampaign(payload)
      setShowCreateModal(false)
      setFormData({
        name: '',
        campaign_type: 'email',
        template_id: null,
        target_contact_type: '',
        attach_pdf: true,
      })
      setShowPreview(null)
      loadCampaigns()
    } catch (error) {
      alert('Failed to create campaign: ' + (error.response?.data?.detail || error.message))
    } finally {
      setCreating(false)
    }
  }

  const handleStart = async (id) => {
    setStarting(id)
    try {
      await startCampaign(id)
      startPolling(id)
      loadCampaigns()
    } catch (error) {
      alert('Failed to start campaign: ' + (error.response?.data?.detail || error.message))
    } finally {
      setStarting(null)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteCampaign(id)
      setShowDeleteModal(null)
      if (pollingRef.current[id]) {
        clearInterval(pollingRef.current[id])
        delete pollingRef.current[id]
      }
      loadCampaigns()
    } catch (error) {
      alert('Failed to delete campaign: ' + (error.response?.data?.detail || error.message))
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const renderProgress = (campaign) => {
    const prog = progressMap[campaign.id]
    if (!prog && campaign.status !== 'active') return null
    if (!prog) return <span className="text-xs text-gray-400">Loading...</span>

    const total = prog.total || 1
    const sentPct = Math.round((prog.sent / total) * 100)
    const failedPct = Math.round((prog.failed / total) * 100)

    return (
      <div className="w-full">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>{prog.sent} sent</span>
          <span>{prog.pending} pending</span>
          {prog.failed > 0 && <span className="text-red-600">{prog.failed} failed</span>}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-green-500 transition-all duration-500"
            style={{ width: `${sentPct + failedPct}%` }}
          >
            {failedPct > 0 && (
              <div
                className="h-2 rounded-full bg-red-400 float-right"
                style={{ width: `${(failedPct / (sentPct + failedPct)) * 100}%` }}
              />
            )}
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1 text-right">{sentPct}% complete</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Campaigns</h1>
          <p className="text-gray-600 mt-1">Create and manage outreach campaigns</p>
        </div>
        <div className="flex gap-3">
          {templates.length === 0 && (
            <button
              onClick={handleImportTemplates}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm"
            >
              Import Templates
            </button>
          )}
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Create Campaign
          </button>
        </div>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Campaigns</p>
              <p className="text-3xl font-bold text-primary-600">
                {campaigns.filter((c) => c.status === 'active').length}
              </p>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
              <TrendingUp className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sent</p>
              <p className="text-3xl font-bold text-green-600">
                {campaigns.reduce((sum, c) => sum + (c.sent_count || 0), 0)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Send className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Campaigns</p>
              <p className="text-3xl font-bold text-blue-600">{campaigns.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Campaign
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : campaigns.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No campaigns found. Create your first campaign to get started!
                </td>
              </tr>
            ) : (
              campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{campaign.name}</span>
                      {campaign.campaign_type === 'linkedin' ? (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-blue-100 text-blue-700">
                          LinkedIn
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-gray-100 text-gray-600">
                          Email
                        </span>
                      )}
                    </div>
                    {campaign.attachment_path && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                        <Paperclip size={12} />
                        PDF attached
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                      {CONTACT_TYPES.find((t) => t.value === campaign.target_contact_type)?.label ||
                        campaign.target_contact_type ||
                        'All'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 min-w-[200px]">
                    {campaign.status === 'active' || progressMap[campaign.id] ? (
                      renderProgress(campaign)
                    ) : (
                      <div className="text-sm text-gray-500">
                        {campaign.sent_count || 0} sent
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {campaign.created_at
                        ? new Date(campaign.created_at).toLocaleDateString()
                        : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {campaign.status === 'draft' && (
                        <button
                          onClick={() => handleStart(campaign.id)}
                          disabled={starting === campaign.id}
                          className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50 disabled:opacity-50"
                          title="Start Campaign"
                        >
                          <Play size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => setShowDeleteModal(campaign)}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                        title="Delete Campaign"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create New Campaign</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setShowPreview(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={isLinkedIn ? 'e.g., LinkedIn Student Outreach' : 'e.g., Club Outreach Wave 1'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Channel
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, campaign_type: 'email', template_id: null, attach_pdf: true })}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                      !isLinkedIn
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <Send size={18} />
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, campaign_type: 'linkedin', template_id: null, attach_pdf: false })}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                      isLinkedIn
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <MessageSquare size={18} />
                    LinkedIn DM
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Category
                </label>
                <select
                  required
                  value={formData.target_contact_type}
                  onChange={(e) =>
                    {
                      const ct = e.target.value
                      let match = null
                      if (formData.campaign_type === 'linkedin') {
                        // For LinkedIn, pick the first linkedin template
                        match = templates.find((t) => (t.template_type || '').toLowerCase() === 'linkedin')
                      } else {
                        match = templates.find((t) => {
                          const n = (t.name || '').toLowerCase()
                          return (n.includes(ct) || n.includes(ct.replace('_', ' '))) && n.includes('initial')
                        })
                      }
                      setFormData({ ...formData, target_contact_type: ct, template_id: match ? match.id : null })
                    }
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a category...</option>
                  {CONTACT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {(formData.target_contact_type || isLinkedIn) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isLinkedIn ? 'Message Template' : 'Email Template'}
                  </label>
                  {filteredTemplates.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No {isLinkedIn ? 'LinkedIn' : 'email'} templates found.{' '}
                      <button
                        type="button"
                        onClick={handleImportTemplates}
                        className="text-primary-600 underline"
                      >
                        Import templates
                      </button>
                    </p>
                  ) : (
                    <select
                      required
                      value={formData.template_id || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, template_id: e.target.value || null })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select a template...</option>
                      {filteredTemplates.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}{t.subject ? ` — ${t.subject}` : ''}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {!isLinkedIn && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="attach_pdf"
                    checked={formData.attach_pdf}
                    onChange={(e) => setFormData({ ...formData, attach_pdf: e.target.checked })}
                    className="h-4 w-4 text-primary-600 rounded"
                  />
                  <label htmlFor="attach_pdf" className="text-sm text-gray-700 flex items-center gap-1">
                    <Paperclip size={14} />
                    Attach TransferX College Deck (PDF)
                  </label>
                </div>
              )}

              {formData.template_id && !isLinkedIn && (
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={previewLoading}
                  className="w-full px-4 py-2 border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Eye size={18} />
                  {previewLoading ? 'Loading preview...' : 'Preview Email'}
                </button>
              )}

              {/* LinkedIn message preview */}
              {formData.template_id && isLinkedIn && (
                <div className="border border-blue-200 rounded-lg overflow-hidden">
                  <div className="bg-blue-50 px-4 py-2">
                    <div className="text-sm font-medium text-blue-700">
                      LinkedIn DM Preview
                    </div>
                  </div>
                  <div className="bg-white p-4">
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {(templates.find(t => t.id === formData.template_id)?.body_text || '').replace(/\{\{name\}\}/g, 'John').replace(/\{\{college\}\}/g, 'UCLA')}
                    </p>
                  </div>
                </div>
              )}

              {/* Email Preview Panel */}
              {showPreview && !isLinkedIn && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 flex justify-between items-center">
                    <div className="text-sm font-medium text-gray-700">
                      Preview — {showPreview.total_recipients} recipient
                      {showPreview.total_recipients !== 1 ? 's' : ''}
                    </div>
                    {showPreview.sample_contact && (
                      <div className="text-xs text-gray-500">
                        Sample: {showPreview.sample_contact.name} ({showPreview.sample_contact.college})
                      </div>
                    )}
                  </div>
                  <div className="bg-white p-2">
                    <div className="text-xs text-gray-500 mb-2 px-2">
                      Subject: <strong>{showPreview.subject}</strong>
                    </div>
                    <iframe
                      srcDoc={showPreview.html}
                      title="Email Preview"
                      className="w-full border-0 rounded"
                      style={{ minHeight: '300px' }}
                      sandbox=""
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setShowPreview(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !formData.template_id}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {creating ? 'Creating...' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete Campaign</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{showDeleteModal.name}</strong>? This will
              remove all queued messages and cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Campaigns
