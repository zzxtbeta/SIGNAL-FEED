import { Search, MessageSquare, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '../contexts/LayoutContext';

const tracks = [
  { id: 'quantum', name: '量子科技', status: 'active' },
  { id: 'bci', name: '脑机接口', status: 'coming' },
  { id: 'embodied-ai', name: '具身智能', status: 'coming' },
  { id: 'synthetic-bio', name: '合成生物学', status: 'coming' },
  { id: 'fusion-energy', name: '核聚变能源', status: 'coming' },
  { id: 'space-tech', name: '商业航天', status: 'coming' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { isChatOpen, toggleChat } = useLayout();
  const [selectedTrack, setSelectedTrack] = useState('quantum');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTrack = e.target.value;
    
    if (newTrack !== 'quantum') {
      const trackName = tracks.find(t => t.id === newTrack)?.name;
      setToastMessage(`${trackName}赛道正在建设中，敬请期待`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      e.target.value = 'quantum';
    } else {
      setSelectedTrack(newTrack);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to signal feed with search query
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setToastMessage(`搜索: ${searchQuery.trim()}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  return (
    <>
      <nav className="fixed top-4 left-4 right-4 z-50 bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-lg">
        <div className="px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center">
            {/* Logo 区域 */}
            <div className="flex items-center gap-3 w-56">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-600 to-orange-700 rounded flex items-center justify-center flex-shrink-0">
                <span className="font-display text-white text-xl font-bold">G</span>
              </div>
              <div className="flex flex-col">
                <h1 className="font-display text-2xl tracking-wider text-orange-600 leading-none">
                  GRAVAITY
                </h1>
                <span className="text-[10px] text-neutral-500 tracking-widest mt-0.5 uppercase">Cognitive Engine</span>
              </div>
            </div>
            
            {/* 赛道选择器 */}
            <div className="relative group">
              <select 
                value={selectedTrack}
                onChange={handleTrackChange}
                className="bg-neutral-800/50 border border-neutral-700/50 rounded-lg pl-4 pr-10 py-2 text-sm font-medium cursor-pointer hover:bg-neutral-800 hover:border-orange-600/50 focus:outline-none focus:border-orange-600 transition-all appearance-none min-w-[140px]"
              >
                {tracks.map((track) => (
                  <option key={track.id} value={track.id}>
                    {track.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none group-hover:text-orange-600 transition-colors" />
            </div>
          </div>
        
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索信号、公司、技术..."
              className="bg-neutral-800 border border-neutral-700 rounded pl-10 pr-4 py-1.5 text-sm w-64 focus:outline-none focus:border-orange-600 transition-colors"
            />
          </form>
          <button
            onClick={toggleChat}
            className={`flex items-center gap-2 px-4 py-1.5 rounded text-sm font-semibold transition-colors ${
              isChatOpen 
                ? 'bg-orange-600 hover:bg-orange-700' 
                : 'bg-neutral-800 hover:bg-neutral-700'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Chat
          </button>
        </div>
      </div>
    </nav>

    {/* Toast 提示 */}
    {showToast && (
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg px-6 py-3 shadow-2xl flex items-center gap-3">
          <div className="w-1 h-8 bg-orange-600 rounded-full"></div>
          <p className="text-sm text-neutral-200">{toastMessage}</p>
        </div>
      </div>
    )}
  </>
  );
}
