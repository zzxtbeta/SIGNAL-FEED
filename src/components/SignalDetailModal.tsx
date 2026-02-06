import { X, Building2, User, Lightbulb, ExternalLink, MessageSquare, Bookmark, FileText } from 'lucide-react';
import { useState } from 'react';
import { Signal, SignalType } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { mockSignals } from '../mock/signals';

interface SignalDetailModalProps {
  signal: Signal;
  onClose: () => void;
  onOpenChat?: () => void;
}

const priorityConfig = {
  high: {
    color: 'bg-red-600',
    bgColor: 'bg-red-600/20',
    textColor: 'text-red-500',
    borderColor: 'border-red-600/30',
    label: '高',
  },
  mid: {
    color: 'bg-amber-500',
    bgColor: 'bg-amber-500/20',
    textColor: 'text-amber-500',
    borderColor: 'border-amber-500/30',
    label: '中',
  },
  low: {
    color: 'bg-neutral-600',
    bgColor: 'bg-neutral-700/50',
    textColor: 'text-neutral-400',
    borderColor: 'border-neutral-700',
    label: '低',
  },
};

export default function SignalDetailModal({ signal, onClose, onOpenChat }: SignalDetailModalProps) {
  const { addFocusItem, addNote, focusItems } = useAppContext();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeTab, setActiveTab] = useState<SignalType | '全部'>('全部');
  const config = priorityConfig[signal.priority];

  // Get related signals (mock - in real app would come from API)
  const relatedSignals = mockSignals.filter(s => s.id !== signal.id).slice(0, 8);
  
  // Filter related signals by active tab
  const filteredRelatedSignals = activeTab === '全部' 
    ? relatedSignals 
    : relatedSignals.filter(s => s.type === activeTab);

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleAddToFocus = () => {
    // Extract company name from signal (simplified logic)
    const companyName = signal.title.includes('本源量子') ? '本源量子' :
                       signal.title.includes('图灵量子') ? '图灵量子' :
                       signal.title.includes('启科量子') ? '启科量子' :
                       signal.title.includes('国盾量子') ? '国盾量子' :
                       '相关公司';
    
    const focusItem = {
      id: `focus-${Date.now()}`,
      type: 'company' as const,
      name: companyName,
      description: signal.summary.substring(0, 50) + '...',
      signalCount: 1,
      lastUpdate: signal.timestamp,
      tags: [signal.type],
    };

    // Check if already in focus
    if (focusItems.some(f => f.name === companyName)) {
      showToastMessage(`${companyName} 已在关注列表中`);
    } else {
      addFocusItem(focusItem);
      showToastMessage(`已将 ${companyName} 添加到关注列表`);
    }
  };

  const handleAddNote = () => {
    const note = {
      id: `note-${Date.now()}`,
      title: `${signal.title} - 笔记`,
      content: `信号摘要：\n${signal.summary}\n\n我的分析：\n[待补充]`,
      tags: [signal.type, signal.priority === 'high' ? '高优先级' : ''],
      relatedSignals: 1,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    
    addNote(note);
    showToastMessage('已创建笔记，可在"我的笔记"中查看和编辑');
  };

  const handleChatAnalysis = () => {
    onClose();
    if (onOpenChat) {
      onOpenChat();
    }
    showToastMessage('Chat功能开发中，敬请期待');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 p-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-2 py-1 ${config.bgColor} ${config.textColor} text-xs font-bold rounded border ${config.borderColor}`}>
                {config.label}
              </span>
              <span className="px-2 py-1 bg-neutral-800 text-neutral-300 text-xs font-semibold rounded">
                {signal.type}
              </span>
              <span className="text-neutral-500 text-xs">{signal.timestamp}</span>
              <span className="text-neutral-500 text-xs">来源：{signal.source}</span>
            </div>
            <h2 className="text-2xl font-bold">{signal.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-neutral-800 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Why Important - US02 */}
          <div className="bg-gradient-to-r from-orange-600/10 to-red-600/10 border border-orange-600/30 rounded-lg p-4">
            <h3 className="font-semibold text-orange-600 mb-2 flex items-center gap-2">
              <span className="text-lg">⚡</span>
              为什么重要？
            </h3>
            <ul className="space-y-1 text-sm text-neutral-300">
              {signal.priority === 'high' && (
                <>
                  <li>• 融资金额显著高于同类企业</li>
                  <li>• 团队来自已关注的核心研究机构</li>
                  <li>• 与近期政策导向高度相关</li>
                </>
              )}
              {signal.priority === 'mid' && (
                <>
                  <li>• 技术突破具有代表性</li>
                  <li>• 发表在顶级期刊</li>
                  <li>• 可能影响未来技术路线选择</li>
                </>
              )}
              {signal.priority === 'low' && (
                <>
                  <li>• 常规工商变更，无重大影响</li>
                  <li>• 建议持续观察后续动态</li>
                </>
              )}
            </ul>
          </div>

          {/* Summary */}
          <div>
            <h3 className="font-semibold text-lg mb-3">信号摘要</h3>
            <p className="text-neutral-400 leading-relaxed">{signal.summary}</p>
          </div>

          {/* Structured Info */}
          <div>
            <h3 className="font-semibold text-lg mb-3">结构化要点</h3>
            <div className="bg-neutral-800 rounded-lg p-4 space-y-2 text-sm">
              {signal.type === '论文' && (
                <>
                  <div className="flex">
                    <span className="text-neutral-500 w-24">期刊：</span>
                    <span className="text-neutral-200">Nature</span>
                  </div>
                  <div className="flex">
                    <span className="text-neutral-500 w-24">研究机构：</span>
                    <span className="text-neutral-200">中国科学技术大学</span>
                  </div>
                  <div className="flex">
                    <span className="text-neutral-500 w-24">研究方向：</span>
                    <span className="text-neutral-200">拓扑量子纠错</span>
                  </div>
                  <div className="flex">
                    <span className="text-neutral-500 w-24">关键指标：</span>
                    <span className="text-neutral-200">容错阈值 2.1%</span>
                  </div>
                </>
              )}
              {signal.type === '融资事件' && (
                <>
                  <div className="flex">
                    <span className="text-neutral-500 w-24">公司：</span>
                    <span className="text-neutral-200">本源量子（合肥）</span>
                  </div>
                  <div className="flex">
                    <span className="text-neutral-500 w-24">技术路线：</span>
                    <span className="text-neutral-200">超导量子计算</span>
                  </div>
                  <div className="flex">
                    <span className="text-neutral-500 w-24">融资轮次：</span>
                    <span className="text-neutral-200">C轮</span>
                  </div>
                  <div className="flex">
                    <span className="text-neutral-500 w-24">金额：</span>
                    <span className="text-neutral-200">数亿元人民币</span>
                  </div>
                  <div className="flex">
                    <span className="text-neutral-500 w-24">投资方：</span>
                    <span className="text-neutral-200">深创投（领投）、建信股权、中金资本</span>
                  </div>
                </>
              )}
              {signal.type === '技术发布' && (
                <>
                  <div className="flex">
                    <span className="text-neutral-500 w-24">发布方：</span>
                    <span className="text-neutral-200">本源量子</span>
                  </div>
                  <div className="flex">
                    <span className="text-neutral-500 w-24">产品名称：</span>
                    <span className="text-neutral-200">本源司南</span>
                  </div>
                  <div className="flex">
                    <span className="text-neutral-500 w-24">产品类型：</span>
                    <span className="text-neutral-200">量子计算操作系统</span>
                  </div>
                  <div className="flex">
                    <span className="text-neutral-500 w-24">研究方向：</span>
                    <span className="text-neutral-200">拓扑量子纠错</span>
                  </div>
                  <div className="flex">
                    <span className="text-neutral-500 w-24">关键指标：</span>
                    <span className="text-neutral-200">容错阈值 2.1%</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Related Entities */}
          <div>
            <h3 className="font-semibold text-lg mb-3">关联对象</h3>
            <div className="grid grid-cols-3 gap-3">
              {signal.relatedEntities.companies > 0 && (
                <button 
                  onClick={() => alert('跳转到公司详情页（开发中）')}
                  className="bg-neutral-800 rounded-lg p-4 hover:border hover:border-orange-600 transition-all cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-semibold">公司</span>
                  </div>
                  <div className="text-xs text-neutral-400">{signal.relatedEntities.companies} 家</div>
                </button>
              )}
              {signal.relatedEntities.people > 0 && (
                <button 
                  onClick={() => alert('跳转到人物详情页（开发中）')}
                  className="bg-neutral-800 rounded-lg p-4 hover:border hover:border-orange-600 transition-all cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-semibold">关键人物</span>
                  </div>
                  <div className="text-xs text-neutral-400">{signal.relatedEntities.people} 人</div>
                </button>
              )}
              {signal.relatedEntities.technologies > 0 && (
                <button 
                  onClick={() => alert('跳转到知识地图（开发中）')}
                  className="bg-neutral-800 rounded-lg p-4 hover:border hover:border-orange-600 transition-all cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-semibold">相关技术</span>
                  </div>
                  <div className="text-xs text-neutral-400">{signal.relatedEntities.technologies} 条</div>
                </button>
              )}
            </div>
          </div>

          {/* Related Signals with Tabs */}
          <div>
            <h3 className="font-semibold text-lg mb-3">相关信号</h3>
            
            {/* Signal Type Tabs */}
            <div className="flex gap-2 mb-3 overflow-x-auto">
              <button 
                onClick={() => setActiveTab('全部')}
                className={`px-3 py-1.5 text-xs font-semibold rounded whitespace-nowrap transition-colors ${
                  activeTab === '全部' 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                }`}
              >
                全部 ({relatedSignals.length})
              </button>
              <button 
                onClick={() => setActiveTab('论文')}
                className={`px-3 py-1.5 text-xs font-semibold rounded whitespace-nowrap transition-colors ${
                  activeTab === '论文' 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                }`}
              >
                论文 ({relatedSignals.filter(s => s.type === '论文').length})
              </button>
              <button 
                onClick={() => setActiveTab('政策规划')}
                className={`px-3 py-1.5 text-xs font-semibold rounded whitespace-nowrap transition-colors ${
                  activeTab === '政策规划' 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                }`}
              >
                政策规划 ({relatedSignals.filter(s => s.type === '政策规划').length})
              </button>
              <button 
                onClick={() => setActiveTab('融资事件')}
                className={`px-3 py-1.5 text-xs font-semibold rounded whitespace-nowrap transition-colors ${
                  activeTab === '融资事件' 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                }`}
              >
                融资事件 ({relatedSignals.filter(s => s.type === '融资事件').length})
              </button>
              <button 
                onClick={() => setActiveTab('产业化进展')}
                className={`px-3 py-1.5 text-xs font-semibold rounded whitespace-nowrap transition-colors ${
                  activeTab === '产业化进展' 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                }`}
              >
                产业化进展 ({relatedSignals.filter(s => s.type === '产业化进展').length})
              </button>
              <button 
                onClick={() => setActiveTab('技术发布')}
                className={`px-3 py-1.5 text-xs font-semibold rounded whitespace-nowrap transition-colors ${
                  activeTab === '技术发布' 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                }`}
              >
                技术发布 ({relatedSignals.filter(s => s.type === '技术发布').length})
              </button>
              <button 
                onClick={() => setActiveTab('人才组织')}
                className={`px-3 py-1.5 text-xs font-semibold rounded whitespace-nowrap transition-colors ${
                  activeTab === '人才组织' 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                }`}
              >
                人才组织 ({relatedSignals.filter(s => s.type === '人才组织').length})
              </button>
            </div>

            {/* Related Signals List */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filteredRelatedSignals.length > 0 ? (
                filteredRelatedSignals.map((relatedSignal) => (
                  <button 
                    key={relatedSignal.id}
                    onClick={() => {
                      onClose();
                      // In real app, would open this signal's detail
                      setTimeout(() => alert(`查看信号: ${relatedSignal.title}`), 100);
                    }}
                    className="w-full bg-neutral-800 rounded p-3 hover:bg-neutral-700 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold line-clamp-1">{relatedSignal.title}</span>
                      <span className="text-xs text-neutral-500 ml-2 whitespace-nowrap">{relatedSignal.timestamp}</span>
                    </div>
                    <div className="text-xs text-neutral-400">
                      {relatedSignal.type} · {relatedSignal.priority === 'high' ? '高' : relatedSignal.priority === 'mid' ? '中' : '低'}优先级
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-6 text-neutral-500 text-sm">
                  暂无 {activeTab} 类型的相关信号
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-neutral-800">
            <button 
              onClick={handleAddNote}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 rounded font-semibold transition-colors"
            >
              <FileText className="w-4 h-4" />
              记录为笔记
            </button>
            <button 
              onClick={handleAddToFocus}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded font-semibold transition-colors"
            >
              <Bookmark className="w-4 h-4" />
              加入关注
            </button>
            <button 
              onClick={handleChatAnalysis}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded font-semibold transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Chat 分析
            </button>
          </div>

          {/* Original Source */}
          <div className="pt-4 border-t border-neutral-800">
            <a
              href="#"
              className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-500 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              查看原文链接
            </a>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[110] animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-neutral-800 border border-neutral-700 rounded-lg px-6 py-3 shadow-2xl flex items-center gap-3">
            <div className="w-1 h-8 bg-orange-600 rounded-full"></div>
            <p className="text-sm text-neutral-200">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
