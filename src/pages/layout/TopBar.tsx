import { Search, ChevronDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function TopBar({ isCollapsed }: { isCollapsed?: boolean }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/signin');
  };

  return (
    <header className={`h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 right-0 z-10 transition-[left] duration-300 ease-in-out ${isCollapsed ? 'left-[64px]' : 'left-[240px]'}`}>
      <div className="flex items-center">
        <h1 className="text-[26px] font-black tracking-tighter text-[#0060FE]">Starshipit</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search"
            className="pl-3 pr-10 py-[7px] border border-gray-300 rounded text-[13px] outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-w-[280px]"
          />
          <button className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center border-l border-gray-300 text-blue-500 hover:bg-gray-50 rounded-r">
            <Search className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer px-[10px] py-[5px] hover:bg-gray-50 rounded border border-gray-200 text-[13px] font-medium text-gray-700 transition-colors outline-none">
            <div className="w-[22px] h-[22px] rounded-full bg-blue-100 flex items-center justify-center text-[#0060FE] text-xs font-semibold shadow-sm">
              z
            </div>
            <span>zack@yopmail.com</span>
            <ChevronDown className="w-3.5 h-3.5 text-blue-500 -ml-1 stroke-[2.5]" />
          </DropdownMenuTrigger>
          {/* <DropdownMenuContent align="end" className="w-[180px] transition-[opacity,margin] duration data-[state=open]:opacity-100 data-[state=closed]:opacity-0"> */}
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuItem className="cursor-pointer">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
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
