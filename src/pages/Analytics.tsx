import React from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { motion } from 'framer-motion';
import { NavigationMenu } from '@/components/dashboard/NavigationMenu';
import { NotificationsIcon } from '@/components/dashboard/NotificationsIcon';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';

const Analytics = () => {
  const [activeTab] = React.useState('analytics');

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 to-charcoal-800 relative overflow-x-hidden">
      {/* Ambient light effect */}
      <div className="fixed top-0 right-0 w-1/2 h-screen bg-gradient-to-l from-purple-500/5 to-transparent pointer-events-none" />
      
      <Sidebar activeTab={activeTab} setActiveTab={() => {}} />

      {/* Floating Header */}
      <motion.div 
        className="fixed top-0 right-0 left-72 z-50 px-8 py-4"
        style={{
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(28, 28, 33, 0.8)',
        }}
      >
        <div className="flex items-center justify-between">
          <NavigationMenu />
          <NotificationsIcon />
        </div>
      </motion.div>

      <div className="ml-72 pt-24 px-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <AnalyticsDashboard />
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;