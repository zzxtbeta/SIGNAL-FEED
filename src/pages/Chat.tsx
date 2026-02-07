import { useState } from 'react';
import { useLayout } from '../contexts/LayoutContext';
import { X, Send, Paperclip } from 'lucide-react';

export default function Chat() {
  const { chatReferences, removeChatReference } = useLayout();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;
    // TODO: 发送消息逻辑
    console.log('Send message:', message, 'with references:', chatReferences);
    setMessage('');
  };

  return (
    <div className="h-full flex flex-col bg-neutral-900">
      {/* Header */}
      <div className="p-6 border-b border-neutral-800">
        <h2 className="font-display text-2xl text-orange-600">GRAVITY</h2>
        <p className="text-sm text-neutral-400 mt-1">认知引擎 · 大模型助力分析</p>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-neutral-800">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors text-left">
            总结当前页面信号趋势
          </button>
          <button className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors text-left">
            全球量子计算发展如何?
          </button>
          <button className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors text-left">
            量子通信现在处于什么阶段?
          </button>
          <button className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors text-left">
            中国量子计算实力如何?
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center text-white text-sm font-bold">
            AI
          </div>
          <div className="flex-1 bg-neutral-800 rounded-lg p-4">
            <p className="text-sm text-neutral-300">
              你好！我是GRAVITY认知引擎。你可以拖拽信号、标的、笔记到这里，我会基于这些内容为你提供深度分析。
            </p>
          </div>
        </div>
      </div>

      {/* References */}
      {chatReferences.length > 0 && (
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-900/50">
          <div className="text-xs text-neutral-500 mb-2 flex items-center gap-2">
            <Paperclip className="w-3 h-3" />
            引用内容 ({chatReferences.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {chatReferences.map((ref) => (
              <div
                key={`${ref.type}-${ref.id}`}
                className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 rounded-full text-xs group"
              >
                <span className="text-orange-600 font-semibold">
                  {ref.type === 'signal' ? '信号' : ref.type === 'candidate' ? '标的' : '笔记'}
                </span>
                <span className="text-neutral-300 max-w-[150px] truncate">{ref.title}</span>
                <button
                  onClick={() => removeChatReference(ref.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-neutral-500 hover:text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-neutral-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入问题... (⌘ Enter 换行 | Enter 发送)"
            className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-600 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-neutral-700 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-neutral-500 mt-2">
          ⌘ Enter 换行 · Enter 发送
        </p>
      </div>
    </div>
  );
}
