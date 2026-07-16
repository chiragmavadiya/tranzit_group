import React, { memo } from "react";
import { Pencil, User, Mail, Phone } from "lucide-react";
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
      <CardContent className="p-0 bg-slate-50 dark:bg-zinc-900">
        <div className="flex items-center justify-between p-4 py-2.5">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 flex-1 mr-2">
            {/* Section Label */}
            <span className="text-sm font-bold flex items-center gap-1.5 text-slate-800 dark:text-zinc-400 shrink-0">
              <User className="w-5 h-5 text-primary" />
              {title}
            </span>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm text-slate-600 dark:text-zinc-400">
              {/* Sender Details */}
              <span className="font-semibold text-slate-900 dark:text-zinc-100 whitespace-nowrap">
                {name}{name && address && ','}
              </span>
              <span className="text-slate-600 dark:text-zinc-400">{address}</span>

              {/* Contact Badges */}
              {email && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800/80 text-xs font-medium text-slate-600 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-700/50">
                  <Mail className="h-3 w-3 text-slate-400 dark:text-zinc-500" />
                  {email}
                </span>
              )}
              {phone && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800/80 text-xs font-medium text-slate-600 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-700/50">
                  <Phone className="h-3 w-3 text-slate-400 dark:text-zinc-500" />
                  {phone}
                </span>
              )}
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
            <span className="text-sm font-medium text-slate-800 dark:text-zinc-400">
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