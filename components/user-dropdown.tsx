'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut } from 'lucide-react';
import { getUser, signOut } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';

function UserDropdownSkeleton() {
  return (
    <div className='flex items-center gap-2'>
      <Skeleton className='h-8 w-8 rounded-full bg-slate-300' />
      <div className='space-y-1'>
        <Skeleton className='h-4 w-24 bg-slate-300' />
        <Skeleton className='h-3 w-32 bg-slate-300' />
      </div>
    </div>
  );
}

export function UserDropdown() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <UserDropdownSkeleton />;
  }

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='flex items-center gap-2 outline-none'>
        <Avatar className='h-8 w-8 bg-gradient-to-br from-orange-400 to-red-500'>
          <AvatarFallback className='bg-gradient-to-br from-orange-400 to-red-500' />
        </Avatar>
        <div className='flex flex-col items-start'>
          <p className='text-sm font-medium'>
            {user.user_metadata.full_name || user.email?.split('@')[0]}
          </p>
          <p className='text-xs text-muted-foreground'>{user.email}</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuItem
          className='text-red-600 focus:text-red-600'
          onClick={() => signOut()}
        >
          <LogOut className='mr-2 h-4 w-4' />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
