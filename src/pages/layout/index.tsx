import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <TopBar isCollapsed={isCollapsed} />
      <main className={`h-screen flex flex-col transition-[margin] duration-300 ease-in-out pt-16 overflow-hidden ${isCollapsed ? 'ml-[64px]' : 'ml-[240px]'}`}>
        {/* Main Content Area */}
        <div className="px-10 py-5 mx-auto w-full flex-1 flex flex-col overflow-y-auto bg-slate-50/30">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
