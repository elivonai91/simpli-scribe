import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useSubscriptions } from '@/context/SubscriptionContext';

export const StatsOverview = () => {
  const { subscriptions } = useSubscriptions();

  // Calculate usage score based on cost and frequency of use
  const usageData = subscriptions.map(sub => ({
    name: sub.name,
    usageScore: sub.cost * (Math.random() * 100), // In a real app, this would be actual usage data
    cost: sub.cost
  })).sort((a, b) => b.usageScore - a.usageScore);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Monthly Spend', value: '$124.99', change: '+2.5%' },
          { title: 'Active Subscriptions', value: '12', change: '2 upcoming' },
          { title: 'Yearly Projection', value: '$1,499.88', change: '-$45.00' }
        ].map((stat, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={stat.title}
            className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-white/70 font-medium">{stat.title}</h3>
            <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
            <p className="text-sm text-white/50 mt-1">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/10"
      >
        <h2 className="text-xl font-semibold text-white mb-6">My Subscription Usage</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={usageData} layout="vertical">
              <XAxis type="number" stroke="#ffffff50" />
              <YAxis dataKey="name" type="category" stroke="#ffffff50" width={150} />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }}
                formatter={(value: number, name: string) => [
                  `$${value.toFixed(2)}`,
                  name === 'usageScore' ? 'Usage Score' : 'Cost'
                ]}
              />
              <Bar dataKey="usageScore" fill="#a855f7" name="Usage Score" />
              <Bar dataKey="cost" fill="#3b82f6" name="Monthly Cost" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-white/70 text-sm">
          <p>* Usage score is calculated based on subscription cost and frequency of use.</p>
          <p>* Higher usage score indicates better value for money.</p>
        </div>
      </motion.div>
    </div>
  );
};