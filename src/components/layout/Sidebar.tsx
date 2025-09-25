"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { navItems } from "@/config/nav"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import ProfileBadge from "../ui/ProfileBadge"
import type { Role } from "@prisma/client"

type SidebarUser = { name: string | null; role: Role }

export default function Sidebar({ user, fixed = false }: { user: SidebarUser; fixed?: boolean }) {
    const pathname = usePathname()
    return (
        <aside
            className={cn(
                "hidden md:flex w-72 shrink-0 border-r bg-card/40 h-dvh",
                fixed && "fixed inset-y-0 left-0 z-40"
            )}
        >
            <div className="flex h-full flex-col">
                <div className="h-40 flex items-center justify-center px-4 border-b">
                    <Link href="/dashboard" className="font-semibold">
                        <Image src="/logo.svg" alt="logo" width={214} height={106} />
                    </Link>
                </div>

                <ScrollArea className="flex-1 px-6 py-8">
                    <nav className="space-y-2 px-3 py-3">
                        {navItems.map(({ label, href, icon: Icon }) => {
                            const active = pathname === href || pathname.startsWith(href + "/")
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={cn(
                                        "group flex items-center gap-4 rounded-lg px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground",
                                        active && "bg-accent text-accent-foreground"
                                    )}
                                >
                                    <Icon className="h-6 w-6 opacity-70 group-hover:opacity-100" />
                                    <span className="text-2xl">{label}</span>
                                </Link>
                            )
                        })}
                    </nav>
                </ScrollArea>

                <div className="flex flex-col gap-3">
                    <ProfileBadge user={user} />
                    <div className="flex py-2 items-center justify-center border-t text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Alcotrade
                    </div>
                </div>
            </div>
        </aside>
    )
}
