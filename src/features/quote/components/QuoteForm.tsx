"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { QuoteLocation } from "../types";
import { memo, useState, useMemo } from "react";
import AutoComplete from "@/components/common/AutoComplate2";
import { useSearchLocalities } from "../hooks/useQuote";

interface QuoteFormProps {
  locations: {
    sender: QuoteLocation | null;
    receiver: QuoteLocation | null;
  };
  setLocations: React.Dispatch<React.SetStateAction<{ sender: QuoteLocation | null; receiver: QuoteLocation | null }>>;
}

interface LocalityAutoCompleteProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  onSelect: (locality: { label: string; suburb: string; state: string; postcode: string }) => void;
}

const LocalityAutoComplete = memo(({ label, placeholder, value, onChange, onSelect }: LocalityAutoCompleteProps) => {
  const [query, setQuery] = useState("");
  const { data: localities } = useSearchLocalities(query, query.length >= 2);

  const options = useMemo(() => {
    if (!localities) return [];
    return localities.map((item) => ({
      value: item.value,
      label: item.label,
      suburb: item.suburb,
      state: item.state,
      postcode: item.postcode,
    }));
  }, [localities]);

  return (
    <AutoComplete
      placeholder={placeholder}
      options={options}
      value={value}
      label={label}
      onChange={(val) => {
        setQuery(val);
        onChange(val);
      }}
      onSelect={(val) => {
        const opt = options.find((o) => o.value === val);
        if (opt) {
          onSelect({
            label: opt.label,
            suburb: opt.suburb,
            state: opt.state,
            postcode: opt.postcode,
          });
        }
      }}
    />
  );
});

LocalityAutoComplete.displayName = "LocalityAutoComplete";

export const QuoteForm = memo(({ locations, setLocations }: QuoteFormProps) => {
  return (
    <div className="space-y-4">
      {/* Addresses Section */}
      <Card className="border-gray-200">
        <CardHeader className="p-4 border-b border-gray-100 dark:border-zinc-800 " >
          <CardTitle className=" inline-flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-zinc-100">
            <MapPin className="w-4 h-4 text-primary" />
            Addresses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-0.5">
              <LocalityAutoComplete
                label="Sender Location"
                placeholder="Start typing suburb or postcode"
                value={locations.sender?.label}
                onChange={(value) => {
                  setLocations(prev => ({
                    ...prev,
                    sender: prev.sender ? { ...prev.sender, label: value } : {
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
                onSelect={(opt) => {
                  setLocations(prev => ({
                    ...prev,
                    sender: {
                      label: opt.label,
                      address1: '',
                      street: '',
                      suburb: opt.suburb,
                      state: opt.state,
                      postcode: opt.postcode,
                      country: 'AU'
                    }
                  }));
                }}
              />
              <p className="text-xs mt-0 mb-2 text-slate-500 dark:text-zinc-500">Select by suburb or enter postcode to filter</p>
            </div>
            <div className="space-y-0.5">
              <LocalityAutoComplete
                label="Receiver Location"
                placeholder="Start typing suburb or postcode"
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
                onSelect={(opt) => {
                  setLocations(prev => ({
                    ...prev,
                    receiver: {
                      label: opt.label,
                      address1: '',
                      street: '',
                      suburb: opt.suburb,
                      state: opt.state,
                      postcode: opt.postcode,
                      country: 'AU'
                    }
                  }));
                }}
              />
              <p className="text-xs mt-0 mb-2 text-slate-500 dark:text-zinc-500">Select by suburb or enter postcode to filter</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

QuoteForm.displayName = "QuoteForm";
