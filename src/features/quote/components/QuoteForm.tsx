"use client";

import { useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SelectComponent from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MapPin, Plus, Trash2, Calculator, Package } from "lucide-react";
import AutoComplete from "@/components/common/AutoComplate";
import type { QuoteItem, QuoteLocation } from "../types";

interface QuoteFormProps {
  items: QuoteItem[];
  setItems: React.Dispatch<React.SetStateAction<QuoteItem[]>>;
  locations: {
    sender: QuoteLocation | null;
    receiver: QuoteLocation | null;
  };
  setLocations: React.Dispatch<React.SetStateAction<{ sender: QuoteLocation | null; receiver: QuoteLocation | null }>>;
  onGetRate: () => void;
  isValid: boolean;
}

export function QuoteForm({ items, setItems, setLocations, onGetRate, isValid }: QuoteFormProps) {
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

  const locationOptions = useMemo(() => [
    { value: 'SYD-2000', label: 'Sydney, NSW 2000', suburb: 'Sydney', state: 'NSW', postcode: '2000', country: 'Australia' },
    { value: 'MEL-3000', label: 'Melbourne, VIC 3000', suburb: 'Melbourne', state: 'VIC', postcode: '3000', country: 'Australia' },
    { value: 'BNE-4000', label: 'Brisbane, QLD 4000', suburb: 'Brisbane', state: 'QLD', postcode: '4000', country: 'Australia' },
    { value: 'PER-6000', label: 'Perth, WA 6000', suburb: 'Perth', state: 'WA', postcode: '6000', country: 'Australia' },
  ], []);

  return (
    <div className="space-y-4">
      {/* Addresses Section */}
      <Card className="shadow-md border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <CardHeader className="pb-0">
          <CardTitle className="inline-flex items-center gap-2 text-[15px] font-semibold text-slate-800 dark:text-zinc-100">
            <MapPin className="w-4 h-4 text-blue-500" />
            Addresses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-0.5">
              <Label className="text-[13px] font-medium text-slate-600 dark:text-zinc-400">Sender Location</Label>
              <AutoComplete
                placeholder="Start typing suburb or postcode..."
                options={locationOptions}
                onSelect={(val) => {
                  const opt = locationOptions.find(o => o.value === val);
                  if (opt) setLocations(prev => ({ ...prev, sender: opt }));
                }}
                className="[&>div>input]:h-10 [&>div>input]:text-[13px]"
              />
              <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">Select by suburb or enter postcode to filter</p>
            </div>
            <div className="space-y-0.5">
              <Label className="text-[13px] font-medium text-slate-600 dark:text-zinc-400">Receiver Location</Label>
              <AutoComplete
                placeholder="Start typing suburb or postcode..."
                options={locationOptions}
                onSelect={(val) => {
                  const opt = locationOptions.find(o => o.value === val);
                  if (opt) setLocations(prev => ({ ...prev, receiver: opt }));
                }}
                className="[&>div>input]:h-10 [&>div>input]:text-[13px]"
              />
              <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">Select a suggestion from the dropdown to lock the locality.</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
