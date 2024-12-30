import React from 'react';
import { PieChart, CreditCard, List, TrendingUp, Search, Atom, Settings, User } from 'lucide-react';
import { SidebarMenuItem } from './sidebar/SidebarMenuItem';
import { SidebarHeader } from './sidebar/SidebarHeader';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: PieChart },
    { id: 'my-subscription', label: 'My SubsCryption', icon: User },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'features', label: 'Features', icon: List },
    { id: 'trending', label: 'Trending Subscriptions', icon: TrendingUp },
    { id: 'discover', label: 'Discover', icon: Search },
    { id: 'chemistry', label: 'Chemistry', icon: Atom },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-72 backdrop-blur-xl bg-white/10 border-r border-white/10">
      <SidebarHeader />
      
      <nav className="mt-8 px-4">
        {menuItems.map((item) => (
          <SidebarMenuItem
            key={item.id}
            {...item}
            isActive={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </nav>
    </div>
  );
};