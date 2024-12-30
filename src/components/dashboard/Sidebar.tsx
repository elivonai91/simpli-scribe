import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, CreditCard, TrendingUp, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  return (
    <div className="fixed left-0 top-0 h-full w-72 backdrop-blur-xl bg-white/10 border-r border-white/10">
      <div className="p-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
          SubsCrypt
        </h1>
      </div>
      
      <nav className="mt-8 px-4">
        {['Overview', 'Subscriptions', 'Analytics', 'Settings'].map(item => (
          <motion.button
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            key={item}
            className={`flex items-center px-6 py-4 w-full rounded-xl mb-2 ${
              activeTab === item.toLowerCase()
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:bg-white/10'
            }`}
            onClick={() => setActiveTab(item.toLowerCase())}
          >
            {item === 'Overview' && <PieChart className="w-5 h-5 mr-3" />}
            {item === 'Subscriptions' && <CreditCard className="w-5 h-5 mr-3" />}
            {item === 'Analytics' && <TrendingUp className="w-5 h-5 mr-3" />}
            {item === 'Settings' && <Settings className="w-5 h-5 mr-3" />}
            {item}
          </motion.button>
        ))}
      </nav>
    </div>
  );
};