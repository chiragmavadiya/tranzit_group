import type { Column } from '@/components/common/types/DataTable.types';
import { formateCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { CustomTooltip } from '@/components/common/CustomTooltip';
import { NavLink } from 'react-router-dom';
import { StatusBadge } from '../orders/components/StatusBadge';
import type { Manifest } from './types';
import Favicon from '@/assets/favicon.png';

export const getManifestColumns = (
  onDownloadPDF: (row: Manifest) => void,
  downloadingId: string | null,
  canReadWrite: boolean,
  canOrderView: boolean
): Column<Manifest>[] => [
    {
      header: 'ORDER #',
      key: 'order_number',
      className: 'text-primary font-bold',
      width: '120px',
      disableToggle: true,
      sticky: 'left',
      cell: (value: string) => {
        if (!canOrderView) {
          return value;
        }
        return (
          <NavLink to={`/orders/view/${value}`} className="font-bold text-primary underline">
            {value}
          </NavLink>
        )
      }

    },
    {
      header: 'SHIPPED', key: 'consignment_date',
      cell: (value: string) => value || '-'
    },
    {
      header: 'CUSTOMER',
      key: 'customer_name',
      width: '220px',
      cell: (value: string) => (
        <div className="flex justify-between items-center truncate uppercase font-semibold py-1 px-0 transition-all duration-250 border border-transparent rounded-sm text-slate-800 dark:text-zinc-200">
          {value || '-'}
        </div>
      )
    },
    {
      header: 'SUBURB', key: 'suburb',
    },
    {
      header: 'CARRIER', key: 'courier',
      width: '220px',
      cell: (value: string, row: Manifest) => (
        <div className="flex items-center gap-2">
          {(row?.courier_logo || row?.courier_logo_url) && (
            <div className="">
              <img src={row?.courier_logo || row?.courier_logo_url} className="h-6! min-w-[60px] object-contain" />
            </div>
          )}
          <div className="flex">
            <span className="font-normal whitespace-nowrap">{value && value !== 'unknown' ? value : '-'}</span>
            {row.product_id && <span className="font-normal text-sm whitespace-nowrap"> - {row.product_id}</span>}
          </div>
        </div>
      )
    },
    {
      header: 'AMOUNT', key: 'amount', cell: (value: string) => <span className="font-medium"> {formateCurrency(Number(value))}</span>
    },
    {
      header: 'PAYMENT STATUS', key: 'payment_status', cell: (value: string) => <StatusBadge status={value} />
    },
    {
      header: 'ORDER SOURCE', key: 'order_type', width: '110px',
      cell: (value: string, row: Manifest) => (
        <div className="flex items-center gap-2">
          <img src={row?.order_source_icon || Favicon} className="h-4 w-4" alt="" />
          <span className="capitalize">{value}</span>
        </div>
      )
    },
    ...(canReadWrite ? [{
      key: 'actions',
      header: '',
      sticky: 'right' as const,
      cell: (_: any, row: Manifest) => {
        const isDownloading = downloadingId === row?.order_number;
        return (
          <div className="flex items-center gap-2">
            <CustomTooltip title="Download PDF" placement="bottom">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 hover:text-primary bg-transparent hover:bg-transparent dark:hover:bg-transparent"
                onClick={() => onDownloadPDF(row)}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </Button>
            </CustomTooltip>
          </div>
        );
      }
    }] : []),
  ];
