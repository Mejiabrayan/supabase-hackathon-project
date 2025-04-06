import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,

} from '@/components/ui/sidebar';

import { siteConfig } from '@/config/site';
import Link from 'next/link';
import { Suspense } from 'react';
import { UserDropdown } from './user-dropdown';
import { GalleryVerticalEnd, Home, Book } from 'lucide-react';

const icons = {
  Home,
  Book,
} as const;

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant='floating' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link href='/'>
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                  <GalleryVerticalEnd className='size-4' />
                </div>
                <div className='flex flex-col gap-0.5 leading-none'>
                  <span className='font-semibold'>DevGenius</span>
                  <span className=''>AI-powered blogging</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className='gap-2'>
            {siteConfig.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.href} className='font-medium'>
                    {item.icon &&
                      icons[item.icon as keyof typeof icons] &&
                      React.createElement(
                        icons[item.icon as keyof typeof icons],
                        { className: 'mr-2 h-4 w-4' }
                      )}
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className='px-3'>
        <Suspense
          fallback={
            <div className='h-10 w-full animate-pulse rounded-md bg-muted' />
          }
        >
          <UserDropdown />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  );
}
