import "@/lib/sentry";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Provider } from 'react-redux'
import { store } from '@/app/store'
import { queryClient } from '@/lib/query-client'
<<<<<<< HEAD
import ErrorBoundary from '@/components/common/ErrorBoundary'
=======
// import * as Sentry from "@sentry/react";
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
import '@/styles/index.css'
import "@fontsource-variable/geist/index.css";
import App from './App.tsx'
import { TooltipProvider } from "@/components/ui/tooltip"
import { initializeAnalytics } from "./analytics/index.ts";
<<<<<<< HEAD
import { initClarity } from "./lib/clarity.ts";

initializeAnalytics();
initClarity();
=======

// const ErrorFallback = () => (
//   <div className="flex h-screen items-center justify-center">
//     <div>
//       <h1>Oops!</h1>
//       <p>Something went wrong.</p>
//     </div>
//   </div>
// );

initializeAnalytics();
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <Sentry.ErrorBoundary fallback={<ErrorFallback />}> */}
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            {/* Inside the providers so a render crash shows the fallback instead of a
                blank page, and reports to Sentry, without tearing down the store. */}
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
        {import.meta.env.DEV && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </Provider>
<<<<<<< HEAD
=======
    {/* </Sentry.ErrorBoundary> */}
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
  </StrictMode >,
)
