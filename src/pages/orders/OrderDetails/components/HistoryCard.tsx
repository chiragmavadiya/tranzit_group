import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ChevronDown, ChevronUp, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HistoryItem {
  id: string
  timestamp: string
  action: string
  details?: string
}

const mockHistory: HistoryItem[] = [
  {
    id: '1',
    timestamp: '07/04/26 09:33 PM',
    action: 'Shipment Saved',
    details: 'Shipment saved Blazor_New [Saved]'
  },
  {
    id: '2',
    timestamp: '07/04/26 09:33 PM',
    action: 'Shipment Saved',
    details: 'Shipment saved Blazor_New [Saved]'
  },
  {
    id: '3',
    timestamp: '07/04/26 09:33 PM',
    action: 'Shipment Saved',
    details: 'Shipment saved Blazor_New [Saved]'
  },
  {
    id: '4',
    timestamp: '07/04/26 09:33 PM',
    action: 'Shipment Saved',
    details: 'Shipment saved Blazor_New [Saved]'
  },
  {
    id: '5',
    timestamp: '07/04/26 09:33 PM',
    action: 'Shipment Saved',
    details: 'Shipment saved Blazor_New [Saved]'
  },
]

export const HistoryCard: React.FC = () => {
  const [isCardExpanded, setIsCardExpanded] = useState(true)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  const toggleItem = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <Card className="border py-0 ring-0 shadow-md border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden transition-colors duration-300 gap-2">
      <CardHeader
        className="flex flex-row items-center justify-between py-3 px-5 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer transition-colors"
        onClick={() => setIsCardExpanded(!isCardExpanded)}
      >
        <CardTitle className="text-sm font-bold text-gray-900 dark:text-zinc-100 tracking-wider">
          HISTORY
        </CardTitle>
        <div className="flex items-center gap-2">
          {isCardExpanded ? (
            <ChevronUp className="h-5 w-5 text-[#0060FE]" />
          ) : (
            <ChevronDown className="h-5 w-5 text-[#0060FE]" />
          )}
        </div>
      </CardHeader>

      {isCardExpanded && (
        <CardContent className="p-0 bg-white dark:bg-zinc-950">
          <div className="flex flex-col">
            {mockHistory.map((item) => {
              const isExpanded = expandedItems[item.id]
              return (
                <div key={item.id}>
                  <div
                    className="flex items-center justify-between px-5 py-2 transition-colors hover:bg-gray-50/50 dark:hover:bg-zinc-900/50"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 text-[#0060FE] hover:bg-transparent"
                        onClick={() => toggleItem(item.id)}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                      <span className="text-xs font-medium text-gray-500 dark:text-zinc-400 whitespace-nowrap">
                        {item.timestamp}
                      </span>
                      <span className="text-xs font-bold text-gray-900 dark:text-zinc-100">
                        {item.action}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[#0060FE] hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>

                  {isExpanded && item.details && (
                    <div className="px-5 pb-4 pl-[52px]">
                      <p className="text-xs text-gray-400 dark:text-zinc-500">
                        {item.details}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
