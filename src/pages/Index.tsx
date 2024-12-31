import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { PopularSubscriptions } from '@/components/dashboard/PopularSubscriptions';
import Features from '@/components/dashboard/Features';
import { SearchBar } from '@/components/SearchBar';
import { Plus } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SubscriptionProvider } from '@/context/SubscriptionContext';
import { NavigationMenu } from '@/components/dashboard/NavigationMenu';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0.8, 0.95]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 to-charcoal-800 relative overflow-x-hidden">
      {/* Ambient light effect */}
      <div className="fixed top-0 right-0 w-1/2 h-screen bg-gradient-to-l from-purple-500/5 to-transparent pointer-events-none" />
      
      <SubscriptionProvider>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Floating Header */}
        <motion.div 
          className="fixed top-0 right-0 left-72 z-50 px-8 py-4"
          style={{
            opacity: headerOpacity,
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(28, 28, 33, 0.8)',
          }}
        >
          <NavigationMenu />
        </motion.div>

        <div className="ml-72 pt-24">
          {/* 3D Carousel Section */}
          <div className="w-full h-[500px] mb-8">
            <PopularSubscriptions />
          </div>

          <div className="px-8 space-y-8">
            <div className="flex items-center gap-8">
              <SearchBar />
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 h-[60px] rounded-xl flex items-center gap-3 shadow-lg shadow-purple-500/30 whitespace-nowrap w-[200px] justify-center text-base border border-white/10"
              >
                <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
                Add Subscription
              </motion.button>
            </div>

            <div className="space-y-8">
              {activeTab === 'overview' && <StatsOverview />}
              {activeTab === 'features' && <Features />}
            </div>
          </div>
        </div>
      </SubscriptionProvider>
    </div>
  );
};

export default Index;