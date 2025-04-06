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

function truncateText(text: string, maxLength: number = 20): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
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
            <span className='font-medium'>{currentRoute.title}</span>
          )}
        </BreadcrumbItem>

        {isNested && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className='font-medium max-w-[200px] truncate'>
                {nestedSegment === 'published' ? 'Published' : truncateText(nestedSegment || '')}
              </span>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
