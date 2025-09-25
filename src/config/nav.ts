import { Home, Package, Newspaper, Users } from "lucide-react";
import TranslateIcon from "@/components/icons/translate";

export const navItems = [
  { label: "Головна", href: "/dashboard", icon: Home },
  { label: "Продукти", href: "/products", icon: Package },
  { label: "Новини", href: "/news", icon: Newspaper },
  { label: "Партнери", href: "/partners", icon: Users },
  { label: "Вигляд та переклад", href: "/translate", icon: TranslateIcon },
];
