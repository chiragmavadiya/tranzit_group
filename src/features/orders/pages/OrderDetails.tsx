import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2, AlertTriangle, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import { OrderHeader } from '@/features/orders/components/order-details/OrderHeader'
import { AddressCard } from '@/features/orders/components/order-details/AddressCard'
import { CarrierCard } from '@/features/orders/components/order-details/CarrierCard'
import { HistoryCard } from '@/features/orders/components/order-details/HistoryCard'
import { SidePanel } from '@/features/orders/components/order-details/SidePanel'
import { StickyFooter } from '@/features/orders/components/order-details/StickyFooter'
import CreateOrderDialog from '@/features/orders/components/CreateOrderDialog'
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI'
import { useGlobalCouriers } from '@/features/courier-surcharge/hooks/useGlobalCouriers'
import { ItemsTable } from '@/features/orders/components/order-details/ItemsTable'
import { useOrderItems } from '@/features/orders/hooks/useOrderItems'
import type { AddressData } from '../types'
import { useCreateOrder, useOrderDetails, useDownloadLabel, useWalletCheck, useCancelOrder, useConsignOrder } from '../hooks/useOrders'


import WalletCheckDialog from '@/features/orders/components/WalletCheckDialog'
import type { WalletCheckResponse } from '../types/api.types'
import { showToast } from '@/components/ui/custom-toast'
import { Checkbox } from '@/components/ui/checkbox'
import { DANGEROUS_GOODS_URL, PRIVACY_POLICY_URL, TERMS_CONDITIONS_URL } from '@/constants'
import { useAppSelector } from '@/hooks/store.hooks'
import { Button } from '@/components/ui/button'

