import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Contacts API
export const getContacts = (params = {}) =>
  api.get('/contacts', { params })

export const getContact = (id) =>
  api.get(`/contacts/${id}`)

export const createContact = (data) =>
  api.post('/contacts', data)

// Clubs API
export const getClubs = (params = {}) =>
  api.get('/clubs', { params })

// Campaigns API
export const getCampaigns = (params = {}) =>
  api.get('/campaigns', { params })

export const getCampaign = (id) =>
  api.get(`/campaigns/${id}`)

export const createCampaign = (data) =>
  api.post('/campaigns', data)

export const startCampaign = (id) =>
  api.post(`/campaigns/${id}/start`)

export const deleteCampaign = (id) =>
  api.delete(`/campaigns/${id}`)

export const previewCampaign = (data) =>
  api.post('/campaigns/preview', data)

export const getCampaignProgress = (id) =>
  api.get(`/campaigns/${id}/progress`)

export const importTemplates = () =>
  api.post('/admin/import-templates')

// KPIs API
export const getKPIs = (params = {}) =>
  api.get('/kpis', { params })

export const getKPISummary = () =>
  api.get('/kpis/summary')

// Admin API
export const getStats = () =>
  api.get('/admin/stats')

export const sendTestEmail = (email) =>
  api.post(`/admin/test-email?to=${email}`)

export const discoverContacts = (params = {}) =>
  api.post('/admin/discover-contacts', null, { params })

export const getRateLimits = () =>
  api.get('/rate-limits')

// Templates API
export const getTemplates = (params = {}) =>
  api.get('/templates', { params })

// Calendly API
export const getCalendlyUser = () =>
  api.get('/calendly/user')

export const getCalendlyEventTypes = () =>
  api.get('/calendly/event-types')

export const getCalendlyAvailableSlots = (params) =>
  api.get('/calendly/available-slots', { params })

export const getCalendlyScheduledEvents = (params = {}) =>
  api.get('/calendly/scheduled-events', { params })

export const getCalendlyEventInvitees = (eventUuid) =>
  api.get(`/calendly/scheduled-events/${eventUuid}/invitees`)

export default api
