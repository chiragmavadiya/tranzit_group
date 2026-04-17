
import { Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const LiabilityCover = ({
    covered,
    message
}: {
    covered: boolean
    message: string
}) => (
    <Card className="border-border/60 bg-white shadow-sm">
        <CardHeader className="border-b border-border/60 pb-4">
            <div className="flex items-center gap-3">
                <div
                    className={cn(
                        'flex h-11 w-11 items-center justify-center rounded-2xl',
                        covered
                            ? 'bg-emerald-500/15 text-emerald-700'
                            : 'bg-amber-500/15 text-amber-700'
                    )}
                >
                    <Shield className="h-5 w-5" />
                </div>
                <div>
                    <CardTitle className="text-lg">Limited Liability Cover</CardTitle>
                    <CardDescription>
                        Coverage status for the active consignment
                    </CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-4 px-5 py-5">
            <Badge
                variant="outline"
                className={cn(
                    'h-7 rounded-full border-0 px-3 ring-1',
                    covered
                        ? 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-700 ring-amber-500/20'
                )}
            >
                {covered ? 'Covered' : 'Not Covered'}
            </Badge>
            <p className="text-sm leading-6 text-muted-foreground">
                {message}
            </p>
        </CardContent>
    </Card>
)
