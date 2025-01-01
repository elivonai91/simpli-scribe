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
import { NotificationsIcon } from '@/components/dashboard/NotificationsIcon';
import { NotificationCarousel } from '@/components/dashboard/NotificationCarousel';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { SubscriptionsTab } from '@/components/dashboard/SubscriptionsTab';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0.8, 0.95]);

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-charcoal-900 to-charcoal-800 overflow-hidden">
      <SubscriptionProvider>
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-screen">
          {/* Floating Header */}
          <motion.div 
            className="sticky top-0 z-50 px-8 py-4 bg-charcoal-900/95 backdrop-blur-md border-b border-white/5"
            style={{ opacity: headerOpacity }}
          >
            <div className="flex items-center justify-between">
              <NavigationMenu />
              <NotificationsIcon />
            </div>
          </motion.div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-8 py-6">
              <NotificationCarousel />
            </div>

            {/* 3D Carousel Section */}
            <div className="w-full h-[500px] mb-8">
              <PopularSubscriptions />
            </div>

            <div className="px-8 pb-8 space-y-8">
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
                {activeTab === 'analytics' && <AnalyticsDashboard />}
                {activeTab === 'subscriptions' && <SubscriptionsTab />}
              </div>
            </div>
          </div>
        </div>
      </SubscriptionProvider>
    </div>
  );
};

export default Index;