import SettingsMain from './_components/SettingsMain';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

type UserRole = { role: string };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect('/sign-in');

  const userRole = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (!userRole) redirect('/sign-in');

  const seoSettings = await prisma.siteSettings.findFirst({
    select: {
      defaultSeoTitle: true,
      defaultSeoDescription: true,
      titleSuffix: true,
    },
  });

  const role: UserRole = { role: userRole.role };
  const settings = {
    defaultSeoTitle: seoSettings?.defaultSeoTitle,
    defaultSeoDescription: seoSettings?.defaultSeoDescription,
    titleSuffix: seoSettings?.titleSuffix,
  };

  return <SettingsMain role={role} seoSettings={settings} />;
}
