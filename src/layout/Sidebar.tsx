"use client";

import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, ArrowLeft, ChevronDown, X } from 'lucide-react';
import type { SidebarItem } from './types/Sidebar.types';
import { adminSidebarItems, clientSidebarItems } from '../router/Navigation';
import tranzit_logo from '@/assets/Tranzit_Logo.svg';
import tranzit_logo_dark from '@/assets/Tranzit_Logo_dark.svg';
import { CustomTooltip } from '@/components/common/CustomTooltip';
import { useAppSelector } from '@/hooks/store.hooks';
import { useTheme } from '@/app/providers/theme-provider';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isMobile?: boolean;
  isMobileSidebarOpen?: boolean;
  setIsMobileSidebarOpen?: (val: boolean) => void;
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  isMobile = false,
  isMobileSidebarOpen = false,
  setIsMobileSidebarOpen = () => { }
}: SidebarProps) {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { role } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarItems = role === 'admin' ? adminSidebarItems : clientSidebarItems;
  const { theme } = useTheme();

  useEffect(() => {
    const matchingItem = sidebarItems.find(item => {
      if (item.subGroups) {
        if (location.pathname === item.path || location.pathname.startsWith(item.path + '/')) {
          return true;
        }
        return item.subGroups.some(group =>
          group.items.some(subItem =>
            location.pathname === subItem.path ||
            location.pathname.startsWith(subItem.path)
          )
        );
      }
      return false;
    });

    if (matchingItem) {
      setActiveSubmenu(matchingItem.name);
    } else {
      setActiveSubmenu(null);
    }
  }, [location.pathname, sidebarItems]);

  const toggleExpand = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const handleItemClick = (item: SidebarItem) => {
    if (item.name === 'Settings' || item.name === 'Analytics') {
      setIsCollapsed(false);
      setActiveSubmenu(item.name);
    } else if (item.subItems) {
      setIsCollapsed(false);
      toggleExpand(item.name);
    }
  };

  const handleBackToMainMenu = () => {
    setActiveSubmenu(null);
    navigate(`${role === 'admin' ? '/admin' : ''}/orders`);
  };

  const currentSubmenuData = sidebarItems.find(i => i.name === activeSubmenu);

  return (
    <aside className={cn(
      "print:hidden h-screen bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-800 flex flex-col justify-between fixed top-0 left-0 transition-all duration-300 ease-in-out z-20",
      isMobile
        ? "w-[240px] z-50 shadow-2xl"
        : "z-20",
      isMobile
        ? (isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full")
        : "translate-x-0",
      !isMobile && (isCollapsed ? "w-[64px]" : "w-[240px]")
    )}>
      <div className="flex-1 overflow-y-auto overflow-x-hidden w-full no-scrollbar">
        {/* Main Menu Header */}
        {!activeSubmenu && (
          <div className={`flex items-center h-16 px-4 sticky top-0 z-20 bg-white dark:bg-zinc-950 ${isMobile ? 'justify-between' : (isCollapsed ? 'justify-center' : 'justify-between')
            }`}>
            <button
              onClick={() => isMobile ? setIsMobileSidebarOpen(false) : setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-md text-primary transition-colors"
            >
              {isMobile ? <X className="w-[22px] h-[22px]" /> : <Menu className="w-[22px] h-[22px]" strokeWidth={2.5} />}
            </button>
            <div className={`flex items-center transition-all duration-300 ease-in-out ${isMobile ? 'w-auto opacity-100' : (isCollapsed ? 'w-0 opacity-0 pointer-events-none overflow-hidden' : 'w-auto opacity-100')
              }`}>
              {/* brand logo */}
              <img src={theme === "dark" ? tranzit_logo_dark : tranzit_logo} alt="Tranzit" className="h-15" />
            </div>
          </div>
        )}

        {/* Submenu Header (e.g. Settings) */}
        {activeSubmenu && (!isCollapsed || isMobile) && (
          <div className="flex flex-col pt-2 animate-in slide-in-from-left-4 duration-300">
            <button
              onClick={handleBackToMainMenu}
              className="flex items-center cursor-pointer gap-2 px-4 py-2 text-[13px] text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to main menu</span>
            </button>
            <div className="flex items-center justify-between px-6 py-2 mt-2">
              <div className="flex items-center gap-3">
                {currentSubmenuData?.icon && <currentSubmenuData.icon className="w-6 h-6 text-primary" />}
                <h2 className="my-0 text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">{activeSubmenu}</h2>
              </div>
              {/* <ChevronDown className="w-5 h-5 text-primary rotate-180" /> */}
            </div>
          </div>
        )}

        <nav className="px-2 mt-1 space-y-0.5 pb-2">
          {activeSubmenu && (!isCollapsed || isMobile) ? (
            // Render Submenu Groups (Settings)
            <div className="space-y-6 pt-4 animate-in fade-in duration-500">
              {currentSubmenuData?.subGroups?.map((group) => (
                <div key={group.title} className="space-y-2">
                  <h3 className="px-4 text-[11px] font-bold tracking-wide text-gray-400 uppercase">
                    {group.title}
                  </h3>
                  <div className="space-y-0.5">
                    {group.items.map((subItem) => (
                      <NavLink
                        key={subItem.name}
                        to={subItem.path}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-2 text-[13.5px] border-l-4 font-medium transition-colors rounded-r-md ${isActive ? 'text-primary bg-primary/10 border-primary dark:border-primary' : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-50 dark:hover:bg-zinc-900 border-transparent'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {subItem.icon && (
                              <subItem.icon className={`w-[18px] h-[18px] shrink-0 transition-colors ${isActive ? 'text-primary' : 'text-gray-400 dark:text-zinc-500'}`} strokeWidth={2} />
                            )}
                            <span>{subItem.name}</span>
                          </>
                        )}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Render Main Menu Items
            sidebarItems.map((item) => (
              <div key={item.name}>
                <NavLink
                  to={item.isExternal || item.hasDropdown ? '#' : item.path}
                  onClick={(e) => {
                    if (item.isExternal) {
                      e.preventDefault();
                      window.location.href = item.path;
                      return;
                    }
                    if (item.hasDropdown) {
                      // e.preventDefault();
                      handleItemClick(item);
                    }
                    if (sessionStorage.getItem('quote_courier')) {
                      sessionStorage.removeItem('quote_courier');
                    }
                    if (sessionStorage.getItem('quote_items')) {
                      sessionStorage.removeItem('quote_items');
                    }
                    if (sessionStorage.getItem('quote_sender')) {
                      sessionStorage.removeItem('quote_sender');
                    }
                    if (sessionStorage.getItem('quote_receiver')) {
                      sessionStorage.removeItem('quote_receiver');
                    }
                  }}
                  className={({ isActive }) => {
                    // Fix double active highlight for base orders menu vs create order
                    let finalActive = isActive;
                    if (item.isExternal) finalActive = false;
                    if ((item.name === 'Orders' || item.name === 'Order Management') && location.pathname.includes('/orders/create')) {
                      finalActive = false;
                    }

                    return `flex items-center justify-between overflow-hidden py-[10px] px-3 border-l-4 rounded-r-md text-[14px] font-medium transition-colors ${finalActive && !item.hasDropdown ? 'text-primary bg-primary/10 border-primary dark:border-primary font-semibold' : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-900 border-transparent'
                      }`
                  }}
                >
                  {({ isActive }) => {
                    let finalActive = isActive;
                    if (item.isExternal) finalActive = false;
                    if ((item.name === 'Orders' || item.name === 'Order Management') && location.pathname.includes('/orders/create')) {
                      finalActive = false;
                    }

                    return (
                      <>
                        <div className={`flex items-center gap-${!isCollapsed ? 3 : 3} w-full min-w-0 transition-all duration-300`}>
                          <CustomTooltip title={item.name} placement="bottom" className="flex-1">
                            <item.icon className={`w-[18px] h-[18px] shrink-0 transition-colors ${finalActive && !item.hasDropdown ? 'text-primary' : 'text-gray-400 dark:text-zinc-500'}`} strokeWidth={2} />
                          </CustomTooltip>
                          <div className={`flex items-center min-w-0 flex-1 transition-opacity duration-3000 ${isCollapsed ? 'opacity-100' : 'opacity-100'}`}>
                            <CustomTooltip title={item.name} placement="bottom" onlyOnOverflow={true} className="flex-1">
                              <span>{item.name}</span>
                            </CustomTooltip>
                            {item.name === 'Getting Setup' && (
                              <span className="ml-[6px] px-[5px] py-[2px] rounded text-[10px] bg-[#111827] dark:bg-zinc-800 text-white font-semibold leading-none shadow-sm shrink-0">Menu</span>
                            )}
                          </div>
                        </div>
                        {item.hasDropdown && (
                          <ChevronDown className={`w-4 h-4 shrink-0 ml-2 transition-all duration-300 text-gray-400 dark:text-zinc-500 ${(isCollapsed && !isMobile) ? 'opacity-0' : 'opacity-100'} ${expandedItems.includes(item.name) ? 'rotate-360' : 'rotate-270'}`} />
                        )}
                      </>
                    );
                  }}
                </NavLink>
                {/* Sub-items for Analytics (and others) */}
                {(!isCollapsed || isMobile) && expandedItems.includes(item.name) && item.subItems && (
                  <div className="ml-9 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {item.subItems.map((sub) => (
                      <NavLink
                        key={sub.name}
                        to={sub.path}
                        className={({ isActive }) =>
                          `block px-2 py-2 text-[13px] leading-snug font-medium rounded-md transition-colors ${isActive ? 'text-primary font-semibold' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100'
                          }`
                        }
                      >
                        {sub.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </nav>
      </div>
      {/* <div className={`border-t border-gray-200 dark:border-zinc-800 text-sm text-gray-600 dark:text-zinc-400 bg-white dark:bg-zinc-950 transition-[height,padding,opacity] duration-300 overflow-hidden ${isCollapsed ? 'h-0 opacity-0 p-0' : 'p-4 flex items-center justify-between h-[60px] opacity-100'}`}>
        <span className="font-medium text-[13px] whitespace-nowrap">Classic</span>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <div className="w-[34px] h-[18px] bg-primary rounded-full relative flex items-center shadow-inner cursor-pointer px-[2px]">
            <div className="w-[14px] h-[14px] bg-white dark:bg-zinc-100 rounded-full ml-auto shadow-sm transform transition-transform"></div>
          </div>
          <span className="text-gray-800 dark:text-zinc-200 font-medium text-[13px]">UI 2.0</span>
        </div>
      </div> */}
    </aside>
  );
}
