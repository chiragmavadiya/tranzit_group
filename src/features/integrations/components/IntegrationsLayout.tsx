import React, { Suspense, useEffect } from 'react'
import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom'
import { ChevronRight, Loader2, Settings2 } from 'lucide-react'
import { useIntegrationsList } from '../hooks/useIntegrations'
import IntegrationsSidebar from './IntegrationsSidebar'
import { PROVIDERS } from '../constants'

const IntegrationsLayout: React.FC = () => {
    const { providerId } = useParams<{ providerId: string }>()
    const navigate = useNavigate()
    const location = useLocation()
    const { data: listResponse, isLoading } = useIntegrationsList()

    useEffect(() => {
        // Redirect to first provider if we are at the root integrations path
        if (location.pathname === '/integrations' || location.pathname === '/integrations/') {
            navigate(`/integrations/${PROVIDERS[0].id}`, { replace: true })
        }
    }, [location.pathname, navigate])

    const data = listResponse?.data
    const connectedProviders = React.useMemo(() => data ? [
        ...Object.keys(data.ecommerce_connections || {}).filter(key => data.ecommerce_connections[key]),
        ...Object.keys(data.courier_integrations || {}).filter(key => data.courier_integrations[key])
    ] : [], [data])

    const currentProvider = React.useMemo(() =>
        PROVIDERS.find(p => p.id === providerId), [providerId])

    return (
        <div className="flex h-full flex-col overflow-hidden bg-slate-50/30 dark:bg-zinc-950">
            {/* Header / Breadcrumbs */}
            <div className="border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 px-6 py-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400">
                        <div className="flex items-center gap-1">
                            <Settings2 className="h-3.5 w-3.5" />
                            <span>Integrations</span>
                        </div>
                        {currentProvider && (
                            <>
                                <ChevronRight className="h-3.5 w-3.5" />
                                <span className="font-medium text-slate-700 dark:text-zinc-100">
                                    {currentProvider.name}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <IntegrationsSidebar connectedProviders={connectedProviders} isLoading={isLoading} />
                <main className="flex-1 overflow-y-auto custom-scrollbar">
                    <Suspense
                        fallback={
                            <div className="flex h-full items-center justify-center">
                                <Loader2 className="animate-spin text-blue-400 h-10 w-10" />
                            </div>
                        }
                    >
                        <Outlet context={{ connectedProviders, isLoading }} />
                    </Suspense>
                </main>
            </div>
        </div>
    )
}

export default IntegrationsLayout
