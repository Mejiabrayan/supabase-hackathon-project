import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { cookies } from 'next/headers';
import { AppBreadCrumb } from '@/components/app-breadcrumb';
import { getUser} from '@/app/actions/index'
import { redirect } from 'next/navigation';

export default async function OverviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
  const user = await getUser();


  if (!user) {
    redirect('/auth/sign-in');
  }

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          '--sidebar-width': '19rem',
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <header className='flex h-16 shrink-0 items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <AppBreadCrumb />
      </header>
      <main className='flex flex-1 flex-col gap-4 p-4 pt-0'>{children}</main>
    </SidebarProvider>
  );
}
