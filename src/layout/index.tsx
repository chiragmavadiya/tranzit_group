"use client";

import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { sidebarItems } from '../app/router/Navigation';

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1280);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Helper to find the active menu name from nested structure
    const findActiveName = () => {
      for (const item of sidebarItems) {
        // Direct match
        if (item.path === location.pathname) return item.name;

        // Check subItems (if any)
        if (item.subItems) {
          const subMatch = item.subItems.find(sub => sub.path === location.pathname);
          if (subMatch) return subMatch.name;
        }

        // Check subGroups
        if (item.subGroups) {
          for (const group of item.subGroups) {
            const subMatch = group.items.find(sub => sub.path === location.pathname);
            if (subMatch) return subMatch.name;
          }
        }
      }

      // Special cases or fallback
      if (location.pathname === '/dashboard') return 'Dashboard';
      return null;
    };

    const activeName = findActiveName();
    document.title = activeName ? `${activeName} | Tranzit` : 'Tranzit';
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <TopBar isCollapsed={isCollapsed} />
      <main className={`h-screen flex flex-col transition-[margin] duration-300 ease-in-out pt-16 ${isCollapsed ? 'ml-[64px]' : 'ml-[240px]'}`}>
        <div className="mx-auto w-full flex-1 flex flex-col bg-slate-50/30 dark:bg-zinc-900/10 overflow-hidden min-h-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
