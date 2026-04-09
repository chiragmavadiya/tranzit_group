import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table'
import { ChevronDown } from 'lucide-react'

interface TableCardProps {
  title: string
  headers: string[]
  children?: React.ReactNode
  footer?: React.ReactNode
  footerCells?: React.ReactNode[]
  isEmpty?: boolean
  onClick?: () => void
  editable?: boolean
}

export const TableCard: React.FC<TableCardProps> = ({
  title,
  headers,
  children,
  footer,
  footerCells,
  isEmpty = false,
  onClick,
  editable = false
}) => {
  return (
    <Card className="border-1 ring-0 shadow-md border-gray-200 dark:border-zinc-800 rounded-xl py-1 px-4 overflow-hidden group transition-colors duration-300">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-5 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 group-hover:bg-gray-50/50 dark:group-hover:bg-zinc-800/50 transition-colors">
        <CardTitle className="text-sm font-bold text-gray-900 dark:text-zinc-100 tracking-wider">
          {title.toUpperCase()}
        </CardTitle>
        <ChevronDown onClick={onClick} className={`h-5 w-5 text-[#0060FE] group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 rounded-full transition-colors transition-transform duration-300 ${editable ? 'rotate-180' : ''}`} />
      </CardHeader>
      <CardContent className="p-0 bg-white dark:bg-zinc-950 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-white dark:bg-zinc-950 hover:bg-white dark:hover:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800 transition-colors">
              {headers.map((header) => (
                <TableHead key={header} className="h-12 text-[10px] font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wider px-5">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isEmpty ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={headers.length} className="h-24 text-center text-sm text-gray-500 dark:text-zinc-400 font-medium">
                  No records available.
                </TableCell>
              </TableRow>
            ) : (
              children
            )}
          </TableBody>
          {footerCells && (
            <TableFooter className="bg-white dark:bg-zinc-950">
              <TableRow className="hover:bg-transparent border-t border-gray-400 dark:border-zinc-800">
                {footerCells.map((cell, idx) => (
                  <TableCell key={idx} className="px-5 py-3 text-[12px] font-bold text-gray-900 dark:text-zinc-100 whitespace-nowrap">
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            </TableFooter>
          )}
        </Table>

        {footer && <div className="border-t border-gray-100 dark:border-zinc-800 px-5 py-3 bg-white dark:bg-zinc-950 transition-colors">{footer}</div>}
      </CardContent>
    </Card>
  )
}
