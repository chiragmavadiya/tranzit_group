import { useState, useMemo, useCallback, Fragment } from 'react';
import type { QuoteItem, ServiceRate } from '@/features/quote/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, RefreshCw, Box, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormRadio, FormCheckbox } from '@/features/orders/components/OrderFormUI';
import { cn } from '@/lib/utils';

const SURCHARGES = [
  { id: 'airport', name: 'Airport Delivery Surcharge', description: 'Additional charge for airport deliveries.', price: 25.00 },
  { id: 'exhibition', name: 'Exhibition Centre Surcharge', description: 'Per consignment note (per Delivery / Pickup).', price: 200.00 },
  { id: 'palletising', name: 'Palletising', description: 'Charge for palletising loose freight.', price: 25.00 },
  { id: 'tailgate', name: 'Tailgate Pickup / Delivery', description: 'Tailgate service required at pickup or delivery.', price: 45.00 },
];

import { useGetQuoteServices } from '@/features/quote/hooks/useQuote';
import { toast } from 'sonner';
import { OrderSummary } from './components/OrderSummary';
import type { CustomerAddress, OrderCalculations } from './types';
import { OrderAddressForm } from './components/OrderAddressForm';

const initialAddress: CustomerAddress = {
  contact_name: '',
  business_name: '',
  street_address: '',
  unit: '',
  street_number: '',
  street_name: '',
  suburb: '',
  state: '',
  postcode: '',
  phone: '',
  email: '',
  country: 'Australia',
  label: '',
  save_to_address_book: false
};

