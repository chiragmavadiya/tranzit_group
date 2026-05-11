import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { OrderHeader } from '@/features/orders/components/order-details/OrderHeader'
import { AddressCard } from '@/features/orders/components/order-details/AddressCard'
import { CarrierCard } from '@/features/orders/components/order-details/CarrierCard'
import { HistoryCard } from '@/features/orders/components/order-details/HistoryCard'
import { SidePanel } from '@/features/orders/components/order-details/SidePanel'
import { StickyFooter } from '@/features/orders/components/order-details/StickyFooter'
import CreateOrderDialog from '@/features/orders/components/CreateOrderDialog'
import { ItemsTable } from '@/features/orders/components/order-details/ItemsTable'
// import { PackagingTable } from '@/features/orders/components/order-details/PackagingTable'
import { useOrderItems } from '@/features/orders/hooks/useOrderItems'
import type { AddressData } from '../types'
import { useCreateOrder, useOrderDetails } from '../hooks/useOrders'
import { showToast } from '@/components/ui/custom-toast'
import { Checkbox } from '@/components/ui/checkbox'
import { DANGEROUS_GOODS_URL, PRIVACY_POLICY_URL, TERMS_CONDITIONS_URL } from '@/constants'
import { useAppSelector } from '@/hooks/store.hooks'
// import { useOrderPackaging } from '@/features/orders/hooks/useOrderPackaging'

