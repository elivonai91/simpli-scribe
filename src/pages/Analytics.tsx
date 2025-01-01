import React from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { motion } from 'framer-motion';
import { NavigationMenu } from '@/components/dashboard/NavigationMenu';
import { NotificationsIcon } from '@/components/dashboard/NotificationsIcon';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';

const Analytics = () => {
  const [activeTab] = React.useState('analytics');

  return (
    <div className="flex h-screen bg-charcoal-900">
      <Sidebar activeTab={activeTab} setActiveTab={() => {}} />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Floating Header */}
        <motion.div 
          className="sticky top-0 z-50 px-8 py-4 bg-charcoal-900/95 backdrop-blur-md border-b border-white/5"
        >
          <div className="flex items-center justify-between">
            <NavigationMenu />
            <NotificationsIcon />
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8"
          >
            <AnalyticsDashboard />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;