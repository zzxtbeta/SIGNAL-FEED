import { Mail, Link2, Building2, ChevronRight, GripVertical } from 'lucide-react';
import { Researcher } from '../../types/people';
import { useLayout } from '../../contexts/LayoutContext';
import InstitutionBadge from './InstitutionBadge';
import TitleBadge from './TitleBadge';
import ResearchTagCloud from './ResearchTagCloud';

interface ResearcherCardProps {
  researcher: Researcher;
  onClick?: () => void;
}

export default function ResearcherCard({ researcher, onClick }: ResearcherCardProps) {
  const { setDraggedItem, isChatOpen } = useLayout();

  const handleDragStart = (e: React.DragEvent) => {
    setDraggedItem({
      type: 'researcher',
      id: researcher.id,
      title: researcher.name,
      summary: `${researcher.institutionRaw} · ${researcher.title} · ${researcher.researchTags.slice(0, 3).join(', ')}`,
    });
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div
      draggable={isChatOpen}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      className={`
        bg-neutral-900 border border-neutral-800 rounded-lg p-5
        hover:border-orange-600 transition-all duration-200
        cursor-pointer group relative
        ${isChatOpen ? 'cursor-grab active:cursor-grabbing' : ''}
      `}
    >
      {/* Drag Handle */}
      {isChatOpen && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-4 h-4 text-neutral-500" />
        </div>
      )}

      {/* Header: Institution Badge */}
      <div className="flex items-center justify-between mb-3">
        <InstitutionBadge institution={researcher.institution} size="sm" />
        <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-orange-600 transition-colors" />
      </div>

      {/* Name & Title */}
      <div className="mb-3">
        <h3 className="text-lg font-bold text-white group-hover:text-orange-600 transition-colors mb-1">
          {researcher.name}
          {researcher.nameEn && (
            <span className="ml-2 text-sm font-normal text-neutral-500">
              {researcher.nameEn}
            </span>
          )}
        </h3>
        <TitleBadge title={researcher.titleNormalized} originalTitle={researcher.title} />
      </div>

      {/* Department */}
      {researcher.department && (
        <div className="flex items-center gap-1.5 text-sm text-neutral-400 mb-3">
          <Building2 className="w-3.5 h-3.5" />
          <span>{researcher.department}</span>
        </div>
      )}

      {/* Research Tags */}
      {researcher.researchTags.length > 0 && (
        <div className="mb-4">
          <ResearchTagCloud tags={researcher.researchTags} maxTags={4} />
        </div>
      )}

      {/* Footer: Contact Info Indicators */}
      <div className="flex items-center gap-4 pt-3 border-t border-neutral-800">
        {/* Email indicator */}
        <div className={`flex items-center gap-1.5 text-xs ${researcher.email ? 'text-green-500' : 'text-neutral-600'}`}>
          <Mail className="w-3.5 h-3.5" />
          <span>{researcher.email ? '有邮箱' : '无邮箱'}</span>
        </div>

        {/* Homepage indicator */}
        <div className={`flex items-center gap-1.5 text-xs ${researcher.url ? 'text-blue-500' : 'text-neutral-600'}`}>
          <Link2 className="w-3.5 h-3.5" />
          <span>{researcher.url ? '有主页' : '无主页'}</span>
        </div>

        {/* Biography indicator */}
        <div className={`flex items-center gap-1.5 text-xs ${researcher.biography?.length > 50 ? 'text-amber-500' : 'text-neutral-600'}`}>
          <span className="w-3.5 h-3.5 flex items-center justify-center text-[10px]">📄</span>
          <span>{researcher.biography?.length > 50 ? '有简介' : '简介短'}</span>
        </div>
      </div>
    </div>
  );
}
