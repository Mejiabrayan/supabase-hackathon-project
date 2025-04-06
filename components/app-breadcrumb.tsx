'use client';

import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/site';

function truncateText(text: string, maxLength: number = 30): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength);
}

export function AppBreadCrumb() {
  const pathname = usePathname();
  const currentRoute = siteConfig.find((route) => {
    return pathname.startsWith(route.href);
  });

  if (!currentRoute) return null;

  const isNested = pathname !== currentRoute.href;
  const nestedSegment = isNested ? pathname.split('/').pop() : null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {isNested ? (
            <BreadcrumbLink href={currentRoute.href}>
              {currentRoute.title}
            </BreadcrumbLink>
          ) : (
            <span className='font-normal'>{currentRoute.title}</span>
          )}
        </BreadcrumbItem>

        {isNested && (
          <>
          <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className='font-normal relative inline-block max-w-[200px] overflow-hidden'>
                <span className='relative inline-block whitespace-nowrap'>
                  {nestedSegment === 'published' ? 'Published' : truncateText(nestedSegment || '')}
                </span>
                <span className='absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent' />
              </span>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
