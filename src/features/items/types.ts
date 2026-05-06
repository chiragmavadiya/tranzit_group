export interface Item {
  id: number;
  item_code: string;
  item_name: string;
  item_cubic: number;
  status: string;
}

export interface ItemDetails extends Item {
  item_weight: number;
  item_length: number;
  item_width: number;
  item_height: number;
  is_default: boolean;
}

export interface ItemFormData {
  id?: number;
  item_name: string;
  item_weight?: number | undefined;
  item_length?: number | undefined;
  item_width?: number | undefined;
  item_height?: number | undefined;
  item_cubic?: number | undefined;
  is_default: "on" | "off" | boolean;
  item_code: string;
}

export interface ItemsListResponse {
  status: boolean;
  message: string;
  data: Item[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface ItemDetailsResponse {
  status: boolean;
  message: string;
  data: ItemDetails;
}

export interface ItemsFilters {
  search?: string;
  per_page?: number;
  page?: number;
}
