import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/router/ProtectedRoute";
import { lazy, Suspense } from "react";
import Layout from "@/layout";
import PageLoading from "@/components/common/Loader";

// Lazy load page components
const Dashboard = lazy(() => import('@/features/dashboard/pages/Dashboard'));
const Orders = lazy(() => import('@/features/orders/pages/OrdersPage'));
const OrderDetails = lazy(() => import('@/features/orders/pages/OrderDetails'));
const Search = lazy(() => import('@/features/search/pages/SearchPage'));
const Setup = lazy(() => import('@/features/setup/pages/SetupPage'));
const Invoices = lazy(() => import('@/features/invoices/pages/InvoicesPage'));
const InvoiceDetails = lazy(() => import('@/features/invoices/pages/InvoiceDocumentView'));
const ParcelReport = lazy(() => import('@/features/reports/pages/ParcelReportPage'));
const AuspostReportPage = lazy(() => import('@/features/reports/pages/AusPostReport'));
const IntegratedParcelReport = lazy(() => import('@/features/reports/pages/IntegratedParcelReport'));
const OrderLabelChargesReport = lazy(() => import('@/features/reports/pages/OrderLabelChargesReport'));
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
const GlobalConfigPage = lazy(() => import('@/features/global-config/pages/GlobalConfigPage'));
const BlackoutDaysPage = lazy(() => import('@/features/blackout-days/pages/BlackoutDaysPage'));

const HelpCenterAdminPage = lazy(() => import('@/features/help-center-admin/pages/HelpCenterAdminPage'));
const SettingsLayout = lazy(() => import('@/features/settings/components/SettingsLayout'));
const CategorySettingsPage = lazy(() => import('@/features/settings/pages/CategorySettingsPage'));
const ActivityLogPage = lazy(() => import('@/features/activity-log/pages/ActivityLogPage'));
const DebugCentrePage = lazy(() => import('@/features/debug-centre/pages/DebugCentrePage'));
const TraceDetailPage = lazy(() => import('@/features/debug-centre/pages/TraceDetailPage'));

const withSuspense = (Component: React.ReactNode) => (
    <Suspense
        fallback={<div className="flex items-center justify-center h-full w-full">
            <PageLoading />
        </div>}>
        {Component}
    </Suspense>
);


export default function AdminRoutes() {
    console.log("Render AdminRoutes")

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
                    <Route path="cancel-order" element={withSuspense(<CancelOrderPage />)} />

                    <Route path="invoices">
                        <Route index element={withSuspense(<Invoices />)} />
                        <Route path=":invoiceID" element={withSuspense(<InvoiceDetails />)} />
                    </Route>

                    <Route path="customers">
                        <Route index element={withSuspense(<CustomerManagement />)} />
                        <Route path=":id" element={withSuspense(<CustomerDetailPage />)} />
                    </Route>

                    {/* Staff */}
                    <Route path="staff" element={withSuspense(<StaffManagementPage />)} />

                    {/* Book Pickup */}
                    <Route path="book-pickup" element={withSuspense(<BookPickupPage />)} />

                    {/* Zoho Integration, Global Settings */}
                    <Route path="zoho-integration" element={withSuspense(<ZohoIntegrationPage />)} />
                    <Route path="global-config" element={withSuspense(<GlobalConfigPage />)} />
                    <Route path="blackout-days" element={withSuspense(<BlackoutDaysPage />)} />
                    <Route path="settings" element={withSuspense(<SettingsLayout />)}>
                        <Route path=":categoryId" element={withSuspense(<CategorySettingsPage />)} />
                    </Route>

                    {/* Wallet Topup */}
                    <Route path="topup" element={withSuspense(<AdminTopUpPage />)} />

                    {/* Courier Global Settings */}
                    <Route path="courier-surcharge" element={withSuspense(<CourierSurchargePage />)} />
                    <Route path="courier-postcode" element={withSuspense(<CourierPostcodePage />)} />

                    {/* Enquiries */}
                    <Route path="enquiry" element={withSuspense(<EnquiryPage />)} />

                    {/* Reports */}
                    <Route path="auspost-report" element={withSuspense(<AuspostReportPage />)} />
                    <Route path="customer-parcel-report" element={withSuspense(<ParcelReport />)} />
                    <Route path="integrated-parcel-report" element={withSuspense(<IntegratedParcelReport />)} />
                    <Route path="order-label-charges" element={withSuspense(<OrderLabelChargesReport />)} />

                    {/* Order Summary */}
                    <Route path="order-summary" element={withSuspense(<AuspostOrderSummaryPage />)} />

                    {/* Undelivered */}
                    <Route path="undelivered" element={withSuspense(<UndeliveredParcelPage />)} />

                    {/* Quotes */}
                    <Route path="quotes">
                        <Route path="history" element={withSuspense(<QuoteList />)} />
                        <Route index element={withSuspense(<GetQuote />)} />
                    </Route>

                    {/* Profile */}
                    <Route path="profile" element={withSuspense(<ProfilePage />)} />

                    {/* Help Center */}
                    <Route path="help-center" element={withSuspense(<HelpCenterAdminPage />)} />

                    {/* Activity Log */}
                    <Route path="activity-log" element={withSuspense(<ActivityLogPage />)} />

                    {/* Debug Centre */}
                    <Route path="debug-centre">
                        <Route index element={withSuspense(<DebugCentrePage />)} />
                        <Route path=":traceId" element={withSuspense(<TraceDetailPage />)} />
                    </Route>

                    {/* Others */}
                    <Route path="setup" element={withSuspense(<Setup />)} />
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