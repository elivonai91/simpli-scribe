import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Sparkles, Shield, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PopularSubscriptions } from '@/components/dashboard/PopularSubscriptions';
import { Sidebar } from '@/components/dashboard/Sidebar';

const Index = () => {
  const [activeTab, setActiveTab] = React.useState('overview');
  
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-b from-charcoal-900 to-charcoal-800">
          {/* Hero Section */}
          <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#662d91]/20 to-[#bf0bad]/20" />
            <motion.div 
              className="container mx-auto text-center z-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#662d91] via-[#bf0bad] to-[#ff3da6] text-transparent bg-clip-text">
                Simplify Your Digital Life
              </h1>
              <p className="text-xl md:text-2xl text-white/70 mb-8 max-w-2xl mx-auto">
                Track, manage, and optimize all your subscriptions in one beautiful dashboard
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-[#662d91] to-[#bf0bad] hover:from-[#662d91]/90 hover:to-[#bf0bad]/90 text-white px-8"
                >
                  Start Free Trial
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-white border-white/20 hover:bg-white/5"
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          </section>

          {/* Keep existing sections */}
      <section className="py-24 px-4">
        <motion.div 
          className="container mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl font-bold text-center mb-16 text-white"
            {...fadeInUp}
          >
            Why Choose SimpliScribed
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
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
                icon: <BarChart3 className="w-8 h-8 text-[#662d91]" />,
                title: "Detailed Analytics",
                description: "Track spending patterns and identify savings opportunities"
              }
            ].map((feature, index) => (
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
      <section className="py-24 px-4 bg-charcoal-800/50">
        <div className="container mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center mb-16 text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            See It In Action
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <PopularSubscriptions />
          </motion.div>
        </div>
      </section>
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center mb-16 text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Connect", description: "Link your accounts securely" },
              { step: "2", title: "Analyze", description: "Get insights into your spending" },
              { step: "3", title: "Optimize", description: "Receive smart recommendations" },
              { step: "4", title: "Save", description: "Reduce unnecessary expenses" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#662d91] to-[#bf0bad] flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-white/70">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 px-4 bg-gradient-to-r from-[#662d91]/20 to-[#bf0bad]/20">
        <motion.div 
          className="container mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6 text-white">Ready to Take Control?</h2>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are saving money and time with SimpliScribed
          </p>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-[#662d91] to-[#bf0bad] hover:from-[#662d91]/90 hover:to-[#bf0bad]/90 text-white px-8"
          >
            Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </section>
        </div>
      </div>
    </div>
  );
};

export default Index;
