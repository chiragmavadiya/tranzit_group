"use client";

import { useState, useMemo, useCallback } from 'react';
import { QuoteForm } from '../components/QuoteForm';
import { QuoteSummary } from '../components/QuoteSummary';
import type { QuoteItem, QuoteLocation, QuoteCalculations, ServiceRate } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, RefreshCw, Box, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GetQuotePage() {
  const [items, setItems] = useState<QuoteItem[]>([
    { id: crypto.randomUUID(), type: 'Parcel', qty: 1, weight: 0, length: 0, width: 0, height: 0 }
  ]);
  const [locations, setLocations] = useState<{ sender: QuoteLocation | null; receiver: QuoteLocation | null }>({
    sender: null,
    receiver: null
  });
  const [rates, setRates] = useState<ServiceRate[] | null>(null);
  const [loading, setLoading] = useState(false);

  const calculations = useMemo<QuoteCalculations>(() => {
    let deadWeight = 0;
    let volumetricWeight = 0;
    let totalItems = 0;

    items.forEach(item => {
      totalItems += item.qty;
      deadWeight += item.weight * item.qty;
      volumetricWeight += ((item.length * item.width * item.height) / 5000) * item.qty;
    });

    const serviceCost = rates ? rates[0]?.price || 0 : 0;
    const gst = serviceCost * 0.1;
    const surcharges = 0;

    return {
      totalItems,
      deadWeight,
      volumetricWeight,
      serviceCost,
      gst,
      surcharges,
      total: serviceCost + gst + surcharges
    };
  }, [items, rates]);

  const isValid = useMemo(() => {
    return (
      locations.sender !== null &&
      locations.receiver !== null &&
      items.length > 0 &&
      items.every(item => item.weight > 0 && item.length > 0 && item.width > 0 && item.height > 0)
    );
  }, [locations, items]);

  const handleGetRate = useCallback(async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRates([
      { id: '1', provider: 'StarTrack', name: 'Premium', price: 45.50, estimatedDays: '1-2 Days' },
      { id: '2', provider: 'TNT', name: 'Express', price: 52.00, estimatedDays: 'Next Day' }
    ]);
    setLoading(false);
  }, []);

  return (
    <div className="p-page-padding animate-in fade-in duration-700 overflow-auto">
      <div className="flex flex-col gap-8">
        {/* <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-[#111827] dark:text-white">Get Quote</h1>
        </div> */}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Main Form Area */}
          <div className="xl:col-span-8 space-y-6">
            <QuoteForm
              items={items}
              setItems={setItems}
              locations={locations}
              setLocations={setLocations}
              onGetRate={handleGetRate}
              isValid={isValid}
            />

            {/* Services Section */}
            <Card className="shadow-sm border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 min-h-[250px] gap-0">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 dark:border-zinc-900 pb-3 h-14">
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
                      <div key={rate.id} className="p-5 md:px-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 transition-all group">
                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                          <div className="w-12 h-12 bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-800 rounded-xl flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                            <Box className="w-6 h-6 text-blue-600/20 dark:text-blue-400/20" />
                          </div>
                          <div>
                            <h4 className="text-[15px] font-bold text-[#111827] dark:text-white leading-tight">{rate.provider}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[12px] font-medium text-slate-500 dark:text-zinc-400 whitespace-nowrap">{rate.name}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-700"></span>
                              <span className="text-[12px] font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">{rate.estimatedDays}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8">
                          <div className="text-right">
                            <p className="text-[20px] font-extrabold text-[#111827] dark:text-white tracking-tight">${rate.price.toFixed(2)}</p>
                            <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">
                              Best Value
                            </div>
                          </div>
                          <Button className="bg-[#111827] hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-700 h-9 px-6 text-[13px] font-bold shadow-sm active:scale-95 transition-all rounded-lg">
                            Select
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-4 sticky top-0">
            <QuoteSummary calculations={calculations} />
          </div>
        </div>
      </div>
    </div>
  );
}
