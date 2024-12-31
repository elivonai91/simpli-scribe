import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MonthlyOverviewProps {
  totalMonthlySpending: number;
  monthlyLimit: number;
  spendingPercentage: number;
}

export const MonthlyOverview = ({ 
  totalMonthlySpending, 
  monthlyLimit, 
  spendingPercentage 
}: MonthlyOverviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Spending Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Total Monthly Spending</span>
            <span className="font-bold">${totalMonthlySpending.toFixed(2)}</span>
          </div>
          {monthlyLimit > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Budget Limit: ${monthlyLimit}</span>
                <span className={spendingPercentage > 100 ? 'text-red-500' : 'text-green-500'}>
                  {spendingPercentage.toFixed(1)}% Used
                </span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full">
                <div
                  className={`h-full rounded-full ${
                    spendingPercentage > 100 ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};