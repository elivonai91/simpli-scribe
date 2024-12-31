import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useSubscriptions } from '@/context/SubscriptionContext';

export const StatsOverview = () => {
  const { subscriptions, totalMonthlyCost } = useSubscriptions();

  // Calculate monthly and yearly costs for each subscription
  const subscriptionCosts = subscriptions.map(sub => ({
    name: sub.name,
    monthlyCost: sub.billingCycle === 'yearly' ? sub.cost / 12 : sub.cost,
    yearlyCost: sub.billingCycle === 'yearly' ? sub.cost : sub.cost * 12
  }));

  // Calculate category distribution
  const categoryData = subscriptions.reduce((acc: { name: string; value: number }[], sub) => {
    const existingCategory = acc.find(item => item.name === sub.category);
    const monthlyCost = sub.billingCycle === 'yearly' ? sub.cost / 12 : sub.cost;
    
    if (existingCategory) {
      existingCategory.value += monthlyCost;
    } else if (sub.category) {
      acc.push({ name: sub.category, value: monthlyCost });
    }
    return acc;
  }, []);

  const COLORS = ['#9b87f5', '#7E69AB', '#D946EF', '#FFDEE2', '#FF69B4', '#BA55D3'];

  // Calculate yearly projection
  const yearlyProjection = subscriptions.reduce((total, sub) => {
    return total + (sub.billingCycle === 'yearly' ? sub.cost : sub.cost * 12);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-white/70 font-medium">Monthly Spend</h3>
          <p className="text-3xl font-bold text-white mt-2">${totalMonthlyCost.toFixed(2)}</p>
          <p className="text-sm text-white/50 mt-1">Active subscriptions: {subscriptions.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-white/70 font-medium">Active Subscriptions</h3>
          <p className="text-3xl font-bold text-white mt-2">{subscriptions.length}</p>
          <p className="text-sm text-white/50 mt-1">Services tracked</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-white/70 font-medium">Yearly Projection</h3>
          <p className="text-3xl font-bold text-white mt-2">${yearlyProjection.toFixed(2)}</p>
          <p className="text-sm text-white/50 mt-1">Annual total</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/10"
        >
          <div className="relative z-10">
            <h2 className="text-xl font-semibold text-white mb-6">Subscription Usage Trends</h2>
            <div className="h-64">
              {subscriptionCosts.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subscriptionCosts}>
                    <XAxis 
                      dataKey="name" 
                      stroke="#ffffff50"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis stroke="#ffffff50" />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(155, 135, 245, 0.1)',
                        border: '1px solid rgba(155, 135, 245, 0.2)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)',
                        color: 'white'
                      }}
                    />
                    <Bar dataKey="monthlyCost" name="Monthly Cost" fill="#9b87f5" />
                    <Bar dataKey="yearlyCost" name="Yearly Cost" fill="#D946EF" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-white/50">
                  No subscription data available
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/10"
        >
          <div className="relative z-10">
            <h2 className="text-xl font-semibold text-white mb-6">Category Distribution</h2>
            <div className="h-64">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
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
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Monthly Cost']}
                    />
                    <Legend
                      formatter={(value) => <span style={{ color: 'white' }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-white/50">
                  No category data available
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-4 text-white/70 text-sm">
        <p>* Monthly costs are calculated by dividing yearly subscriptions by 12</p>
        <p>* Yearly projection includes all subscriptions converted to annual costs</p>
      </div>
    </div>
  );
};