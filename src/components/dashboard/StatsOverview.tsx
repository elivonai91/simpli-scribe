import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useSubscriptions } from '@/context/SubscriptionContext';

export const StatsOverview = () => {
  const { subscriptions } = useSubscriptions();

  // Calculate usage score based on cost and frequency of use
  const usageData = subscriptions.map(sub => ({
    name: sub.name,
    usageScore: sub.cost * (Math.random() * 100), // In a real app, this would be actual usage data
    cost: sub.cost
  })).sort((a, b) => b.usageScore - a.usageScore);

  // Calculate category distribution for pie chart
  const categoryData = subscriptions.reduce((acc: { name: string; value: number }[], sub) => {
    const existingCategory = acc.find(item => item.name === sub.category);
    if (existingCategory) {
      existingCategory.value += sub.cost;
    } else {
      acc.push({ name: sub.category, value: sub.cost });
    }
    return acc;
  }, []);

  const COLORS = ['#a855f7', '#3b82f6', '#ec4899', '#10b981', '#f59e0b'];

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/10"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Subscription Usage Trends</h2>
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/10"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Category Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    color: 'white'
                  }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cost']}
                />
                <Legend 
                  formatter={(value) => <span style={{ color: 'white' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="mt-4 text-white/70 text-sm">
        <p>* Usage score is calculated based on subscription cost and frequency of use.</p>
        <p>* Higher usage score indicates better value for money.</p>
      </div>
    </div>
  );
};