import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/router/ProtectedRoute";
import { lazy, Suspense } from "react";
import Layout from "@/layout";
import { Loader2 } from "lucide-react";

// Lazy load page components
const Dashboard = lazy(() => import('@/features/dashboard/pages/Dashboard'));
const Orders = lazy(() => import('@/features/orders/pages/OrdersPage'));
const OrderDetails = lazy(() => import('@/features/orders/pages/OrderDetails'));
const OrderDetails2 = lazy(() => import('@/features/orders/pages/OrderDetails2'));
// const CreateOrder = lazy(() => import('@/features/create-order/'));
const Search = lazy(() => import('@/features/search/pages/SearchPage'));
const GetQuote = lazy(() => import('@/features/quote/pages/GetQuotePage'));
const MyItems = lazy(() => import('@/features/items'));
const AddressBook = lazy(() => import('@/features/address-book'));
const Invoices = lazy(() => import('@/features/invoices/pages/InvoicesPage'));
const InvoiceDetails = lazy(() => import('@/features/invoices/pages/InvoiceDocumentView'));
const Reports = lazy(() => import('@/features/reports'));
const ParcelReport = lazy(() => import('@/features/reports/pages/ParcelReportPage'));
const Enquiry = lazy(() => import('@/features/enquiry'));
// const HelpCenter = lazy(() => import('@/features/help-center/pages/HelpCenterPage'));
const HelpCenterArticle = lazy(() => import('@/features/help-center/pages/HelpCenterArticlePage'));
const Transactions = lazy(() => import('@/features/wallet/pages/TransactionsPage'));
const TopUp = lazy(() => import('@/features/wallet/pages/TopUpPage'));
const IntegrationsLayout = lazy(() => import('@/features/integrations/components/IntegrationsLayout'));
const IntegrationDetails = lazy(() => import('@/features/integrations/pages/IntegrationDetailsPage'));
const HelpCenterLayout = lazy(() => import('@/features/help-center/components/HelpCenterLayout'));

const withSuspense = (Component: React.ReactNode) => (
  <Suspense
    fallback={<div className="flex items-center justify-center h-full w-full">
      <Loader2 className="animate-spin text-blue-400 h-10 w-10" />
    </div>}>
    {Component}
  </Suspense>
);

export default function ClientRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute role="customer" />}>
        <Route element={<Layout />}>
          <Route path="dashboard" element={withSuspense(<Dashboard />)} />
          <Route path="orders">
            <Route index element={withSuspense(<Orders />)} />
            <Route path=":orderType" element={withSuspense(<OrderDetails />)} />
            <Route path=":orderID" element={withSuspense(<OrderDetails2 />)} />
            <Route path=":orderType/:orderID" element={withSuspense(<OrderDetails />)} />
          </Route>

          {/* <Route path="orders/create" element={<CreateOrder />} /> */}
          <Route path="quote" element={withSuspense(<GetQuote />)} />

          <Route path="search" element={withSuspense(<Search />)} />
          <Route path="items" element={withSuspense(<MyItems />)} />
          <Route path="address-book" element={withSuspense(<AddressBook />)} />
          <Route path="integrations" element={withSuspense(<IntegrationsLayout />)}>
            <Route path=":providerId" element={withSuspense(<IntegrationDetails />)} />
          </Route>
          <Route path="wallet">
            <Route path="transactions" element={withSuspense(<Transactions />)} />
            <Route path="top-up" element={withSuspense(<TopUp />)} />
          </Route>

          <Route path="invoices">
            <Route index element={withSuspense(<Invoices />)} />
            <Route path=":invoiceID" element={withSuspense(<InvoiceDetails />)} />
          </Route>
          <Route path="reports" element={withSuspense(<Reports />)} />
          <Route path="parcel-report" element={withSuspense(<ParcelReport />)} />
          <Route path="enquiry" element={withSuspense(<Enquiry />)} />
          <Route path="help-center" element={withSuspense(<HelpCenterLayout />)}>
            {/* <Route index element={<HelpCenter />} /> */}
            <Route path=":slug" element={withSuspense(<HelpCenterArticle />)} />
          </Route>
          {/* Default authenticated route */}
          <Route path="/" element={<Navigate to="/orders" replace />} />

          {/* Fallback route: inside the layout so it doesn't unmount the sidebar on unknown routes */}
          <Route path="*" element={<Navigate to="/orders" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}