import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SignalCard from '../components/SignalCard';
import SignalDetailModal from '../components/SignalDetailModal';
import { useSignals } from '../hooks/useSignals';
import { Signal, SignalType } from '../types';

const signalTypes: (SignalType | '全部')[] = ['全部', '论文', '政策规划', '融资事件', '产业化进展', '技术发布', '人才组织'];

export default function SignalFeed() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const { signals, loading, filters, updateFilters } = useSignals({
    type: '全部',
    priority: 'all',
    timeRange: '7',
  });

  // Filter signals by search query
  const filteredSignals = searchQuery
    ? signals.filter(signal =>
        signal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        signal.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        signal.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : signals;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="font-display text-5xl text-orange-600 mb-2">SIGNAL FEED</h1>
        <p className="text-neutral-400 text-sm">
          {searchQuery ? (
            <>搜索 "{searchQuery}" · 找到 {filteredSignals.length} 条信号</>
          ) : (
            <>实时追踪量子科技领域的关键信号 · 共 {signals.length} 条信号</>
          )}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 sticky top-24 z-40 backdrop-blur-xl bg-neutral-900/80">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-2 flex-wrap">
            {signalTypes.map((type) => (
              <button
                key={type}
                onClick={() => updateFilters({ type })}
                className={`px-4 py-2 rounded font-medium text-sm cursor-pointer transition-all duration-200 ${
                  filters.type === type
                    ? 'bg-orange-600 text-white font-semibold shadow-lg shadow-orange-600/20'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white'
                }`}
              >
                {type}
                {type !== '全部' && (
                  <span className="ml-2 text-xs opacity-70">
                    ({signals.filter(s => s.type === type).length})
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <select
              value={filters.timeRange || '7'}
              onChange={(e) => updateFilters({ timeRange: e.target.value as '7' | '30' | '90' })}
              className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm font-medium cursor-pointer hover:border-orange-600 transition-colors focus:outline-none focus:border-orange-600"
            >
              <option value="7">最近 7 天</option>
              <option value="30">最近 30 天</option>
              <option value="90">最近 90 天</option>
            </select>
            <select
              value={filters.priority || 'all'}
              onChange={(e) => updateFilters({ priority: e.target.value as any })}
              className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm font-medium cursor-pointer hover:border-orange-600 transition-colors focus:outline-none focus:border-orange-600"
            >
              <option value="all">优先级：全部</option>
              <option value="high">高优先级 ({signals.filter(s => s.priority === 'high').length})</option>
              <option value="mid">中优先级 ({signals.filter(s => s.priority === 'mid').length})</option>
              <option value="low">低优先级 ({signals.filter(s => s.priority === 'low').length})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Signal Feed */}
      {loading ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-12 text-center">
          <div className="inline-block w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-400 mt-4">加载中...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSignals.length > 0 ? (
            <>
              {filteredSignals.map((signal, index) => (
                <div
                  key={signal.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <SignalCard 
                    signal={signal} 
                    onClick={() => setSelectedSignal(signal)}
                  />
                </div>
              ))}
              
              {/* Load More Hint */}
              <div className="text-center py-8">
                <p className="text-neutral-500 text-sm">
                  已显示全部 {filteredSignals.length} 条信号
                </p>
              </div>
            </>
          ) : (
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-neutral-400 text-lg mb-2">
                {searchQuery ? `没有找到包含 "${searchQuery}" 的信号` : '暂无符合条件的信号'}
              </p>
              <p className="text-neutral-500 text-sm">
                {searchQuery ? '尝试使用其他关键词搜索' : '尝试调整筛选条件或时间范围'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Signal Detail Modal */}
      {selectedSignal && (
        <SignalDetailModal
          signal={selectedSignal}
          onClose={() => setSelectedSignal(null)}
        />
      )}
    </div>
  );
}
