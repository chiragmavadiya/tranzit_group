"use client";

import { LogOut, Sun, Moon, Monitor, Loader2, User, Wallet, Menu, Search, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation, useSearchParams, useParams } from 'react-router-dom';
import DropdownCustomContent, {
  DropdownCustomMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/app/providers/theme-provider';
import tranzit_logo from '@/assets/Tranzit_Logo.svg';
import tranzit_logo_dark from '@/assets/Tranzit_Logo_dark.svg';
import Favicon from '@/assets/favicon.png';
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
import { GlobalSearch } from '@/features/search/components/GlobalSearch';
import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { useWalletSummary } from '@/features/wallet/hooks/useWallet';
import { AccountSwitchDialog } from '@/features/profile/components/AccountSwitchDialog';
import { BookPickupDialog } from '@/features/book-pickup/components/BookPickupDialog';
import { cn, formateCurrency } from '@/lib/utils';
import { Package } from 'lucide-react';
import * as Sentry from "@sentry/react";

const OrdersTabs = lazy(() => import('@/features/orders/components/OrdersTabs').then(module => ({ default: module.OrdersTabs })));
const ReportsTabs = lazy(() => import('@/features/reports/components/ReportsTabs').then(module => ({ default: module.ReportsTabs })));
const CancelOrderTabs = lazy(() => import('@/features/cancel-order/components/CancelOrderTabs').then(module => ({ default: module.CancelOrderTabs })));
const BookPickupTabs = lazy(() => import('@/features/book-pickup/components/BookPickupTabs').then(module => ({ default: module.BookPickupTabs })));

export default function TopBar({
  isCollapsed,
  isMobile = false,
  setIsMobileSidebarOpen = () => { },
  bannerOpen = false,
}: {
  isCollapsed?: boolean;
  isMobile?: boolean;
  setIsMobileSidebarOpen?: (val: boolean) => void;
  bannerOpen?: boolean;
}) {
  console.log("Render Topbar")

  const { user, is_sub_user, team_access } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { id: customer_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const canReadWriteProfile = useMemo(() => !is_sub_user || team_access?.permissions?.settings_account_detail !== 'no_access', [is_sub_user, team_access]);

  const { theme, setTheme } = useTheme();
  const [isAccountSwitchOpen, setIsAccountSwitchOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBookPickupOpen, setIsBookPickupOpen] = useState(false);

  const logoutMutation = useLogout();
  const role = localStorage.getItem("user_role") || "customer";
  const { data: walletData } = useWalletSummary(role === 'customer');

  const handleLogout = () => {
    // on success return to /signin
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        localStorage.clear();
        Sentry.setUser(null);
        dispatch(logout());
        navigate('/login');
      }
    });
  };

  // const handleFaq = () => {
  //   // open new window
  //   window.open(import.meta.env.TRANZIRGROUP_FAQ_URL || 'https://tranzitgroup.com.au/faq', '_blank');
  // }

  const handleTabChange = useCallback((tab: string) => {
    setSearchParams(prev => {
      prev.set('tab', tab);
      return prev;
    });
  }, [setSearchParams]);
  const handleProfile = () => {
    // open new window
    if (role === 'admin') {
      navigate('/admin/profile');
    } else {
      navigate('/settings/account');

    }
  }

  const redirectToHome = () => {
    navigate(`${role === 'admin' ? '/admin' : ''}/orders`);
  }
  return (
    <header
      style={bannerOpen ? { top: '36px' } : {}}
      className={cn(
        "print:hidden h-16 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-2 sm:px-4 fixed top-0 right-0 z-10 transition-[left,top] duration-300 ease-in-out",
        isMobile
          ? "left-0"
          : (isCollapsed ? 'left-[64px]' : 'left-[240px]')
      )}
    >
      {/* Left Portion: Hamburguer & Logo */}
      <div className="flex items-center gap-2 shrink-0">
        {isMobile && (
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-md text-primary transition-colors shrink-0 cursor-pointer"
          >
            <Menu className="w-[22px] h-[22px]" strokeWidth={2.5} />
          </button>
        )}
        <div className={cn(
          "flex items-center transition-all duration-300 ease-in-out",
          isMobile
            ? "w-[32px] tablet:w-[120px] opacity-100 mr-2 sm:mr-4"
            : (isCollapsed ? 'w-[120px] opacity-100 mr-4' : 'w-0 opacity-0 pointer-events-none overflow-hidden mr-0')
        )}>
          <div className="relative hidden tablet:block h-8 sm:h-10 w-28 cursor-pointer shrink-0" onClick={redirectToHome}>
            <img
              src={tranzit_logo}
              alt="Tranzit"
              className={cn(
                "absolute inset-0 h-full w-full object-contain transition-all duration-500 ease-in-out",
                theme === "dark" ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
              )}
            />
            <img
              src={tranzit_logo_dark}
              alt="Tranzit"
              className={cn(
                "absolute inset-0 h-full w-full object-contain transition-all duration-500 ease-in-out",
                theme === "dark" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
              )}
            />
          </div>
          <img src={theme === "dark" ? Favicon : Favicon} alt="Tranzit" className="rounded block tablet:hidden h-8 sm:h-10 max-w-none cursor-pointer" onClick={redirectToHome} />
        </div>
      </div>

      {/* Center Portion: Scrollable Tabs */}
      <div className='flex flex-1 overflow-x-auto no-scrollbar min-w-0 h-full items-end px-2' style={{ justifyContent: 'safe center' }}>
        <Suspense fallback={null}>
          {(location.pathname === '/orders' || location.pathname === '/admin/orders' || searchParams.get('customerTab') === 'Orders') && (
            <div className="h-16 shrink-0">
              <OrdersTabs
                activeTab={(searchParams.get('tab') as TabType) || 'new'}
                onTabChange={handleTabChange}
                customerId={customer_id || searchParams.get('customerId') as string}
              />
            </div>
          )}
          {(location.pathname === '/reports') && (
            <div className="h-16 shrink-0">
              <ReportsTabs
                activeTab={(searchParams.get('tab') as ReportType) || 'shipment'}
                onTabChange={handleTabChange}
                className="h-full"
              />
            </div>
          )}
          {location.pathname === '/admin/cancel-order' && (
            <div className="h-16 shrink-0">
              <CancelOrderTabs
                activeTab={(searchParams.get('tab') as CancelOrderTabType) || 'request'}
                onTabChange={handleTabChange}
                className="h-full"
              />
            </div>
          )}
          {location.pathname === '/admin/book-pickup' && (
            <div className="h-16 shrink-0">
              <BookPickupTabs
                activeTab={(searchParams.get('tab') as BookPickupTabType) || 'new'}
                onTabChange={handleTabChange}
                className="h-full"
              />
            </div>
          )}
        </Suspense>
      </div>

      {/* Right Portion: Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
        {role === 'customer' && (
          <button
            onClick={() => setIsBookPickupOpen(true)}
            className="flex items-center justify-center sm:gap-1.5 w-8 sm:w-auto h-8 px-0 sm:px-3 rounded-md bg-primary hover:bg-primary-hover text-white text-[12px] sm:text-[13px] font-semibold shadow-sm transition-all active:scale-[0.97] shrink-0 cursor-pointer"
            title="Book a Pickup"
          >
            <Package className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Book a Pickup</span>
          </button>
        )}

        {role === 'customer' && walletData?.data && (() => {
          const isZero = Number(walletData.data.wallet_balance) <= 0;
          return (
            <div className={cn(
              "hidden tablet:flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 h-8 rounded-md border text-[11px] sm:text-[13px] font-bold shadow-sm transition-all duration-300 cursor-default select-none shrink-0",
              isZero
                ? "bg-red-50 dark:bg-red-950/30 border-red-200/50 dark:border-red-900/30 text-red-500 dark:text-red-400 hover:bg-red-100/50 dark:hover:bg-red-950/50"
                : "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/50"
            )}>
              <Wallet className={cn("w-3.5 h-3.5", isZero ? "text-red-500 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400")} />
              <span className="leading-relaxed">
                <span className="hidden xl:inline">Wallet Balance: </span>
                {formateCurrency(Number(walletData.data.wallet_balance))}
              </span>
            </div>
          );
        })()}

        {/* {isMobile ? (
        ) : (
        )} */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex small-laptop:hidden items-center justify-center w-8 h-8 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-800 transition-colors outline-none shrink-0"
        >
          <Search className="h-[16px] w-[16px] text-gray-500 dark:text-zinc-400" />
        </button>
        <div className="small-laptop:flex hidden relative items-center w-[160px] lg:w-[220px] xl:w-[260px] 2xl:w-[300px]">
          <GlobalSearch className="w-full h-8 text-[13px]" />
        </div>

        <div className="hidden sm:block">
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
        </div>

        <DropdownCustomContent
          content={
            <>
              <div className="p-3 mb-2 bg-slate-50 dark:bg-zinc-950/50 rounded-xl flex gap-3 border border-slate-100 dark:border-zinc-800/50">
                <div className="h-8 w-8 text-[11px] rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-md shrink-0">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-slate-900 dark:text-zinc-100 truncate">{user?.first_name} {user?.last_name}</span>
                  <span className="text-xs text-slate-500 dark:text-zinc-500 truncate">{user?.email}</span>
                  {role === 'customer' && walletData?.data && (() => {
                    const isZero = Number(walletData.data.wallet_balance) <= 0;
                    return (
                      <span className={cn(
                        "text-xs font-semibold mt-1 flex items-center gap-1.5",
                        isZero ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
                      )}>
                        <span className={cn("inline-block w-1.5 h-1.5 rounded-full animate-pulse", isZero ? "bg-red-500" : "bg-emerald-500")}></span>
                        Wallet Balance: {formateCurrency(Number(walletData.data.wallet_balance))}
                      </span>
                    );
                  })()}
                </div>
              </div>
              <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />
              {isMobile && (
                <>
                  <div className="px-3 py-1 text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wide">
                    Theme
                  </div>
                  <DropdownMenuItem variant={"default"} onClick={() => setTheme('light')} className={"cursor-pointer py-1.5 px-3 text-[13px] text-orange-500"}>
                    <Sun className="w-4 h-4 mr-2 text-orange-500" />
                    Light Mode
                  </DropdownMenuItem>
                  <DropdownMenuItem variant={"default"} onClick={() => setTheme('dark')} className={"cursor-pointer py-1.5 px-3 text-[13px] text-blue-400"}>
                    <Moon className="w-4 h-4 mr-2 text-blue-400" />
                    Dark Mode
                  </DropdownMenuItem>
                  <DropdownMenuItem variant={"default"} onClick={() => setTheme('system')} className={"cursor-pointer py-1.5 px-3 text-[13px] text-gray-500 dark:text-zinc-400"}>
                    <Monitor className="w-4 h-4 mr-2 text-gray-500 dark:text-zinc-400" />
                    System Mode
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />
                </>
              )}
              {canReadWriteProfile && (
                <DropdownMenuItem variant={"default"} onClick={handleProfile} className={"cursor-pointer py-2 px-3 text-[13px]"}>
                  {<User className="w-4 h-4 mr-2" />}
                  Edit Profile
                </DropdownMenuItem>
              )}
              {/* <DropdownMenuItem variant={"default"} onClick={() => setIsAccountSwitchOpen(true)} className={"cursor-pointer py-2 px-3 text-[13px]"}>
                {<ArrowLeftRight className="w-4 h-4 mr-2" />}
                Account Switch
              </DropdownMenuItem> */}
              {/* <DropdownMenuItem variant={"default"} onClick={handleFaq} className={"cursor-pointer py-2 px-3 text-[13px]"}>
                {<HelpCircle className="w-4 h-4 mr-2" />}
                FAQ
              </DropdownMenuItem> */}
              <DropdownMenuItem variant={"destructive"} onClick={handleLogout} className={"cursor-pointer py-2 px-3 text-[13px]"}>
                {<LogOut className="w-4 h-4 mr-2" />}
                Logout
              </DropdownMenuItem>
            </>
          }
          contentClassName='ring-0 border-gray-100 shadow-md p-2'
          triggerClassName="rounded-full shrink-0"
        >
          <div className="w-[32px] h-[32px] rounded-full pt-[2px] bg-primary/20 text-primary flex items-center justify-center text-xs font-semibold shadow-sm">
            {logoutMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (user?.first_name?.[0] || '') + (user?.last_name?.[0] || '')}
          </div>
        </DropdownCustomContent>
      </div>

      {isSearchOpen && (
        <div className="absolute small-laptop:hidden   inset-0 bg-white dark:bg-zinc-950 z-20 flex items-center px-4 gap-3 animate-in fade-in duration-200">
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-md text-gray-500 dark:text-zinc-400 transition-colors shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <GlobalSearch className="w-full h-8" placeholder="Search orders, invoices..." />
          </div>
        </div>
      )}
      <AccountSwitchDialog
        open={isAccountSwitchOpen}
        onOpenChange={setIsAccountSwitchOpen}
      />
      {role === 'customer' && isBookPickupOpen && (
        <BookPickupDialog
          open={isBookPickupOpen}
          onOpenChange={setIsBookPickupOpen}
          defaultAddress={(user?.addresses[0]?.address_info || `${user?.addresses[0]?.address}, ${user?.addresses[0]?.suburb} ${user?.addresses[0]?.state} ${user?.addresses[0]?.postcode} `) ?? ''}
        />
      )}
    </header>
  );
}
