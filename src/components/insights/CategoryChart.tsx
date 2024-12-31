import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CategoryChartProps {
  chartData: Array<{
    category: string;
    spending: number;
    limit: number;
  }>;
}

export const CategoryChart = ({ chartData }: CategoryChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="spending" fill="#22c55e" name="Current Spending" />
              <Bar dataKey="limit" fill="#3b82f6" name="Category Limit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};