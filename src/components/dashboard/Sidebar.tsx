import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PieChart, CreditCard, List, TrendingUp, Search, Atom, Settings, User, BarChart } from 'lucide-react';
import { SidebarMenuItem } from './sidebar/SidebarMenuItem';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { toast } from "sonner";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: PieChart, path: '/' },
    { id: 'account', label: 'Account', icon: User, path: '/account' },
    { id: 'analytics', label: 'Analytics', icon: BarChart, path: '/analytics' },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, path: '/subscriptions' },
    { id: 'features', label: 'Features', icon: List, path: '/features' },
    { id: 'trending', label: 'Trending Subscriptions', icon: TrendingUp, path: '/trending' },
    { id: 'discover', label: 'Discover', icon: Search, path: '/discover' },
    { id: 'chemistry', label: 'Chemistry', icon: Atom, path: '/chemistry' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleNavigation = (item: typeof menuItems[0]) => {
    if (item.path === location.pathname) return;
    
    // Only allow navigation to implemented routes
    if (!['/chemistry', '/', '/analytics'].includes(item.path)) {
      toast.info("This feature is coming soon!");
      return;
    }

    setActiveTab(item.id);
    navigate(item.path);
  };

  return (
    <div className="fixed left-0 top-0 h-full w-72 bg-charcoal-900/95 border-r border-white/5">
      <SidebarHeader />
      
      <nav className="mt-8 px-4">
        {menuItems.map((item) => (
          <SidebarMenuItem
            key={item.id}
            {...item}
            isActive={location.pathname === item.path}
            onClick={() => handleNavigation(item)}
          />
        ))}
      </nav>
    </div>
  );
};