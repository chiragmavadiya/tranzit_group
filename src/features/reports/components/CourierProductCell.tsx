interface CourierProductCellProps {
  courierName?: string;
  courierLogoUrl?: string;
  productId?: string;
  gap?: string;
  showUnknown?: boolean;
}

export function CourierProductCell({
  courierName,
  courierLogoUrl,
  productId,
  gap = 'gap-2',
  showUnknown = true,
}: CourierProductCellProps) {
  const displayName = !courierName || (courierName === 'unknown' && !showUnknown) ? '-' : courierName;

  return (
    <div className={`flex items-center ${gap}`}>
      {courierLogoUrl && (
        <div className="shrink-0">
          <img src={courierLogoUrl} className="h-6 object-contain" alt="courier-logo" />
        </div>
      )}
      <div className="flex items-center flex-wrap gap-1">
        <span className="font-normal break-normal">{displayName}{productId && <span className="font-normal text-xs text-slate-500 dark:text-zinc-400"> - {productId}</span>}</span>
        {/* {productId && <span className="font-normal text-sm whitespace-nowrap">- {productId}</span>} */}
      </div>
    </div>
  );
}
