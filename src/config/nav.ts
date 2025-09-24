import { Home, Package, Newspaper, Users, Settings, Languages } from "lucide-react"

export const navItems = [
    { label: "Головна", href: "/dashboard", icon: Home },
    { label: "Продукти", href: "/products", icon: Package },
    { label: "Новини", href: "/news", icon: Newspaper },
    { label: "Партнери", href: "/partners", icon: Users },
    { label: "Вигляд та переклад", href: "/translate", icon: Languages },
    { label: "Налаштування", href: "/settings", icon: Settings, roles: ["ADMIN"] as const },
]
