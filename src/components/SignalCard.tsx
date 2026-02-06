import { Building2, User, Lightbulb, Bookmark } from 'lucide-react';
import { Signal } from '../types';

interface SignalCardProps {
  signal: Signal;
  onClick?: () => void;
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

export default function SignalCard({ signal, onClick }: SignalCardProps) {
  const config = priorityConfig[signal.priority];

  return (
    <article
      onClick={onClick}
      className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden hover:border-orange-600 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex">
        <div className={`w-1 ${config.color}`} />
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <span
                className={`px-2 py-1 ${config.bgColor} ${config.textColor} text-xs font-bold rounded border ${config.borderColor}`}
              >
                {config.label}
              </span>
              <span className="px-2 py-1 bg-neutral-800 text-neutral-300 text-xs font-semibold rounded">
                {signal.type}
              </span>
              <span className="text-neutral-500 text-xs">{signal.timestamp}</span>
            </div>
            <button className="text-neutral-500 hover:text-orange-600 transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-xl font-bold mb-2 group-hover:text-orange-600 transition-colors">
            {signal.title}
          </h3>
          <p className="text-neutral-400 text-sm mb-4 leading-relaxed">{signal.summary}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {signal.relatedEntities.companies} 家公司
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {signal.relatedEntities.people} 位人物
              </span>
              <span className="flex items-center gap-1">
                <Lightbulb className="w-4 h-4" />
                {signal.relatedEntities.technologies} 条技术
              </span>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded transition-colors">
                查看详情
              </button>
              <button className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded transition-colors">
                Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
