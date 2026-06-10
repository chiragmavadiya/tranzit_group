import React, { memo } from "react";
import { Pencil, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AddressCardProps {
  title: string;
  name: string;
  address: string;
  email?: string;
  instruction?: string;
  editable?: boolean;
  onEditClick?: () => void;
  phone?: string;
}

export const AddressCard: React.FC<AddressCardProps> = memo(({
  title,
  name,
  address,
  email,
  instruction,
  editable = false,
  onEditClick,
  phone,
}) => {

  return (

    <Card className="w-full border ring-0 border-gray-200 dark:border-zinc-800 dark:bg-zinc-950 transition-colors duration-300">
      <CardContent className="p-0 ">
        <div className="flex items-center justify-between p-4 py-2">
          <div className="flex items-center gap-3 min-h-8">
            {/* Section Label */}
            <span className="text-base font-bold uppercase tracking-wide text-slate-800 dark:text-zinc-400">
              {title}
            </span>

            <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-zinc-400">
              {/* Verified Icon */}
              {name && address && <CheckCircle2 className="h-4 w-4 fill-emerald-600 text-white dark:text-zinc-950" />}

              {/* Sender Details */}
              <div className="flex items-center space-x-1">
                <span className="font-medium text-slate-900 dark:text-zinc-100">{name}{name && address && ','}</span>
                <span>{address}</span>
                {email && <span className="px-1 text-slate-300 dark:text-zinc-700">|</span>}
                {email && <span className="text-slate-600 dark:text-zinc-400">{email}</span>}
                {phone && <span className="px-1 text-slate-300 dark:text-zinc-700">|</span>}
                {phone && <span className="text-slate-600 dark:text-zinc-400">{phone}</span>}
              </div>
            </div>
          </div>

          {/* Edit Action */}
          {editable && (
            <Button onClick={onEditClick} variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary-hover">
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
        {instruction && (
          <div className="flex py-2 items-center px-4 gap-3 bg-gray-300 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800">
            <span className="text-sm font-medium tracking-wider text-slate-800 dark:text-zinc-400">
              Instruction :
            </span>

            <span className="text-sm text-slate-600 dark:text-zinc-400">
              {instruction}
            </span>
          </div>
        )}
      </CardContent>
      {/* {instruction && (
        <CardContent className="flex items-center justify-between p-4 py-0 border-t border-gray-200 dark:border-zinc-800">
        </CardContent>
      )} */}
    </Card>
  );
});