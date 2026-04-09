import type { PackingColumn, ItemsColumn } from '../types';

export const PACKAGING_COLUMNS: PackingColumn[] = [
  { key: 'package', label: 'PACKAGE', editable: false, type: 'select' },
  { key: 'qty', label: 'QTY', editable: true, type: 'number' },
  { key: 'length', label: 'L (CM)', editable: true, type: 'number' },
  { key: 'width', label: 'W (CM)', editable: true, type: 'number' },
  { key: 'height', label: 'H (CM)', editable: true, type: 'number' },
  { key: 'weight', label: 'WGT (KG)', editable: true, type: 'number' },
  { key: 'cubic', label: 'CUBIC (M³)', editable: true, type: 'number' },
  { key: 'tracking', label: 'SCAN OR ENTER TRACKING', editable: true, type: 'text' }
];

export const ITEMS_COLUMNS: ItemsColumn[] = [
  { key: 'item', label: 'ITEM', editable: true, type: 'text', default: true },
  { key: 'sku', label: 'SKU', editable: true, type: 'text', default: true },
  { key: 'ship', label: 'SHIP', editable: true, type: 'number', default: true, displayTotal: true },
  { key: 'unitPrice', label: 'UNIT PRICE (AUD)', editable: true, type: 'number', default: true, displayTotal: true },
  { key: 'weight', label: 'WGT (KG)', editable: true, type: 'number', default: true, displayTotal: true },
  { key: 'size', label: 'SIZE', editable: true, type: 'text', default: true },
  { key: 'countryOfOrigin', label: 'COUNTRY OF ORIGIN', editable: true, type: 'text' },
  { key: 'qtyShipped', label: 'QTY SHIPPED', editable: true, type: 'number', displayTotal: true },
  { key: "color", label: "Color", editable: true, type: 'text' },
  { key: "hs_code", label: "HS code", editable: true, type: 'text' },
  { key: "materials", label: "Materials", editable: true, type: 'text' },
  { key: "country_of_origin", label: "Country of origin", editable: true, type: 'text' },
  { key: "manufacturer_id", label: "Manufacturer ID", editable: true, type: 'text' },
  { key: "brand_name", label: "Brand name", editable: true, type: 'text' },
  { key: "make_or_model", label: "Make or model", editable: true, type: 'text' },
  { key: "usage_or_purpose", label: "Usage or purpose", editable: true, type: 'text' },
  { key: "qty_ordered", label: "QTY ordered", editable: true, type: 'number' },
  { key: "bin_location", label: "Bin location", editable: true, type: 'text' },
  { key: "barcode", label: "Barcode", editable: true, type: 'text' },
  { key: "item_image", label: "Item image", editable: true, type: 'text' }
];

export const DOCUMENT_TYPES = [
  { key: "Customs Invoice", value: "customs_invoice" },
  { key: "Proof of Purchase", value: "proof_of_purchase" },
  { key: "Licence/Permit", value: "licence_permit" },
  { key: "Order Document", value: "order_document" },
  { key: "Invoice", value: "invoice" },
  { key: "Proforma", value: "proforma" },
  { key: "Certificate of Origin", value: "certificate_of_origin" },
  { key: "Nafta Certificate of Origin", value: "nafta_certificate_of_origin" },
  { key: "Commercial Invoice", value: "commercial_invoice" },
  { key: "Custom Declaration", value: "custom_declaration" },
];
