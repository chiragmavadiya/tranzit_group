import React from 'react';
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
import WalletCheckDialog from '@/features/orders/components/WalletCheckDialog';
import { Button } from '@/components/ui/button';
import { ConformationModal } from '@/components/common/ConformationModal';
import { ConfirmContinue } from '@/features/orders/components/order-details/ConfirmContinue';
import { ManualOrderDetails } from '@/features/orders/components/order-details/ManualOrderDetails';
import { useOrderWorkflow } from '@/features/orders/hooks/useOrderWorkflow';
import { Skeleton } from '@/components/ui/skeleton';

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
    walletLoading,
    isOrderLoading,
    isDownloadingLabel,
    isCancelling,
    isConsigning,
    globalCouriers,
    orderDetail,
    isEditable,
    walletCheckOpen,
    setWalletCheckOpen,
    walletCheckData,
    quoteData,
    setQuoteData,
    setCourierData,
    addressData,
    manualOrderData,
    setManualOrderData,
    showCancelModal,
    setShowCancelModal,
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
    handleConsign,
    downloadLabel,
  } = useOrderWorkflow();


  if (isOrderLoading && orderType !== 'create' && orderType !== 'create-menual') {
    return <OrderDetailsSkeleton />;
  }

  const isCreate = orderType === 'create' || orderType === 'create-menual' || orderType === 'return';

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
          isCancelling={isCancelling}
          isConsigning={isConsigning}
          showCancelModal={showCancelModal}
          setShowCancelModal={setShowCancelModal}
          requiresManualLabel={requiresManualLabel}
        />

        {requiresManualLabel && (
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

        {orderDetail?.cancel_request && orderDetail.status !== 'Cancelled' && (
          <div className="mb-4 py-2 px-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-500 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="my-0 text-[14px] font-bold text-amber-900 dark:text-amber-100 uppercase tracking-wider">
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
                onClick={() => onCancelOrder(false)}
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
              globalCouriers={globalCouriers}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 items-start">
            <div className="flex flex-col gap-3 overflow-hidden">
              <AddressCard
                title="SENDER"
                name={addressData.sender.name}
                address={addressData.sender.address || ''}
                email={addressData.sender.email}
                editable={isEditable && (role === 'admin' || orderType === 'return')}
                onEditClick={() => onEditClick('sender')}
                phone={addressData.sender.phone}
              />

              <AddressCard
                title="RECEIVER"
                name={addressData.receiver.name}
                address={addressData.receiver.address || ''}
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
              {!isCreate && (
                <HistoryCard history={orderDetail?.shipping_activity} />
              )}

              {isEditable && (
                <ConfirmContinue
                  termsAccepted={termsAccepted}
                  setTermsAccepted={setTermsAccepted}
                  ratesAccepted={ratesAccepted}
                  setRatesAccepted={setRatesAccepted}
                  dangerousGoodsAccepted={dangerousGoodsAccepted}
                  setDangerousGoodsAccepted={setDangerousGoodsAccepted}
                />
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
              orderType={orderType}
              liabilityMessage={orderDetail?.limited_liability_cover?.message}
              liability={orderDetail?.limited_liability_cover?.covered || false}
              payment_status={orderDetail?.payment_status}
              shipping_activity={orderDetail?.transit_timeline?.events?.reverse()}
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
        isConsigning={isConsigning}
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
          handleOnSave('skipItemCountCheck');
        }}
        confirmText="Continue"
        cancelText="Cancel"
        className="sm:max-w-[500px]"
      />
    </>
  );
};

export default OrderDetailsPage;