const OrderDetailsPage: React.FC = () => {
  const { orderType, orderID } = useParams<{ orderType: string, orderID: string }>()
  const { role, user } = useAppSelector((state) => state.auth)

  // API's Hooks
  const { mutate: createOrder, isPending: saveLoading } = useCreateOrder()
  const { mutate: checkWallet, isPending: walletLoading } = useWalletCheck()
  const { data: orderResponse, isLoading: isOrderLoading } = useOrderDetails(orderID || '')
  const { mutate: downloadLabel, isPending: isDownloadingLabel } = useDownloadLabel()
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder()
  const { mutate: consignOrder, isPending: isConsigning } = useConsignOrder(role === 'admin')
  const { data: globalCouriers } = useGlobalCouriers(role === 'admin' && orderType === 'create-menual')

  const orderDetail = orderResponse?.data
  const navigate = useNavigate()
  const isEditable = orderType === 'create' || orderType === 'consign' || orderType === 'create-menual'

  const [walletCheckOpen, setWalletCheckOpen] = useState(false)
  const [walletCheckData, setWalletCheckData] = useState<WalletCheckResponse | null>(null)
  const [quoteData, setQuoteData] = useState<any>(null);
  const [addressData, setAddressData] = useState<{ sender: AddressData, receiver: AddressData }>(() => ({
    sender: {
      email: user?.email || "",
      phone: user?.office_number || "",
      company: user?.company_name || "",
      address: user?.addresses?.[0]?.address || '',
      address1: user?.addresses?.[0]?.address || '',
      suburb: user?.addresses?.[0]?.suburb || '',
      state: user?.addresses?.[0]?.state || '',
      street_name: user?.addresses?.[0]?.street_name || '',
      street_number: user?.addresses?.[0]?.street_number || '',
      postcode: user?.addresses?.[0]?.postcode || '',
      country: "",
      unit_number: "",
      name: (user?.first_name || '') + " " + (user?.last_name || ''),
      saveToAddressBook: false,
    },
    receiver: {
      email: "",
      phone: "",
      company: "",
      address: "",
      address1: "",
      suburb: "",
      state: "",
      street_name: "",
      unit_number: "",
      street_number: "",
      postcode: "",
      country: "",
      name: "",
      saveToAddressBook: false
    }
  }))
  const [courierData, setCourierData] = useState<any>(null)
  const [manualOrderData, setManualOrderData] = useState({
    trackingNumber: '',
    courierId: '',
    amount: '',
  });

  const initialDialogMode = useMemo(() => {
    if ((orderType === 'create' || orderType === 'create-menual') && addressData.receiver.address1 === '') {
      return "receiver"
    }
    return null
  }, [addressData, orderType])
  const [insuranceSelected, setInsuranceSelected] = useState<boolean>(false)
  const [signatureSelected, setSignatureSelected] = useState<boolean>(false)
  const [orderDialogMode, setOrderDialogMode] = useState<"sender" | "receiver" | null>(initialDialogMode)
  const [deliveryInstructions, setDeliveryInstructions] = useState<string>('')
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [ratesAccepted, setRatesAccepted] = useState(false)
  const [dangerousGoodsAccepted, setDangerousGoodsAccepted] = useState(false)
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined)
  const [selectedCustomer, setSelectedCustomer] = useState<string>('')

  const {
    itemsData,
    updateItem,
    fullUpdateItem,
    addItem,
    removeItem,
    setItemsData,
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

  const isValidConsineOrder = useCallback((orderStatus: string | undefined) => {
    if (orderStatus !== 'new') {
      navigate(`${role === 'admin' ? '/admin' : ''}/orders/edit/${orderID}`)
    }
  }, [role, orderID, navigate])

  useEffect(() => {
    if (role === 'customer' && user && (orderType === 'create' || orderType === 'create-menual')) {
      setAddressData(prev => ({
        ...prev,
        sender: {
          ...prev.sender,
          email: user.email || "",
          phone: user.office_number || "",
          company: user.company_name || "",
          address: user.addresses?.[0]?.address || '',
          address1: user.addresses?.[0]?.address || '',
          suburb: user.addresses?.[0]?.suburb || '',
          state: user.addresses?.[0]?.state || '',
          street_name: user.addresses?.[0]?.street_name || '',
          street_number: user.addresses?.[0]?.street_number || '',
          postcode: user.addresses?.[0]?.postcode || '',
          name: user.first_name + " " + user.last_name,
        }
      }))
    }
  }, [user, role, orderType])

  useEffect(() => {
    if (orderDetail && orderType !== 'create' && orderType !== 'create-menual') {
      setAddressData({
        sender: {
          name: orderDetail.sender_details?.name || "",
          email: orderDetail.sender_details?.email || "",
          phone: orderDetail.sender_details?.mobile || "",
          address1: orderDetail.sender_details?.address_detail?.address_line || "",
          address: orderDetail.sender_details?.address || "",
          company: orderDetail.sender_details?.company || "",
          suburb: orderDetail.sender_details?.address_detail?.suburb || "",
          state: orderDetail.sender_details?.address_detail?.state || "",
          street_name: orderDetail.sender_details?.address_detail?.street_name || "",
          street_number: orderDetail.sender_details?.address_detail?.street_number || "",
          postcode: orderDetail.sender_details?.address_detail?.postcode || "",
          country: "Australia",
          saveToAddressBook: false,
        },
        receiver: {
          name: orderDetail.receiver_details?.name || "",
          email: orderDetail.receiver_details?.email || "",
          phone: orderDetail.receiver_details?.mobile || "",
          address1: orderDetail.receiver_details?.address_detail?.address_line || "",
          address: orderDetail.receiver_details?.address || "",
          company: orderDetail.receiver_details?.company || "",
          suburb: orderDetail.receiver_details?.address_detail?.suburb || "",
          state: orderDetail.receiver_details?.address_detail?.state || "",
          street_name: orderDetail.receiver_details?.address_detail?.street_name || "",
          street_number: orderDetail.receiver_details?.address_detail?.street_number || "",
          postcode: orderDetail.receiver_details?.address_detail?.postcode || "",
          country: "Australia",
          saveToAddressBook: false
        }
      })
      setItemsData(orderDetail.order_details?.items?.map(item => ({
        type: item.type,
        quantity: item.quantity,
        weight: item.weight,
        length: item.length,
        width: item.width,
        height: item.height,
        description: item.description,
      })) || [])
      setDeliveryInstructions(orderDetail.delivery_instructions || "")
      setInsuranceSelected(orderDetail.limited_liability_cover?.covered || false)
      setCourierData(orderDetail.courier_details)
      setQuoteData(orderDetail.order_details)
      isValidConsineOrder(orderDetail.order_status_category)
    }
  }, [isValidConsineOrder, orderDetail, orderType, setItemsData])

  const handleAddressSubmit = useCallback((type: "sender" | "receiver", data: AddressData) => {
    setAddressData(prev => ({ ...prev, [type]: data }))
    setOrderDialogMode(null)
  }, [])

  const onEditClick = useCallback((type: "sender" | "receiver") => {
    setOrderDialogMode(type)
    setIsEdit(true);
  }, [])

  const handleOptionalFieldsChange = useCallback((type: "insurance" | "signature" | "delivery_instructions", value: string | boolean) => {
    if (type === "insurance") {
      setInsuranceSelected(value as boolean)
    } else if (type === "signature") {
      setSignatureSelected(value as boolean)
    } else if (type === "delivery_instructions") {
      setDeliveryInstructions(value as string)
    }
  }, [])

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
    const insuranceCost = insuranceSelected ? 6.00 : 0;
    const grandTotal = (quoteData?.totalPrice || quoteData?.total || 0) + insuranceCost;
    return { totalItems, totalWeight, volumetric, servicePrice, gst, totalSurcharges, insuranceCost, grandTotal, insurance: insuranceSelected }
  }, [itemsData, quoteData, insuranceSelected])

  const handleOnSave = useCallback((skipWalletCheckArg?: any) => {
    const isValidItems = itemsData && itemsData.length > 0 && itemsData.every(item =>
      Number(item.height) > 0 && Number(item.width) > 0 && Number(item.length) > 0 && Number(item.weight) > 0 && Number(item.quantity) > 0
    );
    const hasSenderAddress = Boolean(addressData?.sender?.address1);
    const hasReceiverAddress = Boolean(addressData?.receiver?.address1);

    if (role === "admin" && !selectedCustomer) {
      showToast('Please select a customer.', "error");
      return;
    }

    if (!isValidItems || !hasSenderAddress || !hasReceiverAddress) {
      showToast('Please fill out item dimensions and complete both addresses.', "error");
      return;
    }

    if (role === 'admin' && !pickupDate) {
      showToast('Please select a pickup date.', "error");
      return;
    }

    if (!termsAccepted || !ratesAccepted || !dangerousGoodsAccepted) {
      showToast('You must accept all Terms & Conditions, Dangerous Goods, and Futile Pickup declarations.', "error");
      return;
    }

    const payload = {
      ...addressData,
      parcels: itemsData,
      service: {
        ...courierData,
        cover_limited_liability: insuranceSelected ? 1 : 0,
        signature_required: signatureSelected ? 1 : 0,
      },
      surcharges: [],
      delivery_instructions: deliveryInstructions,
      pickup_date: pickupDate ? format(pickupDate, 'yyyy-MM-dd') : '',
      terms_and_conditions: termsAccepted,
      totals: {
        subtotal: quoteData?.courier.base || 0,
        gst: quoteData?.courier.gst || 0,
        total: quoteData?.courier.price || 0,
        freight_levy: quoteData?.courier.freight_levy || 0,
      },
      // capture: role === "admin" ? true : walletCheckData ? walletCheckData?.wallet_balance > calculation.grandTotal : false,
      capture: role === "admin" || (walletCheckData?.wallet_balance ?? 0) > calculation.grandTotal,
      save_address: addressData?.receiver?.saveToAddressBook ? 1 : 0,
      customer_id: selectedCustomer || undefined,
      ...(orderType === 'create-menual' ? {
        tracking_number: manualOrderData.trackingNumber,
        courier_id: manualOrderData.courierId,
        amount: manualOrderData.amount
      } : {})
    }

    const executeCreateOrder = () => {
      createOrder(payload, {
        onSuccess: (response) => {
          if (response.ok) {
            showToast('Orders Created successfully', "success");
            navigate(`${role === 'admin' ? '/admin' : ''}/orders/edit/${response.order_number}`)
            setWalletCheckOpen(false)
          } else {
            showToast(response.message || "Failed to create orders", "error");
          }
        },
        onError: (error: any) => {
          showToast(error?.response?.data?.message || 'Failed to create orders', "error");
        }
      });
    }

    if (skipWalletCheckArg === true || role === "admin") {
      executeCreateOrder()
      return
    }

    checkWallet(calculation.grandTotal, {
      onSuccess: (res) => {
        if (res.ok) {
          setWalletCheckData(res)
          setWalletCheckOpen(true)
        } else {
          executeCreateOrder()
        }
      },
      onError: () => {
        showToast('Failed to create orders', "error");
        // executeCreateOrder()
      }
    })
  }, [itemsData, addressData, role, selectedCustomer, pickupDate, termsAccepted, ratesAccepted, dangerousGoodsAccepted, courierData, insuranceSelected, signatureSelected, deliveryInstructions, quoteData?.courier, walletCheckData, calculation.grandTotal, orderType, manualOrderData.trackingNumber, manualOrderData.courierId, manualOrderData.amount, checkWallet, createOrder, navigate])

  const onCancelOrder = useCallback(() => {
    if (orderID) {
      cancelOrder(orderID, {
        onSuccess: (response) => {
          showToast(response?.message || "Order cancelled successfully", "success");
          navigate(`${role === 'admin' ? '/admin' : ''}/orders`)
        },

        onError: (error: any) => {
          showToast(error?.response?.data?.message || 'Failed to cancel order', "error");
        }
      })
    }
  }, [orderID, cancelOrder, navigate, role])

  const handleConsign = useCallback(() => {
    if (!termsAccepted || !ratesAccepted || !dangerousGoodsAccepted) {
      showToast('You must accept all Terms & Conditions, Dangerous Goods, and Futile Pickup declarations.', "error");
      return;
    }

    const payload = {
      customer_id: selectedCustomer || orderDetail?.sender_details?.customer_id,
      sender: {
        name: addressData.sender.name,
        company: addressData.sender.company,
        phone: addressData.sender.phone,
        email: addressData.sender.email,
        address1: addressData.sender.address1,
        suburb: addressData.sender.suburb,
        state: addressData.sender.state,
        postcode: addressData.sender.postcode,
        country: addressData.sender.country || 'AU'
      },
      receiver: {
        name: addressData.receiver.name,
        company: addressData.receiver.company,
        phone: addressData.receiver.phone,
        email: addressData.receiver.email,
        address1: addressData.receiver.address1,
        suburb: addressData.receiver.suburb,
        state: addressData.receiver.state,
        postcode: addressData.receiver.postcode,
        country: addressData.receiver.country || 'AU'
      },
      parcels: itemsData.map(item => ({
        type: item.type,
        quantity: item.quantity,
        weight: item.weight,
        length: item.length,
        width: item.width,
        height: item.height
      })),
      service: {
        ...courierData,
        cover_limited_liability: insuranceSelected ? 1 : 0,
        signature_required: signatureSelected ? 1 : 0,
      },
      surcharges: [],
      delivery_instructions: deliveryInstructions,
      pickup_date: pickupDate ? format(pickupDate, 'yyyy-MM-dd') : '',
      terms_and_conditions: termsAccepted,
      totals: {
        subtotal: quoteData?.courier?.base || calculation.servicePrice,
        gst: quoteData?.courier?.gst || calculation.gst,
        total: quoteData?.courier?.price || calculation.grandTotal
      },
      capture: true,
      ...(orderType === 'create-menual' ? {
        tracking_number: manualOrderData.trackingNumber,
        courier_id: manualOrderData.courierId,
        amount: manualOrderData.amount
      } : {})
    }

    if (orderID) {
      consignOrder({ orderId: orderID, data: payload }, {
        onSuccess: () => {
          showToast('Order consigned successfully', "success");
          navigate(`${role === 'admin' ? '/admin' : ''}/orders/edit/${orderID}`);
        },
        onError: (error: any) => {
          showToast(error?.response?.data?.message || 'Failed to consign order', "error");
        }
      })
    }
  }, [termsAccepted, ratesAccepted, dangerousGoodsAccepted, selectedCustomer, orderDetail?.sender_details?.customer_id, addressData.sender.name, addressData.sender.company, addressData.sender.phone, addressData.sender.email, addressData.sender.address1, addressData.sender.suburb, addressData.sender.state, addressData.sender.postcode, addressData.sender.country, addressData.receiver.name, addressData.receiver.company, addressData.receiver.phone, addressData.receiver.email, addressData.receiver.address1, addressData.receiver.suburb, addressData.receiver.state, addressData.receiver.postcode, addressData.receiver.country, itemsData, courierData, insuranceSelected, signatureSelected, deliveryInstructions, pickupDate, quoteData?.courier?.base, quoteData?.courier?.gst, quoteData?.courier?.price, calculation.servicePrice, calculation.gst, calculation.grandTotal, orderType, manualOrderData.trackingNumber, manualOrderData.courierId, manualOrderData.amount, orderID, consignOrder, navigate, role])


  if (isOrderLoading && orderType !== 'create' && orderType !== 'create-menual') {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <span className="text-sm font-bold text-gray-500 animate-pulse uppercase tracking-widest">Loading Order Details...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        className="p-page-padding overflow-y-auto scrollbar-hide-buttons flex-1 bg-white dark:bg-zinc-950 font-sans text-gray-900 dark:text-zinc-100 dark:border-zinc-800 transition-colors duration-300"
        style={{
          '--webkit-scrollbar-button-display': 'none'
        } as React.CSSProperties}
      >
        <OrderHeader
          orderID={orderID}
          orderType={orderType}
          onSave={handleOnSave}
          onDownloadLabel={() => downloadLabel(orderID || '')}
          isDownloadingLabel={isDownloadingLabel}
          orderDetail={orderDetail!}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          onCancelOrder={onCancelOrder}
          isCancelling={isCancelling}

          isConsigning={isConsigning}
        />


        {orderDetail?.cancel_request && (
          <div className="mb-4 p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-500 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="mt-0 text-sm font-bold text-amber-900 dark:text-amber-100 uppercase tracking-widest">Cancellation Request Pending</h3>
                <div className="mt-1.5 flex flex-wrap gap-x-6 gap-y-1 text-xs font-bold text-amber-700 dark:text-amber-400/80">
                  <div className="flex items-center gap-1.5">
                    <span className="opacity-80 font-medium">Requested By:</span>
                    <span>{orderDetail.cancel_request.requested_by}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="opacity-80 font-medium">Date:</span>
                    <span>{orderDetail.cancel_request.requested_at}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="opacity-80 font-medium">Est. Refund:</span>
                    <span className="text-sm text-amber-900 dark:text-amber-200">${orderDetail.cancel_request.refund_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            <Button
              onClick={onCancelOrder}
              disabled={isCancelling}
              className="bg-red-600 hover:bg-red-700 text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-red-600/20 active:scale-[0.98] transition-all flex items-center gap-2"
            >
              {isCancelling ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle size={18} />}
              SUBMIT CANCEL
            </Button>
          </div>
        )}

        <main className="mt-3">
          {orderType === 'create-menual' && (
            <div className="mb-4 p-5 bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm transition-colors duration-300">
              <h3 className="mb-4 text-sm font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wider">Manual Order Details</h3>
              <div className="flex flex-col md:flex-row gap-4">
                <FormInput
                  label="Label Number (Tracking Number)"
                  value={manualOrderData.trackingNumber}
                  onChange={(val) => setManualOrderData(prev => ({ ...prev, trackingNumber: val }))}
                  placeholder="Enter tracking number"
                  className="flex-1"
                />
                <FormSelect
                  label="Courier"
                  value={manualOrderData.courierId}
                  onValueChange={(val) => setManualOrderData(prev => ({ ...prev, courierId: val || '' }))}
                  options={globalCouriers || []}
                  placeholder="Select courier"
                  className="flex-1"
                />
                <FormInput
                  label="Amount"
                  value={manualOrderData.amount}
                  onChange={(val) => setManualOrderData(prev => ({ ...prev, amount: val }))}
                  placeholder="Enter amount"
                  className="flex-1"
                  type="number"
                />
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start">
            <div className="flex flex-col gap-3 overflow-hidden">
              <AddressCard
                title="SENDER"
                name={addressData.sender.name}
                address={addressData.sender.address || ''}
                email={addressData.sender.email}
                editable={isEditable && role === 'admin'}
                onEditClick={() => onEditClick('sender')}
              />

              <AddressCard
                title="RECEIVER"
                name={addressData.receiver.name}
                address={addressData.receiver.address || ''}
                email={addressData.receiver.email}
                editable={isEditable}
                onEditClick={() => onEditClick('receiver')}
              />

              <ItemsTable
                items={itemsData}
                onUpdateItem={updateItem}
                onFullUpdateItem={fullUpdateItem}
                addItem={addItem}
                removeItem={removeItem}
                orderType={orderType}
              />

              {orderType !== 'create-menual' && (
                <CarrierCard
                  itemData={itemsData}
                  addresses={addressData}
                  onQuoteChange={setQuoteData}
                  setCourierData={setCourierData}
                  orderDetail={orderDetail}
                  orderType={orderType!}
                  module="order"
                />
              )}
              {orderType !== 'create' && orderType !== 'create-menual' && <HistoryCard history={orderDetail?.shipping_activity} />}

              {isEditable && (
                <div className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 flex flex-col gap-4 shadow-sm transition-colors duration-300">
                  <h3 className="my-0 text-sm font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wider">Confirm & Continue</h3>

                  <div className="flex flex-col gap-3">
                    <label className={`flex items-start gap-3 rounded-[12px] transition-colors cursor-pointer `}>
                      <Checkbox
                        checked={termsAccepted}
                        onCheckedChange={(c) => setTermsAccepted(c)}
                        className="mt-0.5 rounded-[6px] data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 dark:text-zinc-100">
                          I accept the <a href={TERMS_CONDITIONS_URL} target="_blank" className="text-primary hover:underline">Terms & Conditions</a> and <a href={PRIVACY_POLICY_URL} target="_blank" className="text-primary hover:underline">Privacy Policy</a>
                        </span>
                      </div>
                    </label>

                    <label className={`flex items-start gap-3 rounded-[12px] transition-colors cursor-pointer `}>
                      <Checkbox
                        checked={ratesAccepted}
                        onCheckedChange={(c) => setRatesAccepted(c)}
                        className="mt-0.5 rounded-[6px] data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                          I understand the shipping rates and extra charges
                        </span>
                      </div>
                    </label>

                    <label className={`flex items-start gap-3 rounded-[12px] transition-colors cursor-pointer `}>
                      <Checkbox
                        checked={dangerousGoodsAccepted}
                        onCheckedChange={(c) => setDangerousGoodsAccepted(c)}
                        className="mt-0.5 rounded-[6px] data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                          This consignment does not contain <a href={DANGEROUS_GOODS_URL} target="_blank" className="text-primary hover:underline">dangerous goods</a>
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <SidePanel
              calculation={calculation}
              itemsData={itemsData}
              quoteData={quoteData}
              handleOptionalFieldsChange={handleOptionalFieldsChange}
              insuranceSelected={insuranceSelected}
              signatureSelected={signatureSelected}
              deliveryInstructions={deliveryInstructions}
              pickupDate={pickupDate}
              setPickupDate={setPickupDate}
              orderType={orderType}
              liabilityMessage={orderDetail?.limited_liability_cover?.message}
              // liability={orderDetail?.limited_liability_cover?.covered || false}
              liability={orderDetail?.limited_liability_cover?.covered || false}
            />
          </div>
        </main>
        {orderDialogMode && (
          <CreateOrderDialog
            open={!!orderDialogMode}
            onOpenChange={() => setOrderDialogMode(null)}
            type={orderDialogMode}
            onSubmit={handleAddressSubmit}
            initialData={addressData[orderDialogMode]}
            isEdit={isEdit}
          />
        )}
      </div>
      <StickyFooter
        orderType={orderType}
        onSave={handleOnSave}
        saveLoading={saveLoading || walletLoading}
        onConsign={handleConsign}
      />
      {walletCheckOpen && walletCheckData && (
        <WalletCheckDialog
          open={walletCheckOpen}
          onOpenChange={setWalletCheckOpen}
          walletBalance={walletCheckData.wallet_balance}
          orderTotal={calculation.grandTotal}
          isPending={saveLoading}
          onConfirm={() => handleOnSave(true)}
        />
      )}
    </>
  )
}

export default OrderDetailsPage
