import { CustomModel } from "@/components/ui/dialog";
import { useQuoteDetails } from "../../quote/hooks/useQuote";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface QuoteDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    quoteId: number | null;
}

export function QuoteDetailsDialog({ open, onOpenChange, quoteId }: QuoteDetailsDialogProps) {
    const { data: detailsData, isLoading } = useQuoteDetails(quoteId || undefined);

    if (!quoteId) return null;

    const details = detailsData?.data;

    return (
        <CustomModel
            open={open}
            onOpenChange={onOpenChange}
            title={`Quote Details: ${details?.quote_summary?.quote_reference || ''}`}
            isLoading={isLoading}
            contentClass="sm:max-w-[700px]"
            // onSubmit={() => { }}
            showFooter={false}
        >
            {details && (
                <div className="flex flex-col gap-6 p-1 text-xs">
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-slate-100 dark:border-zinc-800">
                        <div className="flex flex-col gap-1">
                            <span className="text-slate-500 uppercase font-bold tracking-wider">Reference</span>
                            <span className="font-bold text-slate-900 dark:text-zinc-100">{details.quote_summary.quote_reference}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-slate-500 uppercase font-bold tracking-wider">Customer Email</span>
                            <span className="font-bold text-slate-900 dark:text-zinc-100">{details.quote_summary.customer_email}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-slate-500 uppercase font-bold tracking-wider">Service</span>
                            <span className="font-bold text-slate-900 dark:text-zinc-100">{details.quote_summary.service}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-slate-500 uppercase font-bold tracking-wider">Total Amount</span>
                            <span className="font-bold text-blue-600 text-sm">${details.quote_summary.total_amount.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <span className="text-[11px] font-extrabold text-slate-700 dark:text-zinc-400 uppercase tracking-widest border-b pb-1">Sender Address</span>
                            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">{details.sender.address}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-[11px] font-extrabold text-slate-700 dark:text-zinc-400 uppercase tracking-widest border-b pb-1">Receiver Address</span>
                            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">{details.receiver.address}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <span className="text-[11px] font-extrabold text-slate-700 dark:text-zinc-400 uppercase tracking-widest border-b pb-1">Item Details</span>
                        <div className="rounded-lg border border-slate-100 dark:border-zinc-800 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-50 dark:bg-zinc-900">
                                    <TableRow>
                                        <TableHead className="h-8 text-[10px] font-bold">TYPE</TableHead>
                                        <TableHead className="h-8 text-[10px] font-bold text-center">QTY</TableHead>
                                        <TableHead className="h-8 text-[10px] font-bold text-center">WEIGHT</TableHead>
                                        <TableHead className="h-8 text-[10px] font-bold text-center">DIMENSIONS (L×W×H)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {details.item_details.map((item, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell className="py-2">{item.type}</TableCell>
                                            <TableCell className="py-2 text-center font-medium">{item.quantity || item.qty}</TableCell>
                                            <TableCell className="py-2 text-center">{item.weight} kg</TableCell>
                                            <TableCell className="py-2 text-center">{item.length}×{item.width}×{item.height} cm</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1 border-l-2 border-slate-100 dark:border-zinc-800 pl-3">
                            <span className="text-slate-500 uppercase font-bold tracking-wider">Margin</span>
                            <span className="font-bold">${details.margin_amount.toFixed(2)} ({details.margin_percent}%)</span>
                        </div>
                        <div className="flex flex-col gap-1 border-l-2 border-slate-100 dark:border-zinc-800 pl-3">
                            <span className="text-slate-500 uppercase font-bold tracking-wider">Pickup Charge</span>
                            <span className="font-bold">${details.pickup_charge.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col gap-1 border-l-2 border-slate-100 dark:border-zinc-800 pl-3">
                            <span className="text-slate-500 uppercase font-bold tracking-wider">Total Surcharge</span>
                            <span className="font-bold">${details.total_surcharge.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            )}
        </CustomModel>
    );
}
