"use client";

import { useState, useEffect, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { adminSidebarItems, clientSidebarItems } from '../router/Navigation';
import { useAppSelector } from '@/hooks/store.hooks';
import SubscriptionPlanModal from '@/features/customer-settings/components/SubscriptionPlanModal';
import { useGetUserDetails } from '@/features/auth/hooks/useAuth';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 1280);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const location = useLocation();
  const { role } = useAppSelector((state) => state.auth);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // Announcements state
  const { data: userData } = useGetUserDetails(role === 'customer');
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismissAnnouncement = () => {
    setIsDismissed(true);
  };

  const activeAnnouncements = useMemo(() => {
    if (role !== 'customer' || !userData?.announcements || isDismissed) return [];
    return userData.announcements;
  }, [userData, role, isDismissed]);

  useEffect(() => {
    if (currentAnnouncementIndex >= activeAnnouncements.length) {
      setCurrentAnnouncementIndex(0);
    }
  }, [activeAnnouncements, currentAnnouncementIndex]);

  useEffect(() => {
    if (activeAnnouncements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAnnouncementIndex((prev) => (prev + 1) % activeAnnouncements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeAnnouncements, currentAnnouncementIndex]);

  const currentAnnouncement = activeAnnouncements[currentAnnouncementIndex];



  const sidebarItems = role === 'admin' ? adminSidebarItems : clientSidebarItems;

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsMobileSidebarOpen(false);
      } else {
        setIsCollapsed(window.innerWidth <= 1280);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    // Helper to find the active menu name from nested structure
    const findActiveName = () => {
      for (const item of sidebarItems) {
        // Direct match
        if (item.path === location.pathname) return item.name;

        // Nested route match for modules like Help Center articles
        if (item.path !== '/' && location.pathname.startsWith(`${item.path}/`)) {
          return item.name;
        }

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
  }, [location.pathname, sidebarItems]);

  console.log(activeAnnouncements, 'activeAnnouncements')

  const hasAnnouncements = activeAnnouncements.length > 0 && !!currentAnnouncement;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      {hasAnnouncements && (
        <div
          style={{
            backgroundColor: currentAnnouncement.background_color,
            color: currentAnnouncement.text_color,
          }}
          className="w-full text-xs sm:text-sm py-2 px-4 flex items-center justify-center relative z-50 transition-all font-medium h-9 shadow-sm"
        >
          {/* Centered text */}
          <div className="flex-1 text-center truncate pr-[100px] pl-8">
            {currentAnnouncement.text}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 absolute right-4">
            {activeAnnouncements.length > 1 && (
              <div className="flex items-center gap-1.5 bg-black/10 dark:bg-white/10 rounded-full px-2 py-0.5 text-[10px] font-medium select-none">
                <button
                  onClick={() =>
                    setCurrentAnnouncementIndex(
                      (prev) => (prev - 1 + activeAnnouncements.length) % activeAnnouncements.length
                    )
                  }
                  className="hover:opacity-85 h-1 transition-opacity border-0 bg-transparent cursor-pointer flex items-center font-bold"
                  style={{ color: currentAnnouncement.text_color }}
                >
                  <ChevronLeftIcon className='h-3 w-3' />
                </button>
                <span>
                  {currentAnnouncementIndex + 1}/{activeAnnouncements.length}
                </span>
                <button
                  onClick={() =>
                    setCurrentAnnouncementIndex((prev) => (prev + 1) % activeAnnouncements.length)
                  }
                  className="hover:opacity-85 transition-opacity border-0 bg-transparent cursor-pointer flex items-center font-bold"
                  style={{ color: currentAnnouncement.text_color }}
                >
                  <ChevronRightIcon className='h-3 w-3' />
                </button>
              </div>
            )}
            <button
              onClick={() => handleDismissAnnouncement()}
              className="hover:opacity-85 transition-opacity p-0.5 rounded-full hover:bg-black/15 dark:hover:bg-white/15 border-0 bg-transparent cursor-pointer flex items-center justify-center w-5 h-5 font-bold"
              style={{ color: currentAnnouncement.text_color }}
              aria-label="Dismiss announcement"
            >
              ×
            </button>
          </div>
        </div>
      )}
      {isMobile && isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity duration-300 ease-in-out"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobile={isMobile}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        bannerOpen={hasAnnouncements}
      />
      <TopBar
        isCollapsed={isCollapsed}
        isMobile={isMobile}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        bannerOpen={hasAnnouncements}
      />
      <main
        style={hasAnnouncements ? { paddingTop: 'calc(4rem + 36px)', height: 'calc(100vh - 36px)' } : {}}
        className={`h-screen flex flex-col transition-[margin,padding-top,height] duration-300 ease-in-out pt-16 z-0 relative print:ml-0 print:pt-0 print:h-auto ${isMobile ? 'ml-0' : (isCollapsed ? 'ml-[64px]' : 'ml-[240px]')
          }`}
      >
        <div className="mx-auto w-full flex-1 flex flex-col bg-slate-100 dark:bg-zinc-900/10 print:bg-transparent print:p-0 overflow-hidden min-h-0">
          <Outlet />
        </div>
      </main>
      <SubscriptionPlanModal
        open={showSubscriptionModal}
        onOpenChange={setShowSubscriptionModal}
        closeable={true}
      />
    </div>
  );
}
