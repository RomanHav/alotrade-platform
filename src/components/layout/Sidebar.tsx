"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { navItems } from "@/config/nav"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import Image from "next/image";

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden md:flex w-72 shrink-0 border-r bg-card/40">
            <div className="flex h-dvh flex-col">
                <div className="h-40 flex items-center justify-center px-4 border-b">
                    {/* Лого */}
                    <Link href="/dashboard" className="font-semibold"><Image src={'/logo.svg'} alt={'logo'} width={214} height={106}/></Link>
                </div>

                <ScrollArea className="flex-1 px-2 py-3">
                    <nav className="space-y-1">
                        {navItems
                            .map(({ label, href, icon: Icon }) => {
                                const active = pathname === href || pathname.startsWith(href + "/")
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={cn(
                                            "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground",
                                            active && "bg-accent text-accent-foreground"
                                        )}
                                    >
                                        <Icon className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                                        <span className={'text-2xl'}>{label}</span>
                                        {/*{href === "/news" && <Badge variant="secondary" className="ml-auto">beta</Badge>}*/}
                                    </Link>
                                )
                            })}
                    </nav>
                    <Separator className="my-3" />
                    {/* Доп. блоки, например профиль, язык и т.п. */}
                </ScrollArea>

                <div className="px-3 py-3 border-t text-xs text-muted-foreground">
                    © {new Date().getFullYear()} Alcotrade
                </div>
            </div>
        </aside>
    )
}
