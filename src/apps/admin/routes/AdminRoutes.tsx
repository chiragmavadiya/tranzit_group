import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/router/ProtectedRoute";
import { lazy } from "react";
import Layout from "@/layout";

// Lazy load page components
const Dashboard = lazy(() => import('@/features/dashboard/pages/Dashboard'));
const Orders = lazy(() => import('@/features/orders/pages/OrdersPage'));
const OrderDetails = lazy(() => import('@/features/orders/pages/OrderDetails2'));
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


export default function AdminRoutes() {
    return (
        <Routes>
            <Route element={<ProtectedRoute role="admin" />}>
                <Route element={<Layout />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="orders">
                        <Route index element={<Orders />} />
                        <Route path=":orderID" element={<OrderDetails />} />
                        <Route path=":orderType/:orderID" element={<OrderDetails />} />
                    </Route>
                    <Route path="invoices">
                        <Route index element={<Invoices />} />
                        <Route path=":invoiceID" element={<InvoiceDetails />} />
                    </Route>
                    <Route path="setup" element={<Setup />} />
                    <Route path="customer-parcel-report" element={<ParcelReport />} />
                    <Route path="customers">
                        <Route index element={<CustomerManagement />} />
                        <Route path=":id" element={<CustomerDetailPage />} />
                    </Route>
                    <Route path="cancel-order" element={<CancelOrderPage />} />
                    <Route path="book-pickup" element={<BookPickupPage />} />
                    <Route path="staff" element={<StaffManagementPage />} />
                    <Route path="zoho-integration" element={<ZohoIntegrationPage />} />
                    <Route path="topup" element={<AdminTopUpPage />} />
                    <Route path="courier-surcharge" element={<CourierSurchargePage />} />
                    <Route path="courier-postcode" element={<CourierPostcodePage />} />
                    <Route path="enquiry" element={<EnquiryPage />} />
                    <Route path="order-summary" element={<AuspostOrderSummaryPage />} />
                    <Route path="undelivered" element={<UndeliveredParcelPage />} />
                    <Route path="quotes">
                        <Route index element={<QuoteList />} />
                        <Route path="create" element={<GetQuote />} />
                    </Route>
                    <Route path="profile" element={<ProfilePage />} />

                    <Route path="help-center" element={<HelpCenterAdminPage />} />
                    <Route path="settings" element={<SettingsLayout />}>
                        <Route path=":categoryId" element={<CategorySettingsPage />} />
                    </Route>
                    <Route path="activity-log" element={<ActivityLogPage />} />
                    <Route path="search" element={<Search />} />
                    {/* Default authenticated route */}
                    <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

                    {/* Fallback route: inside the layout so it doesn't unmount the sidebar on unknown routes */}
                    <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Route>
            </Route>
        </Routes>
    );
}