export default function CreateOrderPage() {

  const [items, setItems] = useState<QuoteItem[]>([
    { id: crypto.randomUUID(), type: 'Parcel', qty: 1, weight: 0, length: 0, width: 0, height: 0 }
  ]);
  const [locations, setLocations] = useState<{ sender: CustomerAddress; receiver: CustomerAddress }>({
    sender: { ...initialAddress },
    receiver: { ...initialAddress }
  });
  const [rates, setRates] = useState<ServiceRate[] | null>(null);
  const [selectedRateId, setSelectedRateId] = useState<string | null>(null);
  const [selectedSurcharges, setSelectedSurcharges] = useState<string[]>([]);

  const { mutate: getServices, isPending: loading } = useGetQuoteServices();

  const calculations = useMemo<OrderCalculations>(() => {
    let deadWeight = 0;
    let volumetricWeight = 0;
    let totalItems = 0;

    items.forEach(item => {
      const qty = item.qty || 1;
      totalItems += qty;
      deadWeight += item.weight * qty;
      volumetricWeight += ((item.length * item.width * item.height) / 5000) * qty;
    });

    const selectedRate = rates?.find(r => r.product_id === selectedRateId) || (rates?.[0] || null);
    const serviceCost = selectedRate ? selectedRate.price : 0;
    const gst = selectedRate ? selectedRate.gst : (serviceCost * 0.1);

    const surcharges = selectedSurcharges.reduce((acc, id) => {
      const surcharge = SURCHARGES.find(s => s.id === id);
      return acc + (surcharge?.price || 0);
    }, 0);

    const baseTotal = serviceCost + gst + surcharges;

    return {
      totalItems,
      deadWeight,
      volumetricWeight,
      serviceCost,
      gst,
      surcharges,
      total: baseTotal
    };
  }, [items, rates, selectedRateId, selectedSurcharges]);

  const isValid = useMemo(() => {
    return (
      locations.sender.suburb !== '' &&
      locations.receiver.suburb !== '' &&
      items.length > 0 &&
      items.every(item => item.weight > 0 && item.length > 0 && item.width > 0 && item.height > 0)
    );
  }, [locations, items]);

  const handleGetRate = useCallback(() => {
    if (!locations.sender.suburb || !locations.receiver.suburb) return;

    const payload = {
      sender_details: `${locations.sender.postcode}|${locations.sender.suburb}|${locations.sender.state}`,
      receiver_details: `${locations.receiver.postcode}|${locations.receiver.suburb}|${locations.receiver.state}`,
      receiver_address: locations.receiver.label,
      items: items.map(item => ({
        type: item.type,
        quantity: item.qty || 1,
        weight: item.weight,
        length: item.length,
        width: item.width,
        height: item.height
      })),
      is_order: "no" as const
    };

    getServices(payload, {
      onSuccess: (data) => {
        setRates(data.services);
        if (data.services.length > 0) {
          setSelectedRateId(data.services[0].product_id);
        }
        toast.success(`Found ${data.services.length} available services`);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || 'Failed to fetch rates');
      }
    });
  }, [locations, items, getServices]);

  return (
    <div className="p-page-padding animate-in fade-in duration-700 overflow-auto">
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
          {/* Main Form Area */}
          <div className="xl:col-span-8 space-y-4">
            <OrderAddressForm
              items={items}
              setItems={setItems}
              locations={locations}
              setLocations={setLocations}
              onGetRate={handleGetRate}
              isValid={isValid}
            />

            {/* Services Section */}
            <Card className="shadow-sm border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 min-h-[250px] gap-0 p-0">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 dark:border-zinc-900 py-3 [.border-b]:pb-3">
                <CardTitle className="inline-flex items-center gap-2 text-[15px] font-semibold text-slate-800 dark:text-zinc-100">
                  <Truck className="w-4 h-4 text-blue-500" />
                  Available Services
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-[12px] font-medium text-slate-500 hover:text-blue-600 transition-colors"
                  onClick={() => setRates(null)}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {!rates && !loading ? (
                  <div className="flex flex-col items-center justify-center min-h-[250px] text-center p-6 bg-slate-50/50 dark:bg-zinc-900/10">
                    <div className="w-16 h-16 bg-white dark:bg-zinc-900 shadow-sm border border-slate-100 dark:border-zinc-800 rounded-2xl flex items-center justify-center mb-6">
                      <Calculator className="w-7 h-7 text-slate-300 dark:text-zinc-700" />
                    </div>
                    <p className="text-[14px] text-slate-500 dark:text-zinc-400 font-medium max-w-[320px] leading-relaxed">
                      Fill in addresses and items, then click <span className="text-blue-600 font-bold dark:text-blue-400">Get Live Rate</span> to see options.
                    </p>
                  </div>
                ) : loading ? (
                  <div className="flex items-center justify-center min-h-[250px]">
                    <div className="flex flex-col items-center gap-4">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                      <span className="text-[13px] text-slate-500 dark:text-zinc-400 animate-pulse font-medium">Fetching the best rates for you...</span>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-zinc-900 border border-slate-100 dark:border-zinc-800 overflow-hidden">
                    {rates && rates.map(rate => (
                      <Fragment key={rate.product_id}>
                        <div
                          onClick={() => setSelectedRateId(rate.product_id)}
                          className={cn(
                            "p-5 md:px-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 transition-all duration-300 group cursor-pointer",
                            selectedRateId === rate.product_id ? "bg-blue-50/40 dark:bg-blue-900/20" : ""
                          )}
                        >
                          <div className="flex items-center gap-4 mb-4 md:mb-0">
                            <FormRadio
                              checked={selectedRateId === rate.product_id}
                              onChange={() => setSelectedRateId(rate.product_id)}
                            />
                            <div className="w-12 h-12 bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-800 rounded-xl flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                              {rate.image ? (
                                <img src={rate.image} alt={rate.carrier} className="w-8 h-8 object-contain" />
                              ) : (
                                <Box className="w-6 h-6 text-blue-600/20 dark:text-blue-400/20" />
                              )}
                            </div>
                            <div>
                              <h4 className="text-[15px] font-bold text-[#111827] dark:text-white leading-tight">{rate.carrier}</h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[12px] font-medium text-slate-500 dark:text-zinc-400 whitespace-nowrap">{rate.service_name}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-700"></span>
                                <span className="text-[12px] font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">{rate.estimate_delivery_date}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8">
                            <div className="text-right">
                              <p className="text-[20px] font-extrabold text-[#111827] dark:text-white tracking-tight">${rate.price.toFixed(2)}</p>
                              {rate.success && (
                                <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">
                                  Live Rate
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Surcharges Section - Appears below selected service */}
                        {selectedRateId === rate.product_id && (
                          <div className="bg-blue-50/10 dark:bg-blue-900/5 animate-in fade-in slide-in-from-top-4 duration-500 ease-out border-t border-slate-100 dark:border-zinc-800">
                            <div className="px-6 py-3 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                              <h5 className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Extra Surcharges</h5>
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                              {SURCHARGES.map((surcharge) => (
                                <FormCheckbox
                                  key={surcharge.id}
                                  label={surcharge.name}
                                  description={surcharge.description}
                                  price={surcharge.price}
                                  checked={selectedSurcharges.includes(surcharge.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedSurcharges(prev => [...prev, surcharge.id]);
                                    } else {
                                      setSelectedSurcharges(prev => prev.filter(id => id !== surcharge.id));
                                    }
                                  }}
                                  className="hover:bg-white/50 dark:hover:bg-zinc-800/50 py-3 px-6"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </Fragment>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="xl:col-span-4 sticky top-0">
            <OrderSummary
              calculations={calculations}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
