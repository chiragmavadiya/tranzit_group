import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import brandLogo from './assets/Tranzit_Logo.svg';
import './App.css';

// Lazy load page components
const SignIn = lazy(() => import('./pages/auth/SignIn'));
const SignUp = lazy(() => import('./pages/auth/SignUp'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Layout = lazy(() => import('./pages/layout'));
const Orders = lazy(() => import('./pages/orders'));
const Search = lazy(() => import('./pages/search'));
const Setup = lazy(() => import('./pages/setup'));

// Simple loading fallback component
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-zinc-950">
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <img 
          src={brandLogo} 
          alt="Tranzit Group Logo" 
          className="h-16 w-auto animate-pulse brightness-110 drop-shadow-md" 
        />
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full w-full origin-left animate-[loading_1.5s_infinite_ease-in-out] bg-[#0060FE]"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Authenticated routes wrapped in ProtectedRoute -> Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/setup" element={<Setup />} />
              <Route path="/search" element={<Search />} />
              {/* Default authenticated route */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Fallback route: inside the layout so it doesn't unmount the sidebar on unknown routes */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
