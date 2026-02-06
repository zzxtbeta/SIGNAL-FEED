import { X, Send, Sparkles, FileText, Building2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatDrawer({ isOpen, onClose }: ChatDrawerProps) {
  const { messages, loading, context, sendMessage, clearMessages } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    '超导量子计算目前的技术成熟度如何？',
    '本源量子的核心竞争力是什么？',
    '量子通信领域有哪些投资机会？',
    '中国量子科技政策支持力度如何？',
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-[500px] bg-neutral-900 border-l border-neutral-800 z-[70] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-orange-600" />
              <h2 className="font-display text-2xl text-orange-600">GRAVAITY</h2>
            </div>
            <p className="text-xs text-neutral-500">认知引擎 · AI分析助手</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Context Info */}
        {context && (
          <div className="px-6 py-3 bg-orange-600/10 border-b border-orange-600/20">
            <div className="flex items-center gap-2 text-sm">
              {context.type === 'signal' && <FileText className="w-4 h-4 text-orange-600" />}
              {context.type === 'company' && <Building2 className="w-4 h-4 text-orange-600" />}
              <span className="text-neutral-400">当前上下文：</span>
              <span className="text-orange-600 font-semibold">{context.title}</span>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 h-[calc(100vh-280px)]">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-neutral-400 mb-6">开始与AI对话，获取深度分析</p>
              
              {/* Suggested Questions */}
              <div className="space-y-2">
                <p className="text-xs text-neutral-500 mb-3">试试这些问题：</p>
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(question)}
                    className="w-full text-left px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded text-sm text-neutral-300 hover:text-white transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-orange-600 text-white'
                        : 'bg-neutral-800 text-neutral-200'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    
                    {/* Sources */}
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-neutral-700">
                        <p className="text-xs text-neutral-400 mb-2">引用来源：</p>
                        <div className="space-y-1">
                          {message.sources.map((source, idx) => (
                            <div
                              key={idx}
                              className="text-xs text-orange-400 hover:text-orange-300 cursor-pointer flex items-center gap-1"
                            >
                              <span>•</span>
                              <span>{source.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs opacity-50 mt-2">
                      {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-800 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-neutral-800">
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="text-xs text-neutral-500 hover:text-orange-600 mb-3 transition-colors"
            >
              清空对话
            </button>
          )}
          
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入你的问题..."
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:border-orange-600 transition-colors"
              rows={3}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="px-4 bg-orange-600 hover:bg-orange-700 disabled:bg-neutral-700 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-xs text-neutral-500 mt-2">
            按 Enter 发送，Shift + Enter 换行
          </p>
        </div>
      </div>
    </>
  );
}