const OrderDetailsPage: React.FC = () => {
  const { orderType, orderID } = useParams<{ orderType: string, orderID: string }>()
  const { mutate: createOrder, isPending: saveLoading } = useCreateOrder()
  const { data: orderResponse, isLoading: isOrderLoading } = useOrderDetails(orderID || '')
  const { role } = useAppSelector((state) => state.auth)
  const orderDetail = orderResponse?.data
  const navigate = useNavigate()

  const [quoteData, setQuoteData] = useState<any>(null);

  const [addressData, setAddressData] = useState<{ sender: AddressData, receiver: AddressData }>({
    sender: {
      email: "",
      phone: "",
      company: "",
      address1: "150 Collins Street, Melbourne, VIC, 3000, Australia",
      suburb: "Melbourne",
      state: "VIC",
      street_name: "Collins",
      street_number: "150",
      postcode: "3000",
      country: "Australia",
      name: "Zack",
      saveToAddressBook: false,
    },
    receiver: {
      email: "",
      phone: "",
      company: "",
      address1: "",
      suburb: "",
      state: "",
      street_name: "",
      street_number: "",
      postcode: "",
      country: "",
      name: "",
      saveToAddressBook: false
    }
  })
  const [courierData, setCourierData] = useState<any>(null)
  const initialDialogMode = useMemo(() => {
    if (orderType === 'create' && addressData.receiver.address1 === '') {
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

  useEffect(() => {
    if (orderDetail && orderType !== 'create') {
      setAddressData({
        sender: {
          name: orderDetail.sender_details?.name || "",
          email: orderDetail.sender_details?.email || "",
          phone: orderDetail.sender_details?.mobile || "",
          address1: orderDetail.sender_details?.address || "",
          company: "",
          suburb: "",
          state: "",
          street_name: "",
          street_number: "",
          postcode: "",
          country: "Australia",
          saveToAddressBook: false,
        },
        receiver: {
          name: orderDetail.receiver_details?.name || "",
          email: orderDetail.receiver_details?.email || "",
          phone: orderDetail.receiver_details?.mobile || "",
          address1: orderDetail.receiver_details?.address || "",
          company: "",
          suburb: "",
          state: "",
          street_name: "",
          street_number: "",
          postcode: "",
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
      console.log(orderDetail, 'orderDetail')
      setQuoteData(orderDetail.order_details)
    }
  }, [orderDetail, orderType, setItemsData])

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

  const handleOnSave = useCallback(() => {
    const isValidItems = itemsData && itemsData.length > 0 && itemsData.every(item =>
      Number(item.height) > 0 && Number(item.width) > 0 && Number(item.length) > 0 && Number(item.weight) > 0 && Number(item.quantity) > 0
    );
    const hasSenderAddress = Boolean(addressData?.sender?.address1);
    const hasReceiverAddress = Boolean(addressData?.receiver?.address1);

    if (!isValidItems || !hasSenderAddress || !hasReceiverAddress) {
      showToast('Please fill out item dimensions and complete both addresses.', "error");
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
      capture: false,
      save_address: addressData?.receiver?.saveToAddressBook ? 1 : 0,
      customer_id: selectedCustomer || undefined
    }
    createOrder(payload, {
      onSuccess: (response) => {
        showToast('Orders Created successfully', "success");
        navigate(`${role === 'admin' ? '/admin' : ''}/orders/edit/${response.order_number}`)
      },
      onError: (error: any) => {
        showToast(error?.response?.data?.message || 'Failed to create orders', "error");
      }
    });
  }, [createOrder, addressData, itemsData, insuranceSelected, signatureSelected, deliveryInstructions, termsAccepted, quoteData, courierData, pickupDate, navigate, ratesAccepted, dangerousGoodsAccepted, role, selectedCustomer])

  if (isOrderLoading && orderType !== 'create') {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#0060FE]" />
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
          orderDetail={orderDetail!}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
        />
        <main className="mt-3">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start">
            <div className="flex flex-col gap-3 overflow-hidden">
              <AddressCard
                title="SENDER"
                name={addressData.sender.name}
                address={addressData.sender.address1}
                email={addressData.sender.email}
                editable={orderType === 'create'}
                onEditClick={() => onEditClick('sender')}
              />

              <AddressCard
                title="RECEIVER"
                name={addressData.receiver.name}
                address={addressData.receiver.address1}
                editable={orderType === 'create'}
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

              {/* <PackagingTable
                data={packagingData}
                onUpdate={updatePackaging}
              /> */}

              <CarrierCard
                itemData={itemsData}
                addresses={addressData}
                onQuoteChange={setQuoteData}
                setCourierData={setCourierData}
                orderDetail={orderDetail}
                orderType={orderType!}
                module="order"
              />
              {orderType !== 'create' && <HistoryCard history={orderDetail?.shipping_activity} />}

              {/* {orderType === 'create' && (
                <div className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 flex flex-col gap-4 shadow-sm transition-colors duration-300">
                  <h3 className="my-0 text-sm font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wider">Pickup Details</h3>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-zinc-300">Select Pickup Date</label>
                    <Input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className={`h-10 text-xs focus-visible:ring-0 focus-visible:border-[#0060FE] dark:focus-visible:border-blue-500 font-medium w-full max-w-[250px] transition-colors shadow-sm ${!pickupDate ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-zinc-800'}`}
                    />
                    {!pickupDate && (
                      <span className="text-[10px] font-bold text-red-500 uppercase mt-1">Pickup date is required</span>
                    )}
                  </div>
                </div>
              )} */}

              {orderType === 'create' && (
                <div className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 flex flex-col gap-4 shadow-sm transition-colors duration-300">
                  <h3 className="my-0 text-sm font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wider">Confirm & Continue</h3>

                  <div className="flex flex-col gap-3">
                    <label className={`flex items-start gap-3 rounded-[12px] transition-colors cursor-pointer `}>
                      <Checkbox
                        checked={termsAccepted}
                        onCheckedChange={(c) => setTermsAccepted(c)}
                        className="mt-0.5 rounded-[6px] data-[state=checked]:bg-[#0060FE] data-[state=checked]:border-[#0060FE]"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 dark:text-zinc-100">
                          I accept the <a href={TERMS_CONDITIONS_URL} target="_blank" className="text-[#0060FE] hover:underline">Terms & Conditions</a> and <a href={PRIVACY_POLICY_URL} target="_blank" className="text-[#0060FE] hover:underline">Privacy Policy</a>
                        </span>
                      </div>
                    </label>

                    <label className={`flex items-start gap-3 rounded-[12px] transition-colors cursor-pointer `}>
                      <Checkbox
                        checked={ratesAccepted}
                        onCheckedChange={(c) => setRatesAccepted(c)}
                        className="mt-0.5 rounded-[6px] data-[state=checked]:bg-[#0060FE] data-[state=checked]:border-[#0060FE]"
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
                        className="mt-0.5 rounded-[6px] data-[state=checked]:bg-[#0060FE] data-[state=checked]:border-[#0060FE]"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                          This consignment does not contain <a href={DANGEROUS_GOODS_URL} target="_blank" className="text-[#0060FE] hover:underline">dangerous goods</a>
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
      <StickyFooter orderType={orderType} onSave={handleOnSave} saveLoading={saveLoading} />
    </>
  )
}

export default OrderDetailsPage
