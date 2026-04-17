
import { MapPin } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DetailBlock } from './SharedDetails'
import { getInitials } from '../../utils/order-details.utils'

export const ContactCard = ({
    title,
    name,
    meta,
    email,
    mobile,
    address
}: {
    title: string
    name: string
    meta?: string
    email: string
    mobile: string
    address: string
}) => (
    <Card className="border-border/60 bg-white shadow-sm">
        <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>Contact and address information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 px-5 pt-5 pb-1">
            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-700">
                    <span className="text-sm font-semibold">{getInitials(name)}</span>
                </div>
                <div>
                    <p className="text-sm font-semibold text-foreground">{name}</p>
                    {meta ? <p className="text-sm text-muted-foreground">{meta}</p> : null}
                </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <DetailBlock label="Email" value={email} />
                <DetailBlock label="Mobile" value={mobile || 'Not provided'} />
            </div>
            <div className="rounded-2xl border border-border/60 bg-slate-50 px-4 py-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                    <MapPin className="h-4 w-4 text-cyan-700" />
                    Address
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{address}</p>
            </div>
        </CardContent>
    </Card>
)
