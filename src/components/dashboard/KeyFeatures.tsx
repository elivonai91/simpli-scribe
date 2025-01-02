import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Sparkles, Shield, BarChart2 } from 'lucide-react';

export const KeyFeatures = () => {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8 text-[#ff3da6]" />,
      title: "Smart Recommendations",
      description: "Get personalized suggestions to optimize your subscriptions"
    },
    {
      icon: <Shield className="w-8 h-8 text-[#bf0bad]" />,
      title: "Secure Management",
      description: "Keep all your subscription data safe and encrypted"
    },
    {
      icon: <BarChart2 className="w-8 h-8 text-[#662d91]" />,
      title: "Detailed Analytics",
      description: "Track spending patterns and identify savings opportunities"
    }
  ];

  return (
    <section className="py-24 px-4">
      <motion.div 
        className="container mx-auto"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <motion.h2 
          className="text-4xl font-bold text-center mb-16 text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Key Features
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 bg-charcoal-800/50 border border-white/5 hover:border-white/10 transition-all">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};