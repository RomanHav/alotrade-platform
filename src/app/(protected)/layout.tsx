import type { ReactNode } from "react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Sidebar from "@/components/layout/Sidebar"

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
    const session = await auth()
    if (!session?.user) redirect("/sign-in")

    return (
        <div className="min-h-dvh flex">
            <Sidebar />
            <div className="flex-1 flex min-w-0 flex-col">
                {/* Content */}
                <main className="p-4">{children}</main>
            </div>
        </div>
    )
}
