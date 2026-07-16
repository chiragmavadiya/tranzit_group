import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertTriangle, XCircle, FileQuestion } from 'lucide-react';
import { OrderHeader } from '@/features/orders/components/order-details/OrderHeader';
import { AddressCard } from '@/features/orders/components/order-details/AddressCard';
import { CarrierCard } from '@/features/orders/components/order-details/CarrierCard';
import { HistoryCard } from '@/features/orders/components/order-details/HistoryCard';
import { SidePanel } from '@/features/orders/components/order-details/SidePanel';
import { StickyFooter } from '@/features/orders/components/order-details/StickyFooter';
import CreateOrderDialog from '@/features/orders/components/CreateOrderDialog';
import { ItemsTable } from '@/features/orders/components/order-details/ItemsTable';
import { ShopifyItemsCard } from '@/features/orders/components/order-details/ShopifyItemsCard';
import WalletCheckDialog from '@/features/orders/components/WalletCheckDialog';
import { Button } from '@/components/ui/button';
import { ConformationModal } from '@/components/common/ConformationModal';
import { ConfirmContinue } from '@/features/orders/components/order-details/ConfirmContinue';
import { ManualOrderDetails } from '@/features/orders/components/order-details/ManualOrderDetails';
import { useOrderWorkflow } from '@/features/orders/hooks/useOrderWorkflow';
import { Skeleton } from '@/components/ui/skeleton';
import { showToast } from '@/components/ui/custom-toast';
import { CustomModel } from '@/components/ui/dialog';
import { FormInput } from '@/features/orders/components/OrderFormUI';
import { isPhoneValid } from '@/lib/utils';
import { getDisplayCourierName } from '../utils/order-details.utils';

