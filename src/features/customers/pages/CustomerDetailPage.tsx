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
import { MOCK_DETAIL_CUSTOMER } from '../components/customer-detail/constants';

export default function CustomerDetailPage() {
    const { id } = useParams();
    console.log(id);
    const [activeTab, setActiveTab] = useState('Profile');

    const customer = MOCK_DETAIL_CUSTOMER;

    return (
        <div className="flex flex-col flex-1 gap-6 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto scrollbar-hide">
            
            <CustomerHeader customer={customer} />

            <CustomerStats />

            <div className="flex flex-col gap-6 flex-1 min-h-0">
                <CustomerTabs activeTab={activeTab} onTabChange={setActiveTab} />

                <div className="flex-1 min-h-0">
                    {activeTab === 'Profile' && <ProfileTab customer={customer} />}
                    {activeTab === 'Orders' && <OrdersTab />}
                    {activeTab === 'Transaction' && <TransactionTab />}
                    {activeTab === 'Credit Application' && <CreditApplicationTab />}
                    {activeTab === 'Invoice Management' && <InvoiceManagementTab />}

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
        </div>
    );
}
