import { useState, useCallback } from 'react';
import { chatApi } from '../api/chat';
import { ChatMessage, ChatContext } from '../types';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [context, setContext] = useState<ChatContext | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    // 添加用户消息
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);

    setLoading(true);
    setError(null);
    try {
      const response = await chatApi.sendMessage({
        message: content,
        context: context || undefined,
        history: messages,
      });
      setMessages(prev => [...prev, response.message]);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to send message:', err);
    } finally {
      setLoading(false);
    }
  }, [messages, context]);

  const updateContext = useCallback((newContext: ChatContext | null) => {
    setContext(newContext);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    loading,
    error,
    context,
    sendMessage,
    updateContext,
    clearMessages,
  };
};
