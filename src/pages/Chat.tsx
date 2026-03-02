import { useState } from 'react';
import { useLayout } from '../contexts/LayoutContext';
import { X, Send, Paperclip, Sparkles } from 'lucide-react';

export default function Chat() {
  const { chatReferences, removeChatReference } = useLayout();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;
    console.log('Send message:', message, 'with references:', chatReferences);
    setMessage('');
  };

  return (
    <div className="h-full flex flex-col bg-[rgba(5,5,14,0.92)] backdrop-blur-2xl border-l border-[rgba(59,130,246,0.12)]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[rgba(59,130,246,0.12)]">
        <div className="flex items-center gap-2.5 mb-0.5">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <h2 className="font-display text-xl text-shimmer tracking-widest">GRAVITY</h2>
        </div>
        <p className="text-xs text-[#8892aa] pl-9">认知引擎 · 大模型助力分析</p>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-[rgba(59,130,246,0.08)]">
        <p className="text-[10px] text-[#8892aa] uppercase tracking-widest mb-2 font-medium">快速提问</p>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          {[
            '总结当前页面信号趋势',
            '全球量子计算发展如何?',
            '量子通信现在处于什么阶段?',
            '中国量子计算实力如何?',
          ].map((q) => (
            <button
              key={q}
              className="p-2.5 bg-[rgba(59,130,246,0.06)] border border-[rgba(59,130,246,0.12)] hover:bg-[rgba(59,130,246,0.12)] hover:border-blue-500/30 rounded-md transition-all text-left text-[#8892aa] hover:text-[#c8d4f0] leading-snug"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
            AI
          </div>
          <div className="flex-1 bg-[rgba(59,130,246,0.06)] border border-[rgba(59,130,246,0.12)] rounded-xl px-4 py-3">
            <p className="text-sm text-[#c8d4f0] leading-relaxed">
              你好！我是 GRAVITY 认知引擎。你可以拖拽信号、标的、笔记到这里，我会基于这些内容为你提供深度分析。
            </p>
          </div>
        </div>
      </div>

      {/* References */}
      {chatReferences.length > 0 && (
        <div className="px-4 py-3 border-t border-[rgba(59,130,246,0.1)] bg-[rgba(10,10,24,0.6)]">
          <div className="text-[10px] text-[#8892aa] mb-2 flex items-center gap-1.5 uppercase tracking-widest">
            <Paperclip className="w-3 h-3" />
            引用内容 ({chatReferences.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {chatReferences.map((ref) => (
              <div
                key={`${ref.type}-${ref.id}`}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-[rgba(59,130,246,0.08)] border border-[rgba(59,130,246,0.18)] rounded-full text-xs group"
              >
                <span className="text-blue-400 font-semibold">
                  {ref.type === 'signal' ? '信号' : ref.type === 'candidate' ? '标的' : '笔记'}
                </span>
                <span className="text-[#c8d4f0] max-w-[120px] truncate">{ref.title}</span>
                <button
                  onClick={() => removeChatReference(ref.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-0.5"
                >
                  <X className="w-3 h-3 text-[#8892aa] hover:text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-[rgba(59,130,246,0.12)]">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入问题..."
            className="flex-1 bg-[rgba(16,16,31,0.8)] border border-[rgba(59,130,246,0.18)] rounded-lg px-4 py-2.5 text-sm text-[#e0e8ff] placeholder:text-[#8892aa] focus:outline-none focus:border-blue-500/50 focus:shadow-glow-sm transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="btn-glow px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-[rgba(59,130,246,0.1)] disabled:cursor-not-allowed rounded-lg transition-all shadow-glow-sm disabled:shadow-none"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-[10px] text-[#8892aa] mt-2 text-center">⌘ Enter 换行 · Enter 发送</p>
      </div>
    </div>
  );
}
