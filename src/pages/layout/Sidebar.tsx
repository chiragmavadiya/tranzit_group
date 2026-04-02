import {
  ChevronDown, ArrowLeft,
  CheckCircle2, Package, Search, Zap, Send, Calendar, Clock, BarChart2, Tag, Users, Box, Settings, Menu
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const sidebarItems = [
  { name: 'Getting Setup', icon: CheckCircle2, path: '/setup' },
  { name: 'Orders', icon: Package, path: '/orders' },
  { name: 'Search', icon: Search, path: '/search' },
  { name: 'Workflows', icon: Zap, path: '/workflows' },
  { name: 'Manifests', icon: Send, path: '/manifests' },
  { name: 'Pickups', icon: Calendar, path: '/pickups' },
  { name: 'Reports', icon: Clock, path: '/reports' },
  {
    name: 'Analytics',
    icon: BarChart2,
    path: '/analytics',
    hasDropdown: true,
    subItems: [
      { name: 'Shipping summary', path: '/analytics/summary' },
      { name: 'Shipping performance', path: '/analytics/performance' },
    ]
  },
  { name: 'Products', icon: Tag, path: '/products' },
  { name: 'Address book', icon: Users, path: '/address-book' },
  { name: 'Warehouse', icon: Box, path: '/warehouse' },
  {
    name: 'Settings',
    icon: Settings,
    path: '/settings',
    hasDropdown: true,
    subGroups: [
      {
        title: 'GENERAL',
        items: [
          { name: 'Options', path: '/settings/options' },
          { name: 'Pickup address', path: '/settings/address' },
          { name: 'Printing', path: '/settings/printing' },
        ]
      },
      {
        title: 'CONNECT',
        items: [
          { name: 'Couriers', path: '/settings/couriers' },
          { name: 'Integrations', path: '/settings/integrations' },
          { name: 'CSV file', path: '/settings/csv' },
          { name: 'API', path: '/settings/api' },
        ]
      },
      {
        title: 'ORDER MANAGEMENT',
        items: [
          { name: 'Packaging', path: '/settings/packaging' },
          { name: 'Packing slip', path: '/settings/packing-slip' },
          { name: 'Packing validation', path: '/settings/validation' },
          { name: 'Product catalogue', path: '/settings/catalogue' },
          { name: 'Tags', path: '/settings/tags' },
        ]
      },
      {
        title: 'SHIPPING',
        items: [
          { name: 'Rules', path: '/settings/rules' },
          { name: 'Shipping zones', path: '/settings/zones' },
          { name: 'Checkout rates', path: '/settings/checkout-rates' },
          { name: 'Document manager', path: '/settings/document-manager' },
          { name: 'Digital signatures', path: '/settings/digital-signatures' },
          { name: 'Customise rates', path: '/settings/customise-rates' },
        ]
      },
      {
        title: 'POST PURCHASE',
        items: [
          { name: 'Brand hub', path: '/settings/brand-hub' },
          { name: 'Tracking and notifications', path: '/settings/notifications' },
          { name: 'Returns', path: '/settings/returns' },
        ]
      },
      {
        title: 'ACCOUNT MANAGEMENT',
        items: [
          { name: 'Users', path: '/settings/users' },
        ]
      }
    ]
  },
];

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

  const handleItemClick = (item: any) => {
    if (item.name === 'Settings') {
      setActiveSubmenu('Settings');
    } else if (item.subItems) {
      toggleExpand(item.name);
    }
  };

  const currentSubmenuData = sidebarItems.find(i => i.name === activeSubmenu);

  return (
    <aside className={`h-screen bg-white border-r border-gray-200 flex flex-col justify-between fixed top-0 left-0 z-20 transition-[width] duration-300 ease-in-out ${isCollapsed ? 'w-[64px]' : 'w-[240px]'}`}>
      <div className="flex-1 overflow-y-auto overflow-x-hidden w-full custom-scrollbar">
        {/* Main Menu Header */}
        {!activeSubmenu && (
          <div className={`flex items-center h-16 ${isCollapsed ? 'px-4' : 'px-4'}`}>
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-gray-100 rounded-md text-blue-500 transition-colors">
              <Menu className="w-[22px] h-[22px]" strokeWidth={2.5} />
            </button>
          </div>
        )}

        {/* Submenu Header (e.g. Settings) */}
        {activeSubmenu && !isCollapsed && (
          <div className="flex flex-col pt-2 animate-in slide-in-from-left-4 duration-300">
            <button
              onClick={() => setActiveSubmenu(null)}
              className="flex items-center gap-2 px-4 py-2 text-[13px] text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to main menu</span>
            </button>
            <div className="flex items-center justify-between px-6 py-4 mt-2">
              <div className="flex items-center gap-3">
                {currentSubmenuData?.icon && <currentSubmenuData.icon className="w-6 h-6 text-blue-500" />}
                <h2 className="text-xl font-bold tracking-tight text-slate-900">{activeSubmenu}</h2>
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
                          `flex items-center px-4 py-2 text-[13.5px] font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
                    `flex items-center justify-between overflow-hidden py-[10px] px-3 border-l-4 rounded-r-md text-[13.5px] font-medium transition-colors ${isActive && !item.hasDropdown ? 'text-blue-600 bg-blue-100 border-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-transparent'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3 whitespace-nowrap min-w-max">
                        <item.icon className={`w-[18px] h-[18px] shrink-0 transition-colors ${isActive && !item.hasDropdown ? 'text-blue-500' : 'text-gray-400'}`} strokeWidth={2} />
                        <div className={`flex items-center transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                          <span>{item.name}</span>
                          {item.name === 'Getting Setup' && (
                            <span className="ml-[6px] px-[5px] py-[2px] rounded text-[10px] bg-[#111827] text-white font-semibold leading-none shadow-sm shrink-0">Menu</span>
                          )}
                        </div>
                      </div>
                      {item.hasDropdown && (
                        <ChevronDown className={`w-4 h-4 shrink-0 ml-2 transition-all duration-300 text-gray-400 ${isCollapsed ? 'opacity-0' : 'opacity-100'} ${expandedItems.includes(item.name) ? 'rotate-180' : ''}`} />
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
                          `block px-2 py-2 text-[13.5px] font-medium rounded-md transition-colors ${isActive ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-900'
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
      <div className={`border-t border-gray-200 text-sm text-gray-600 bg-white transition-[height,padding,opacity] duration-300 overflow-hidden ${isCollapsed ? 'h-0 opacity-0 p-0' : 'p-4 flex items-center justify-between h-[60px] opacity-100'}`}>
        <span className="font-medium text-[13px] whitespace-nowrap">Classic</span>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <div className="w-[34px] h-[18px] bg-[#0060FE] rounded-full relative flex items-center shadow-inner cursor-pointer px-[2px]">
            <div className="w-[14px] h-[14px] bg-white rounded-full ml-auto shadow-sm transform transition-transform"></div>
          </div>
          <span className="text-gray-800 font-medium text-[13px]">UI 2.0</span>
        </div>
      </div>
    </aside>
  );
}
