import { CustomModel } from '@/components/ui/dialog'
import type { Order } from '../types';
import { CarrierCard } from './order-details/CarrierCard';
import { useMemo, useState } from 'react';

interface UpdateCourierModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    orderData: Order;
}

interface ParsedAddress {
    label: string;
    suburb: string;
    state: string;
    postcode: string;
    country: string;
}

const parseAustralianAddress = (
    address: string
): ParsedAddress => {
    const parts = address.split(",").map((part) => part.trim());


    let suburb = "";
    let state = "";
    let postcode = "";

    if (parts[1]) {
        const match = parts[1].match(/^(.+?)\s+([A-Z]{2,3})\s+(\d{4})$/);

        if (match) {
            suburb = match[1];
            state = match[2];
            postcode = match[3];
        }
    }
    const label = `${suburb} ${state} ${postcode}, AU`;

    return {
        label,
        suburb,
        state,
        postcode,
        country: "AU"
    };
}

const UpdateCourierModal = (props: UpdateCourierModalProps) => {
    const { open, onOpenChange, orderData } = props;
    const [quoteData, setQuoteData] = useState<any>(null);
    const sender = useMemo(() => parseAustralianAddress(orderData?.sender_address_info || ''), [orderData])
    const receiver = useMemo(() => parseAustralianAddress(orderData?.receiver_address_info || ''), [orderData])

    console.log('=========>', quoteData)
    const address = useMemo(() => ({
        sender,
        receiver
    }), [receiver, sender])

    const itemData = useMemo(() => {
        return orderData?.items?.map((item: any) => ({
            ...item,
            length: Number(item.length) || 0,
            width: Number(item.width) || 0,
            height: Number(item.height) || 0,
            weight: Number(item.weight) || 0,
        }))
    }, [orderData])
    return (
        <CustomModel
            open={open}
            onOpenChange={onOpenChange}
            title={`Update carrier and product`}
            contentClass='min-w-5xl'
            submitText={'Update'}
        >
            <CarrierCard
                addresses={address}
                itemData={itemData}
                initialSelectedCourierId={orderData?.courier_code + (orderData.product_id || '')}
                onQuoteChange={setQuoteData}
            />
        </CustomModel>
    )
}

export default UpdateCourierModal