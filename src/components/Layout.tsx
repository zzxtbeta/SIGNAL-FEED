import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ChatDrawer from './ChatDrawer';
import { useState } from 'react';

export default function Layout() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar onChatToggle={() => setIsChatOpen(!isChatOpen)} />
      
      <div className="flex pt-24 min-h-screen">
        <Sidebar />
        
        <main className="flex-1 ml-64 mr-4 pb-8">
          <Outlet />
        </main>
      </div>

      <ChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
