import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  className?: string;
}

export const MetricCard = ({ title, value, suffix, className }: MetricCardProps) => {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}{suffix && suffix}
        </div>
      </CardContent>
    </Card>
  );
};