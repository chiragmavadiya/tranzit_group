"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import AutoComplete from "@/components/common/AutoComplate";
import type { QuoteLocation } from "../types";
import { LOCATION_OPTIONS } from '@/constants';

interface QuoteFormProps {
  locations: {
    sender: QuoteLocation | null;
    receiver: QuoteLocation | null;
  };
  setLocations: React.Dispatch<React.SetStateAction<{ sender: QuoteLocation | null; receiver: QuoteLocation | null }>>;
}

export function QuoteForm({ setLocations }: QuoteFormProps) {
  return (
    <div className="space-y-4">
      {/* Addresses Section */}
      <Card className="">
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
                options={LOCATION_OPTIONS}
                onSelect={(val) => {
                  const opt = LOCATION_OPTIONS.find(o => o.value === val);
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
                options={LOCATION_OPTIONS}
                onSelect={(val) => {
                  const opt = LOCATION_OPTIONS.find(o => o.value === val);
                  if (opt) setLocations(prev => ({ ...prev, receiver: opt }));
                }}
                className="[&>div>input]:h-10 [&>div>input]:text-[13px]"
              />
              <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">Select a suggestion from the dropdown to lock the locality.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
