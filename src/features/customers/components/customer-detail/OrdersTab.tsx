import OrdersPage from '@/features/orders/pages/OrdersPage';

interface OrdersTabProps {
    customerId: string;
}

export const OrdersTab = ({ customerId }: OrdersTabProps) => {
    return (
        <>
            <OrdersPage fromCustomer={true} customerId={customerId} />
        </>
    );
};


