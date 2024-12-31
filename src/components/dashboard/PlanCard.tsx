import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlanCardProps {
  name: string;
  price: {
    monthly: string;
    yearly: string;
    yearlyNote: string;
  };
  features: {
    name: string;
    included: boolean;
  }[];
  className?: string;
}

const PlanCard = ({ name, price, features, className }: PlanCardProps) => {
  return (
    <Card className={cn("backdrop-blur-xl border-white/10 bg-white/10", className)}>
      <CardHeader>
        <CardTitle className="text-xl text-white">
          {name}
          <div className="flex flex-col space-y-1 mt-2">
            <span className="text-lg font-normal text-white/80">
              {price.monthly}
            </span>
            <span className="text-sm font-normal text-white/60">
              or {price.yearly} {price.yearlyNote}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {features.map((feature) => (
            <li key={feature.name} className="flex items-center gap-3">
              {feature.included ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <X className="w-5 h-5 text-red-500" />
              )}
              <span className="text-white/90">{feature.name}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default PlanCard;