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

  const COLORS = ['#9b87f5', '#7E69AB', '#D946EF', '#FFDEE2'];

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
          className="relative overflow-hidden rounded-2xl p-6 before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-500/20 before:to-pink-500/20 before:backdrop-blur-xl"
        >
          <div className="relative z-10">
            <h2 className="text-xl font-semibold text-white mb-6">Subscription Usage Trends</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usageData} layout="vertical">
                  <XAxis type="number" stroke="#ffffff50" />
                  <YAxis dataKey="name" type="category" stroke="#ffffff50" width={150} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(155, 135, 245, 0.1)',
                      border: '1px solid rgba(155, 135, 245, 0.2)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)'
                    }}
                    formatter={(value: number, name: string) => [
                      `$${value.toFixed(2)}`,
                      name === 'usageScore' ? 'Usage Score' : 'Cost'
                    ]}
                  />
                  <Bar dataKey="usageScore" fill="#9b87f5" name="Usage Score" />
                  <Bar dataKey="cost" fill="#D946EF" name="Monthly Cost" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl p-6 before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-500/20 before:to-pink-500/20 before:backdrop-blur-xl"
        >
          <div className="relative z-10">
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
                      background: 'rgba(155, 135, 245, 0.1)',
                      border: '1px solid rgba(155, 135, 245, 0.2)',
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