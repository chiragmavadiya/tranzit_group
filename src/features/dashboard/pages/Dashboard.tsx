import { useAppSelector } from "@/hooks/store.hooks";
import { lazy } from "react";

const ClientDashboard = lazy(() => import("./ClientDashboard"));
const AdminDashboard = lazy(() => import("./AdminDashboard"));

export default function Dashboard() {
  const role = useAppSelector((state) => state.auth.role);

  return role === 'admin' ? <AdminDashboard /> : <ClientDashboard />
}
