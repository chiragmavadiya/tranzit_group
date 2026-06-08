import { useCustomerIntegrations } from '../../hooks/useCustomers';
import { Truck, ShoppingCart } from "lucide-react";
import RenderIntegrationSection from '@/features/integrations/components/RenderIntegrationSection';

interface CustomerIntegrationTabProps {
    customerId: string;
}

export const CustomerIntegrationTab = ({ customerId }: CustomerIntegrationTabProps) => {
    const { data: response, isLoading } = useCustomerIntegrations(customerId);

    const data = response?.data;
    console.log(data, 'data....')

    return (
        <div className="space-y-8 animate-in fade-in duration-500 bg-white dark:bg-zinc-950 p-4 rounded-md">
            {/* {renderIntegrationSection('courier_integrations', 'Courier Integrations', Truck)} */}
            {/* {renderIntegrationSection('ecommerce_connections', 'E-commerce Integrations', ShoppingCart)} */}
            <RenderIntegrationSection
                data={data?.courier_integrations.filter((item: any) => item.connected)}
                // disconnectMutation={disconnectMutation}
                fromCustomer={true}
                title="Courier Integrations"
                Icon={Truck}
                isLoading={isLoading}
            />
            <RenderIntegrationSection
                data={data?.ecommerce_connections.filter((item: any) => item.connected)}
                // disconnectMutation={disconnectMutation}
                fromCustomer={true}
                title="E-commerce Integrations"
                Icon={ShoppingCart}
                isLoading={isLoading}
            />
        </div>
    );
};
