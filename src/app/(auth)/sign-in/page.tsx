import { Suspense } from "react";
import SignInForm from "./SignInForm";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function SignInPage({
  searchParams,
}: {
    searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
    const sp = (await searchParams) ?? {}
    const raw = sp["callbackUrl"]
    const callbackUrl =
        Array.isArray(raw) ? (raw[0] ?? "/dashboard") : (raw || "/dashboard")
  return (
    <Suspense fallback={null}>
      <div className="w-full p-5 flex flex-col items-center gap-24">
        <Image src={"logo.svg"} alt="Logo" width={250} height={166} />
        <SignInForm callbackUrl={callbackUrl} />
      </div>
    </Suspense>
  );
}
