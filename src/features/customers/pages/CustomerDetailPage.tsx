import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { CustomerHeader } from '../components/customer-detail/CustomerHeader';
import { CustomerStats } from '../components/customer-detail/CustomerStats';
import { CustomerTabs } from '../components/customer-detail/CustomerTabs';
import { ProfileTab } from '../components/customer-detail/ProfileTab';
import { OrdersTab } from '../components/customer-detail/OrdersTab';
import { TransactionTab } from '../components/customer-detail/TransactionTab';
import { CreditApplicationTab } from '../components/customer-detail/CreditApplicationTab';
import { InvoiceManagementTab } from '../components/customer-detail/InvoiceManagementTab';
import { useCustomerDetails } from '../hooks/useCustomers';
import CustomerDialog from '../components/CustomerDialog';

export default function CustomerDetailPage() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('Profile');
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const { data: response, isLoading } = useCustomerDetails(id as string);
    const customer = response?.data;

    if (isLoading) {
        return (
            <div className="flex flex-col flex-1 items-center justify-center p-page-padding h-full">
                <span className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="flex flex-col flex-1 items-center justify-center p-page-padding h-full">
                <p className="text-slate-500">Customer not found.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1 gap-6 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto scrollbar-hide">

            <CustomerHeader
                customer={customer as any}
                onEdit={() => setIsEditDialogOpen(true)}
            />

            {/* Note: Stats uses its own logic or requires more fields. Might need adjustment if stats endpoints are provided in future */}
            <CustomerStats />

            <div className="flex flex-col gap-6 flex-1">
                <CustomerTabs activeTab={activeTab} onTabChange={setActiveTab} />

                <div className="flex-1">
                    {activeTab === 'Profile' && <ProfileTab customerId={id as string} />}
                    {activeTab === 'Orders' && <OrdersTab customerId={id as string} />}
                    {activeTab === 'Transaction' && <TransactionTab customerId={id as string} />}
                    {activeTab === 'Credit Application' && <CreditApplicationTab />}
                    {activeTab === 'Invoice Management' && <InvoiceManagementTab customerId={id as string} />}

                    {activeTab === 'Integration' && (
                        <div className="flex h-64 items-center justify-center rounded-3xl bg-white dark:bg-zinc-900 shadow-lg border border-white dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-500">
                            <div className="flex flex-col items-center gap-4 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-500">
                                    <Clock className="h-8 w-8" />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Content Coming Soon</h3>
                                    <p className="text-xs text-slate-400 uppercase tracking-[0.2em] mt-1">This section is currently under development</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <CustomerDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                customerId={id}
            />
        </div>
    );
}

