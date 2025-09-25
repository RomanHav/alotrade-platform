// src/app/(auth)/sign-in/page.tsx
import Image from "next/image"
import { signIn } from "@/auth"
import { redirect } from "next/navigation"
import SignInForm from "./SignInForm"

export const dynamic = "force-dynamic"

export default async function SignInPage({
                                             searchParams,
                                         }: {
    searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
    const sp = (await searchParams) ?? {}
    const raw = sp["callbackUrl"]
    const callbackUrl = Array.isArray(raw) ? raw[0] ?? "/dashboard" : raw || "/dashboard"

    async function login(formData: FormData) {
        "use server"
        try {
            const email = String(formData.get("email") || "")
            const password = String(formData.get("password") || "")
            if (!email || !password) redirect("/sign-in?error=MissingCredentials")

            await signIn("credentials", {
                email,
                password,
                redirectTo: callbackUrl,
            })
        } catch (err) {
            console.error("[sign-in action error]", err)
            // опционально: перекинь с кодом
            redirect("/sign-in?error=AuthFailed")
        }
    }

    return (
        <div className="w-full p-5 flex flex-col items-center gap-24">
            <Image src="/logo.svg" alt="Logo" width={250} height={166} />
            <SignInForm action={login} callbackUrl={callbackUrl} />
        </div>
    )
}
