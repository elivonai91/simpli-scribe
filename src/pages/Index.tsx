import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopNavigation } from '@/components/dashboard/TopNavigation';
import { HeroSection } from '@/components/dashboard/HeroSection';
import { KeyFeatures } from '@/components/dashboard/KeyFeatures';
import { UpcomingPayments } from '@/components/dashboard/UpcomingPayments';
import { SubscriptionProvider } from '@/context/SubscriptionContext';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="relative flex min-h-screen">
      {/* Background that extends full width */}
      <div className="fixed inset-0 bg-gradient-to-b from-charcoal-900 to-charcoal-800">
        <div className="absolute inset-0 bg-gradient-to-r from-[#662d91]/20 to-[#bf0bad]/20" />
      </div>
      
      {/* Fixed position sidebar with transparent background */}
      <aside className="fixed top-0 left-0 w-72 h-screen z-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </aside>

      <TopNavigation />
      
      {/* Main content with padding to account for the fixed sidebar */}
      <main className="flex-1 ml-72">
        <div className="relative min-h-screen">
          <div className="relative z-10">
            <section className="min-h-screen flex items-center justify-center px-4">
              <HeroSection />
            </section>
            
            <KeyFeatures />
            
            <SubscriptionProvider>
              <UpcomingPayments />
            </SubscriptionProvider>

            {/* Rest of the content */}
            <section className="py-12 px-4">
              <div className="container mx-auto">
                {/* Additional content sections go here */}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
