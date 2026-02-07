import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Chat from '../pages/Chat';
import { useLayout } from '../contexts/LayoutContext';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Layout() {
  const { 
    isSidebarCollapsed, 
    toggleSidebar, 
    isChatOpen, 
    chatWidth, 
    setChatWidth,
    addChatReference,
    draggedItem,
  } = useLayout();
  
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);

  // 处理拖拽调整宽度
  const handleMouseDown = () => {
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 300 && newWidth <= 800) {
        setChatWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, setChatWidth]);

  // 处理拖放到Chat区域
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem && isChatOpen) {
      addChatReference(draggedItem);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const sidebarWidth = isSidebarCollapsed ? 0 : 256;
  const mainWidth = isChatOpen 
    ? `calc(100% - ${sidebarWidth}px - ${chatWidth}px)` 
    : `calc(100% - ${sidebarWidth}px)`;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar />
      
      <div className="flex pt-24 min-h-screen relative">
        {/* Sidebar */}
        <div 
          className="transition-all duration-300 ease-in-out"
          style={{ width: isSidebarCollapsed ? 0 : 256 }}
        >
          {!isSidebarCollapsed && <Sidebar />}
        </div>

        {/* Sidebar Toggle Button - 精致小巧的设计 */}
        <button
          onClick={toggleSidebar}
          className="fixed top-1/2 -translate-y-1/2 z-50 group transition-all duration-300"
          style={{ 
            left: isSidebarCollapsed ? '0' : '240px',
          }}
        >
          <div className="relative">
            {/* 背景光晕效果 */}
            <div className="absolute inset-0 bg-orange-600/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* 主按钮 - 更小更精致 */}
            <div className="relative bg-neutral-900 border border-neutral-800 group-hover:border-orange-600 rounded-r-lg py-3 px-1.5 transition-all duration-300 shadow-lg">
              <div className="flex flex-col items-center gap-0.5">
                {isSidebarCollapsed ? (
                  <>
                    <ChevronRight className="w-3 h-3 text-neutral-500 group-hover:text-orange-600 transition-colors" />
                    <div className="w-0.5 h-4 bg-neutral-700 group-hover:bg-orange-600 rounded-full transition-colors" />
                  </>
                ) : (
                  <>
                    <div className="w-0.5 h-4 bg-neutral-700 group-hover:bg-orange-600 rounded-full transition-colors" />
                    <ChevronLeft className="w-3 h-3 text-neutral-500 group-hover:text-orange-600 transition-colors" />
                  </>
                )}
              </div>
            </div>
          </div>
        </button>
        
        {/* Main Content */}
        <main 
          className="flex-shrink-0 px-4 pb-8 transition-all duration-300"
          style={{ width: mainWidth }}
        >
          <Outlet />
        </main>

        {/* Chat Panel */}
        {isChatOpen && (
          <>
            {/* Resize Handle */}
            <div
              ref={resizeRef}
              onMouseDown={handleMouseDown}
              className="w-1 bg-neutral-800 hover:bg-orange-600 cursor-col-resize transition-colors flex-shrink-0 relative group"
            >
              <div className="absolute inset-y-0 -left-1 -right-1" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-12 bg-neutral-600 group-hover:bg-orange-600 rounded-full transition-colors" />
            </div>

            {/* Chat Content */}
            <div 
              className="flex-shrink-0 h-[calc(100vh-6rem)] sticky top-24"
              style={{ width: chatWidth }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <Chat />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

