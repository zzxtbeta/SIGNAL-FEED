import { Star, Building2, User, Lightbulb, Plus, Bell, TrendingUp, GripVertical } from 'lucide-react';
import { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useLayout } from '../contexts/LayoutContext';

export default function MyFocus() {
  const { focusItems } = useAppContext();
  const { setDraggedItem, isChatOpen } = useLayout();
  const [activeTab, setActiveTab] = useState<'all' | 'company' | 'person' | 'technology'>('all');

  const filteredItems = activeTab === 'all' 
    ? focusItems 
    : focusItems.filter(item => item.type === activeTab);

  const getIcon = (type: string) => {
    switch (type) {
      case 'company':
        return <Building2 className="w-5 h-5" />;
      case 'person':
        return <User className="w-5 h-5" />;
      case 'technology':
        return <Lightbulb className="w-5 h-5" />;
      default:
        return <Star className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'company':
        return '公司';
      case 'person':
        return '人物';
      case 'technology':
        return '技术';
      default:
        return '';
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="font-display text-5xl text-orange-600 mb-2">MY FOCUS</h1>
        <p className="text-neutral-400 text-sm">
          我的关注列表 · {focusItems.length} 个关注对象
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded font-medium text-sm transition-all ${
              activeTab === 'all'
                ? 'bg-orange-600 text-white'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            全部 ({focusItems.length})
          </button>
          <button
            onClick={() => setActiveTab('company')}
            className={`px-4 py-2 rounded font-medium text-sm transition-all ${
              activeTab === 'company'
                ? 'bg-orange-600 text-white'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            公司 ({focusItems.filter(i => i.type === 'company').length})
          </button>
          <button
            onClick={() => setActiveTab('person')}
            className={`px-4 py-2 rounded font-medium text-sm transition-all ${
              activeTab === 'person'
                ? 'bg-orange-600 text-white'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            人物 ({focusItems.filter(i => i.type === 'person').length})
          </button>
          <button
            onClick={() => setActiveTab('technology')}
            className={`px-4 py-2 rounded font-medium text-sm transition-all ${
              activeTab === 'technology'
                ? 'bg-orange-600 text-white'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            技术 ({focusItems.filter(i => i.type === 'technology').length})
          </button>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded font-semibold text-sm transition-colors">
          <Plus className="w-4 h-4" />
          添加关注
        </button>
      </div>

      {/* Focus Items */}
      <div className="space-y-4">
        {filteredItems.map((item, index) => {
          const handleDragStart = (e: React.DragEvent) => {
            setDraggedItem({
              type: item.type === 'company' ? 'candidate' : 'note',
              id: item.id,
              title: item.name,
              summary: item.description,
            });
            e.dataTransfer.effectAllowed = 'copy';
          };

          const handleDragEnd = () => {
            setDraggedItem(null);
          };

          return (
            <div
              key={item.id}
              draggable={isChatOpen}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              className={`bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-orange-600 transition-all duration-200 animate-in fade-in slide-in-from-bottom-4 relative ${
                isChatOpen ? 'cursor-grab active:cursor-grabbing' : ''
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {isChatOpen && (
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-4 h-4 text-neutral-500" />
                </div>
              )}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded flex items-center justify-center flex-shrink-0 text-white">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <span className="px-2 py-0.5 bg-neutral-800 text-neutral-400 text-xs rounded">
                      {getTypeLabel(item.type)}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400 mb-3">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-neutral-800 text-neutral-400 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button className="text-orange-600 hover:text-orange-500 transition-colors">
                <Star className="w-5 h-5 fill-current" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
              <div className="flex items-center gap-4 text-xs text-neutral-500">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {item.signalCount} 条新信号
                </span>
                <span>最后更新：{item.lastUpdate}</span>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded transition-colors flex items-center gap-1">
                  <Bell className="w-3 h-3" />
                  提醒设置
                </button>
                <button className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded transition-colors">
                  查看详情
                </button>
              </div>
            </div>
          </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">⭐</div>
          <p className="text-neutral-400 text-lg mb-2">还没有关注任何对象</p>
          <p className="text-neutral-500 text-sm mb-6">
            从信号流、知识地图或候选标的中添加关注
          </p>
          <button className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded font-semibold transition-colors">
            开始添加关注
          </button>
        </div>
      )}
    </div>
  );
}
