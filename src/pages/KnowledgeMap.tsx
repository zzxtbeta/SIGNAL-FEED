import { useState, useMemo } from 'react';
import { useDomains } from '../hooks/useDomains';
import { TechNode } from '../types';
import { TrendingUp, TrendingDown, Minus, ChevronRight, ChevronDown, BookOpen, Calendar, Users, Building2 } from 'lucide-react';

const trendIcons = {
  rising: <TrendingUp className="w-4 h-4 text-red-500" />,
  stable: <Minus className="w-4 h-4 text-neutral-400" />,
  declining: <TrendingDown className="w-4 h-4 text-neutral-500" />,
  early: <Minus className="w-4 h-4 text-neutral-400" />,
};

const trendLabels = {
  rising: '🔥 上升',
  stable: '→ 稳定',
  declining: '↘ 下降',
  early: '→ 早期',
};

const stageProgress = {
  '理论研究': 20,
  '实验室阶段': 40,
  '工程化早期': 60,
  '工程化': 70,
  '商业化早期': 85,
  '商业化': 95,
};

export default function KnowledgeMap() {
  const { domains, loading } = useDomains();
  const [selectedNode, setSelectedNode] = useState<TechNode | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    'quantum-computing',
    'quantum-communication',
  ]);
  const [selectedYear, setSelectedYear] = useState<string>('2026');

  // Mock论文数据 - 实际应该从API获取
  const mockPapers = [
    {
      id: 'p1',
      title: '基于拓扑保护的量子纠错新方案',
      journal: 'Nature',
      date: '2026-02-04',
      authors: ['潘建伟', '陆朝阳'],
      institution: '中国科学技术大学',
      keyMetrics: '容错阈值 2.1%',
      breakthrough: '提出新型拓扑量子纠错方案，容错阈值提升至2.1%',
      relatedCompanies: ['本源量子'],
      techArea: '超导量子计算',
    },
    {
      id: 'p2',
      title: '32离子高保真度量子纠缠实现',
      journal: 'Science',
      date: '2026-01-31',
      authors: ['段路明'],
      institution: '清华大学',
      keyMetrics: '保真度 99.5%',
      breakthrough: '实现32个离子的高保真度量子纠缠，创造新纪录',
      relatedCompanies: [],
      techArea: '离子阱量子计算',
    },
    {
      id: 'p3',
      title: '室温量子传感灵敏度突破',
      journal: 'Physical Review Letters',
      date: '2026-01-23',
      authors: ['俞大鹏'],
      institution: '南方科技大学',
      keyMetrics: '灵敏度 1 pT/√Hz',
      breakthrough: '利用金刚石NV色心实现室温高灵敏度磁场传感',
      relatedCompanies: [],
      techArea: '量子传感',
    },
    {
      id: 'p4',
      title: '量子态长时间存储新纪录',
      journal: 'Nature Communications',
      date: '2026-01-19',
      authors: ['龙桂鲁'],
      institution: '北京大学',
      keyMetrics: '存储时间 1秒',
      breakthrough: '实现量子态在固态系统中1秒存储，提升100倍',
      relatedCompanies: [],
      techArea: '量子存储',
    },
  ];

  const categories = useMemo(() => 
    domains.filter((n) => n.type === 'category'),
    [domains]
  );

  const routes = useMemo(() => 
    domains.filter((n) => n.type === 'route'),
    [domains]
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // 默认选中第一个技术路线
  const defaultNode = useMemo(() => {
    if (!selectedNode && routes.length > 0) {
      return routes.find((r) => r.id === 'superconducting') || routes[0];
    }
    return selectedNode;
  }, [selectedNode, routes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-400">加载知识地图...</p>
        </div>
      </div>
    );
  }

  const currentNode = defaultNode;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-display text-5xl text-orange-600 mb-2">QUANTUM TECH MAP</h1>
        <p className="text-neutral-400 text-sm">
          量子科技知识地图 · {routes.length} 条技术路线 · {categories.length} 个技术板块
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Tree View */}
        <div className="col-span-5 bg-neutral-900 border border-neutral-800 rounded-lg p-6 h-[calc(100vh-16rem)] overflow-y-auto">
          <h2 className="font-display text-2xl text-orange-600 mb-6 sticky top-0 bg-neutral-900 pb-2">
            技术板块
          </h2>

          <div className="space-y-4">
            {categories.map((category) => {
              const categoryRoutes = routes.filter((r) => r.parentId === category.id);
              const isExpanded = expandedCategories.includes(category.id);
              
              return (
                <div key={category.id} className="border-l-2 border-neutral-700 pl-4">
                  <div
                    onClick={() => toggleCategory(category.id)}
                    className="font-bold text-lg mb-3 cursor-pointer hover:text-orange-600 transition-colors flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-2">
                      {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      {category.name}
                    </span>
                    <span className="text-sm text-neutral-500 group-hover:text-orange-600">
                      {categoryRoutes.length} 条路线
                    </span>
                  </div>
                  
                  {isExpanded && (
                    <div className="ml-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      {categoryRoutes.map((route) => (
                        <div
                          key={route.id}
                          onClick={() => setSelectedNode(route)}
                          className={`p-3 rounded cursor-pointer border-l-4 transition-all duration-200 ${
                            currentNode?.id === route.id
                              ? 'border-red-600 bg-neutral-800 shadow-lg'
                              : 'border-neutral-600 hover:border-orange-600 hover:bg-neutral-800/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-sm">{route.name}</span>
                            <span className="text-xs flex items-center gap-1">
                              {trendIcons[route.trend]}
                            </span>
                          </div>
                          <div className="text-xs text-neutral-400 flex items-center justify-between">
                            <span>{route.stage}</span>
                            <span>{route.signalCount} 条信号</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="col-span-7 bg-neutral-900 border border-neutral-800 rounded-lg p-6 h-[calc(100vh-16rem)] overflow-y-auto">
          {currentNode ? (
            <>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
                <h2 className="font-display text-3xl text-orange-600">{currentNode.name}</h2>
                <span className="px-3 py-1 bg-red-600/20 text-red-500 text-sm font-bold rounded border border-red-600/30 flex items-center gap-2">
                  {trendIcons[currentNode.trend]}
                  {trendLabels[currentNode.trend]}
                </span>
              </div>

              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-orange-600">技术简介</h3>
                  <p className="text-neutral-400 leading-relaxed">{currentNode.description}</p>
                </div>

                {/* Maturity */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-orange-600">技术成熟度</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-3 bg-neutral-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-600 to-red-600 transition-all duration-500"
                          style={{ width: `${stageProgress[currentNode.stage as keyof typeof stageProgress] || 50}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-orange-600 min-w-[120px]">
                        {currentNode.stage}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>理论研究</span>
                      <span>实验室</span>
                      <span>工程化</span>
                      <span>商业化</span>
                    </div>
                  </div>
                </div>

                {/* Academic Progress Timeline */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg text-orange-600 flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      学术进展时间线
                    </h3>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="bg-neutral-800 border border-neutral-700 rounded px-3 py-1.5 text-sm font-medium cursor-pointer hover:border-orange-600 transition-colors focus:outline-none focus:border-orange-600"
                    >
                      <option value="2026">2026年</option>
                      <option value="2025">2025年</option>
                      <option value="2024">2024年</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    {mockPapers.map((paper, index) => (
                      <div
                        key={paper.id}
                        className="relative pl-8 pb-4 border-l-2 border-neutral-700 last:border-l-0 last:pb-0 animate-in fade-in slide-in-from-left-4"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* Timeline dot */}
                        <div className="absolute left-[-9px] top-0 w-4 h-4 bg-orange-600 rounded-full border-4 border-neutral-900"></div>
                        
                        <div className="bg-neutral-800 rounded-lg p-4 hover:bg-neutral-700 transition-all cursor-pointer group">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 bg-red-600/20 text-red-500 text-xs font-bold rounded border border-red-600/30">
                                  {paper.journal}
                                </span>
                                <span className="text-xs text-neutral-500 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {paper.date}
                                </span>
                              </div>
                              <h4 className="font-semibold text-sm group-hover:text-orange-600 transition-colors">
                                {paper.title}
                              </h4>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="space-y-2 text-xs">
                            <div className="flex items-start gap-2">
                              <Users className="w-3 h-3 text-neutral-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-neutral-400">作者：</span>
                                <span className="text-neutral-300">{paper.authors.join('、')}</span>
                                <span className="text-neutral-500 ml-2">({paper.institution})</span>
                              </div>
                            </div>

                            <div className="bg-neutral-900 rounded p-2">
                              <div className="text-neutral-400 mb-1">关键突破：</div>
                              <div className="text-neutral-300">{paper.breakthrough}</div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-neutral-400">关键指标：</span>
                              <span className="px-2 py-0.5 bg-orange-600/20 text-orange-600 rounded font-semibold">
                                {paper.keyMetrics}
                              </span>
                            </div>

                            {paper.relatedCompanies.length > 0 && (
                              <div className="flex items-start gap-2">
                                <Building2 className="w-3 h-3 text-neutral-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="text-neutral-400">关联公司：</span>
                                  <span className="text-neutral-300">{paper.relatedCompanies.join('、')}</span>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <span className="text-neutral-400">技术领域：</span>
                              <span className="text-neutral-300">{paper.techArea}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Statistics */}
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="bg-neutral-800 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-1">{mockPapers.length}</div>
                      <div className="text-xs text-neutral-400">顶刊论文</div>
                    </div>
                    <div className="bg-neutral-800 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-1">
                        {new Set(mockPapers.flatMap(p => p.authors)).size}
                      </div>
                      <div className="text-xs text-neutral-400">核心作者</div>
                    </div>
                    <div className="bg-neutral-800 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-1">
                        {new Set(mockPapers.map(p => p.institution)).size}
                      </div>
                      <div className="text-xs text-neutral-400">研究机构</div>
                    </div>
                  </div>
                </div>

                {/* Key Problems */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-orange-600">关键问题</h3>
                  <div className="space-y-2">
                    <div className="bg-neutral-800 rounded p-3 text-sm hover:bg-neutral-700 transition-colors">
                      <span className="text-orange-600 font-semibold">•</span> 量子比特相干时间提升
                    </div>
                    <div className="bg-neutral-800 rounded p-3 text-sm hover:bg-neutral-700 transition-colors">
                      <span className="text-orange-600 font-semibold">•</span> 量子纠错码实现
                    </div>
                    <div className="bg-neutral-800 rounded p-3 text-sm hover:bg-neutral-700 transition-colors">
                      <span className="text-orange-600 font-semibold">•</span> 大规模量子芯片集成
                    </div>
                  </div>
                </div>

                {/* Related Companies */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-orange-600">
                    关联公司 ({currentNode.companyCount})
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-neutral-800 rounded p-3 hover:border hover:border-orange-600 transition-all cursor-pointer group">
                      <div className="font-semibold text-sm mb-1 group-hover:text-orange-600 transition-colors">
                        本源量子
                      </div>
                      <div className="text-xs text-neutral-400">合肥 · C轮</div>
                    </div>
                    <div className="bg-neutral-800 rounded p-3 hover:border hover:border-orange-600 transition-all cursor-pointer group">
                      <div className="font-semibold text-sm mb-1 group-hover:text-orange-600 transition-colors">
                        国盾量子
                      </div>
                      <div className="text-xs text-neutral-400">合肥 · 上市</div>
                    </div>
                    <div className="bg-neutral-800 rounded p-3 hover:border hover:border-orange-600 transition-all cursor-pointer group">
                      <div className="font-semibold text-sm mb-1 group-hover:text-orange-600 transition-colors">
                        启科量子
                      </div>
                      <div className="text-xs text-neutral-400">北京 · A轮</div>
                    </div>
                  </div>
                </div>

                {/* Related Signals */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-orange-600">
                    关联信号 ({currentNode.signalCount})
                  </h3>
                  <div className="space-y-2">
                    <div className="bg-neutral-800 rounded p-3 hover:bg-neutral-700 transition-colors cursor-pointer group">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold group-hover:text-orange-600 transition-colors">
                          本源量子完成C轮融资
                        </span>
                        <span className="text-xs text-neutral-500">2026-02-01</span>
                      </div>
                      <div className="text-xs text-neutral-400">融资 · 高优先级</div>
                    </div>
                    <div className="bg-neutral-800 rounded p-3 hover:bg-neutral-700 transition-colors cursor-pointer group">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold group-hover:text-orange-600 transition-colors">
                          Nature：新型拓扑量子纠错码突破
                        </span>
                        <span className="text-xs text-neutral-500">2026-01-29</span>
                      </div>
                      <div className="text-xs text-neutral-400">论文 · 高优先级</div>
                    </div>
                  </div>
                  <button className="w-full mt-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-sm font-semibold transition-colors hover:text-orange-600">
                    查看全部 {currentNode.signalCount} 条信号 →
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-500">
              <div className="text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <p>请从左侧选择一个技术路线</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
