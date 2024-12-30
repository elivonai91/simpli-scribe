import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const popularServices = [
  {
    name: 'Netflix',
    category: 'Entertainment',
    price: 19.99,
    description: 'Stream your favorite shows and movies',
    icon: '🎬',
    trending: true
  },
  {
    name: 'Spotify',
    category: 'Music',
    price: 9.99,
    description: 'Music streaming with personalized playlists',
    icon: '🎵'
  },
  {
    name: 'Notion',
    category: 'Productivity',
    price: 8,
    description: 'All-in-one workspace for notes and collaboration',
    icon: '📝',
    trending: true
  },
  {
    name: 'Adobe CC',
    category: 'Creative',
    price: 52.99,
    description: 'Professional creative tools suite',
    icon: '🎨'
  }
];

export const PopularSubscriptions = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {popularServices.map((service, index) => (
        <motion.div
          key={service.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{service.icon}</div>
              <div>
                <h3 className="text-xl font-semibold text-white">{service.name}</h3>
                <p className="text-purple-200/70">{service.category}</p>
              </div>
            </div>
            {service.trending && (
              <div className="flex items-center px-3 py-1 rounded-full bg-pink-500/20 text-pink-300">
                <TrendingUp className="w-4 h-4 mr-1" />
                Trending
              </div>
            )}
          </div>
          
          <p className="text-white/70 mb-4">{service.description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              ${service.price}/mo
            </span>
            <Button
              variant="outline"
              className="bg-white/10 border-purple-400/50 hover:bg-white/20 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Subscription
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};