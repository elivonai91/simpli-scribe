import React from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';

const Analytics = () => {
  const [activeTab, setActiveTab] = React.useState('analytics');

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 to-charcoal-800 relative overflow-x-hidden">
      {/* Ambient light effect */}
      <div className="fixed top-0 right-0 w-1/2 h-screen bg-gradient-to-l from-purple-500/5 to-transparent pointer-events-none" />
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="ml-72">
        <div className="p-8">
          <AnalyticsDashboard />
        </div>
      </div>
    </div>
  );
};

export default Analytics;