
import { Box } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { OrderItem } from '../../types/order-details.types'
import { formatMeasure } from '../../utils/order-details.utils'

export const OrderItemsTable = ({ items }: { items: OrderItem[] }) => (
    <Card className="border-border/60 bg-white shadow-sm gap-0">
        <CardHeader className="border-b border-border/60 pb-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <CardTitle className="text-lg">Order Items</CardTitle>
                    <CardDescription>
                        Package contents, quantities, and dimensions
                    </CardDescription>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                    <Box className="h-5 w-5 text-primary" />
                </div>
            </div>
        </CardHeader>
        <CardContent className="px-0 py-0">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border/60 bg-slate-50/80 hover:bg-slate-50/80">
                            <TableHead className="px-5 py-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                Item
                            </TableHead>
                            <TableHead className="px-5 py-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                Type
                            </TableHead>
                            <TableHead className="px-5 py-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                Qty
                            </TableHead>
                            <TableHead className="px-5 py-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                Weight
                            </TableHead>
                            <TableHead className="px-5 py-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                Dimensions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow
                                key={item.id}
                                className="border-border/60 hover:bg-slate-50/60"
                            >
                                <TableCell className="px-5 py-4 align-top whitespace-normal">
                                    <div className="space-y-1">
                                        <p className="font-semibold text-foreground">
                                            {item.display_name}
                                        </p>
                                        <p className="text-sm leading-6 text-muted-foreground">
                                            {item.description || 'No description provided.'}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4">{item.type}</TableCell>
                                <TableCell className="px-5 py-4">{item.quantity}</TableCell>
                                <TableCell className="px-5 py-4">
                                    {formatMeasure(item.weight, 'kg')}
                                </TableCell>
                                <TableCell className="px-5 py-4">
                                    {item.length} x {item.width} x {item.height} cm
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
    </Card>
)
