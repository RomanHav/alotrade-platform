import { Suspense } from "react";
import SignInForm from "./SignInForm";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default function Page({
  searchParams,
}: {
  searchParams?: { callbackUrl?: string };
}) {
  const callbackUrl = searchParams?.callbackUrl ?? "/dashboard";
  return (
    <Suspense fallback={null}>
      <div className="w-full p-5 flex flex-col items-center gap-24">
        <Image src={"logo.svg"} alt="Logo" width={250} height={166} />
        <SignInForm callbackUrl={callbackUrl} />
      </div>
    </Suspense> 
  );
}

// kdkd