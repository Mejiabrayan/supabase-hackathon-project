import { getUser } from '@/app/actions';
import { redirect } from 'next/navigation';
export default async function OverviewPage() {
  const user = await getUser();
  console.log('user', user);
  if (!user) {
    redirect('/auth/sign-in');
  }
  return <div>Overview</div>;
}
