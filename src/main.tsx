import "@/lib/sentry";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Provider } from 'react-redux'
import { store } from '@/app/store'
import { queryClient } from '@/lib/query-client'
import * as Sentry from "@sentry/react";
import '@/styles/index.css'
import "@fontsource-variable/geist/index.css";
import App from './App.tsx'
import { TooltipProvider } from "@/components/ui/tooltip"
import { initializeAnalytics } from "./analytics";

initializeAnalytics();

// eslint-disable-next-line react-refresh/only-export-components
const ErrorFallback = () => (
  <div className="flex h-screen items-center justify-center">
    <div>
      <h1>Oops!</h1>
      <p>Something went wrong.</p>
    </div>
  </div>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </TooltipProvider>
          {import.meta.env.DEV && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </QueryClientProvider>
      </Provider>
    </Sentry.ErrorBoundary>
  </StrictMode >,
)
