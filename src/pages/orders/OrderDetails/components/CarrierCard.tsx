import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { RefreshCw, Star, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const CarrierCard: React.FC = () => {
  return (
    <Card className="border-1 ring-0 shadow-md border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden transition-colors duration-300 px-4">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-5 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors">
        <CardTitle className="text-sm font-bold text-gray-900 dark:text-zinc-100 tracking-wider">
          CARRIER
        </CardTitle>
        <ChevronDown className="h-5 w-5 text-[#0060FE]" />
      </CardHeader>
      <CardContent className="p-0 bg-white dark:bg-zinc-950">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] divide-y lg:divide-y-0 lg:divide-x dark:divide-zinc-800 border-b border-gray-100 dark:border-zinc-800 transition-colors">
          <div className="p-0">
            <div className="flex items-center justify-between px-5 py-2 border-b border-gray-50 dark:border-zinc-800 text-[10px] font-bold text-gray-900 dark:text-zinc-100 uppercase transition-colors">
              <span>Carrier</span>
              <div className="flex items-center gap-20">
                <span>Rate</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 rounded-sm">
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="bg-[#E9F2FE] dark:bg-blue-900/20 px-5 py-4 flex items-center justify-between transition-colors">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-gray-300 dark:text-zinc-700" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900 dark:text-zinc-100">Plain Label</span>
                  <span className="text-xs text-gray-500 dark:text-zinc-400">Plain Label</span>
                </div>
              </div>
              <div className="text-sm font-bold text-gray-900 dark:text-zinc-100 mr-8">
                -
              </div>
            </div>
          </div>

          <div className="p-5 flex flex-col gap-4 transition-colors">
            <span className="text-[10px] font-bold text-gray-900 dark:text-zinc-100 uppercase">Options</span>
            <div className="flex flex-col gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="atl" className="border-gray-300 dark:border-zinc-700 data-[state=checked]:bg-[#0060FE]" />
                <label
                  htmlFor="atl"
                  className="text-xs font-medium text-gray-600 dark:text-zinc-400 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Authority to Leave
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="sr" className="border-gray-300 dark:border-zinc-700 data-[state=checked]:bg-[#0060FE]" />
                <label
                  htmlFor="sr"
                  className="text-xs font-medium text-gray-600 dark:text-zinc-400 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Signature Required
                </label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