const OrderDetailsSkeleton: React.FC = () => {
  return (
    <div className="p-page-padding overflow-y-auto flex-1 bg-white dark:bg-zinc-950 font-sans transition-colors duration-300">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-20 rounded-md" /> {/* Back Button */}
            <Skeleton className="h-8 w-40 rounded-md" /> {/* Order ID */}
            <Skeleton className="h-6 w-24 rounded-full" /> {/* Country Tag */}
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-16 rounded-md" /> {/* Manual badge */}
            <Skeleton className="h-4 w-32 rounded-md" /> {/* Created X hours ago */}
            <Skeleton className="h-6 w-20 rounded-full" /> {/* Printed Badge */}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-36 rounded-md" /> {/* Download Label */}
          <Skeleton className="h-8 w-32 rounded-md" /> {/* Delete Order */}
        </div>
      </div>

      {/* Main Grid Skeleton */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 items-start">
        {/* Left Column */}
        <div className="flex flex-col gap-3">
          {/* Sender Card Skeleton */}
          <div className="border border-gray-200 dark:border-zinc-800 rounded-xl p-4 bg-white dark:bg-zinc-950 flex items-center gap-3">
            <Skeleton className="h-4 w-16" /> {/* SENDER label */}
            <Skeleton className="h-4 w-4 rounded-full" /> {/* CheckCircle icon */}
            <Skeleton className="h-4 flex-1 max-w-lg" /> {/* Address line */}
          </div>

          {/* Receiver Card Skeleton */}
          <div className="border border-gray-200 dark:border-zinc-800 rounded-xl p-4 bg-white dark:bg-zinc-950 flex items-center gap-3">
            <Skeleton className="h-4 w-18" /> {/* RECEIVER label */}
            <Skeleton className="h-4 w-4 rounded-full" /> {/* CheckCircle icon */}
            <Skeleton className="h-4 flex-1 max-w-lg" /> {/* Address line */}
          </div>

          {/* Items Accordion Skeleton */}
          <div className="border border-gray-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950 overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-zinc-900/50 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" /> {/* Box Icon placeholder */}
                <Skeleton className="h-5 w-24" /> {/* ITEMS title */}
              </div>
              <Skeleton className="h-5 w-5 rounded" /> {/* Accordion chevron */}
            </div>
            <div className="p-4 space-y-4">
              <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/30">
                <Skeleton className="h-10 w-24 rounded-lg" /> {/* Standard parcel box info */}
                <Skeleton className="h-10 w-20 rounded-lg" /> {/* QTY info */}
                <Skeleton className="h-10 w-20 rounded-lg" /> {/* Weight info */}
                <Skeleton className="h-10 w-44 rounded-lg" /> {/* Dimensions info */}
              </div>
            </div>
          </div>

          {/* Shipment Options (CarrierCard) Skeleton */}
          <div className="border border-gray-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950 overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-zinc-900/50 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-44" /> {/* Shipment Options title */}
              </div>
            </div>
            <div className="p-4">
              <div className="border border-primary/10 bg-primary/5 dark:bg-primary/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" /> {/* Courier logo placeholder */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3.5 w-36" />
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <Skeleton className="h-5 w-16 ml-auto" />
                  <Skeleton className="h-3 w-20 ml-auto" />
                </div>
              </div>
            </div>
          </div>

          {/* History Card Skeleton */}
          <div className="border border-gray-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950 overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-zinc-900/50 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-20" /> {/* HISTORY title */}
              </div>
              <Skeleton className="h-4 w-4 rounded" />
            </div>
            <div className="p-5 space-y-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (SidePanel) */}
        <div className="flex flex-col gap-3">
          {/* Order Quotation Summary Skeleton */}
          <div className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 overflow-hidden p-5 space-y-4">
            <div className="border-b border-slate-100 dark:border-zinc-800 pb-3 flex justify-between items-center">
              <Skeleton className="h-5 w-52" />
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between"><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-8" /></div>
              <div className="flex justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-12" /></div>
              <div className="flex justify-between"><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-14" /></div>
              <div className="h-px bg-slate-100 dark:bg-zinc-800" />
              <div className="flex justify-between"><Skeleton className="h-4 w-28" /><Skeleton className="h-4 w-12" /></div>
              <div className="flex justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-12" /></div>
              <div className="flex justify-between"><Skeleton className="h-4 w-16" /><Skeleton className="h-4 w-12" /></div>
              <div className="h-px bg-slate-100 dark:bg-zinc-800" />
              <div className="flex justify-between items-center pt-1">
                <div className="space-y-1"><Skeleton className="h-5 w-16" /><Skeleton className="h-3 w-24" /></div>
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>

          {/* Delivery Instructions Skeleton */}
          <div className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 overflow-hidden p-5 space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>

          {/* Liability Cover Skeleton */}
          <div className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 overflow-hidden p-5 space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    orderType,
    orderID,
    role,
    saveLoading,
    isSavingDraft,
    isCreatingConsignment,
    walletLoading,
    isOrderLoading,
    isDownloadingLabel,
    isCancelling,
    isConsigning,
    orderDetail,
    isEditable,
    walletCheckOpen,
    setWalletCheckOpen,
    walletCheckData,
    quoteData,
    setQuoteData,
    courierData,
    setCourierData,
    addressData,
    manualOrderData,
    setManualOrderData,
    showCancelModal,
    setShowCancelModal,
    showArchiveModal,
    setShowArchiveModal,
    showItemCountModal,
    setShowItemCountModal,
    insuranceSelected,
    signatureSelected,
    orderDialogMode,
    setOrderDialogMode,
    deliveryInstructions,
    isEdit,
    termsAccepted,
    setTermsAccepted,
    ratesAccepted,
    setRatesAccepted,
    dangerousGoodsAccepted,
    setDangerousGoodsAccepted,
    selectedCustomer,
    setSelectedCustomer,
    itemsData,
    updateItem,
    fullUpdateItem,
    addItem,
    removeItem,
    handleAddressSubmit,
    onEditClick,
    handleOptionalFieldsChange,
    calculation,
    requiresManualLabel,
    handleOnSave,
    onCancelOrder,
    onArchiveOrder,
    handleConsign,
    downloadLabel,
    hasDefaultItemAndCourier,
    showReceiverPhoneModal,
    setShowReceiverPhoneModal,
    handleReceiverPhoneSubmit,
    default_courier,
    default_item,
    canReadWrite,
    setDeliveryInstructions,
    setActiveSettings,
    activeSettings
    // isCloning,
  } = useOrderWorkflow();

  const [showCarrierConfirm, setShowCarrierConfirm] = useState(false);
  const [receiverPhoneInput, setReceiverPhoneInput] = useState('');
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);

  React.useEffect(() => {
    if (showReceiverPhoneModal) {
      setReceiverPhoneInput(addressData.receiver.phone || '');
    }
  }, [showReceiverPhoneModal, addressData.receiver.phone]);

  const displayCourierName = getDisplayCourierName(
    quoteData?.courier?.carrier || orderDetail?.courier_details?.courier || courierData?.courier
  );

  const handleConsignClick = () => {
    if (!termsAccepted || !ratesAccepted || !dangerousGoodsAccepted) {
      showToast('You must accept all Terms & Conditions, Dangerous Goods, and Futile Pickup declarations.', 'error');
      return;
    }

    if (!courierData?.courier) {
      showToast('Please select a courier.', 'error');
      return;
    }

    if (courierData?.is_own_courier) {
      setShowCarrierConfirm(true);
    } else {
      handleConsign();
    }
  };

  const handleSaveClick = (skipWalletCheckArg: string | boolean) => {
    if (skipWalletCheckArg === 'saveAsDraft') {
      handleOnSave('saveAsDraft');
      return;
    }

    const isValidItems = itemsData && itemsData.length > 0 && itemsData.every((item) =>
      item.type !== 'box' ||
      (Number(item.height) > 0 && Number(item.width) > 0 && Number(item.length) > 0 && Number(item.weight) > 0 && Number(item.quantity) > 0)
    );
    const hasSenderAddress = Boolean(addressData?.sender?.address1);
    const hasReceiverAddress = Boolean(addressData?.receiver?.address1);

    if (role === 'admin' && !selectedCustomer) {
      showToast('Please select a customer.', 'error');
      return;
    }

    if (!isValidItems || !hasSenderAddress || !hasReceiverAddress) {
      showToast('Please fill out item dimensions and complete both addresses.', 'error');
      return;
    }
    if (!courierData?.courier) {
      showToast('Please select a courier.', 'error');
      return;
    }

    if (!termsAccepted || !ratesAccepted) {
      showToast('You must accept all Terms & Conditions and Futile Pickup declarations.', 'error');
      return;
    }

    if (!dangerousGoodsAccepted) {
      showToast("Please confirm that this consignment does not contain dangerous goods", 'error');
      return;
    }

    if (courierData?.is_own_courier) {
      setShowCarrierConfirm(true);
    } else {
      handleOnSave(skipWalletCheckArg);
    }
  };

  const isCreate = orderType === 'create' || orderType === 'create-menual' || orderType === 'return';
  // if (isOrderLoading || (isCreate && orderDialogMode)) {
  //   return <OrderDetailsSkeleton />;
  // }

  if (!isCreate && !isOrderLoading && !orderDetail) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] bg-white dark:bg-zinc-950 px-4 animate-in fade-in duration-300">
        <div className="flex flex-col items-center max-w-md text-center bg-gray-50/50 dark:bg-zinc-900/30 border border-gray-100 dark:border-zinc-800/80 rounded-2xl p-8 shadow-sm">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-5">
            <FileQuestion size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 mb-2 uppercase tracking-wide">
            Order Not Found
          </h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6 leading-relaxed">
            We couldn't find the details for Order <span className="font-bold text-gray-800 dark:text-zinc-200">#{orderID}</span>. It may have been deleted or the ID is incorrect.
          </p>
          <Button
            onClick={() => navigate(`${role === 'admin' ? '/admin' : ''}/orders`)}
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase h-8 shadow-md transition-all active:scale-[0.98]"
          >
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {(isOrderLoading || (isCreate && orderDialogMode && !isEdit)) ? (
        <OrderDetailsSkeleton />
      ) : (
        <>
          <div
            className="p-page-padding overflow-y-auto scrollbar-hide-buttons flex-1 bg-white dark:bg-zinc-950 font-sans text-gray-900 dark:text-zinc-100 dark:border-zinc-800 transition-colors duration-300"
            style={{
              '--webkit-scrollbar-button-display': 'none',
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
              onArchiveOrder={onArchiveOrder}
              isCancelling={isCancelling}
              isConsigning={isConsigning}
              showCancelModal={showCancelModal}
              setShowCancelModal={setShowCancelModal}
              showArchiveModal={showArchiveModal}
              setShowArchiveModal={setShowArchiveModal}
              requiresManualLabel={requiresManualLabel}
              // for clone
              itemsData={itemsData}
              courierData={courierData}
              addressData={addressData}
              signatureSelected={signatureSelected}
              insuranceSelected={insuranceSelected}
              deliveryInstructions={deliveryInstructions}
              canReadWrite={canReadWrite}
              activeSettings={activeSettings}
              quoteData={quoteData}
            />

            {requiresManualLabel && (
              <>
                {role === 'admin' ? (
                  <div>

                  </div>
                ) : (
                  <div className="mb-4 mt-3 py-2 px-4  bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-500 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                        <AlertTriangle size={20} />
                      </div>
                      <div>
                        <h3 className="mt-0 mb-0 text-[14px] font-bold text-red-900 dark:text-red-100 uppercase tracking-wide">
                          Manual Label Required
                        </h3>
                        <p className="mt-0 text-[14px] text-red-700 dark:text-red-300 mb-0 ">
                          The shipping label cannot be generated for this order at the moment, this order requires manual label
                          creation by admin.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>

            )}

            {orderDetail?.cancel_request && orderDetail.status !== 'Cancelled' && (
              <div className="mb-4 py-2 px-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-500 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 className="my-0 text-[14px] font-bold text-amber-900 dark:text-amber-100 uppercase tracking-wide">
                      Cancellation Request Pending
                    </h3>
                    <div className=" flex flex-wrap gap-x-6 gap-y-1 text-[14px] font-bold text-amber-700 dark:text-amber-400/80">
                      <div className="flex items-center gap-1.5">
                        <span className="opacity-90 font-medium">Requested By:</span>
                        <span className='uppercase'>{orderDetail?.cancel_request?.requested_by}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="opacity-90 font-medium">Date:</span>
                        <span>{orderDetail?.cancel_request?.requested_at}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="opacity-90 font-medium">Est. Refund:</span>
                        <span className="text-sm text-amber-800 dark:text-amber-200">
                          ${orderDetail?.cancel_request?.refund_amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {role === 'admin' && (
                  <Button
                    onClick={() => onCancelOrder(true)}
                    disabled={isCancelling}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-8 px-4 shadow-lg shadow-red-600/20 active:scale-[0.98] transition-all flex items-center gap-2"
                  >
                    {isCancelling ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle size={18} />}
                    SUBMIT CANCEL
                  </Button>
                )}
              </div>
            )}

            <main className="mt-3">
              {orderType === 'create-menual' && (
                <ManualOrderDetails
                  manualOrderData={manualOrderData}
                  setManualOrderData={setManualOrderData}
                />
              )}

              <div className={`grid grid-cols-1 ${orderType !== 'create-menual' ? 'lg:grid-cols-[1fr_380px]' : ''} gap-4 items-start`}>
                <div className="flex flex-col gap-3 overflow-hidden lg:col-start-1 lg:row-start-1">
                  <AddressCard
                    title="Sender"
                    name={addressData.sender.name}
                    // address={addressData.sender.address_info || addressData.sender.address || ''}
                    address={`${addressData.sender?.unit_number && addressData.sender?.unit_number + '-'}${addressData.sender?.address1}, ${addressData?.sender?.suburb} ${addressData?.sender?.state} ${addressData?.sender?.postcode} Australia`}
                    email={addressData.sender.email}
                    editable={isEditable && (role === 'admin' || orderType === 'return')}
                    onEditClick={() => onEditClick('sender')}
                    phone={addressData.sender.phone}
                  />
                  <AddressCard
                    title="Receiver"
                    name={addressData.receiver.name}
                    address={`${addressData.receiver?.unit_number && addressData.receiver?.unit_number + '-'}${addressData.receiver?.address1}, ${addressData?.receiver?.suburb} ${addressData?.receiver?.state} ${addressData?.receiver?.postcode} Australia`}
                    email={addressData.receiver.email}
                    instruction={addressData.receiver.instructions || ''}
                    editable={isEditable && orderType !== 'return'}
                    onEditClick={() => onEditClick('receiver')}
                    phone={addressData.receiver.phone}
                  />

                  <ItemsTable
                    items={itemsData}
                    onUpdateItem={updateItem}
                    onFullUpdateItem={fullUpdateItem}
                    addItem={addItem}
                    removeItem={removeItem}
                    orderType={orderType}
                    customerId={selectedCustomer}
                  />
                  {orderDetail?.order_details?.shopify_items && orderDetail.order_details.shopify_items.length > 0 && (
                    <ShopifyItemsCard items={orderDetail.order_details.shopify_items} />
                  )}
                  {orderType !== 'create-menual' && (
                    <CarrierCard
                      itemData={itemsData}
                      addresses={addressData}
                      onQuoteChange={setQuoteData}
                      setCourierData={setCourierData}
                      orderDetail={orderDetail}
                      orderType={orderType!}
                      selectedCustomer={selectedCustomer}
                      module="order"
                      default_courier={default_courier}
                      initialSelectedCourierId={orderDetail?.courier_details && `${orderDetail?.courier_details?.courier_code || ''}${orderDetail?.courier_details?.product_id || ''}`}
                      signatureSelected={signatureSelected}
                      setDeliveryInstructions={setDeliveryInstructions}
                      activeSettings={activeSettings}
                      setActiveSettings={setActiveSettings}
                      onLoadingChange={setIsQuoteLoading}
                    />
                  )}
                  {!isCreate && (
                    <HistoryCard history={orderDetail?.shipping_activity} />
                  )}
                </div>

                {orderType !== 'create-menual' && (
                  <div className="lg:col-start-2 lg:row-start-1 w-full">
                    <SidePanel
                      calculation={calculation}
                      itemsData={itemsData}
                      quoteData={quoteData}
                      handleOptionalFieldsChange={handleOptionalFieldsChange}
                      insuranceSelected={insuranceSelected}
                      // signatureSelected={signatureSelected}
                      deliveryInstructions={deliveryInstructions}
                      orderType={orderType}
                      liabilityMessage={orderDetail?.limited_liability_cover?.message}
                      liability={orderDetail?.limited_liability_cover?.covered || false}
                      payment_status={orderDetail?.payment_status}
                      shipping_activity={orderDetail?.transit_timeline?.events?.reverse()}
                    />
                  </div>
                )}

                {isEditable && (
                  <div className="lg:col-start-1 lg:row-start-2 w-full">
                    <ConfirmContinue
                      termsAccepted={termsAccepted}
                      setTermsAccepted={setTermsAccepted}
                      ratesAccepted={ratesAccepted}
                      setRatesAccepted={setRatesAccepted}
                      dangerousGoodsAccepted={dangerousGoodsAccepted}
                      setDangerousGoodsAccepted={setDangerousGoodsAccepted}
                    />
                  </div>
                )}
              </div>
            </main>
          </div>
          <StickyFooter
            orderType={orderType}
            onSave={handleSaveClick}
            saveLoading={saveLoading || walletLoading}
            isSavingDraft={isSavingDraft}
            isCreatingConsignment={isCreatingConsignment}
            onConsign={handleConsignClick}
            isConsigning={isConsigning}
            isServicePending={isQuoteLoading}
          />
        </>
      )}
      {orderDialogMode && (
        <CreateOrderDialog
          open={!!orderDialogMode}
          onOpenChange={() => setOrderDialogMode(null)}
          type={orderDialogMode}
          onSubmit={handleAddressSubmit}
          initialData={addressData[orderDialogMode]}
          isEdit={isEdit}
          orderId={orderID}
          orderType={orderType}
          hasDefaultItemAndCourier={hasDefaultItemAndCourier}
          default_courier={default_courier}
          default_item={default_item}
          selectedCustomer={selectedCustomer}
          onCustomerSelect={setSelectedCustomer}
        />
      )}
      {walletCheckOpen && walletCheckData && (
        <WalletCheckDialog
          open={walletCheckOpen}
          onOpenChange={setWalletCheckOpen}
          walletBalance={walletCheckData.wallet_balance}
          orderTotal={calculation.grandTotal}
          isPending={isCreate ? saveLoading : isConsigning}
          onConfirm={() => isCreate ? handleOnSave(walletCheckData?.skipWalletCheckArg || quoteData.courier.is_own_courier) : handleConsign(true)}
        />
      )}
      <ConformationModal
        open={showItemCountModal}
        onOpenChange={setShowItemCountModal}
        title="Shipping Label Not Generated"
        description={
          <div className="space-y-4">
            <p className="text-sm">The shipping label cannot be generated for this order at the moment.</p>
            <p className="text-sm font-semibold">
              The shipping label will be created by our support team once the payment has been successfully completed.
            </p>
          </div>
        }
        onConfirm={() => {
          setShowItemCountModal(false);
          if (isCreate) {
            handleOnSave('skipItemCountCheck');
          } else {
            handleConsign('skipItemCountCheck');
          }
        }}
        confirmText="Continue"
        cancelText="Cancel"
        className="sm:max-w-[500px]"
      />
      {showCarrierConfirm && (
        <ConformationModal
          open={showCarrierConfirm}
          onOpenChange={setShowCarrierConfirm}
          title="Confirm carrier"
          description={
            <div className="space-y-4 pt-2">
              <p className="text-sm text-slate-600 dark:text-zinc-400">
                You're about to create this shipment using your connected <strong className="font-bold text-slate-800 dark:text-zinc-200">{displayCourierName}</strong> account.
              </p>
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Shipping charges will be billed according to your {displayCourierName} account and contract setup.
              </p>
            </div>
          }
          onConfirm={() => {
            setShowCarrierConfirm(false);
            if (isCreate) {
              handleOnSave(false);
            } else {
              handleConsign();
            }
          }}
          confirmText={`Continue`}
          cancelText="Cancel"
          className='sm:max-w-[500px]'
        />
      )}
      {showReceiverPhoneModal && (
        <CustomModel
          open={showReceiverPhoneModal}
          onOpenChange={setShowReceiverPhoneModal}
          title="Receiver Phone Number Required"
          description="A contact number for the receiver is required to book this consignment."
          onSubmit={() => {
            if (!receiverPhoneInput.trim() || !isPhoneValid(receiverPhoneInput)) {
              showToast("Please enter a valid phone number", "error");
              return;
            }
            handleReceiverPhoneSubmit(receiverPhoneInput);
          }}
          submitText="Continue"
          cancelText="Cancel"
          contentClass="sm:max-w-[450px]"
        >
          <div className="p-4 space-y-4">
            <FormInput
              label="Receiver Phone Number"
              value={receiverPhoneInput}
              onChange={(val) => setReceiverPhoneInput(val)}
              placeholder="e.g. 0412345678"
              required
              isFullWidth
              error={!receiverPhoneInput.trim() || !isPhoneValid(receiverPhoneInput)}
            />
          </div>
        </CustomModel>
      )}
    </>
  );
};

export default OrderDetailsPage;
