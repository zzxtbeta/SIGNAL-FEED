import { useState } from 'react';
import { useCandidates } from '../hooks/useCandidates';
import { Building2, MapPin, TrendingUp, Star } from 'lucide-react';

export default function Candidates() {
  const { candidates, loading, updateFilters } = useCandidates();
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedTechRoute, setSelectedTechRoute] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'signalCount' | 'recent'>('signalCount');

  const locations = ['all', '合肥', '北京', '上海', '深圳', '杭州'];
  const techRoutes = ['all', '超导量子计算', '光量子计算', '量子通信', '量子传感', '量子软件'];

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    updateFilters({ location: location === 'all' ? undefined : location });
  };

  const handleTechRouteChange = (route: string) => {
    setSelectedTechRoute(route);
    updateFilters({ techRoute: route === 'all' ? undefined : route });
  };

  const handleSortChange = (sort: 'signalCount' | 'recent') => {
    setSortBy(sort);
    updateFilters({ sortBy: sort });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="font-display text-5xl text-orange-600 mb-2">CANDIDATES</h1>
        <p className="text-neutral-400 text-sm">
          AI推荐的潜在投资标的 · 共 {candidates.length} 家公司
        </p>
      </div>

      {/* Filters */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Location Filter */}
          <div>
            <label className="text-xs text-neutral-500 mb-2 block">地区筛选</label>
            <div className="flex flex-wrap gap-2">
              {locations.map((location) => (
                <button
                  key={location}
                  onClick={() => handleLocationChange(location)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                    selectedLocation === location
                      ? 'bg-orange-600 text-white'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {location === 'all' ? '全部' : location}
                </button>
              ))}
            </div>
          </div>

          {/* Tech Route Filter */}
          <div>
            <label className="text-xs text-neutral-500 mb-2 block">技术路线</label>
            <select
              value={selectedTechRoute}
              onChange={(e) => handleTechRouteChange(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm font-medium cursor-pointer hover:border-orange-600 transition-colors focus:outline-none focus:border-orange-600"
            >
              {techRoutes.map((route) => (
                <option key={route} value={route}>
                  {route === 'all' ? '全部路线' : route}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="text-xs text-neutral-500 mb-2 block">排序方式</label>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as 'signalCount' | 'recent')}
              className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm font-medium cursor-pointer hover:border-orange-600 transition-colors focus:outline-none focus:border-orange-600"
            >
              <option value="signalCount">信号数量（多→少）</option>
              <option value="recent">最近更新</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidates List */}
      {loading ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-12 text-center">
          <div className="inline-block w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-400 mt-4">加载中...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {candidates.length > 0 ? (
            candidates.map((candidate, index) => (
              <div
                key={candidate.id}
                className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-orange-600 transition-all duration-200 cursor-pointer group animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-orange-600 transition-colors">
                        {candidate.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                        <MapPin className="w-3 h-3" />
                        {candidate.location}
                        {candidate.fundingRound && (
                          <>
                            <span>·</span>
                            <span>{candidate.fundingRound}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <button className="text-neutral-500 hover:text-orange-600 transition-colors">
                    <Star className="w-5 h-5" />
                  </button>
                </div>

                {/* Tech Route */}
                <div className="mb-4">
                  <span className="px-2 py-1 bg-orange-600/20 text-orange-500 text-xs font-semibold rounded border border-orange-600/30">
                    {candidate.techRoute}
                  </span>
                  {candidate.stage && (
                    <span className="ml-2 px-2 py-1 bg-neutral-800 text-neutral-400 text-xs font-medium rounded">
                      {candidate.stage}
                    </span>
                  )}
                </div>

                {/* Description */}
                {candidate.description && (
                  <p className="text-sm text-neutral-400 mb-4 line-clamp-2">
                    {candidate.description}
                  </p>
                )}

                {/* Reasons */}
                <div className="mb-4">
                  <div className="text-xs text-neutral-500 mb-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    推荐原因
                  </div>
                  <div className="space-y-1">
                    {candidate.reasons.map((reason, idx) => (
                      <div key={idx} className="text-xs text-neutral-400 flex items-start gap-2">
                        <span className="text-orange-600 mt-0.5">•</span>
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                  <div className="text-xs text-neutral-500">
                    {candidate.signalCount} 条相关信号
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded transition-colors">
                      查看详情
                    </button>
                    <button className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded transition-colors">
                      加入关注
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 bg-neutral-900 border border-neutral-800 rounded-lg p-12 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-neutral-400 text-lg mb-2">暂无符合条件的候选标的</p>
              <p className="text-neutral-500 text-sm">尝试调整筛选条件</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
