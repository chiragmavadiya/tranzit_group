import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Transaction } from "../types";
import { Wallet, Plus, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionListProps {
  transactions: Transaction[];
  className?: string;
}

export function TransactionList({ transactions, className }: TransactionListProps) {
  return (
    <Card className={cn("border p-0 gap-0 ring-0 shadow-md border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 flex flex-col transition-colors duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between py-3 px-5 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 group-hover:bg-gray-50/50 dark:group-hover:bg-zinc-800/50 transition-colors">
        <div className="flex flex-col gap-0.5">
          <CardTitle className="text-sm font-bold text-gray-900 dark:text-zinc-100 tracking-wider uppercase">
            Transactions
          </CardTitle>
          <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-tight">
            Last {transactions.length} activity
          </p>
        </div>
        <button className="text-slate-400 hover:text-blue-600 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto custom-scrollbar px-2 py-2">
        <div className="space-y-1">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors group cursor-default"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105",
                  tx.type === 'debit' ? "bg-slate-50 dark:bg-zinc-900 text-slate-500" : "bg-blue-50 dark:bg-blue-900/20 text-blue-500"
                )}>
                  {tx.type === 'debit' ? <Wallet className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[13px] font-bold text-gray-700 dark:text-zinc-200 leading-tight">
                    {tx.title}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 truncate">
                    {tx.subtitle}
                  </span>
                </div>
              </div>
              <span className={cn(
                "text-[13px] font-bold tabular-nums",
                tx.type === 'debit' ? "text-[#F35555]" : "text-[#10B981]"
              )}>
                {tx.type === 'debit' ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
              </span>
            </div>
          ))}
          {transactions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center opacity-50">
              <Wallet className="w-10 h-10 mb-2 text-slate-300" />
              <p className="text-xs font-medium text-slate-400">No transactions recorded</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
