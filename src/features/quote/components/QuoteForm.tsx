"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { QuoteLocation } from "../types";
import { PlaceAutocomplete } from "@/components/common/AutoComplateAddress";

interface QuoteFormProps {
  locations: {
    sender: QuoteLocation | null;
    receiver: QuoteLocation | null;
  };
  setLocations: React.Dispatch<React.SetStateAction<{ sender: QuoteLocation | null; receiver: QuoteLocation | null }>>;
}

export function QuoteForm({ locations, setLocations }: QuoteFormProps) {
  return (
    <div className="space-y-4">
      {/* Addresses Section */}
      <Card className="">
        <CardHeader className="p-4 bg-transparent border-b border-gray-100 dark:border-zinc-800">
          <CardTitle className=" inline-flex items-center gap-2 text-[15px] font-semibold text-slate-800 dark:text-zinc-100">
            <MapPin className="w-4 h-4 text-primary" />
            Addresses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-0.5">
              <PlaceAutocomplete
                onPlaceSelect={(opt) => {
                  setLocations(prev => ({
                    ...prev,
                    sender: {
                      label: opt.formatted_address,
                      address1: opt.address1 || '',
                      street_name: opt.street || '',
                      // street_number: opt.street_number || '',
                      // street_type: opt.street_type || '',
                      suburb: opt.suburb || '',
                      state: opt.state || '',
                      postcode: opt.post_code || '',
                      country: opt.country || ''
                    }
                  }));
                }}
                errormsg='Please enter an address'
                label='Sender Location'
                value={locations.sender?.label}
                onChange={(value) => {
                  setLocations(prev => ({
                    ...prev,
                    sender: prev.sender ? { ...prev.sender, label: value } : {
                      label: value,
                      address1: '',
                      street_name: '',
                      street_number: '',
                      street_type: '',
                      suburb: '',
                      state: '',
                      postcode: '',
                      country: ''
                    }
                  }));
                }}
                className='rounded-none'
              />
              <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">Select by suburb or enter postcode to filter</p>
            </div>
            <div className="space-y-0.5">
              <PlaceAutocomplete
                onPlaceSelect={(opt) => {
                  setLocations(prev => ({
                    ...prev,
                    receiver: {
                      label: opt.formatted_address,
                      address1: opt.address1 || '',
                      street_name: opt.street || '',
                      // street_number: opt.street_number || '',
                      // street_type: opt.street_type || '',
                      suburb: opt.suburb || '',
                      state: opt.state || '',
                      postcode: opt.post_code || '',
                      country: opt.country || ''
                    }
                  }));
                }}
                errormsg='Please enter an address'
                label="Receiver Location"
                value={locations.receiver?.label}
                onChange={(value) => {
                  setLocations(prev => ({
                    ...prev,
                    receiver: prev.receiver ? { ...prev.receiver, label: value } : {
                      label: value,
                      address1: '',
                      street_name: '',
                      street_number: '',
                      street_type: '',
                      suburb: '',
                      state: '',
                      postcode: '',
                      country: ''
                    }
                  }));
                }}
              />
              <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">Select a suggestion from the dropdown to lock the locality.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
