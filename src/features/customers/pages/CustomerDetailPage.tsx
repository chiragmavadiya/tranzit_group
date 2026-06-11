import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { CustomerHeader } from '../components/customer-detail/CustomerHeader';
import { CustomerStats } from '../components/customer-detail/CustomerStats';
import { CustomerTabs } from '../components/customer-detail/CustomerTabs';
import { CUSTOMER_TABS } from '../components/customer-detail/constants';
import { ProfileTab } from '../components/customer-detail/ProfileTab';
import { OrdersTab } from '../components/customer-detail/OrdersTab';
import { TransactionTab } from '../components/customer-detail/TransactionTab';
import { CreditApplicationTab } from '../components/customer-detail/CreditApplicationTab';
import { InvoiceManagementTab } from '../components/customer-detail/InvoiceManagementTab';
import { useCustomerDetails } from '../hooks/useCustomers';
import CustomerDialog from '../components/CustomerDialog';
import { CustomerIntegrationTab } from '../components/customer-detail/CustomerIntegrationTab';

export default function CustomerDetailPage() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const tabParam = searchParams.get('customerTab');
    const activeTab = CUSTOMER_TABS.find(t => t.toLowerCase() === tabParam?.toLowerCase()) || 'Profile';
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const { data: response, isLoading } = useCustomerDetails(id as string);
    const customer = response?.data;

    if (isLoading) {
        return (
            <div className="flex flex-col flex-1 items-center justify-center p-page-padding h-full">
                <span className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
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
        <div className="flex flex-col flex-1 gap-4 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto scrollbar-hide">

            <CustomerHeader
                customer={customer as any}
                onEdit={() => setIsEditDialogOpen(true)}
            />

            {/* Note: Stats uses its own logic or requires more fields. Might need adjustment if stats endpoints are provided in future */}
            <CustomerStats customer={customer} />

            <div className="flex flex-col gap-4 flex-1">
                <CustomerTabs />

                <div className="flex-1">
                    {activeTab === 'Profile' && (
                        <ProfileTab
                            customerId={id as string}
                        // onEdit={() => setIsEditDialogOpen(true)} 
                        />
                    )}
                    {activeTab === 'Orders' && <OrdersTab customerId={id as string} />}
                    {activeTab === 'Transaction' && <TransactionTab customerId={id as string} />}
                    {activeTab === 'Credit Application' && <CreditApplicationTab />}
                    {activeTab === 'Invoice Management' && <InvoiceManagementTab customerId={id as string} />}
                    {activeTab === 'Integration' && <CustomerIntegrationTab customerId={id as string} />}
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

