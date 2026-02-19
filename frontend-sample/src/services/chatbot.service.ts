import apiClient from '@/lib/api';

export const chatbotService = {
  async sendMessage(message: string, context?: any) {
    const response = await apiClient.post('/api/chatbot/message', { message, context });
    return response.data;
  },

  async getChatHistory(sessionId?: string) {
    const response = await apiClient.get('/api/chatbot/history', { params: { sessionId } });
    return response.data;
  },
};
