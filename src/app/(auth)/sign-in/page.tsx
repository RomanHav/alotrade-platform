import Image from 'next/image';
import SignInForm from './SignInForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  if (session?.user) redirect('/dashboard');

  const sp = (await searchParams) ?? {};
  const raw = sp['callbackUrl'];
  const callbackUrl = Array.isArray(raw) ? (raw[0] ?? '/dashboard') : raw || '/dashboard';

  return (
    <div className="flex w-full flex-col items-center gap-24 p-5">
      <Image src="/logo.svg" alt="Logo" width={250} height={166} />
      <SignInForm callbackUrl={callbackUrl} />
    </div>
  );
}
