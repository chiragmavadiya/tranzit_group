import React from 'react';
import { Plus, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function OrdersHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Orders</h1>
        <p className="text-gray-500 mt-1">Manage and track your customer orders across all channels.</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="gap-2 border-gray-200 hover:bg-gray-50">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </Button>
        <Button variant="outline" className="gap-2 border-gray-200 hover:bg-gray-50">
          <Upload className="w-4 h-4" />
          <span>Import</span>
        </Button>
        <Button className="gap-2 bg-[#0060FE] hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all active:scale-95">
          <Plus className="w-4 h-4" />
          <span>Create Order</span>
        </Button>
      </div>
    </div>
  );
}
