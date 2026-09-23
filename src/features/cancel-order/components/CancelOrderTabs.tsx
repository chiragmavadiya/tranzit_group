import { cn } from '@/lib/utils';
import { CANCEL_ORDER_TABS, type CancelOrderTabType } from '../constants/cancelOrder.constants';
import { useCancelOrderCounts } from '../hooks/useCancelOrder';
import { useSearchParams } from 'react-router-dom';
import ModuleTabs from '@/components/common/ModuleTabs';
import { LayoutGroup } from 'framer-motion';

import { FormSelect } from '@/features/orders/components/OrderFormUI';

interface CancelOrderTabsProps {
    activeTab: CancelOrderTabType;
    onTabChange: (tab: CancelOrderTabType) => void;
    className?: string;
}

export function CancelOrderTabs({ activeTab, onTabChange, className }: CancelOrderTabsProps) {
    const [searchParams] = useSearchParams();
    const customer = searchParams.get('customer');
    const { data: countsData } = useCancelOrderCounts({ customer });

    return (
        <>
            <LayoutGroup id="cancel-order-tabs">
                <nav className={cn("hidden tablet:flex h-full items-end gap-6", className)} aria-label="Cancel Order Tabs">
                    {CANCEL_ORDER_TABS.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const count = tab.id === 'request'
                            ? (countsData?.data?.cancel_request ?? 0)
                            : (countsData?.data?.canceled_order ?? 0);

                        return (
                            <ModuleTabs
                                key={tab.id}
                                tab={tab.id}
                                tabKey={tab.label}
                                onTabChange={(tabId) => onTabChange(tabId as CancelOrderTabType)}
                                isActive={isActive}
                                count={Number(count)}
                            />
                        );
                    })}
                </nav>
            </LayoutGroup>

            <div className="flex tablet:hidden h-full items-center px-1">
                <FormSelect
                    value={activeTab}
                    onValueChange={(val) => {
                        if (val) onTabChange(val as CancelOrderTabType);
                    }}
                    options={CANCEL_ORDER_TABS.map((tab) => {
                        const count = tab.id === 'request'
                            ? (countsData?.data?.cancel_request ?? 0)
                            : (countsData?.data?.canceled_order ?? 0);
                        return {
                            label: `${tab.label} (${count})`,
                            value: tab.id,
                        };
                    })}
                    placeholder="Select tab"
                    allowClear={false}
                    searchdisable={true}
                    className="w-[160px]"
                    selectClassName="h-8 [&_input]:text-[12px]! font-semibold"
                    optionClassName="text-[12px]!"
                />
            </div>
        </>
    );
}

