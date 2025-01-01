import React from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { motion } from 'framer-motion';
import { NavigationMenu } from '@/components/dashboard/NavigationMenu';
import { NotificationsIcon } from '@/components/dashboard/NotificationsIcon';
import { SubscriptionsTab } from '@/components/dashboard/SubscriptionsTab';

const Subscriptions = () => {
  const [activeTab] = React.useState('subscriptions');

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 to-charcoal-800 relative overflow-x-hidden">
      {/* Ambient light effect */}
      <div className="fixed top-0 right-0 w-1/2 h-screen bg-gradient-to-l from-purple-500/5 to-transparent pointer-events-none" />
      
      <Sidebar activeTab={activeTab} setActiveTab={() => {}} />

      <div className="ml-72">
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

        {/* Main Content - Adjusted padding and margin */}
        <div className="pt-20 px-8 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl p-6">
              <h1 className="text-3xl font-bold text-white mb-4">Subscriptions</h1>
              <SubscriptionsTab />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;