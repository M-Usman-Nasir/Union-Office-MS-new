import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'

export const superAdminApi = {
  getGlobalReports: (year) => {
    return api.get(API_ENDPOINTS.SUPER_ADMIN_REPORTS_GLOBAL, {
      params: { year },
    })
  },

  getSubscriptionPlans: (all = false) =>
    api.get(API_ENDPOINTS.SUPER_ADMIN_SUBSCRIPTION_PLANS, { params: all ? { all: 'true' } : {} }),
  createSubscriptionPlan: (data) => api.post(API_ENDPOINTS.SUPER_ADMIN_SUBSCRIPTION_PLANS, data),
  updateSubscriptionPlan: (id, data) => api.patch(API_ENDPOINTS.SUPER_ADMIN_SUBSCRIPTION_PLAN_BY_ID(id), data),
  getAdminsWithSubscriptions: () => api.get(API_ENDPOINTS.SUPER_ADMIN_SUBSCRIPTION_ADMINS),
  createSubscription: (data) => api.post(API_ENDPOINTS.SUPER_ADMIN_SUBSCRIPTION, data),
  updateSubscriptionStatus: (id, data) => api.patch(API_ENDPOINTS.SUPER_ADMIN_SUBSCRIPTION_BY_ID(id), data),

  listInvoices: (params) => api.get(API_ENDPOINTS.SUPER_ADMIN_INVOICES, { params }),
  createInvoice: (data) => api.post(API_ENDPOINTS.SUPER_ADMIN_INVOICES, data),
  autoGenerateInvoices: () => api.post(API_ENDPOINTS.SUPER_ADMIN_INVOICES + '/auto-generate'),
  updateInvoiceStatus: (id, status) => api.patch(API_ENDPOINTS.SUPER_ADMIN_INVOICE_BY_ID(id), { status }),
  uploadInvoicePaymentProof: (invoiceId, formData) =>
    api.post(API_ENDPOINTS.SUPER_ADMIN_INVOICE_UPLOAD_PAYMENT_PROOF(invoiceId), formData),
}
