import React from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { motion } from 'framer-motion';
import { NavigationMenu } from '@/components/dashboard/NavigationMenu';
import { NotificationsIcon } from '@/components/dashboard/NotificationsIcon';

const Chemistry = () => {
  const [activeTab] = React.useState('chemistry');

  return (
    <div className="min-h-screen bg-charcoal-900 relative overflow-x-hidden">
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

      <div className="ml-72 pt-24 px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Chemistry Lab</h1>
            <p className="text-white/70">
              Welcome to the Chemistry Lab! This is where we experiment with new features and ideas.
              Stay tuned for exciting updates.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chemistry;