import { AddSubscriptionForm } from '@/components/AddSubscriptionForm';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SubscriptionProvider } from '@/context/SubscriptionContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Grid2X2, List, Search, Pyramid } from 'lucide-react';
import { useState, useMemo } from 'react';
import { SpendingInsights } from '@/components/SpendingInsights';
import { BudgetForm } from '@/components/BudgetForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PremiumFeatures } from '@/components/PremiumFeatures';

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
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Tabs defaultValue="subscriptions" className="space-y-8">
          <TabsList className="w-full justify-start bg-secondary border border-accent/20">
            <TabsTrigger value="subscriptions" className="data-[state=active]:gradient-gold data-[state=active]:text-primary-foreground">
              <Pyramid className="mr-2 h-4 w-4" />
              Subscriptions
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:gradient-gold data-[state=active]:text-primary-foreground">
              Insights & Budget
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3 space-y-6">
                <AddSubscriptionForm />
                <PremiumFeatures />
              </div>
              
              <div className="w-full md:w-2/3 space-y-6">
                <Card className="gradient-gold text-primary-foreground hieroglyph-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Pyramid className="h-6 w-6" />
                      Monthly Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">
                      ${totalMonthlyCost.toFixed(2)}
                    </div>
                    <p className="text-primary-foreground/80">Total Monthly Cost</p>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search subscriptions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-secondary border-accent/20"
                      />
                    </div>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px] bg-secondary border-accent/20">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="cost">Cost</SelectItem>
                        <SelectItem value="date">Next Billing</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-[180px] bg-secondary border-accent/20">
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
                        className="border-accent/20"
                      >
                        <Grid2X2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setViewMode('list')}
                        className="border-accent/20"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className={viewMode === 'grid' 
                    ? "grid gap-4 md:grid-cols-2" 
                    : "space-y-4"
                  }>
                    {filteredAndSortedSubscriptions.map((subscription) => (
                      <SubscriptionCard
                        key={subscription.id}
                        subscription={subscription}
                      />
                    ))}
                  </div>
                  
                  {filteredAndSortedSubscriptions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No subscriptions found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <SpendingInsights />
              </div>
              <div>
                <BudgetForm />
              </div>
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