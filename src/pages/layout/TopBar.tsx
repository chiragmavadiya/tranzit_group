import { Search, ChevronDown, LogOut, Sun, Moon, Monitor } from 'lucide-react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/theme-provider';
import { OrdersTabs } from '../orders/components/OrdersTabs';
import type { TabType } from '../orders/types';

export default function TopBar({ isCollapsed }: { isCollapsed?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/signin');
  };

  return (
    <header className={`h-16 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-6 fixed top-0 right-0 z-10 transition-[left] duration-300 ease-in-out ${isCollapsed ? 'left-[64px]' : 'left-[240px]'}`}>
      <div className='flex justify-center flex-1'>
        {location.pathname === '/orders' && (
          <div className="h-16 ml-4">
            <OrdersTabs
              activeTab={(searchParams.get('tab') as TabType) || 'new'}
              onTabChange={(tab) => setSearchParams({ tab })}
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search"
            className="pl-3 pr-10 py-[7px] border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 rounded text-[13px] outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-w-[280px]"
          />
          <button className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center border-l border-gray-300 dark:border-zinc-700 text-blue-500 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-r">
            <Search className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>



        {/* Theme Toggle Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-center w-9 h-9 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 rounded border border-gray-200 dark:border-zinc-800 transition-colors outline-none">
            {theme === 'light' && <Sun className="h-[18px] w-[18px] text-orange-500" />}
            {theme === 'dark' && <Moon className="h-[18px] w-[18px] text-blue-400" />}
            {theme === 'system' && <Monitor className="h-[18px] w-[18px] text-gray-500 dark:text-zinc-400" />}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[140px]">
            <DropdownMenuItem
              className={`cursor-pointer flex items-center gap-2 ${theme === 'light' ? 'bg-gray-100 dark:bg-zinc-800' : ''}`}
              onClick={() => setTheme('light')}
            >
              <Sun className="h-4 w-4 text-orange-500" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`cursor-pointer flex items-center gap-2 ${theme === 'dark' ? 'bg-gray-100 dark:bg-zinc-800' : ''}`}
              onClick={() => setTheme('dark')}
            >
              <Moon className="h-4 w-4 text-blue-400" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`cursor-pointer flex items-center gap-2 ${theme === 'system' ? 'bg-gray-100 dark:bg-zinc-800' : ''}`}
              onClick={() => setTheme('system')}
            >
              <Monitor className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer px-[10px] py-[5px] hover:bg-gray-50 dark:hover:bg-zinc-800 rounded border border-gray-200 dark:border-zinc-800 text-[13px] font-medium text-gray-700 dark:text-zinc-300 transition-colors outline-none">
            <div className="w-[22px] h-[22px] rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[#0060FE] dark:text-blue-400 text-xs font-semibold shadow-sm">
              z
            </div>
            <span>zack@yopmail.com</span>
            <ChevronDown className="w-3.5 h-3.5 text-blue-500 -ml-1 stroke-[2.5]" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuItem className="cursor-pointer">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="dark:bg-zinc-800" />
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/30"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
