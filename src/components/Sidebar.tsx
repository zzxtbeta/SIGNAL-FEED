import { NavLink } from 'react-router-dom';
import { Zap, Target, Map, Star, FileText } from 'lucide-react';

const navItems = [
  { to: '/signals', icon: Zap, label: '信号流' },
  { to: '/candidates', icon: Target, label: '候选标的' },
  { to: '/knowledge-map', icon: Map, label: '知识地图' },
  { to: '/focus', icon: Star, label: '我的关注' },
  { to: '/notes', icon: FileText, label: '我的笔记' },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-4 w-56 bg-neutral-900 border border-neutral-800 rounded-lg p-4 h-[calc(100vh-7rem)]">
      <nav className="space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded font-medium text-sm cursor-pointer transition-colors ${
                isActive
                  ? 'bg-neutral-800 text-orange-600 font-semibold'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
