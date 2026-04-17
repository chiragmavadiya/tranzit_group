import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/router/ProtectedRoute";
import { lazy } from "react";
import Layout from "@/layout";

// Lazy load page components
const Dashboard = lazy(() => import('@/features/dashboard/pages/Dashboard'));
const Orders = lazy(() => import('@/features/orders/pages/OrdersPage'));
const OrderDetails = lazy(() => import('@/features/orders/pages/OrderDetails'));
const Search = lazy(() => import('@/features/search/pages/SearchPage'));
const Setup = lazy(() => import('@/features/setup/pages/SetupPage'));
const GetQuote = lazy(() => import('@/features/quote/pages/GetQuotePage'));
const MyItems = lazy(() => import('@/features/items'));
const AddressBook = lazy(() => import('@/features/address-book'));
const Invoices = lazy(() => import('@/features/invoices/pages/InvoicesPage'));
const InvoiceDetails = lazy(() => import('@/features/invoices/pages/InvoiceDocumentView'));
const Reports = lazy(() => import('@/features/reports'));
const ParcelReport = lazy(() => import('@/features/reports/pages/ParcelReportPage'));
const Enquiry = lazy(() => import('@/features/enquiry'));



export default function ClientRoutes() {
    return (
        <Routes>
            <Route element={<ProtectedRoute role="client" />}>
                <Route element={<Layout />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="orders">
                        <Route index element={<Orders />} />
                        <Route path=":orderID" element={<OrderDetails />} />
                        <Route path=":orderType/:orderID" element={<OrderDetails />} />
                    </Route>

                    <Route path="orders/create" element={<div>order create page</div>} />
                    <Route path="quote" element={<GetQuote />} />
                    <Route path="setup" element={<Setup />} />

                    <Route path="search" element={<Search />} />
                    <Route path="items" element={<MyItems />} />
                    <Route path="address-book" element={<AddressBook />} />
                    <Route path="invoices">
                        <Route index element={<Invoices />} />
                        <Route path=":invoiceID" element={<InvoiceDetails />} />
                    </Route>
                    <Route path="reports" element={<Reports />} />
                    <Route path="parcel-report" element={<ParcelReport />} />
                    <Route path="enquiry" element={<Enquiry />} />
                    {/* Default authenticated route */}
                    <Route path="/" element={<Navigate to="/orders" replace />} />

                    {/* Fallback route: inside the layout so it doesn't unmount the sidebar on unknown routes */}
                    <Route path="*" element={<Navigate to="/orders" replace />} />
                </Route>
            </Route>
        </Routes>
    );
}