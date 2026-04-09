import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, ArrowLeft, ChevronDown } from 'lucide-react';
import type { SidebarItem } from './types/Sidebar.types';
import { sidebarItems } from './constants/Navigation';
import tranzit_logo from '@/assets/Tranzit_Logo.svg';
import { CustomTooltip } from '@/components/ui/CustomeTooltip';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

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
      toggleExpand(item.name);
    }
  };

  const currentSubmenuData = sidebarItems.find(i => i.name === activeSubmenu);

  return (
    <aside className={`h-screen bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-800 flex flex-col justify-between fixed top-0 left-0 z-20 transition-[width] duration-500 ease-in-out ${isCollapsed ? 'w-[64px]' : 'w-[240px]'}`}>
      <div className="flex-1 overflow-y-auto overflow-x-hidden w-full custom-scrollbar">
        {/* Main Menu Header */}
        {!activeSubmenu && (
          <div className={`flex items-center justify-between h-16 ${isCollapsed ? 'px-4' : 'px-4'}`}>
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-md text-blue-500 transition-colors">
              <Menu className="w-[22px] h-[22px]" strokeWidth={2.5} />
            </button>
            <div className="flex items-center">
              {/* brand logo */}
              <img src={tranzit_logo} alt="Tranzit" className="h-10 dark:invert" />
            </div>
          </div>
        )}

        {/* Submenu Header (e.g. Settings) */}
        {activeSubmenu && !isCollapsed && (
          <div className="flex flex-col pt-2 animate-in slide-in-from-left-4 duration-300">
            <button
              onClick={() => setActiveSubmenu(null)}
              className="flex items-center gap-2 px-4 py-2 text-[13px] text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to main menu</span>
            </button>
            <div className="flex items-center justify-between px-6 py-4 mt-2">
              <div className="flex items-center gap-3">
                {currentSubmenuData?.icon && <currentSubmenuData.icon className="w-6 h-6 text-blue-500" />}
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">{activeSubmenu}</h2>
              </div>
              <ChevronDown className="w-5 h-5 text-blue-500 rotate-180" />
            </div>
          </div>
        )}

        <nav className="px-2 mt-1 space-y-0.5">
          {activeSubmenu && !isCollapsed ? (
            // Render Submenu Groups (Settings)
            <div className="space-y-6 pt-4 animate-in fade-in duration-500">
              {currentSubmenuData?.subGroups?.map((group) => (
                <div key={group.title} className="space-y-2">
                  <h3 className="px-4 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    {group.title}
                  </h3>
                  <div className="space-y-0.5">
                    {group.items.map((subItem) => (
                      <NavLink
                        key={subItem.name}
                        to={subItem.path}
                        className={({ isActive }) =>
                          `flex items-center px-4 py-2 text-[13.5px] font-medium transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-50 dark:hover:bg-zinc-900'
                          }`
                        }
                      >
                        {subItem.name}
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
                  to={item.path}
                  onClick={(e) => {
                    if (item.hasDropdown) {
                      e.preventDefault();
                      handleItemClick(item);
                    }
                  }}
                  className={({ isActive }) =>
                    `flex items-center justify-between overflow-hidden py-[10px] px-3 border-l-4 rounded-r-md text-[13.5px] font-medium transition-colors ${isActive && !item.hasDropdown ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/10 border-blue-600 dark:border-blue-400' : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-900 border-transparent'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3 w-full min-w-0">
                        <item.icon className={`w-[18px] h-[18px] shrink-0 transition-colors ${isActive && !item.hasDropdown ? 'text-blue-500' : 'text-gray-400 dark:text-zinc-500'}`} strokeWidth={2} />
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
                        <ChevronDown className={`w-4 h-4 shrink-0 ml-2 transition-all duration-300 text-gray-400 dark:text-zinc-500 ${isCollapsed ? 'opacity-0' : 'opacity-100'} ${expandedItems.includes(item.name) ? 'rotate-180' : ''}`} />
                      )}
                    </>
                  )}
                </NavLink>
                {/* Sub-items for Analytics (and others) */}
                {!isCollapsed && expandedItems.includes(item.name) && item.subItems && (
                  <div className="ml-9 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {item.subItems.map((sub) => (
                      <NavLink
                        key={sub.name}
                        to={sub.path}
                        className={({ isActive }) =>
                          `block px-2 py-2 text-[13.5px] font-medium rounded-md transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100'
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
          <div className="w-[34px] h-[18px] bg-[#0060FE] dark:bg-blue-600 rounded-full relative flex items-center shadow-inner cursor-pointer px-[2px]">
            <div className="w-[14px] h-[14px] bg-white dark:bg-zinc-100 rounded-full ml-auto shadow-sm transform transition-transform"></div>
          </div>
          <span className="text-gray-800 dark:text-zinc-200 font-medium text-[13px]">UI 2.0</span>
        </div>
      </div> */}
    </aside>
  );
}
