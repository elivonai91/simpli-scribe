import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar, Bell } from 'lucide-react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { motion } from 'framer-motion';

export const NotificationCarousel = () => {
  const { subscriptions } = useSubscriptions();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const upcomingPayments = subscriptions
    .filter(sub => {
      const daysUntilPayment = Math.ceil(
        (new Date(sub.nextBillingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilPayment <= 7;
    })
    .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime());

  if (upcomingPayments.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % upcomingPayments.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + upcomingPayments.length) % upcomingPayments.length);
  };

  return (
    <div className="relative w-full mb-8">
      <h2 className="text-xl font-semibold text-white mb-4">Upcoming Payments</h2>
      <div className="relative">
        <motion.div
          className="overflow-hidden rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Calendar className="h-8 w-8 text-purple-400" />
                <div>
                  <h3 className="text-lg font-medium text-white">
                    {upcomingPayments[currentIndex].name}
                  </h3>
                  <p className="text-white/70">
                    Due on {new Date(upcomingPayments[currentIndex].nextBillingDate).toLocaleDateString()}
                  </p>
                  <p className="text-white/70 mt-1">
                    Amount: ${upcomingPayments[currentIndex].cost}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {upcomingPayments.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={nextSlide}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>
      
      {upcomingPayments.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {upcomingPayments.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-purple-500' : 'bg-white/20'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};