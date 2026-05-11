import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Truck, AlertCircle, RefreshCw } from 'lucide-react'
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

export const CarrierCard: React.FC<CarrierCardProps> = (props) => {
  const { itemData, addresses, onQuoteChange, setCourierData, orderDetail, module, orderType = 'create' } = props
  const { role } = useAppSelector((state) => state.auth);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('')
  const [couriers, setCouriers] = useState<any[]>([]);
  const [surchargesMap, setSurchargesMap] = useState<Record<string, any[]>>({});
  const [bestDeal, setBestDeal] = useState<string>('');

  const { mutate: getServices, isPending: loading } = useGetQuoteServices(role);
  useEffect(() => {
    if (orderType !== 'create') return;
    // Check if we have valid items with dimensions > 0
    const isValidItems = itemData && itemData.length > 0 && itemData.every(item =>
      Number(item.height) > 0 && Number(item.width) > 0 && Number(item.length) > 0 && Number(item.weight) > 0 && Number(item.quantity) > 0
    );
    if (!isValidItems) return;

    // Check if we have both addresses
    const sender = addresses?.sender;
    const receiver = addresses?.receiver;

    const hasSenderAddress = sender && ('address1' in sender ? Boolean(sender.address1) : Boolean(sender.label));
    const hasReceiverAddress = receiver && ('address1' in receiver ? Boolean(receiver.address1) : Boolean(receiver.label));

    if (!hasSenderAddress || !hasReceiverAddress) return;

    const timer = setTimeout(() => {
      const receiver_details = `${receiver.suburb} ${receiver.state} ${receiver.postcode} ${receiver.country || ''}`.trim();
      const sender_addr1 = 'address1' in sender ? sender.address1 : sender.label;
      const receiver_addr1 = 'address1' in receiver ? receiver.address1 : receiver.label;

      const payload = {
        items: itemData,
        sender_details: sender_addr1,
        receiver_details: receiver_details,
        receiver_address: receiver_addr1,
        is_order: "yes" as const,
      }
      getServices(payload, {
        onSuccess: (data) => {
          setCouriers(data.services || []);
          setSurchargesMap(data.surcharges || {});
          if (data.services && data.services.length > 0) {
            const firstService = data.services[0];
            const minItem = data.services.reduce((min, curr) =>
              curr.price < min.price ? curr : min
            );
            setBestDeal(minItem.product_id || minItem.code || '');
            setSelectedServiceId(firstService.product_id || firstService.code || '0');
          }
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
      const selectedCourier = couriers.find((c, idx) => (c.product_id || c.code || String(idx)) === selectedServiceId);
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
    <Card className="border shadow-md pt-1 gap-0 border-gray-100 dark:border-zinc-800 rounded-xl overflow-hidden transition-colors duration-300">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-5 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors">
        <div className="flex justify-between w-full items-center gap-2">
          <div className='flex items-center gap-2'>
            <Truck className="h-4 w-4 text-blue-600 dark:text-blue-500" />
            <CardTitle className="text-sm font-bold text-gray-900 dark:text-zinc-100 tracking-wider">
              SHIPMENT OPTIONS
            </CardTitle>
          </div>
          {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
        </div>
      </CardHeader>

      <CardContent className="p-4 bg-gray-50/50 dark:bg-zinc-950">
        {orderType !== 'create' && orderDetail ? (
          <div className="flex flex-col gap-3">
            <div className="relative flex flex-col p-4 rounded-xl border border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-900/10 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 flex items-center justify-center p-2 shadow-sm">
                    <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
                      {orderDetail.courier_details?.courier || 'Standard Delivery'}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase">Tracking:</span>
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">{orderDetail.courier_details?.tracking_number || 'N/A'}</span>
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
          <div className="py-8 flex items-center justify-center text-sm text-gray-500 font-medium gap-2">
            <RefreshCw className="h-4 w-4 animate-spin text-[#0060FE]" />
            Fetching available carriers...
          </div>
        ) : couriers.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center text-sm text-gray-500 font-medium gap-2">
            <AlertCircle className="h-5 w-5 text-gray-400" />
            No shipment options available yet.<br />
            <span className="text-xs">Please fill out item dimensions and complete both addresses.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {couriers.map((courier, idx) => {
              const serviceId = courier.product_id || courier.code || String(idx);

              // Map additional charges by courierCode
              const courierSurcharges = surchargesMap[courier.courierCode] || [];
              const totalSurcharges = courierSurcharges.reduce((acc, curr) => acc + curr.amount, 0);

              const totalPrice = courier.price + totalSurcharges
              const isSelected = selectedServiceId === serviceId

              return (
                <div
                  key={serviceId}
                  onClick={() => setSelectedServiceId(serviceId)}
                  className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isSelected
                    ? 'border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-900/10'
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
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-blue-600 bg-blue-600 dark:border-blue-500 dark:bg-blue-500' : 'border-gray-300 dark:border-zinc-600'
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
                              <div className="flex items-center gap-1 text-[11px] text-orange-600 dark:text-orange-400 font-medium hover:underline cursor-help">
                                Includes ${totalSurcharges.toFixed(2)} surcharges
                                <AlertCircle className="w-3 h-3" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white dark:bg-zinc-800 text-xs text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-700 shadow-lg p-3">
                              <p className="font-bold mb-2">Price Breakdown</p>
                              <div className="flex justify-between gap-4 mb-1">
                                <span>Base Price:</span>
                                <span className="font-medium">${courier.price.toFixed(2)}</span>
                              </div>
                              {courierSurcharges.map((charge, i) => (
                                <div key={i} className="flex justify-between gap-4 mb-1 text-orange-600 dark:text-orange-400">
                                  <span>{charge.name}:</span>
                                  <span>+${charge.amount.toFixed(2)}</span>
                                </div>
                              ))}
                              <div className="border-t border-gray-100 dark:border-zinc-700 mt-2 pt-2 flex justify-between gap-4 font-bold text-gray-900 dark:text-white">
                                <span>Total:</span>
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
}
