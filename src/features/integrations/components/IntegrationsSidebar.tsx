import React from 'react'
import { NavLink } from 'react-router-dom'
// import { Truck, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PROVIDERS } from '../constants'
import { Skeleton } from '@/components/ui/skeleton'

interface IntegrationsSidebarProps {
    connectedProviders: string[]
    isLoading: boolean
}

const IntegrationsSidebar: React.FC<IntegrationsSidebarProps> = ({ connectedProviders, isLoading }) => {
    const courierProviders = PROVIDERS.filter(p => p.type === 'courier')
    const ecommerceProviders = PROVIDERS.filter(p => p.type === 'ecommerce')

    const renderProviderLink = (provider: typeof PROVIDERS[number]) => {
        const isConnected = connectedProviders.includes(provider.id)
        const Icon = provider.icon

        return (
            <NavLink
                key={provider.id}
                to={`/integrations/${provider.id}`}
                className={({ isActive }) =>
                    cn(
                        'flex items-center justify-between px-5 py-2 rounded-lg text-sm transition-all duration-200 group',
                        isActive
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 font-medium'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100'
                    )
                }
            >
                <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        "group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    )} />
                    <span className="truncate">{provider.name}</span>
                </div>
                {isConnected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] shrink-0" />
                )}
            </NavLink>
        )
    }

    if (isLoading) {
        return (
            <div className="w-64 border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col p-4 gap-6 h-full overflow-y-auto">
                <div className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <div className="space-y-1">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-9 w-full" />)}
                    </div>
                </div>
                <div className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <div className="space-y-1">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-9 w-full" />)}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <aside className="w-64 border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col h-full overflow-y-auto custom-scrollbar">
            <div className="p-4 space-y-6">
                {/* Courier Section */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 px-3">
                        {/* <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" /> */}
                        <h3 className="my-0 text-[11px] font-bold text-slate-600 dark:text-zinc-500 uppercase tracking-wider">
                            Courier Integrations
                        </h3>
                    </div>
                    <div className="space-y-0.5">
                        {courierProviders.map(renderProviderLink)}
                    </div>
                </div>

                {/* Ecommerce Section */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 px-3">
                        {/* <ShoppingCart className="w-3.5 h-3.5 text-purple-600 shrink-0" /> */}
                        <h3 className="my-0 text-[11px] font-bold text-slate-600 dark:text-zinc-500 uppercase tracking-wider">
                            E-commerce Integrations
                        </h3>
                    </div>
                    <div className="space-y-0.5">
                        {ecommerceProviders.map(renderProviderLink)}
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default IntegrationsSidebar
