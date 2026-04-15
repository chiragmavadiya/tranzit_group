import { useAppSelector } from "@/hooks/store.hooks";
import { lazy, Suspense } from "react";

const ClientDashboard = lazy(() => import("./ClientDashboard"));
const AdminDashboard = lazy(() => import("./AdminDashboard"));

export default function Dashboard() {
  const role = useAppSelector((state) => state.auth.role);

  return (
    <Suspense fallback={
      <div className="flex h-full w-full items-center justify-center p-page-padding">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    }>
      {role === 'admin' ? <AdminDashboard /> : <ClientDashboard />}
    </Suspense>
  );
}
