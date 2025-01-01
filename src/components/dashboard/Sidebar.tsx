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
    { id: 'discovery', label: 'Discovery', icon: Search, path: '/discovery' },
    { id: 'analytics', label: 'Analytics', icon: BarChart, path: '/analytics' },
    { id: 'account', label: 'Account', icon: User, path: '/account' },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, path: '/subscriptions' },
    { id: 'features', label: 'Features', icon: List, path: '/features' },
    { id: 'trending', label: 'Trending Subscriptions', icon: TrendingUp, path: '/trending' },
    { id: 'chemistry', label: 'Chemistry', icon: Atom, path: '/chemistry' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleNavigation = (item: typeof menuItems[0]) => {
    if (item.path === location.pathname) return;
    
    if (!['/chemistry', '/', '/analytics', '/subscriptions', '/discovery'].includes(item.path)) {
      toast.info("This feature is coming soon!");
      return;
    }

    setActiveTab(item.id);
    navigate(item.path);
  };

  return (
    <div className="h-full flex flex-col bg-transparent backdrop-blur-[2px]">
      <SidebarHeader />
      
      <nav className="mt-8 px-4 flex-1">
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