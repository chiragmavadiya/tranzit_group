export interface Item {
  id: number;
  item_code: string;
  item_name: string;
  item_cubic: string | number | null;
  is_active: number;
  DT_RowIndex?: number;
}

export interface ItemFormData {
  id?: number;
  item_code: string;
  item_name: string;
  item_cubic: number;
  item_weight: number;
  item_length: number;
  item_width: number;
  item_height: number;
  is_default: boolean;
}

export interface ItemsFilters {
  search: string;
  pageSize: number;
  page: number;
}
