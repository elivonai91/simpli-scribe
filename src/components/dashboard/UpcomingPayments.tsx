import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ArrowRight } from 'lucide-react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { Link } from 'react-router-dom';

export const UpcomingPayments = () => {
  const { subscriptions } = useSubscriptions();
  const next7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const getPaymentsForDate = (date: Date) => {
    return subscriptions.filter(sub => {
      const paymentDate = new Date(sub.nextBillingDate);
      return paymentDate.toDateString() === date.toDateString();
    });
  };

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-white">Upcoming Payments & Renewals</h2>
          <Link 
            to="/calendar" 
            className="text-[#ff3da6] hover:text-[#ff3da6]/80 flex items-center gap-2"
          >
            View Full Calendar <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {next7Days.map((date, index) => {
            const payments = getPaymentsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <motion.div
                key={date.toISOString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`${
                  isToday ? 'bg-purple-500/20' : 'bg-charcoal-800/50'
                } border border-white/5`}>
                  <CardContent className="p-4">
                    <div className="text-sm text-white/70 mb-2">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-lg font-semibold text-white mb-2">
                      {date.getDate()}
                    </div>
                    {payments.length > 0 ? (
                      <div className="space-y-2">
                        {payments.map(payment => (
                          <div 
                            key={payment.id}
                            className="text-sm p-2 rounded bg-[#ff3da6]/20 text-[#ff3da6]"
                          >
                            <div className="font-medium">{payment.name}</div>
                            <div>${payment.cost}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-white/40">No payments</div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};