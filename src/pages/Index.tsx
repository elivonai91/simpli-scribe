import { AddSubscriptionForm } from '@/components/AddSubscriptionForm';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SubscriptionProvider } from '@/context/SubscriptionContext';

const Dashboard = () => {
  const { subscriptions, totalMonthlyCost } = useSubscriptions();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <AddSubscriptionForm />
          </div>
          
          <div className="w-full md:w-2/3 space-y-6">
            <Card className="bg-brand-500 text-white">
              <CardHeader>
                <CardTitle>Monthly Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${totalMonthlyCost.toFixed(2)}
                </div>
                <p className="text-brand-100">Total Monthly Cost</p>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {subscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                />
              ))}
            </div>
          </div>
        </div>
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