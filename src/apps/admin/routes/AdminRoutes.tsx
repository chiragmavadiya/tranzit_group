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
const Invoices = lazy(() => import('@/features/invoices/pages/InvoicesPage'));
const InvoiceDetails = lazy(() => import('@/features/invoices/pages/InvoiceDocumentView'));


export default function AdminRoutes() {
    return (
        <Routes>
            <Route element={<ProtectedRoute role="admin" />}>
                <Route element={<Layout />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="orders">
                        <Route index element={<Orders />} />
                        <Route path=":orderType/:orderID" element={<OrderDetails />} />
                    </Route>
                    <Route path="invoices">
                        <Route index element={<Invoices />} />
                        <Route path=":invoiceID" element={<InvoiceDetails />} />
                    </Route>
                    <Route path="setup" element={<Setup />} />
                    <Route path="search" element={<Search />} />
                    {/* Default authenticated route */}
                    <Route path="/" element={<Navigate to="/admin/orders" replace />} />

                    {/* Fallback route: inside the layout so it doesn't unmount the sidebar on unknown routes */}
                    <Route path="*" element={<Navigate to="/admin/orders" replace />} />
                </Route>
            </Route>
        </Routes>
    );
}