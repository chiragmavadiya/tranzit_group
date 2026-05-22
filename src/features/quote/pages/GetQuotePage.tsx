"use client";

import { useState, useMemo } from 'react';
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

export default function GetQuotePage() {
  const { role, user } = useAppSelector((state) => state.auth);
  const isAdmin = role === 'admin';
  const [margin, setMargin] = useState<string>('0');
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const navigate = useNavigate();

  const {
    itemsData,
    updateItem,
    fullUpdateItem,
    addItem,
    removeItem,
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
    const grandTotal = Number(servicePrice) + Number(gst) + Number(totalSurcharges) + Number(marginPrice);
    return { totalItems, totalWeight, volumetric, servicePrice, gst, totalSurcharges, grandTotal, margin: marginPrice }
  }, [itemsData, quoteData, margin])


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
    const mapLocationToAddress = (
      loc: QuoteLocation | null,
      defaultName = '',
      defaultEmail = '',
      defaultPhone = '',
      defaultCompany = ''
    ) => {
      if (!loc) return {
        email: defaultEmail,
        phone: defaultPhone,
        company: defaultCompany,
        address: '',
        address1: '',
        suburb: '',
        state: '',
        street_name: '',
        unit_number: '',
        street_number: '',
        postcode: '',
        country: '',
        name: defaultName,
        saveToAddressBook: false,
      };
      return {
        email: defaultEmail,
        phone: defaultPhone,
        company: defaultCompany,
        address: loc.label || '',
        address1: loc.address1 || loc.label || '',
        suburb: loc.suburb || '',
        state: loc.state || '',
        street_name: loc.street_name || '',
        unit_number: '',
        street_number: loc.street_number || '',
        street_type: loc.street_type || '',
        postcode: loc.postcode || '',
        country: loc.country || 'Australia',
        name: defaultName,
        saveToAddressBook: false,
      };
    };

    const senderData = mapLocationToAddress(
      locations.sender,
      `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
      user?.email || '',
      user?.office_number || '',
      user?.company_name || ''
    );
    const receiverData = mapLocationToAddress(locations.receiver);

    sessionStorage.setItem('quote_sender', JSON.stringify(senderData));
    sessionStorage.setItem('quote_receiver', JSON.stringify(receiverData));
    sessionStorage.setItem('quote_items', JSON.stringify(itemsData));
    sessionStorage.setItem('quote_courier', JSON.stringify(quoteData));

    navigate('/orders/create');
  };

  return (
    <>
      <div className="p-page-padding animate-in fade-in duration-700 overflow-auto">
        <div className="flex flex-col gap-8">
          {/* <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-[#111827] dark:text-white">Get Quote</h1>
        </div> */}

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
                onSendQuote={() => setIsSendDialogOpen(true)}
                isValid={isValid}
                quoteData={quoteData}
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
            pickupCharge={0}

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
