import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const spendingData = [
  { month: 'Jan', amount: 280 },
  { month: 'Feb', amount: 300 },
  { month: 'Mar', amount: 310 },
  { month: 'Apr', amount: 290 },
  { month: 'May', amount: 320 },
  { month: 'Jun', amount: 318 }
];

export const StatsOverview = () => {
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
        <h2 className="text-xl font-semibold text-white mb-6">Spending Trends</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spendingData}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity={0.4}/>
                  <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#ffffff50" />
              <YAxis stroke="#ffffff50" />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#a855f7"
                fill="url(#colorGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};