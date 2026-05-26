"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { QuoteLocation } from "../types";
import { PlaceAutocomplete } from "@/components/common/AutoComplateAddress";
import { memo } from "react";

interface QuoteFormProps {
  locations: {
    sender: QuoteLocation | null;
    receiver: QuoteLocation | null;
  };
  setLocations: React.Dispatch<React.SetStateAction<{ sender: QuoteLocation | null; receiver: QuoteLocation | null }>>;
}

export const QuoteForm = memo(({ locations, setLocations }: QuoteFormProps) => {
  return (
    <div className="space-y-4">
      {/* Addresses Section */}
      <Card className="border-gray-200 ">
        <CardHeader className="p-4 border-b border-gray-100 dark:border-zinc-800 bg-slate-50" >
          <CardTitle className=" inline-flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-zinc-100">
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
                      street: opt.street || '',
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
                      street: '',
                      // street_number: opt.street_number || '',
                      // street_type: opt.street_type || '',
                      suburb: '',
                      state: '',
                      postcode: '',
                      country: ''
                    }
                  }));
                }}
                className='rounded-none'
              />
              <p className="text-xs mt-0 mb-2 text-slate-500 dark:text-zinc-500">Select by suburb or enter postcode to filter</p>
            </div>
            <div className="space-y-0.5">
              <PlaceAutocomplete
                onPlaceSelect={(opt) => {
                  setLocations(prev => ({
                    ...prev,
                    receiver: {
                      label: opt.formatted_address,
                      address1: opt.address1 || '',
                      street: opt.street || '',
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
                      street: '',
                      suburb: '',
                      state: '',
                      postcode: '',
                      country: ''
                    }
                  }));
                }}
              />
              <p className="text-xs mt-0 mb-2 text-slate-500 dark:text-zinc-500">Select a suggestion from the dropdown to lock the locality.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
