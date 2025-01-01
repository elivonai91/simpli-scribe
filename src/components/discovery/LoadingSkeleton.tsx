import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <Card key={i} className="h-[200px] bg-charcoal-800/50 border-white/5">
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div className="space-y-4 flex-1">
              <Skeleton className="h-6 w-3/4 bg-white/5" />
              <Skeleton className="h-4 w-1/2 bg-white/5" />
              <Skeleton className="h-4 w-2/3 bg-white/5" />
            </div>
            <div className="w-20">
              <Skeleton className="h-6 w-full bg-white/5" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);