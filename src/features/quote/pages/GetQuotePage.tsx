"use client";

import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuoteForm } from '../components/QuoteForm';
import { QuoteSummary } from '../components/QuoteSummary';
import { SendQuoteDialog } from '../../customer-quote/components/SendQuoteDialog';
import { useAppSelector } from '@/hooks/store.hooks';
import type { QuoteLocation } from '../types';
import { ItemsTable } from '@/features/orders/components/order-details/ItemsTable';
import { useOrderItems } from '@/features/orders/hooks/useOrderItems';
import { CarrierCard } from '@/features/orders/components/order-details/CarrierCard';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import { useDefaultItem } from '@/features/items/hooks/useItems';

export default function GetQuotePage() {
  const { role } = useAppSelector((state) => state.auth);
  const isAdmin = role === 'admin';
  const { data: defaultItem } = useDefaultItem(role !== 'admin')
  const [margin, setMargin] = useState<string>('0');
  const [pickupCharge, setPickupCharge] = useState<string>('0');
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const navigate = useNavigate();

  const {
    itemsData,
    updateItem,
    fullUpdateItem,
    addItem,
    removeItem,
    setItemsData
  } = useOrderItems([
    {
      type: "box",
      quantity: 1,
      weight: 0,
      length: 0,
      width: 0,
      height: 0
    }
  ])
  const [locations, setLocations] = useState<{ sender: QuoteLocation | null; receiver: QuoteLocation | null }>({
    sender: null,
    receiver: null
  });
  // const [courierData, setCourierData] = useState<any>({});
  const [quoteData, setQuoteData] = useState<any>({});

  const calculation = useMemo(() => {
    const totalItems = itemsData?.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0) || 0;
    const totalWeight = itemsData?.reduce((acc, item) => acc + (Number(item.weight) * (Number(item.quantity) || 1)), 0) || 0;
    const volumetric = itemsData?.reduce((acc, item) => {
      const w = Number(item.width) || 0;
      const h = Number(item.height) || 0;
      const l = Number(item.length) || 0;
      const q = Number(item.quantity) || 1;
      return acc + ((w * h * l) / 1000000) * q;
    }, 0) || 0;

    const servicePrice = quoteData?.courier?.base || quoteData?.subtotal || 0;
    const gst = quoteData?.courier?.gst || quoteData?.tax || 0;
    const totalSurcharges = quoteData?.totalSurcharges || 0;
    const marginPrice = (Number(servicePrice) * Number(margin)) / 100;
    const grandTotal = Number(servicePrice) + Number(gst) + Number(totalSurcharges) + Number(marginPrice) + Number(pickupCharge || 0);
    return { totalItems, totalWeight, volumetric, servicePrice, gst, totalSurcharges, grandTotal, margin: marginPrice, pickupCharge: Number(pickupCharge || 0) }
  }, [itemsData, quoteData, margin, pickupCharge])


  const isValid = useMemo(() => {
    return (
      locations.sender !== null &&
      locations.receiver !== null &&
      itemsData.length > 0 &&
      itemsData.every(item => item.weight > 0 && item.length > 0 && item.width > 0 && item.height > 0)
    );
  }, [locations, itemsData]);

  const canCreateOrder = useMemo(() => {
    return isValid && quoteData?.courier;
  }, [isValid, quoteData]);

  const handleCreateOrder = () => {
    sessionStorage.setItem('quote_items', JSON.stringify(itemsData));
    sessionStorage.setItem('quote_courier', JSON.stringify(quoteData));

    navigate('/orders/create');
  };

  useEffect(() => {
    if (defaultItem?.data) {
      setItemsData([{
        type: "box",
        quantity: 1,
        weight: defaultItem.data.item_weight!,
        length: defaultItem.data.item_length!,
        width: defaultItem.data.item_width!,
        height: defaultItem.data.item_height!
      }])
    }
  }, [defaultItem, setItemsData])


  return (
    <>
      <div className="p-page-padding animate-in flex-1 fade-in duration-700 overflow-auto">
        <div className="flex flex-col gap-3">
          {isAdmin && (
            <div className="flex items-center justify-end">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/quotes/history')}
              >
                <History className='w-4 h-4' />Quote History
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
            {/* Main Form Area */}
            <div className="xl:col-span-8 space-y-4">
              <QuoteForm
                locations={locations}
                setLocations={setLocations}
              />
              <ItemsTable
                items={itemsData}
                onUpdateItem={updateItem}
                onFullUpdateItem={fullUpdateItem}
                addItem={addItem}
                removeItem={removeItem}

              />

              {/* Services Section */}
              <CarrierCard
                itemData={itemsData}
                addresses={locations}
                module="quote"
                onQuoteChange={setQuoteData}
              // setCourierData={setCourierData}
              // orderDetail={orderDetail}
              />
            </div>

            <div className="xl:col-span-4 sticky top-0">
              <QuoteSummary
                calculation={calculation}
                isAdmin={isAdmin}
                margin={margin}
                setMargin={setMargin}
                pickupCharge={pickupCharge}
                setPickupCharge={setPickupCharge}
                onSendQuote={() => setIsSendDialogOpen(true)}
                isValid={isValid}
              // quoteData={quoteData}
              />
            </div>
          </div>
        </div>

        {isAdmin && (
          <SendQuoteDialog
            open={isSendDialogOpen}
            onOpenChange={setIsSendDialogOpen}
            calculations={calculation}
            courierData={quoteData?.courier}
            locations={locations}
            items={itemsData}
            margin={margin}
            pickupCharge={Number(pickupCharge || 0)}

          />
        )}

      </div>
      {canCreateOrder && (
        <div className="sticky bottom-0 -left-5 right-20 bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 p-3 flex justify-center items-center gap-3 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_10px_rgba(0,0,0,0.2)] transition-colors duration-300">
          <Button
            onClick={handleCreateOrder}
            variant="default"
            className="flex items-center gap-2 h-8 px-6 uppercase text-xs font-bold bg-primary hover:bg-primary/95 text-white shadow-sm"
          >
            Create Order
          </Button>
        </div>
      )}
    </>
  );
}
