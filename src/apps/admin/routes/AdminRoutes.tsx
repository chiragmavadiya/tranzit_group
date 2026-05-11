import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/router/ProtectedRoute";
import { lazy, Suspense } from "react";
import Layout from "@/layout";
import { Loader2 } from "lucide-react";

// Lazy load page components
const Dashboard = lazy(() => import('@/features/dashboard/pages/Dashboard'));
const Orders = lazy(() => import('@/features/orders/pages/OrdersPage'));
const OrderDetails = lazy(() => import('@/features/orders/pages/OrderDetails'));
const Search = lazy(() => import('@/features/search/pages/SearchPage'));
const Setup = lazy(() => import('@/features/setup/pages/SetupPage'));
const Invoices = lazy(() => import('@/features/invoices/pages/InvoicesPage'));
const InvoiceDetails = lazy(() => import('@/features/invoices/pages/InvoiceDocumentView'));
const ParcelReport = lazy(() => import('@/features/reports/pages/ParcelReportPage'));
const CustomerManagement = lazy(() => import('@/features/customers/pages/CustomerPage'));
const CustomerDetailPage = lazy(() => import('@/features/customers/pages/CustomerDetailPage'));
const CancelOrderPage = lazy(() => import('@/features/cancel-order/pages/CancelOrderPage'));
const BookPickupPage = lazy(() => import('@/features/book-pickup/pages/BookPickupPage'));
const StaffManagementPage = lazy(() => import('@/features/staff/pages/StaffManagementPage'));
const ZohoIntegrationPage = lazy(() => import('@/features/zoho/pages/ZohoIntegrationPage'));
const AdminTopUpPage = lazy(() => import('@/features/wallet/pages/AdminTopUpPage'));
const CourierSurchargePage = lazy(() => import('@/features/courier-surcharge/pages/CourierSurchargePage'));
const CourierPostcodePage = lazy(() => import('@/features/courier-postcode/pages/CourierPostcodePage'));
const EnquiryPage = lazy(() => import('@/features/enquiries/pages/EnquiryPage'));
const AuspostOrderSummaryPage = lazy(() => import('@/features/auspost-order-summary/pages/AuspostOrderSummaryPage'));
const UndeliveredParcelPage = lazy(() => import('@/features/undelivered-parcel/pages/UndeliveredParcelPage'));
const GetQuote = lazy(() => import('@/features/quote/pages/GetQuotePage'));
const QuoteList = lazy(() => import('@/features/customer-quote/pages/QuoteListPage'));
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'));

const HelpCenterAdminPage = lazy(() => import('@/features/help-center-admin/pages/HelpCenterAdminPage'));
const SettingsLayout = lazy(() => import('@/features/settings/components/SettingsLayout'));
const CategorySettingsPage = lazy(() => import('@/features/settings/pages/CategorySettingsPage'));
const ActivityLogPage = lazy(() => import('@/features/activity-log/pages/ActivityLogPage'));

const withSuspense = (Component: React.ReactNode) => (
    <Suspense
        fallback={<div className="flex items-center justify-center h-full w-full">
            <Loader2 className="animate-spin text-blue-400 h-10 w-10" />
        </div>}>
        {Component}
    </Suspense>
);


export default function AdminRoutes() {
    return (
        <Routes>
            <Route element={<ProtectedRoute role="admin" />}>
                <Route element={<Layout />}>
                    <Route path="dashboard" element={withSuspense(<Dashboard />)} />
                    <Route path="orders">
                        <Route index element={withSuspense(<Orders />)} />
                        <Route path=":orderType" element={withSuspense(<OrderDetails />)} />
                        <Route path=":orderType/:orderID" element={withSuspense(<OrderDetails />)} />
                    </Route>
                    <Route path="invoices">
                        <Route index element={withSuspense(<Invoices />)} />
                        <Route path=":invoiceID" element={withSuspense(<InvoiceDetails />)} />
                    </Route>
                    <Route path="setup" element={withSuspense(<Setup />)} />
                    <Route path="customer-parcel-report" element={withSuspense(<ParcelReport />)} />
                    <Route path="customers">
                        <Route index element={withSuspense(<CustomerManagement />)} />
                        <Route path=":id" element={withSuspense(<CustomerDetailPage />)} />
                    </Route>
                    <Route path="cancel-order" element={withSuspense(<CancelOrderPage />)} />
                    <Route path="book-pickup" element={withSuspense(<BookPickupPage />)} />
                    <Route path="staff" element={withSuspense(<StaffManagementPage />)} />
                    <Route path="zoho-integration" element={withSuspense(<ZohoIntegrationPage />)} />
                    <Route path="topup" element={withSuspense(<AdminTopUpPage />)} />
                    <Route path="courier-surcharge" element={withSuspense(<CourierSurchargePage />)} />
                    <Route path="courier-postcode" element={withSuspense(<CourierPostcodePage />)} />
                    <Route path="enquiry" element={withSuspense(<EnquiryPage />)} />
                    <Route path="order-summary" element={withSuspense(<AuspostOrderSummaryPage />)} />
                    <Route path="undelivered" element={withSuspense(<UndeliveredParcelPage />)} />
                    <Route path="quotes">
                        <Route index element={withSuspense(<QuoteList />)} />
                        <Route path="create" element={withSuspense(<GetQuote />)} />
                    </Route>
                    <Route path="profile" element={withSuspense(<ProfilePage />)} />

                    <Route path="help-center" element={withSuspense(<HelpCenterAdminPage />)} />
                    <Route path="settings" element={withSuspense(<SettingsLayout />)}>
                        <Route path=":categoryId" element={withSuspense(<CategorySettingsPage />)} />
                    </Route>
                    <Route path="activity-log" element={withSuspense(<ActivityLogPage />)} />
                    <Route path="search" element={withSuspense(<Search />)} />
                    {/* Default authenticated route */}
                    <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

                    {/* Fallback route: inside the layout so it doesn't unmount the sidebar on unknown routes */}
                    <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Route>
            </Route>
        </Routes>
    );
}