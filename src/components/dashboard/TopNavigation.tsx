import React from 'react';
import { Bell, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const TopNavigation = () => {
  return (
    <div className="fixed top-0 right-0 z-50 flex items-center gap-4 p-4">
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5 text-white/70 hover:text-white transition-colors" />
        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
      </Button>
      
      <Button variant="ghost" size="icon">
        <Settings className="h-5 w-5 text-white/70 hover:text-white transition-colors" />
      </Button>
      
      <div className="flex flex-col items-center gap-1">
        <Avatar className="h-8 w-8 border border-white/10">
          <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60" />
          <AvatarFallback>JS</AvatarFallback>
        </Avatar>
        <span className="text-sm text-white/70">Jessica</span>
      </div>
    </div>
  );
};