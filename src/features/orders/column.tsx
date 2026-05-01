import { NavLink } from "react-router-dom";
import type { Order } from "./types";
import type { Column } from "@/components/common";

export const COLUMN_CONFIG: Column<Order>[] = [
  {
    header: 'ORDER #',
    key: 'order_number',
    className: 'text-blue-600 font-bold',
    sticky: 'left',
    cell: (value: string) => (
      <NavLink to={`/orders/${value}`} className="font-bold text-blue-600 underline dark:text-blue-400 ">
        {value}
      </NavLink>
    )

  },
  {
    header: 'CUSTOMER NAME', key: 'customer_name'
  },
  {
    header: 'SUBURB', key: 'suburb'
  },
  {
    header: 'AMOUNT', key: 'amount'
  },
  {
    header: 'STATUS', key: 'status'
  },
  {
    header: 'PAYMENT STATUS', key: 'payment_status'
  },
  {
    header: 'COURIER', key: 'courier'
  },
  {
    header: 'ORDER TYPE', key: 'order_type'
  },
  {
    header: 'ORDER DATE', key: 'consignment_date'
  },
];
