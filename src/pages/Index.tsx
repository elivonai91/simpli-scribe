import { AddSubscriptionForm } from '@/components/AddSubscriptionForm';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Grid2X2, List, Search, Pyramid, Bell, CreditCard, Settings2, TrendingUp, Plus } from 'lucide-react';
import { useState, useMemo } from 'react';
import { SpendingInsights } from '@/components/SpendingInsights';
import { BudgetForm } from '@/components/BudgetForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PremiumFeatures } from '@/components/PremiumFeatures';
import { SubscriptionProvider } from '@/context/SubscriptionContext';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { subscriptions, totalMonthlyCost } = useSubscriptions();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get unique categories for filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = new Set(subscriptions.map(sub => sub.category));
    return ['all', ...Array.from(uniqueCategories)];
  }, [subscriptions]);

  // Filter and sort subscriptions
  const filteredAndSortedSubscriptions = useMemo(() => {
    return subscriptions
      .filter(sub => {
        const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || sub.category === filterCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'cost':
            return b.cost - a.cost;
          case 'date':
            return new Date(b.nextBillingDate).getTime() - new Date(a.nextBillingDate).getTime();
          default:
            return a.name.localeCompare(b.name);
        }
      });
  }, [subscriptions, searchQuery, sortBy, filterCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 to-charcoal-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Tabs defaultValue="subscriptions" className="space-y-8">
          <TabsList className="w-full justify-start backdrop-blur-xl bg-white/10 border border-white/10 rounded-xl">
            <TabsTrigger 
              value="subscriptions" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-400 data-[state=active]:to-gold-500 data-[state=active]:text-charcoal-900"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Subscriptions
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-400 data-[state=active]:to-gold-500 data-[state=active]:text-charcoal-900"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Insights & Budget
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions">
            <div className="flex flex-col md:flex-row gap-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full md:w-1/3 space-y-6"
              >
                <AddSubscriptionForm />
                <PremiumFeatures />
              </motion.div>
              
              <div className="w-full md:w-2/3 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <Card className="backdrop-blur-xl bg-white/10 border-white/10 p-6">
                    <div className="flex flex-col">
                      <span className="text-gold-400/70">Monthly Spend</span>
                      <span className="text-3xl font-bold text-gold-400 mt-2">
                        ${totalMonthlyCost.toFixed(2)}
                      </span>
                      <span className="text-sm text-gold-400/50 mt-1">+2.5% from last month</span>
                    </div>
                  </Card>
                  
                  <Card className="backdrop-blur-xl bg-white/10 border-white/10 p-6">
                    <div className="flex flex-col">
                      <span className="text-gold-400/70">Active Subscriptions</span>
                      <span className="text-3xl font-bold text-gold-400 mt-2">
                        {subscriptions.length}
                      </span>
                      <span className="text-sm text-gold-400/50 mt-1">2 upcoming renewals</span>
                    </div>
                  </Card>
                  
                  <Card className="backdrop-blur-xl bg-white/10 border-white/10 p-6">
                    <div className="flex flex-col">
                      <span className="text-gold-400/70">Yearly Projection</span>
                      <span className="text-3xl font-bold text-gold-400 mt-2">
                        ${(totalMonthlyCost * 12).toFixed(2)}
                      </span>
                      <span className="text-sm text-gold-400/50 mt-1">Based on current spend</span>
                    </div>
                  </Card>
                </motion.div>

                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gold-400/50" />
                      <Input
                        placeholder="Search subscriptions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 backdrop-blur-xl bg-white/10 border-white/10 text-gold-400 placeholder:text-gold-400/50"
                      />
                    </div>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px] backdrop-blur-xl bg-white/10 border-white/10 text-gold-400">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="cost">Cost</SelectItem>
                        <SelectItem value="date">Next Billing</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-[180px] backdrop-blur-xl bg-white/10 border-white/10 text-gold-400">
                        <SelectValue placeholder="Filter category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setViewMode('grid')}
                        className="border-white/10 bg-white/10 hover:bg-white/20"
                      >
                        <Grid2X2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setViewMode('list')}
                        className="border-white/10 bg-white/10 hover:bg-white/20"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <motion.div 
                    className={viewMode === 'grid' ? "grid gap-4 md:grid-cols-2" : "space-y-4"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                  >
                    {filteredAndSortedSubscriptions.map((subscription, index) => (
                      <motion.div
                        key={subscription.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <SubscriptionCard subscription={subscription} />
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  {filteredAndSortedSubscriptions.length === 0 && (
                    <div className="text-center py-8 text-gold-400/50 backdrop-blur-xl bg-white/10 rounded-xl border border-white/10">
                      No subscriptions found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <SpendingInsights />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <BudgetForm />
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const Index = () => (
  <SubscriptionProvider>
    <Dashboard />
  </SubscriptionProvider>
);

export default Index;