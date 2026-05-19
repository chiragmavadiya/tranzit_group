import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CustomerSettingsLayout() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] lg:h-screen bg-gray-50/50 dark:bg-zinc-950/50 p-page-padding overflow-y-auto">
      <div className="w-full space-y-6">
        {/* <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-1"
        >
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-100">
            {getTitle()}
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            {getDescription()}
          </p>
        </motion.div> */}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
