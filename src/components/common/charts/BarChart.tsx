import type { BarChartData } from "@/features/dashboard/types";
import { formateCurrency, cn } from "@/lib/utils";
import { useState } from "react";
import { Info, BarChart3 as BarChartIcon, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ResponsiveContainer,
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    LabelList,
} from "recharts";

const ChartTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload as BarChartData;

    return (
        <div className="rounded-xl border border-slate-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md p-4 shadow-xl min-w-[270px] text-slate-800 dark:text-zinc-200 transition-all duration-200">
            <h4 className="mb-3 font-bold text-slate-900 dark:text-zinc-100 border-b border-slate-100 dark:border-zinc-800/80 pb-2 text-sm">{data.label}</h4>

            <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-zinc-400">Total Paid Amount</span>
                    <span className="font-bold text-slate-950 dark:text-zinc-50">{formateCurrency(data.total_paid_amount)}</span>
                </div>

                <div className="flex justify-between items-center border-t border-slate-100 dark:border-zinc-800/50 pt-2 mt-1">
                    <span className="text-slate-500 dark:text-zinc-400 font-semibold">Total Orders</span>
                    <span className="font-bold text-slate-950 dark:text-zinc-50">{data.total_orders}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 pl-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        Tranzit Group Orders
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-zinc-100">{data.total_tranzit_group_orders}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 pl-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                        BYO Courier Orders
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-zinc-100">{data.total_byo_courier_orders}</span>
                </div>

                <div className="flex justify-between items-center border-t border-slate-100 dark:border-zinc-800/50 pt-2 mt-1">
                    <span className="text-slate-500 dark:text-zinc-400">TR Markup Charges</span>
                    <span className="font-bold text-slate-950 dark:text-zinc-50">{formateCurrency(data.total_tranzit_group_markup)}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-zinc-400">TR Pickup Charges</span>
                    <span className="font-bold text-slate-950 dark:text-zinc-50">{formateCurrency(data.total_tranzit_group_pickup_charge)}</span>
                </div>
            </div>
        </div>
    );
};

interface Props {
    data: BarChartData[];
    summary?: {
        total_orders: number;
        total_customer_spending: number;
        total_tranzit_group_revenue: number;
    };
    height?: number;
    loading?: boolean;
}

