import { NavLink } from 'react-router-dom';
import { Zap, Target, Map, Star, FileText, Users } from 'lucide-react';

const navItems = [
  { to: '/signals', icon: Zap, label: '信号流' },
  { to: '/candidates', icon: Target, label: '候选标的' },
  { to: '/researchers', icon: Users, label: '人才库' },
  { to: '/knowledge-map', icon: Map, label: '知识地图' },
  { to: '/focus', icon: Star, label: '我的关注' },
  { to: '/notes', icon: FileText, label: '我的笔记' },
];

export default function Sidebar() {
  return (
    <aside
      className="fixed left-0 w-56 border-r backdrop-blur-xl p-4 h-[calc(100vh-4rem)] top-16 overflow-y-auto transition-colors duration-300"
      style={{ background: 'var(--th-bg-sidebar)', borderColor: 'var(--th-border)' }}
    >
      <nav className="space-y-0.5 mt-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-4 py-2.5 rounded-md font-medium text-sm cursor-pointer transition-all duration-200 group ${
                isActive
                  ? 'nav-link-active-bar bg-[rgba(59,130,246,0.1)] text-blue-400'
                  : 'text-[#8892aa] hover:bg-[rgba(59,130,246,0.06)] hover:text-[#c8d4f0]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-blue-400' : 'text-[#8892aa] group-hover:text-[#c8d4f0]'
                }`} />
                <span>{label}</span>
                {isActive && (
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500/10 to-transparent pointer-events-none" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom status */}
      <div className="absolute bottom-6 left-4 right-4">
        <div
          className="border rounded-md p-3 transition-colors duration-300"
          style={{ borderColor: 'var(--th-border)', background: 'var(--th-bg-elevated)' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 dot-pulse" />
            <span className="text-xs text-blue-400 font-medium">量子科技赛道</span>
          </div>
          <p className="text-[10px] text-[#8892aa] leading-relaxed">实时追踪 · AI 增强分析</p>
        </div>
      </div>
    </aside>
  );
}
