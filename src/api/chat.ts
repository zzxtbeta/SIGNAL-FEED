// Chat/LLM相关API

import { apiClient, useMock } from './client';
import { ChatRequest, ChatResponse, ChatMessage } from '../types';

export const chatApi = {
  /**
   * 发送Chat消息
   */
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    if (useMock) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟LLM响应时间
      
      const mockResponse: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: '这是一个模拟的AI回复。在实际环境中，这里会调用真实的LLM API。',
        timestamp: new Date().toISOString(),
        sources: [
          { type: 'signal', id: 'signal-1', title: '本源量子完成C轮融资' },
        ],
      };
      
      return { message: mockResponse };
    }

    return apiClient.post<ChatResponse>('/chat', request);
  },
};
