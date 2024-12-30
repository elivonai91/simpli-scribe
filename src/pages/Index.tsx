import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { PopularSubscriptions } from '@/components/dashboard/PopularSubscriptions';
import { SearchBar } from '@/components/SearchBar';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="ml-72 p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="w-full max-w-3xl">
            <SearchBar />
          </div>
          
          <div className="flex items-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl flex items-center shadow-lg shadow-purple-500/30"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Subscription
            </motion.button>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 shadow-lg"
            />
          </div>
        </div>

        <div className="space-y-8">
          {activeTab === 'overview' && <StatsOverview />}
          
          {(activeTab === 'overview' || activeTab === 'trending') && (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {activeTab === 'trending' ? 'Trending Subscriptions' : 'Popular Subscriptions'}
                </h2>
                <button className="bg-white/10 border-purple-400/50 hover:bg-white/20 text-white px-4 py-2 rounded-xl">
                  View All
                </button>
              </div>
              <PopularSubscriptions />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;