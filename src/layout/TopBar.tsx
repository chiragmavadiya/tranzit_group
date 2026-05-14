"use client";

import { LogOut, Sun, Moon, Monitor, Loader2, HelpCircle } from 'lucide-react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import DropdownCustomContent, {
  DropdownCustomMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/app/providers/theme-provider';
// import { OrdersTabs } from '@/features/orders/components/OrdersTabs';
import type { TabType } from '@/features/orders/types';
import { useAppSelector, useAppDispatch } from '@/hooks/store.hooks';
import { logout } from '@/features/auth/authSlice';
// import { ReportsTabs } from '@/features/reports/components/ReportsTabs';
// import { CancelOrderTabs } from '@/features/cancel-order/components/CancelOrderTabs';
import type { CancelOrderTabType } from '@/features/cancel-order/constants/cancelOrder.constants';
// import { BookPickupTabs } from '@/features/book-pickup/components/BookPickupTabs';
import type { BookPickupTabType } from '@/features/book-pickup/constants/book-pickup.constants';
import type { ReportType } from '@/features/reports/types';
import { useLogout } from '@/features/auth/hooks/useAuth';
import { CustomTooltip } from '@/components/common/CustomTooltip';
import { GlobalSearch } from '@/features/search/components/GlobalSearch';
import { lazy, Suspense } from 'react';

const OrdersTabs = lazy(() => import('@/features/orders/components/OrdersTabs').then(module => ({ default: module.OrdersTabs })));
const ReportsTabs = lazy(() => import('@/features/reports/components/ReportsTabs').then(module => ({ default: module.ReportsTabs })));
const CancelOrderTabs = lazy(() => import('@/features/cancel-order/components/CancelOrderTabs').then(module => ({ default: module.CancelOrderTabs })));
const BookPickupTabs = lazy(() => import('@/features/book-pickup/components/BookPickupTabs').then(module => ({ default: module.BookPickupTabs })));

export default function TopBar({ isCollapsed }: { isCollapsed?: boolean }) {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { theme, setTheme } = useTheme();

  const logoutMutation = useLogout();

  const handleLogout = () => {
    // on success return to /signin
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        localStorage.clear();
        dispatch(logout());
        navigate('/login');
      }
    });
  };

  const handleFaq = () => {
    // open new window
    window.open('https://tranzitgroup.com.au/faq', '_blank');
  }

  return (
    <header className={`print:hidden h-16 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-6 fixed top-0 right-0 z-10 transition-[left] duration-300 ease-in-out ${isCollapsed ? 'left-[64px]' : 'left-[240px]'}`}>
      <div className='flex justify-center flex-1'>
        <Suspense fallback={null}>
          {(location.pathname === '/orders' || location.pathname === '/admin/orders') && (
            <div className="h-16 ml-4">
              <OrdersTabs
                activeTab={(searchParams.get('tab') as TabType) || 'new'}
                onTabChange={(tab) => setSearchParams({ tab })}
              />
            </div>
          )}
          {(location.pathname === '/reports') && (
            <div className="h-16 ml-4">
              <ReportsTabs
                activeTab={(searchParams.get('tab') as ReportType) || 'shipment'}
                onTabChange={(tab) => setSearchParams({ tab })}
                className="h-full"
              />
            </div>
          )}
          {location.pathname === '/admin/cancel-order' && (
            <div className="h-16 ml-4">
              <CancelOrderTabs
                activeTab={(searchParams.get('tab') as CancelOrderTabType) || 'request'}
                onTabChange={(tab) => setSearchParams({ tab })}
                className="h-full"
              />
            </div>
          )}
          {location.pathname === '/admin/book-pickup' && (
            <div className="h-16 ml-4">
              <BookPickupTabs
                activeTab={(searchParams.get('tab') as BookPickupTabType) || 'new'}
                onTabChange={(tab) => setSearchParams({ tab })}
                className="h-full"
              />
            </div>
          )}
        </Suspense>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          {/* <Search className="absolute left-3 h-4 w-4" strokeWidth={2.5} />
          <input
            type="text"
            placeholder="Search"
            className="pl-9 pr-10 py-[7px] border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 rounded text-[13px] outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 "
          /> */}
          <GlobalSearch />
        </div>
        <DropdownCustomMenu
          menus={[
            { label: 'Light', icon: Sun, onClick: () => setTheme('light'), className: 'text-orange-500' },
            { label: 'Dark', icon: Moon, onClick: () => setTheme('dark'), className: 'text-blue-400' },
            { label: 'System', icon: Monitor, onClick: () => setTheme('system'), className: 'text-gray-500 dark:text-zinc-400' }
          ]}
        >
          <div className="flex items-center justify-center w-8 h-8 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-800 transition-colors outline-none">
            {theme === 'light' && <Sun className="h-[16px] w-[16px] text-orange-500" />}
            {theme === 'dark' && <Moon className="h-[16px] w-[16px] text-blue-400" />}
            {theme === 'system' && <Monitor className="h-[16px] w-[16px] text-gray-500 dark:text-zinc-400" />}
          </div>
        </DropdownCustomMenu>

        <DropdownCustomContent
          // menus={[
          //   { label: 'Profile', icon: User, onClick: () => navigate('/profile') },
          //   { label: 'FAQ', icon: HelpCircle, onClick: handleFaq },
          //   { label: 'Logout', icon: LogOut, onClick: handleLogout, variant: 'destructive' }
          // ]}
          content={
            <>
              <div className="p-3 mb-2 bg-slate-50 dark:bg-zinc-950/50 rounded-xl flex items-center gap-3 border border-slate-100 dark:border-zinc-800/50">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-md">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-slate-900 dark:text-zinc-100 truncate">{user?.first_name} {user?.last_name}</span>
                  <span className="text-xs text-slate-500 dark:text-zinc-500 truncate">{user?.email}</span>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />
              <DropdownMenuItem variant={"default"} onClick={handleFaq} className={"cursor-pointer py-2 px-3 text-[13px]"}>
                {<HelpCircle className="w-4 h-4 mr-2" />}
                FAQ
              </DropdownMenuItem>
              <DropdownMenuItem variant={"destructive"} onClick={handleLogout} className={"cursor-pointer py-2 px-3 text-[13px]"}>
                {<LogOut className="w-4 h-4 mr-2" />}
                Logout
              </DropdownMenuItem>
            </>
          }
          contentClassName='ring-0 border-gray-100 shadow-md p-2'
        >
          <div className='max-w-[220px] flex items-center gap-2 cursor-pointer px-[10px] py-[5px] hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-800 text-[13px] font-medium text-gray-700 dark:text-zinc-300 transition-colors outline-none h-8'>

            <div className="w-[22px] h-[22px] rounded-full pt-[2px] bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold shadow-sm">
              {logoutMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : user?.first_name?.charAt(0).toUpperCase()
              }
            </div>
            <div className="max-w-[170px]">

              <CustomTooltip title={user?.email} onlyOnOverflow>
                {user?.email}
              </CustomTooltip>
            </div>
          </div>
        </DropdownCustomContent>
      </div>
    </header>
  );
}
