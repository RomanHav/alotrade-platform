import type { ReactNode } from "react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Sidebar from "@/components/layout/Sidebar"
import { prisma } from "@/lib/prisma"

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
    const session = await auth()
    if (!session?.user) redirect("/sign-in")

    const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, role: true },
  });

  if (!user) redirect("/sign-in");
    
    return (
        <div className="min-h-dvh flex">
            <Sidebar user={user} />
            <div className="flex-1 flex min-w-0 flex-col">
                {/* Content */}
                <main className="p-4">{children}</main>
            </div>
        </div>
    )
}
