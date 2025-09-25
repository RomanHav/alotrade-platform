import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import DashboardMain from './_components/DashboardMain';

export const revalidate = 0;

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/sign-in?callbackUrl=/dashboard');

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id as string },
    select: { name: true, email: true },
  });

  const name = dbUser?.name ?? session.user?.name ?? dbUser?.email ?? 'користувачу';

  return <DashboardMain userName={name} />;
}
