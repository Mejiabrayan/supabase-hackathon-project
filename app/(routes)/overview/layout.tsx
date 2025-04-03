'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { VercelIcon } from '@/components/icons';

export default function OverviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-dvh bg-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 shrink-0">
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="text-white">
              <VercelIcon size={20} />
            </div>
            <span className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              DevGenius
            </span>
          </div>
          <div className="h-px bg-gradient-to-r from-white/[0.01] via-white/10 to-white/[0.01] my-2" />
          <nav className="flex flex-col gap-1">
            <Link 
              href="/overview" 
              className={`flex items-center gap-2 px-3 py-2 text-white/60 hover:text-white rounded-md transition-colors ${
                pathname === '/overview' ? 'bg-white/5 text-white' : 'hover:bg-white/5'
              }`}
            >
              <span>Overview</span>
            </Link>
            <Link 
              href="/overview/published" 
              className={`flex items-center gap-2 px-3 py-2 text-white/60 hover:text-white rounded-md transition-colors ${
                pathname === '/overview/published' ? 'bg-white/5 text-white' : 'hover:bg-white/5'
              }`}
            >
              <span>Published</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-auto">
        {children}
      </main>
    </div>
  );
}
