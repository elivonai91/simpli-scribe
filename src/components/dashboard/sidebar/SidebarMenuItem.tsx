import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SidebarMenuItemProps {
  id: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
}

export const SidebarMenuItem = ({ id, label, icon: Icon, isActive, onClick }: SidebarMenuItemProps) => {
  return (
    <motion.button
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center px-6 py-4 w-full rounded-xl mb-2 text-base transition-colors ${
        isActive 
          ? 'bg-white/10 text-white' 
          : 'text-white/70 hover:bg-white/5'
      }`}
      onClick={onClick}
    >
      <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-ruby-500' : 'text-ruby-500/70'}`} />
      {label}
    </motion.button>
  );
};