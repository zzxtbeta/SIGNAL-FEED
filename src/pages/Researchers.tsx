import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, GraduationCap, Mail, FileText, X, Users } from 'lucide-react';
import { useResearchers } from '../hooks/useResearchers';
import { Researcher, Institution, TitleLevel, INSTITUTION_CONFIG, TITLE_CONFIG } from '../types/people';
import ResearcherCard from '../components/researcher/ResearcherCard';
import ResearcherDetailModal from '../components/researcher/ResearcherDetailModal';
import InstitutionBadge from '../components/researcher/InstitutionBadge';

const institutions: Institution[] = ['ustc', 'baqis', 'qscgba', 'zju', 'tsinghua'];
const titleLevels: TitleLevel[] = ['pi', 'professor', 'associate', 'postdoc', 'phd'];

export default function Researchers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitutions, setSelectedInstitutions] = useState<Institution[]>([]);
  const [selectedTitles, setSelectedTitles] = useState<TitleLevel[]>([]);
  const [hasEmail, setHasEmail] = useState(false);
  const [hasBiography, setHasBiography] = useState(false);
  const [selectedResearcher, setSelectedResearcher] = useState<Researcher | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 30; // 每页显示数量

  // 当筛选条件变化时重置页码
  useEffect(() => {
    setPage(1);
  }, [selectedInstitutions, selectedTitles, searchQuery, hasEmail, hasBiography]);

  const filters = useMemo(() => ({
    institution: selectedInstitutions.length > 0 ? selectedInstitutions : undefined,
    titleLevel: selectedTitles.length > 0 ? selectedTitles : undefined,
    searchQuery: searchQuery || undefined,
    hasEmail: hasEmail || undefined,
    hasBiography: hasBiography || undefined,
    page,
    pageSize,
  }), [selectedInstitutions, selectedTitles, searchQuery, hasEmail, hasBiography, page]);

  const { researchers, loading, total, hasMore } = useResearchers({ initialFilters: filters });

  const toggleInstitution = (inst: Institution) => {
    setSelectedInstitutions(prev =>
      prev.includes(inst)
        ? prev.filter(i => i !== inst)
        : [...prev, inst]
    );
  };

  const toggleTitle = (title: TitleLevel) => {
    setSelectedTitles(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const clearFilters = () => {
    setSelectedInstitutions([]);
    setSelectedTitles([]);
    setHasEmail(false);
    setHasBiography(false);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedInstitutions.length > 0 || selectedTitles.length > 0 || hasEmail || hasBiography || searchQuery;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="font-display text-5xl text-orange-600 mb-2">QUANTUM TALENT POOL</h1>
        <p className="text-neutral-400 text-sm">
          量子科技领域研究人员 · 共 {loading ? '...' : total} 人
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            type="text"
            placeholder="搜索姓名、机构、研究方向..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-600 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-700 rounded"
            >
              <X className="w-4 h-4 text-neutral-500" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-orange-600" />
          <span className="font-semibold text-sm">筛选条件</span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto text-xs text-neutral-400 hover:text-orange-600 transition-colors"
            >
              清除全部
            </button>
          )}
        </div>

        {/* Institution Filters */}
        <div className="mb-4">
          <div className="text-xs text-neutral-500 mb-2">所属机构</div>
          <div className="flex flex-wrap gap-2">
            {institutions.map(inst => (
              <button
                key={inst}
                onClick={() => toggleInstitution(inst)}
                className={`transition-all ${selectedInstitutions.includes(inst) ? '' : 'opacity-60 hover:opacity-100'}`}
              >
                <InstitutionBadge institution={inst} size="sm" />
              </button>
            ))}
          </div>
        </div>

        {/* Title Filters */}
        <div className="mb-4">
          <div className="text-xs text-neutral-500 mb-2 flex items-center gap-1">
            <GraduationCap className="w-3 h-3" />
            职称级别
          </div>
          <div className="flex flex-wrap gap-2">
            {titleLevels.map(title => (
              <button
                key={title}
                onClick={() => toggleTitle(title)}
                className={`
                  px-3 py-1.5 rounded text-xs font-medium transition-all
                  ${selectedTitles.includes(title)
                    ? 'bg-orange-600 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }
                `}
              >
                {TITLE_CONFIG[title].label}
              </button>
            ))}
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasEmail}
              onChange={(e) => setHasEmail(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-orange-600 focus:ring-orange-600"
            />
            <span className="text-sm text-neutral-400 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              有邮箱
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasBiography}
              onChange={(e) => setHasBiography(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-orange-600 focus:ring-orange-600"
            />
            <span className="text-sm text-neutral-400 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              有简介
            </span>
          </label>
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-600/20 text-orange-400 text-xs rounded border border-orange-600/30">
              搜索: {searchQuery}
              <button onClick={() => setSearchQuery('')} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedInstitutions.map(inst => (
            <span key={inst} className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-800 text-neutral-300 text-xs rounded">
              {INSTITUTION_CONFIG[inst].shortName}
              <button onClick={() => toggleInstitution(inst)} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {selectedTitles.map(title => (
            <span key={title} className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-800 text-neutral-300 text-xs rounded">
              {TITLE_CONFIG[title].label}
              <button onClick={() => toggleTitle(title)} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Researchers Grid */}
      {loading ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-12 text-center">
          <div className="inline-block w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-400 mt-4">加载研究人员数据...</p>
        </div>
      ) : (
        <>
          {researchers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {researchers.map((researcher, index) => (
                <div
                  key={researcher.id}
                  className="animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <ResearcherCard
                    researcher={researcher}
                    onClick={() => setSelectedResearcher(researcher)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-12 text-center">
              <Users className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
              <p className="text-neutral-400 text-lg mb-2">未找到符合条件的研究人员</p>
              <p className="text-neutral-500 text-sm">尝试调整筛选条件</p>
            </div>
          )}

          {/* Results Count & Load More */}
          <div className="text-center py-6 space-y-4">
            <p className="text-neutral-500 text-sm">
              显示 {researchers.length} / {total} 条结果
            </p>
            {hasMore && (
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={loading}
                className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors border border-neutral-700"
              >
                {loading ? '加载中...' : '加载更多'}
              </button>
            )}
          </div>
        </>
      )}

      {/* Detail Modal */}
      {selectedResearcher && (
        <ResearcherDetailModal
          researcher={selectedResearcher}
          onClose={() => setSelectedResearcher(null)}
        />
      )}
    </div>
  );
}
