import api from './axios'
import { API_ENDPOINTS } from '@/utils/constants'

export const staffApi = {
  getComplaints: (params) => {
    return api.get(API_ENDPOINTS.STAFF_COMPLAINTS, { params })
  },

  getPayments: (params) => {
    return api.get(API_ENDPOINTS.STAFF_PAYMENTS, { params })
  },

  updatePaymentStatus: (paymentId, data) => {
    return api.patch(API_ENDPOINTS.STAFF_PAYMENT_UPDATE(paymentId), data)
  },
}
