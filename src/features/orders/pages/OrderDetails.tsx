import React, { useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
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
// import { useOrderPackaging } from '@/features/orders/hooks/useOrderPackaging'

const OrderDetailsPage: React.FC = () => {
  const { orderType, orderID } = useParams<{ orderType: string, orderID: string }>()

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
  const initialDialogMode = useMemo(() => {
    if (addressData.receiver.address1 === '') {
      return "receiver"
    }
    return null
  }, [addressData])
  const [orderDialogMode, setOrderDialogMode] = useState<"sender" | "receiver" | null>(initialDialogMode)

  const {
    itemsData,
    updateItem,
    fullUpdateItem,
    addItem,
    removeItem
  } = useOrderItems([
    {
      type: "box",
      quantity: 0,
      weight: 0,
      length: 0,
      width: 0,
      height: 0
    }
  ])

  // const {
  //   packagingData,
  //   updatePackaging
  // } = useOrderPackaging({
  //   package: 'Package',
  //   qty: 1,
  //   length: 10,
  //   width: 5,
  //   height: 1,
  //   weight: 2,
  //   cubic: 0.0001,
  //   tracking: ''
  // })

  const handleAddressSubmit = useCallback((type: "sender" | "receiver", data: AddressData) => {
    setAddressData(prev => ({ ...prev, [type]: data }))
    setOrderDialogMode(null)
  }, [])

  const onCreateOrderClick = useCallback((type: "sender" | "receiver") => {
    setOrderDialogMode(type)
  }, [])

  // const senderAddress = useMemo(() => ({
  //   name: "Zack",
  //   address: "150 Collins Street, Melbourne, VIC, 3000, Australia",
  //   email: "zack@yopmail.com"
  // }), [])

  // const receiverAddress = useMemo(() => ({
  //   name: "new order",
  //   address: "150 Collins Street, Melbourne, VIC, 3000, Australia"
  // }), [])

  return (
    <>
      <div
        className="p-page-padding overflow-y-auto scrollbar-hide-buttons bg-white dark:bg-zinc-950 font-sans text-gray-900 dark:text-zinc-100 dark:border-zinc-800 transition-colors duration-300"
        style={{
          '--webkit-scrollbar-button-display': 'none'
        } as React.CSSProperties}
      >
        <OrderHeader orderID={orderID} orderType={orderType} />
        <main className="mt-3">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start">
            <div className="flex flex-col gap-3 overflow-hidden">
              <AddressCard
                title="SENDER"
                name={addressData.sender.name}
                address={addressData.sender.address1}
                email={addressData.sender.email}
                editable={orderType === 'create'}
                onEditClick={() => onCreateOrderClick('sender')}
              />

              <AddressCard
                title="RECEIVER"
                name={addressData.receiver.name}
                address={addressData.receiver.address1}
                editable={orderType === 'create'}
                onEditClick={() => onCreateOrderClick('receiver')}
              />

              <ItemsTable
                items={itemsData}
                onUpdateItem={updateItem}
                onFullUpdateItem={fullUpdateItem}
                addItem={addItem}
                removeItem={removeItem}
              />

              {/* <PackagingTable
                data={packagingData}
                onUpdate={updatePackaging}
              /> */}

              <CarrierCard itemData={itemsData} addresses={addressData} onQuoteChange={setQuoteData} />
              <HistoryCard />
            </div>

            <SidePanel itemsData={itemsData} quoteData={quoteData} />
          </div>
        </main>
        {orderDialogMode && (
          <CreateOrderDialog
            open={!!orderDialogMode}
            onOpenChange={() => setOrderDialogMode(null)}
            type={orderDialogMode}
            onSubmit={handleAddressSubmit}
            initialData={addressData[orderDialogMode]}
          />
        )}
      </div>
      <StickyFooter orderType={orderType} />
    </>
  )
}

export default OrderDetailsPage
