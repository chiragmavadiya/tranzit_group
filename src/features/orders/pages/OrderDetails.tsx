import React from 'react';
import { Loader2, AlertTriangle, XCircle } from 'lucide-react';
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

const OrderDetailsPage: React.FC = () => {
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
    pickupDate,
    setPickupDate,
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
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <span className="text-sm font-bold text-gray-500 animate-pulse uppercase tracking-widest">
            Loading Order Details...
          </span>
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
                <h3 className="mt-0 mb-0 text-[12px] font-bold text-red-900 dark:text-red-100 uppercase tracking-wide">
                  Manual Label Required
                </h3>
                <p className="mt-0 text-[11px] text-red-700 dark:text-red-300 mb-0 ">
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
                <h3 className="my-0 text-[12px] font-bold text-amber-900 dark:text-amber-100 uppercase tracking-wider">
                  Cancellation Request Pending
                </h3>
                <div className=" flex flex-wrap gap-x-6 gap-y-1 text-[11px] font-bold text-amber-700 dark:text-amber-400/80">
                  <div className="flex items-center gap-1.5">
                    <span className="opacity-80 font-medium">Requested By:</span>
                    <span>{orderDetail?.cancel_request?.requested_by}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="opacity-80 font-medium">Date:</span>
                    <span>{orderDetail?.cancel_request?.requested_at}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="opacity-80 font-medium">Est. Refund:</span>
                    <span className="text-sm text-amber-900 dark:text-amber-200">
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

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-4 items-start">
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
              {orderType !== 'create' && orderType !== 'create-menual' && (
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
              pickupDate={pickupDate}
              setPickupDate={setPickupDate}
              orderType={orderType}
              liabilityMessage={orderDetail?.limited_liability_cover?.message}
              liability={orderDetail?.limited_liability_cover?.covered || false}
              payment_status={orderDetail?.payment_status}
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
