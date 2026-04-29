import { useQuery } from "@tanstack/react-query";
import { courierSurchargeService } from "../services/courier-surcharge.service";
import { QUERY_KEYS } from "@/constants/api.constants";

export function useGlobalCouriers() {
    return useQuery({
        queryKey: (QUERY_KEYS as any).ADMIN_COURIER_SURCHARGES?.GLOBAL_COURIERS || ["global-couriers"],
        queryFn: () => courierSurchargeService.getGlobalCouriers(),
        select: (response) => response.data.map(courier => ({
            label: courier.name,
            value: courier.id.toString()
        }))
    });
}
