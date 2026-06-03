import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import { createPortal } from "react-dom"

export interface DrawerProps {
  open: boolean
  onClose: () => void
  title: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className
}: DrawerProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const content = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed inset-y-0 right-0 z-[100] w-full max-w-[60vw] bg-white dark:bg-zinc-950 shadow-2xl flex flex-col border-l border-gray-200 dark:border-zinc-800",
              className
            )}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100 dark:border-zinc-800">
                <div className="flex flex-col gap-1">
                  <h2 className="my-0 text-xl font-bold text-gray-900 dark:text-zinc-100">
                    {title}
                  </h2>
                  {description && (
                    <p className="my-0 text-sm text-gray-500 dark:text-zinc-400">
                      {description}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full w-8 h-8 hover:bg-gray-100 dark:hover:bg-zinc-800"
                  onClick={onClose}
                >
                  <X className="w-4 h-4 text-gray-500" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar">
                {children}
              </div>
              {footer && (
                <div className="px-6 py-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  if (typeof document === 'undefined') return null

  return createPortal(content, document.body)
}
