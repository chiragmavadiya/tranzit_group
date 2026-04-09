import React from "react";
import { Pencil, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AddressCardProps {
  title: string;
  name: string;
  address: string;
  email?: string;
  editable?: boolean;
  onEditClick?: () => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  title,
  name,
  address,
  email,
  editable = false,
  onEditClick,
}) => {
  return (
    <Card className="w-full border-1 ring-0 shadow-md border-gray-200 dark:border-zinc-800 py-1 dark:bg-zinc-950 transition-colors duration-300">
      <CardContent className="flex items-center justify-between p-4 py-0">
        <div className="flex items-center gap-3 h-8">
          {/* Section Label */}
          <span className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-400">
            {title}
          </span>

          <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-zinc-400">
            {/* Verified Icon */}
            <CheckCircle2 className="h-4 w-4 fill-emerald-600 text-white dark:text-zinc-950" />

            {/* Sender Details */}
            <div className="flex items-center space-x-1">
              <span className="font-medium text-slate-900 dark:text-zinc-100">{name},</span>
              <span>{address}</span>
              <span className="px-1 text-slate-300 dark:text-zinc-700">|</span>
              <span className="text-slate-600 dark:text-zinc-400">{email}</span>
            </div>
          </div>
        </div>

        {/* Edit Action */}
        {editable && (
          <Button onClick={onEditClick} variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};