export default function BarChart({
    data,
    summary,
    height = 250,
    loading = false,
}: Props) {
    const [activeSeries, setActiveSeries] = useState<'total_orders' | 'total_tranzit_group_orders' | 'total_byo_courier_orders'>('total_orders');

    const hasData = data && data.length > 0;

    return (
        <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 py-4 shadow-sm transition-all duration-300">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                {/* Left side: Title & Description */}
                <div>
                    <h2 className="my-0 text-xl font-bold text-slate-900 dark:text-zinc-100">
                        Orders Overview
                    </h2>
                    <p className="mt-0 mb-4 md:mb-0 text-slate-500 dark:text-zinc-400 text-sm">
                        Summary of orders placed in the selected period
                    </p>
                </div>


                {/* Right side: Pills & Info Hint */}
                {hasData && (
                    <div className="flex flex-col items-start md:items-end gap-2">
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Total Orders Pill */}
                            <button
                                onClick={() => setActiveSeries('total_orders')}
                                className={`flex items-center gap-2 px-3 py-1 border text-xs font-semibold cursor-pointer transition-all duration-200 select-none rounded-full outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500/50 hover:scale-[1.02] active:scale-[0.98] ${activeSeries === 'total_orders'
                                    ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-850 shadow-sm'
                                    : 'bg-slate-50 dark:bg-zinc-900/50 text-slate-400 dark:text-zinc-500 border-slate-200 dark:border-zinc-800/80 opacity-60 hover:opacity-100 hover:border-slate-300 dark:hover:border-zinc-700'
                                    }`}
                            >
                                <span className={`h-2 w-2 rounded-full ${activeSeries === 'total_orders' ? 'bg-blue-600 dark:bg-blue-500' : 'bg-slate-300 dark:bg-zinc-700'}`} />
                                <span>Total Orders</span>
                            </button>

                            {/* Tranzit Group Pill */}
                            <button
                                onClick={() => setActiveSeries('total_tranzit_group_orders')}
                                className={`flex items-center gap-2 px-3 py-1 border text-xs font-semibold cursor-pointer transition-all duration-200 select-none rounded-full outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] ${activeSeries === 'total_tranzit_group_orders'
                                    ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-850 shadow-sm'
                                    : 'bg-slate-50 dark:bg-zinc-900/50 text-slate-400 dark:text-zinc-500 border-slate-200 dark:border-zinc-800/80 opacity-60 hover:opacity-100 hover:border-slate-300 dark:hover:border-zinc-700'
                                    }`}
                            >
                                <span className={`h-2 w-2 rounded-full ${activeSeries === 'total_tranzit_group_orders' ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-slate-300 dark:bg-zinc-700'}`} />
                                <span>Tranzit Group</span>
                            </button>

                            {/* BYO Courier Pill */}
                            <button
                                onClick={() => setActiveSeries('total_byo_courier_orders')}
                                className={`flex items-center gap-2 px-3 py-1 border text-xs font-semibold cursor-pointer transition-all duration-200 select-none rounded-full outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-500/50 hover:scale-[1.02] active:scale-[0.98] ${activeSeries === 'total_byo_courier_orders'
                                    ? 'bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-855 shadow-sm'
                                    : 'bg-slate-50 dark:bg-zinc-900/50 text-slate-400 dark:text-zinc-500 border-slate-200 dark:border-zinc-800/80 opacity-60 hover:opacity-100 hover:border-slate-300 dark:hover:border-zinc-700'
                                    }`}
                            >
                                <span className={`h-2 w-2 rounded-full ${activeSeries === 'total_byo_courier_orders' ? 'bg-purple-600 dark:bg-purple-500' : 'bg-slate-300 dark:bg-zinc-700'}`} />
                                <span>BYO Courier</span>
                            </button>
                        </div>

                        {/* Hint text */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-zinc-500 select-none">
                            <Info className="h-3.5 w-3.5" />
                            <span>Click legend to toggle visual focus</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Period Summary Stats */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-zinc-900 bg-slate-50/30 dark:bg-zinc-900/10">
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <div className="space-y-1.5 flex-1">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-4.5 w-16" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                hasData && summary && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        {/* Period Orders Card */}
                        <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-zinc-900 bg-slate-50/30 dark:bg-zinc-900/10 transition-all duration-300 hover:shadow-sm">
                            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 transition-colors">
                                <ShoppingBag className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="my-0 text-xs font-bold text-slate-500 dark:text-zinc-500">Total Orders</p>
                                <p className="my-0 text-base font-extrabold text-slate-900 dark:text-zinc-100 mt-0.5">{summary.total_orders ?? 0}</p>
                            </div>
                        </div>

                        {/* Period Spending Card */}
                        <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-zinc-900 bg-slate-50/30 dark:bg-zinc-900/10 transition-all duration-300 hover:shadow-sm">
                            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 transition-colors">
                                <DollarSign className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="my-0 text-xs font-bold text-slate-500 dark:text-zinc-500">Total Customer Spending</p>
                                <p className="my-0 text-base font-extrabold text-slate-900 dark:text-zinc-100 mt-0.5">{formateCurrency(summary.total_customer_spending ?? 0)}</p>
                            </div>
                        </div>

                        {/* Period TR Revenue Card */}
                        <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-zinc-900 bg-slate-50/30 dark:bg-zinc-900/10 transition-all duration-300 hover:shadow-sm">
                            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 transition-colors">
                                <TrendingUp className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="my-0 text-xs font-bold text-slate-500 dark:text-zinc-500">Total TR Revenue</p>
                                <p className="my-0 text-base font-extrabold text-slate-900 dark:text-zinc-100 mt-0.5">{formateCurrency(summary.total_tranzit_group_revenue ?? 0)}</p>
                            </div>
                        </div>
                    </div>
                )
            )}

            {loading ? (
                <div style={{ height }} className="w-full flex items-end justify-between gap-3 px-4 pt-10 pb-2 border border-slate-100 dark:border-zinc-900/50 rounded-xl bg-slate-50/10 dark:bg-zinc-950/5 select-none">
                    {Array.from({ length: 12 }).map((_, i) => {
                        const heights = ["h-[30%]", "h-[50%]", "h-[70%]", "h-[45%]", "h-[85%]", "h-[60%]", "h-[40%]", "h-[90%]", "h-[55%]", "h-[75%]", "h-[35%]", "h-[65%]"];
                        return (
                            <Skeleton
                                key={i}
                                className={cn("w-full rounded-t-md opacity-40", heights[i % heights.length])}
                            />
                        );
                    })}
                </div>
            ) : !hasData ? (
                <div
                    style={{ height }}
                    className="flex flex-col items-center justify-center border border-dashed border-slate-250 dark:border-zinc-800 rounded-xl bg-slate-50/40 dark:bg-zinc-950/20 text-slate-400 dark:text-zinc-500 select-none"
                >
                    <BarChartIcon className="h-10 w-10 mb-2.5 stroke-[1.25] text-slate-300 dark:text-zinc-700" />
                    <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">No order data recorded for this period</p>
                    <p className="text-xs text-slate-400 dark:text-zinc-550 mt-1">Try selecting a different date range filter above</p>
                </div>
            ) : (
                <ResponsiveContainer
                    width="100%"
                    height={height}
                >
                    <RechartsBarChart
                        data={data}
                        margin={{
                            top: 25,
                            right: 0,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            {/* Linear Gradients */}
                            <linearGradient
                                id="totalOrdersGradient"
                                x1="0"
                                x2="0"
                                y1="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#3B82F6"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#1D4ED8"
                                />
                            </linearGradient>
                            <linearGradient
                                id="tranzitGradient"
                                x1="0"
                                x2="0"
                                y1="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#6366F1"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#4338CA"
                                />
                            </linearGradient>
                            <linearGradient
                                id="byoGradient"
                                x1="0"
                                x2="0"
                                y1="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#A855F7"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#7E22CE"
                                />
                            </linearGradient>

                            {/* Elegant Bar Drop Shadow */}
                            <filter id="barShadow" x="-10%" y="-10%" width="120%" height="120%">
                                <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.12" floodColor="#000" />
                            </filter>
                        </defs>

                        <CartesianGrid
                            vertical={false}
                            stroke="#e2e8f0"
                            className="stroke-slate-200 dark:stroke-zinc-800/80"
                            strokeDasharray="4 4"
                        />

                        <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: "#64748B",
                                fontSize: 12,
                            }}
                        />

                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                            tick={{
                                fill: "#64748B",
                                fontSize: 12,
                            }}
                            width={30}
                        />

                        <Tooltip
                            trigger="hover"
                            offset={25}
                            cursor={{
                                fill: "rgba(226, 232, 240, 0.3)",
                                className: "fill-slate-100/50 dark:fill-zinc-800/5"
                            }}
                            content={<ChartTooltip />}
                        />

                        {activeSeries === 'total_orders' && (
                            <Bar
                                dataKey="total_orders"
                                fill="url(#totalOrdersGradient)"
                                radius={[4, 4, 0, 0]}
                                filter="url(#barShadow)"
                                maxBarSize={46}
                                animationDuration={800}
                                animationEasing="ease-out"
                            >
                                <LabelList
                                    position="top"
                                    fontSize={11}
                                    offset={8}
                                    className="fill-slate-700 dark:fill-zinc-300 font-bold"
                                    valueAccessor={(entry: any) => entry.value > 0 ? `${entry.value}` : ''}
                                />
                            </Bar>
                        )}

                        {activeSeries === 'total_tranzit_group_orders' && (
                            <Bar
                                dataKey="total_tranzit_group_orders"
                                fill="url(#tranzitGradient)"
                                radius={[4, 4, 0, 0]}
                                filter="url(#barShadow)"
                                maxBarSize={46}
                                animationDuration={800}
                                animationEasing="ease-out"
                            >
                                <LabelList
                                    position="top"
                                    fontSize={11}
                                    offset={8}
                                    className="fill-slate-700 dark:fill-zinc-300 font-bold"
                                    valueAccessor={(entry: any) => entry.value > 0 ? `${entry.value}` : ''}
                                />
                            </Bar>
                        )}

                        {activeSeries === 'total_byo_courier_orders' && (
                            <Bar
                                dataKey="total_byo_courier_orders"
                                fill="url(#byoGradient)"
                                radius={[4, 4, 0, 0]}
                                filter="url(#barShadow)"
                                maxBarSize={46}
                                animationDuration={800}
                                animationEasing="ease-out"
                            >
                                <LabelList
                                    position="top"
                                    fontSize={11}
                                    offset={8}
                                    className="fill-slate-700 dark:fill-zinc-300 font-bold"
                                    valueAccessor={(entry: any) => entry.value > 0 ? `${entry.value}` : ''}
                                />
                            </Bar>
                        )}
                    </RechartsBarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}