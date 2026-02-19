import apiClient from '@/lib/api';

export const paymentService = {
  async getInvoices(params?: { page?: number; limit?: number; status?: string }) {
    const response = await apiClient.get('/api/fees/invoices', { params });
    return response.data;
  },

  async getPayments(params?: { page?: number; limit?: number }) {
    const response = await apiClient.get('/api/fees/payments', { params });
    return response.data;
  },

  async createInvoice(data: any) {
    const response = await apiClient.post('/api/fees/invoices', data);
    return response.data;
  },

  async processPayment(invoiceId: string, paymentData: any) {
    const response = await apiClient.post(`/api/fees/invoices/${invoiceId}/pay`, paymentData);
    return response.data;
  },

  async getPaymentStats() {
    const response = await apiClient.get('/api/fees/stats');
    return response.data;
  },
};
