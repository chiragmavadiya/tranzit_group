import { useState, useEffect } from "react";

const Search = () => {
    const [result, setResult] = useState<{ primes: number[], timeTaken: number } | null>(null);
    const [isCalculating, setIsCalculating] = useState(true);

    useEffect(() => {
        // NOTE: we add a small timeout so the user sees the spinner visually start before the worker kicks in!
        const timeoutId = setTimeout(() => {
            // Use Vite's native syntax to load workers beautifully without the Blob workaround!
            const worker = new Worker(new URL('../services/worker.ts', import.meta.url), { type: 'module' });

            // 2. Start the heavy calculation on the BACKGROUND thread
            worker.postMessage(200000);

            // 3. Listen for when the background thread finishes
            worker.onmessage = (e) => {
                setResult(e.data);
                setIsCalculating(false);
                worker.terminate(); // Clean up worker
            };
        }, 100);

        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Search Module</h2>

            {isCalculating ? (
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-md max-w-lg flex flex-col items-center justify-center space-y-3">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-blue-700 font-medium text-lg">Computing in background thread...</p>
                    <p className="text-blue-600/80 text-sm">Notice how the sidebar and UI are totally un-frozen!</p>
                </div>
            ) : (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-md max-w-lg">
                    <p className="text-emerald-700 font-medium text-lg">✅ Heavy Calculation Finished</p>
                    <p className="text-emerald-600/80 text-sm mt-1">
                        The heavy task was delegated to a native Vite Web Worker!
                    </p>
                    <div className="mt-4 p-4 bg-white border border-emerald-100 rounded text-sm text-slate-700">
                        Computed <span className="font-semibold">{result?.primes.length}</span> prime numbers.<br />
                        Background thread took <span className="font-bold text-emerald-600 text-lg">{Math.round(result?.timeTaken || 0)}ms</span>.
                    </div>
                </div>
            )}
        </div>
    )
}

export default Search;