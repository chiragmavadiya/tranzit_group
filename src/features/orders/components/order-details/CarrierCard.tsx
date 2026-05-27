import React, { memo, useEffect, useEffectEvent, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Truck, AlertCircle, RefreshCw, Copy, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useGetQuoteServices } from '@/features/quote/hooks/useQuote'
import { showToast } from '@/components/ui/custom-toast'
import type { AddressData, ItemData } from '../../types'
import { useAppSelector } from '@/hooks/store.hooks'
import type { QuoteLocation } from '@/features/quote/types'

interface CarrierCardProps {
  itemData: ItemData[];
  addresses: { sender: AddressData | QuoteLocation | null, receiver: AddressData | QuoteLocation | null };
  onQuoteChange?: (data: any) => void;
  setCourierData?: React.Dispatch<React.SetStateAction<any>>;
  orderDetail?: any;
  module?: string;
  orderType?: string
}

export const CarrierCard: React.FC<CarrierCardProps> = memo((props) => {
  const { itemData, addresses, onQuoteChange, setCourierData, orderDetail, module, orderType = 'create' } = props
  const { role } = useAppSelector((state) => state.auth);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('')
  const [couriers, setCouriers] = useState<any[]>([]);
  const [surchargesMap, setSurchargesMap] = useState<Record<string, any[]>>({});
  const [bestDeal, setBestDeal] = useState<string>('');
  const [copiedTracking, setCopiedTracking] = useState(false);

  const handleCopyTracking = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTracking(true);
    showToast("Tracking number copied to clipboard", "success");
    setTimeout(() => {
      setCopiedTracking(false);
    }, 2000);
  };

  const { mutate: getServices, isPending: loading } = useGetQuoteServices(role);

  const getAddress = (
    location: { address1?: string; address?: string; label?: string }
  ) => {
    return location?.address1 || location?.address || location?.label || "";
  };

  const handleServiceSuccess = useEffectEvent((data: any) => {
    setCouriers(data.services || []);
    setSurchargesMap(data.surcharges || {});
    if (data.services && data.services.length > 0) {
      const getServiceTotalPrice = (service: any) => {
        const surcharges = data.surcharges?.[service.courierCode] || [];
        const totalSurcharges = surcharges.reduce((acc: number, curr: any) => acc + curr.amount, 0);
        return service.price + totalSurcharges;
      };
      const minItem = data.services.reduce((min: any, curr: any) =>
        getServiceTotalPrice(curr) < getServiceTotalPrice(min) ? curr : min
      );
      setBestDeal(minItem.product_id || minItem.courierCode || '');
      const selectedFromQuote = sessionStorage.getItem('quote_courier');
      if (selectedFromQuote) {
        const courier = JSON.parse(selectedFromQuote);
        setSelectedServiceId(courier.courier.product_id || courier.courier.courierCode || '');
      } else if (!selectedServiceId) {
        setSelectedServiceId(minItem.product_id || minItem.courierCode || '');
      }
      // if (!selectedServiceId)
      //   setSelectedServiceId(minItem.product_id || minItem.courierCode || '');
    }
  })
  useEffect(() => {
    if (orderType !== 'create' && orderType !== 'consign' && orderType !== 'return') return;
    // Check if we have valid items with dimensions > 0
    const isValidItems = itemData && itemData.length > 0 && itemData.every(item =>
      Number(item.height) > 0 && Number(item.width) > 0 && Number(item.length) > 0 && Number(item.weight) > 0 && Number(item.quantity) > 0
    );
    if (!isValidItems) return;

    // Check if we have both addresses
    const sender = addresses?.sender;
    const receiver = addresses?.receiver;

    const sender_addr1 = getAddress(sender!);
    const receiver_addr1 = getAddress(receiver!);
    if (sender_addr1 === '' || receiver_addr1 === '') return;

    const timer = setTimeout(() => {
      const receiver_details = `${receiver!.suburb} ${receiver!.state} ${receiver!.postcode} ${receiver!.country || ''}`.trim();


      // const sender_addr1 = getAddress(sender);
      // const receiver_addr1 = getAddress(receiver);
      // const sender_addr1 = 'address1' in sender ? (sender.address1 || '') : ('address' in sender ? (sender.address || '') : (sender as QuoteLocation).label || '');
      // const receiver_addr1 = 'address1' in receiver ? (receiver.address1 || '') : ('address' in receiver ? (receiver.address || '') : (receiver as QuoteLocation).label || '');


      const payload = {
        items: itemData,
        sender_details: sender_addr1,
        receiver_details: receiver_details,
        receiver_address: receiver_addr1,
        is_order: "yes" as const,
      }
      getServices(payload, {
        onSuccess: (data) => {
          handleServiceSuccess(data);
        },
        onError: (err: any) => {
          showToast(err?.response?.data?.message || 'Failed to fetch rates', "error");
        }
      });
    }, 500); // 500ms debounce
    // Cleanup previous timer
    return () => clearTimeout(timer);
  }, [itemData, addresses, getServices, orderType, module])

  useEffect(() => {
    if (couriers.length > 0 && selectedServiceId) {
      const selectedCourier = couriers.find((c, idx) => (c.product_id || c.courierCode || String(idx)) === selectedServiceId);
      if (selectedCourier) {
        const courierSurcharges = surchargesMap[selectedCourier.courierCode] || [];
        const totalSurcharges = courierSurcharges.reduce((acc: any, curr: any) => acc + curr.amount, 0);
        const totalPrice = selectedCourier.price + totalSurcharges;
        onQuoteChange?.({
          courier: selectedCourier,
          surcharges: courierSurcharges,
          totalSurcharges,
          totalPrice
        });
        setCourierData?.({
          courier: selectedCourier.carrier_id,
          product_id: selectedCourier.product_id,
          product_type: selectedCourier.product_type,
          shipment_summary: selectedCourier.shipment_summary,
        })
      }
    }
  }, [selectedServiceId, couriers, surchargesMap, onQuoteChange, setCourierData])

  return (
    <Card className="border gap-0 border-gray-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b border-gray-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 transition-colors">
        <div className="flex justify-between w-full items-center gap-2">
          <div className='flex items-center gap-2'>
            <Truck className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-bold text-gray-900 dark:text-zinc-100 tracking-wider">
              SHIPMENT OPTIONS
            </CardTitle>
          </div>
          {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
        </div>
      </CardHeader>

      <CardContent className="p-4 bg-white dark:bg-zinc-950">
        {orderType !== 'create' && orderType !== 'consign' && orderDetail ? (
          <div className="flex flex-col gap-3">
            <div className="relative flex flex-col p-4 rounded-xl border border-primary bg-primary/5 dark:bg-primary/10 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 flex items-center justify-center p-1 shadow-sm">
                    {orderDetail.courier_details?.image_url ? (<img
                      src={orderDetail.courier_details?.image_url}
                      alt={orderDetail.courier_details?.courier}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/100x40?text=Logo'
                      }}
                    />) : (<Truck className="w-6 h-6 text-primary" />)}


                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
                      {orderDetail.courier_details?.courier || 'Standard Delivery'}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase">Tracking:</span>
                      <span className="text-xs font-bold text-primary">{orderDetail.courier_details?.tracking_number || 'N/A'}</span>
                      {orderDetail.courier_details?.tracking_number && (
                        <button
                          onClick={() => handleCopyTracking(orderDetail.courier_details.tracking_number)}
                          className="flex items-center justify-center p-0.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-primary transition-all duration-150 focus:outline-none"
                          title="Copy tracking number"
                        >
                          {copiedTracking ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500 animate-in fade-in duration-200" />
                          ) : (
                            <Copy className="h-3.5 w-3.5 transition-transform hover:scale-110 active:scale-95" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-gray-900 dark:text-zinc-100 tracking-tighter">
                    ${orderDetail.order_details?.total?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest mt-0.5">
                    Total Inc. GST
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : loading && couriers.length === 0 ? (
          <div className="py-8 h-34 flex items-center justify-center text-sm text-gray-500 font-medium gap-2">
            <RefreshCw className="h-4 w-4 animate-spin text-primary" />
            Fetching available carriers...
          </div>
        ) : couriers.length === 0 ? (
          <div className="py-8 h-36 flex flex-col items-center justify-center text-base text-gray-500 font-medium gap-2">
            <AlertCircle className="h-5 w-5 text-gray-400" />
            No shipment options available yet.<br />
            <span className="text-sm">Please fill out item dimensions and complete both addresses.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {couriers.map((courier, idx) => {
              const serviceId = courier.product_id || courier.courierCode || String(idx);

              // Map additional charges by courierCode
              const courierSurcharges = surchargesMap[courier.courierCode] || [];
              const totalSurcharges = courierSurcharges.reduce((acc, curr) => acc + curr.amount, 0);

              const totalPrice = courier.price + totalSurcharges
              const isSelected = selectedServiceId === serviceId

              if (courier.success === false) {
                return (
                  <div
                    // key={serviceId}
                    // onClick={() => setSelectedServiceId(serviceId)}
                    className={`relative flex flex-col p-4 rounded-xl border-2 transition-all duration-200 ${isSelected
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-transparent bg-white dark:bg-zinc-900 hover:border-gray-200 dark:hover:border-zinc-700 shadow-sm'
                      }`}
                  >
                    <span className="font-bold text-gray-900 dark:text-zinc-100 text-sm">
                      {courier.carrier}
                    </span>
                    <div key={serviceId}>{courier.message}</div>
                  </div>
                )
              }

              return (
                <div
                  key={serviceId}
                  onClick={() => setSelectedServiceId(serviceId)}
                  className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isSelected
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-transparent bg-white dark:bg-zinc-900 hover:border-gray-200 dark:hover:border-zinc-700 shadow-sm'
                    }`}
                >
                  {/* Recommended Badge (Example logic: lowest price) */}
                  {serviceId === bestDeal && (
                    <div className="absolute -top-2.5 right-4">
                      <Badge className="bg-[#00A650] hover:bg-[#00A650] text-white text-[10px] uppercase font-bold px-2 py-0.5 shadow-sm">
                        Best Value
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4">
                    {/* Left Side: Logo & Info */}
                    <div className="flex items-center gap-4">
                      {/* Radio Button Visual */}
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-primary bg-primary' : 'border-gray-300 dark:border-zinc-600'
                        }`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>

                      {/* Logo Container */}
                      <div className="w-16 h-10 bg-white dark:bg-white rounded-md border border-gray-100 dark:border-zinc-200 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                        <img
                          src={courier.image}
                          alt={courier.carrier}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/100x40?text=Logo'
                          }}
                        />
                      </div>

                      {/* Carrier Info */}
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-zinc-100 text-sm">
                          {courier.carrier}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium mt-0.5">
                          {courier.service_name || courier.service_code || 'Standard Delivery'}
                          {courier.estimate_delivery_date && ` • ETA: ${courier.estimate_delivery_date}`}
                        </span>
                      </div>
                    </div>

                    {/* Right Side: Pricing */}
                    <div className="flex flex-col items-end justify-center">
                      <span className="text-lg font-bold text-gray-900 dark:text-zinc-100">
                        ${totalPrice.toFixed(2)}
                      </span>

                      {totalSurcharges > 0 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex items-center gap-1 text-[11px] text-orange-600 dark:text-orange-400 font-medium hover:underline cursor-help transition-colors duration-150">
                                Includes ${totalSurcharges.toFixed(2)} surcharges
                                <AlertCircle className="w-3 h-3" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="flex flex-col items-stretch w-80 max-w-none bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-xs text-gray-700 dark:text-zinc-300 shadow-xl rounded-xl p-4 gap-2.5">
                              <div className="border-b border-gray-100 dark:border-zinc-800 pb-2">
                                <span className="font-bold text-gray-900 dark:text-zinc-100 text-sm">
                                  Price Breakdown
                                </span>
                              </div>

                              <div className="flex justify-between items-center text-gray-600 dark:text-zinc-400 py-0.5">
                                <span>Base Price</span>
                                <span className="font-semibold text-gray-900 dark:text-zinc-100">
                                  ${courier.price.toFixed(2)}
                                </span>
                              </div>

                              {courierSurcharges.filter((charge) => charge.amount > 0).length > 0 && (
                                <div className="flex flex-col gap-1.5 py-1">
                                  {courierSurcharges
                                    .filter((charge) => charge.amount > 0)
                                    .map((charge, i) => (
                                      <div key={i} className="flex justify-between items-start text-[11px] text-primary-600 dark:text-amber-400">
                                        <span className="text-left leading-tight max-w-[200px]">{charge.name}</span>
                                        <span className="font-medium shrink-0 ml-4">+${charge.amount.toFixed(2)}</span>
                                      </div>
                                    ))}
                                </div>
                              )}

                              <div className="border-t border-gray-100 dark:border-zinc-800 pt-2.5 mt-0.5 flex justify-between items-center font-bold text-sm text-gray-900 dark:text-white">
                                <span>Total Price</span>
                                <span>${totalPrice.toFixed(2)}</span>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
})
