"use client";

import { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  MapPin,
  Plus,
  Trash2,
  Calculator,
  Search,
  Info,
  User,
  Building2,
  Phone,
  Mail,
  Hash,
  ArrowUpFromLine,
  ArrowDownToLine,
  Package
} from "lucide-react";
import type { OrderAddressFormProps } from "../types";
import type { QuoteItem } from '@/features/quote/types';
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';
import { Checkbox } from '@/components/ui/checkbox';
import SelectComponent from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export function OrderAddressForm({ items, setItems, locations, setLocations, onGetRate, isValid }: OrderAddressFormProps) {
  const addItem = useCallback(() => {
    const newItem: QuoteItem = {
      id: crypto.randomUUID(),
      type: 'Parcel',
      qty: 1,
      weight: 0,
      length: 0,
      width: 0,
      height: 0,
    };
    setItems((prev) => [...prev, newItem]);
  }, [setItems]);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter(item => item.id !== id));
  }, [setItems]);

  const updateItem = useCallback((id: string, field: keyof QuoteItem, value: string | number) => {
    setItems((prev) => prev.map(item => item.id === id ? { ...item, [field]: value } as QuoteItem : item));
  }, [setItems]);

  const handleLocationChange = useCallback((type: 'sender' | 'receiver', field: string, value: any) => {
    setLocations(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  }, [setLocations]);

  const states = [
    { label: 'VIC', value: 'VIC' },
    { label: 'NSW', value: 'NSW' },
    { label: 'QLD', value: 'QLD' },
    { label: 'WA', value: 'WA' },
    { label: 'SA', value: 'SA' },
    { label: 'TAS', value: 'TAS' },
    { label: 'ACT', value: 'ACT' },
    { label: 'NT', value: 'NT' },
  ];

  return (
    <div className="space-y-4">
      {/* Addresses Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sender Section */}
        <Card className="shadow-sm pt-0 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
          <CardHeader className="h-14 flex items-center bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800 py-3">
            <CardTitle className="text-[15px] font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
              <ArrowUpFromLine className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
              Sender
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <FormInput
              label="Contact Person"
              required
              icon={User}
              value={locations.sender.contact_name}
              onChange={(val) => handleLocationChange('sender', 'contact_name', val)}
              className="col-span-12"
            />
            <FormInput
              label="Business Name"
              icon={Building2}
              value={locations.sender.business_name}
              onChange={(val) => handleLocationChange('sender', 'business_name', val)}
              className="col-span-12"
            />
            <FormInput
              label="Street Address"
              required
              icon={MapPin}
              value={locations.sender.street_address}
              onChange={(val) => handleLocationChange('sender', 'street_address', val)}
              className="col-span-12"
            />
            <div className="grid grid-cols-3 gap-3">
              <FormInput
                label="Unit/Apartment"
                icon={Hash}
                value={locations.sender.unit}
                onChange={(val) => handleLocationChange('sender', 'unit', val)}
              />
              <FormInput
                label="Street Number"
                icon={Hash}
                value={locations.sender.street_number}
                onChange={(val) => handleLocationChange('sender', 'street_number', val)}
              />
              <FormInput
                label="Street Name"
                icon={MapPin}
                value={locations.sender.street_name}
                onChange={(val) => handleLocationChange('sender', 'street_name', val)}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <FormInput
                label="Town / Suburb"
                required
                icon={MapPin}
                value={locations.sender.suburb}
                onChange={(val) => handleLocationChange('sender', 'suburb', val)}
              />
              <FormSelect
                label="State"
                required
                options={states}
                value={locations.sender.state}
                onValueChange={(val) => handleLocationChange('sender', 'state', val)}
              />
              <FormInput
                label="Postcode"
                required
                icon={MapPin}
                value={locations.sender.postcode}
                onChange={(val) => handleLocationChange('sender', 'postcode', val)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Phone"
                required
                icon={Phone}
                value={locations.sender.phone}
                onChange={(val) => handleLocationChange('sender', 'phone', val)}
              />
              <FormInput
                label="Email"
                required
                icon={Mail}
                value={locations.sender.email}
                onChange={(val) => handleLocationChange('sender', 'email', val)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Receiver Section */}
        <Card className="shadow-sm pt-0 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
          <CardHeader className="h-14 bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800 py-3 flex flex-row items-center justify-between">
            <CardTitle className="text-[15px] font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
              <ArrowDownToLine className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
              Receiver
            </CardTitle>
            <div className="w-64">
              <FormSelect
                options={[]}
                placeholder="Contact Search (name, email, phone)"
                onValueChange={() => { }}
                className="h-8"
                label=""
                value=""
              />
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="CONTACT PERSON"
                required
                icon={User}
                value={locations.receiver.contact_name}
                onChange={(val) => handleLocationChange('receiver', 'contact_name', val)}
              />
              <FormInput
                label="BUSINESS NAME"
                icon={Building2}
                value={locations.receiver.business_name}
                onChange={(val) => handleLocationChange('receiver', 'business_name', val)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="PHONE"
                required
                icon={Phone}
                value={locations.receiver.phone}
                onChange={(val) => handleLocationChange('receiver', 'phone', val)}
              />
              <FormInput
                label="EMAIL"
                required
                icon={Mail}
                value={locations.receiver.email}
                onChange={(val) => handleLocationChange('receiver', 'email', val)}
              />
            </div>

            <div className="relative pt-2">
              <div className="flex items-center gap-2 mb-2">
                <Label className="text-[11px] font-extrabold text-slate-700 dark:text-zinc-400 uppercase tracking-wider">FULL ADDRESS SEARCH</Label>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Start typing to search address..."
                  className="w-full h-9 pl-10 pr-4 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Type to search, or fill the details manually below.</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <FormInput
                label="Unit/Apartment"
                icon={Hash}
                value={locations.receiver.unit}
                onChange={(val) => handleLocationChange('receiver', 'unit', val)}
              />
              <FormInput
                label="Street Number"
                icon={Hash}
                value={locations.receiver.street_number}
                onChange={(val) => handleLocationChange('receiver', 'street_number', val)}
              />
              <FormInput
                label="Street Name"
                icon={MapPin}
                value={locations.receiver.street_name}
                onChange={(val) => handleLocationChange('receiver', 'street_name', val)}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <FormInput
                label="Town / Suburb"
                required
                icon={MapPin}
                value={locations.receiver.suburb}
                onChange={(val) => handleLocationChange('receiver', 'suburb', val)}
              />
              <FormSelect
                label="State"
                required
                options={states}
                value={locations.receiver.state}
                onValueChange={(val) => handleLocationChange('receiver', 'state', val)}
              />
              <FormInput
                label="Postcode"
                required
                icon={MapPin}
                value={locations.receiver.postcode}
                onChange={(val) => handleLocationChange('receiver', 'postcode', val)}
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="save-address"
                checked={locations.receiver.save_to_address_book}
                onCheckedChange={(checked) => handleLocationChange('receiver', 'save_to_address_book', checked)}
                className="w-4 h-4 rounded border-slate-200 dark:border-zinc-700 data-[state=checked]:bg-blue-600"
              />
              <label htmlFor="save-address" className="text-[11px] font-bold text-slate-500 cursor-pointer">Save address to address book</label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items Section */}
      <Card className="shadow-md gap-0 border-gray-200 dark:border-zinc-800 py-1 px-4 bg-white dark:bg-zinc-950">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-6 border-b border-slate-100 dark:border-zinc-800">
          <CardTitle className="text-sm font-bold text-slate-800 dark:text-zinc-100 tracking-wider flex items-center gap-2">
            <Package className="w-4 h-4 text-orange-500" strokeWidth={2.5} />
            ITEMS
          </CardTitle>
          <div className="flex items-center gap-3">
            <Button
              onClick={onGetRate}
              disabled={!isValid}
              className="bg-[#0060FE] hover:bg-blue-700 text-white gap-2 pt-px h-8 text-[13px] font-bold transition-all shadow-md active:scale-[0.98]"
            >
              <Calculator className="w-4 h-4" />
              Get Live Rate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={addItem}
              className="h-8 gap-1.5 text-[12px] border-slate-200 pt-px dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              Add item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 bg-white dark:bg-zinc-950">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-white dark:bg-zinc-950 hover:bg-white dark:hover:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800 transition-colors">
                  <TableHead className="h-10 text-[10px] font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wider px-5 w-[180px]">Type</TableHead>
                  <TableHead className="h-10 text-[10px] font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wider px-5 w-[80px]">Qty</TableHead>
                  <TableHead className="h-10 text-[10px] font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wider px-5 w-[120px]">Weight (KG)</TableHead>
                  <TableHead className="h-10 text-[10px] font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wider px-5 w-[100px]">Length (CM)</TableHead>
                  <TableHead className="h-10 text-[10px] font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wider px-5 w-[100px]">Width (CM)</TableHead>
                  <TableHead className="h-10 text-[10px] font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wider px-5 w-[100px]">Height (CM)</TableHead>
                  <TableHead className="h-10 w-5 px-5 sticky right-0 bg-background z-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="group/row bg-white dark:bg-zinc-950 hover:bg-gray-50 dark:hover:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 transition-colors">
                    <TableCell className="px-5 py-4">
                      {/* <Select
                        value={item.type}
                        onValueChange={(val: string | null) => val && updateItem(item.id, 'type', val)}
                      >
                        <SelectTrigger className="h-8 min-w-20 text-[11px]group-hover/row:border-gray-200 dark:group-hover/row:border-zinc-800 focus:border-blue-600 focus:bg-white dark:focus:bg-zinc-950 focus-visible:ring-1 focus-visible:ring-blue-600 transition-all font-medium py-0 px-2 outline-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Parcel">Parcel</SelectItem>
                          <SelectItem value="Document">Document</SelectItem>
                          <SelectItem value="Pallet">Pallet</SelectItem>
                        </SelectContent>
                      </Select> */}
                      <SelectComponent
                        value={item.type}
                        onValueChange={(val: string | null) => val && updateItem(item.id || '', 'type', val)}
                        data={[
                          { label: 'Parcel', value: 'Parcel' },
                          { label: 'Document', value: 'Document' },
                          { label: 'Pallet', value: 'Pallet' },
                        ]}
                        placeholder="Select type"
                        className="h-7 data-[size=default]:h-7 min-w-28 text-[11px] group-hover/row:border-gray-200 dark:group-hover/row:border-zinc-800 focus:border-blue-600 focus:bg-white dark:focus:bg-zinc-950 focus-visible:ring-1 focus-visible:ring-blue-600 transition-all font-medium py-0 px-2 outline-none"
                      />
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <Input
                        type="number"
                        value={item.qty}
                        onChange={(e) => updateItem(item.id || '', 'qty', Math.max(1, parseInt(e.target.value) || 0))}
                        // className="h-7 w-full text-center text-xs group-hover/row:border-gray-200 dark:group-hover/row:border-zinc-800 focus:border-blue-600 focus:bg-white dark:focus:bg-zinc-950 focus-visible:ring-1 focus-visible:ring-blue-600 transition-all font-medium py-0 px-2"
                        className="h-7 min-w-15"
                        min={1}
                      />
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <Input
                        type="number"
                        placeholder="kg"
                        value={item.weight || ''}
                        onChange={(e) => updateItem(item.id || '', 'weight', Math.max(0, parseFloat(e.target.value) || 0))}
                        // className="h-7 w-full text-xs group-hover/row:border-gray-200 dark:group-hover/row:border-zinc-800 dark:focus:bg-zinc-950 focus-visible:ring-1 focus-visible:ring-blue-600 transition-all font-medium py-0 px-2"
                        className="h-7"
                        min={0}
                      />
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <Input
                        type="number"
                        placeholder="cm"
                        value={item.length || ''}
                        onChange={(e) => updateItem(item.id || '', 'length', Math.max(0, parseFloat(e.target.value) || 0))}
                        // className="h-7 w-full text-xs group-hover/row:border-gray-200 dark:group-hover/row:border-zinc-800 focus:border-blue-600 focus:bg-white dark:focus:bg-zinc-950 focus-visible:ring-1 focus-visible:ring-blue-600 transition-all font-medium py-0 px-2"
                        className="h-7"
                        min={0}
                      />
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <Input
                        type="number"
                        placeholder="cm"
                        value={item.width || ''}
                        onChange={(e) => updateItem(item.id || '', 'width', Math.max(0, parseFloat(e.target.value) || 0))}
                        // className="h-7 w-full text-xs group-hover/row:border-gray-200 dark:group-hover/row:border-zinc-800 focus:border-blue-600 focus:bg-white dark:focus:bg-zinc-950 focus-visible:ring-1 focus-visible:ring-blue-600 transition-all font-medium py-0 px-2"
                        className="h-7"
                        min={0}
                      />
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <Input
                        type="number"
                        placeholder="cm"
                        value={item.height || ''}
                        onChange={(e) => updateItem(item.id || '', 'height', Math.max(0, parseFloat(e.target.value) || 0))}
                        // className="h-7 w-full text-xs group-hover/row:border-gray-200 dark:group-hover/row:border-zinc-800 focus:border-blue-600 focus:bg-white dark:focus:bg-zinc-950 focus-visible:ring-1 focus-visible:ring-blue-600 transition-all font-medium py-0 px-2"
                        className="h-7"
                        min={0}
                      />
                    </TableCell>
                    <TableCell className="px-2 py-4 text-center sticky right-0 z-20 bg-background">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id || '')}
                        disabled={items.length === 1}
                        className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <div />

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
