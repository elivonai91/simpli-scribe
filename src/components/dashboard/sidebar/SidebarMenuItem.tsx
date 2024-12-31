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
      className={`flex items-center px-6 py-4 w-full rounded-xl mb-2 text-base ${
        isActive ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10'
      }`}
      onClick={onClick}
    >
      <Icon className="w-6 h-6 mr-3 text-purple-500" />
      {label}
    </motion.button>
  );
};