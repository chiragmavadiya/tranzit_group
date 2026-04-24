export interface CourierSurcharge {
  id: string;
  courierName: string;
  code: string;
  name: string;
  description: string;
  amount: string;
  customerSelectable: boolean;
  autoApply: boolean;
  chargeBasis: string;
  appliesOn: string;
  defaultSelected: boolean;
}
