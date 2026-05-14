import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 p-6 text-center">
          <div className={`bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-8 w-full shadow-lg flex flex-col items-center ${import.meta.env.DEV ? 'max-w-3xl' : 'max-w-md'}`}>
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 text-red-600 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Something went wrong</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
              We encountered an unexpected error. Please try refreshing the page or navigating back home.
            </p>
            
            {import.meta.env.DEV && this.state.error && (
              <div className="w-full mb-8 text-left p-4 bg-slate-950 dark:bg-black rounded-lg overflow-auto border border-red-900/30">
                <p className="text-red-400 font-mono text-sm font-semibold mb-2">{this.state.error.toString()}</p>
                <div className="text-slate-300 font-mono text-xs whitespace-pre-wrap">
                  {this.state.error.stack}
                </div>
              </div>
            )}

            <div className="flex gap-4 w-full max-w-md">
              <button 
                onClick={() => window.location.reload()}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-300 font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
               >
                 <RefreshCw className="w-4 h-4" />
                 Refresh
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
               >
                 <Home className="w-4 h-4" />
                 Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
