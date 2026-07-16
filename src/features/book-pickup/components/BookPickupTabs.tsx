import { cn } from '@/lib/utils';
import { BOOK_PICKUP_TABS } from '../constants/book-pickup.constants';
import type { BookPickupTabType } from '../constants/book-pickup.constants';
import { useBookPickupCounts } from '../hooks/useBookPickup';
import ModuleTabs from '@/components/common/ModuleTabs';
import { LayoutGroup } from 'framer-motion';

import { FormSelect } from '@/features/orders/components/OrderFormUI';

interface BookPickupTabsProps {
    activeTab: BookPickupTabType;
    onTabChange: (tab: BookPickupTabType) => void;
    className?: string;
}

export function BookPickupTabs({ activeTab, onTabChange, className }: BookPickupTabsProps) {
    const { data: countsData } = useBookPickupCounts();

    return (
        <>
            <LayoutGroup id="book-pickup-tabs">
                <nav className={cn("hidden tablet:flex h-full items-end gap-6", className)} aria-label="Book Pickup Tabs">
                    {BOOK_PICKUP_TABS.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const count = tab.id === 'new'
                            ? (countsData?.data?.new ?? 0)
                            : (countsData?.data?.booked ?? 0);

                        return (
                            <ModuleTabs
                                key={tab.id}
                                tab={tab.id}
                                tabKey={tab.label}
                                onTabChange={(tabId) => onTabChange(tabId as BookPickupTabType)}
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
                        if (val) onTabChange(val as BookPickupTabType);
                    }}
                    options={BOOK_PICKUP_TABS.map((tab) => {
                        const count = tab.id === 'new'
                            ? (countsData?.data?.new ?? 0)
                            : (countsData?.data?.booked ?? 0);
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
