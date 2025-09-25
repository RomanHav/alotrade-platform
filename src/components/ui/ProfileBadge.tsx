"use client";

import { LogOut, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Role } from "@prisma/client";

type ProfileBadgeProps = {
  user: {
    name: string | null;
    role: Role;
  };
};

const roleLabel: Record<Role, string> = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  VIEWER: "Viewer",
  EDITOR: "Editor",
};

export default function ProfileBadge({ user }: ProfileBadgeProps) {
  return (
    <div className="px-2">
      <div className="bg-neutral-200 rounded-lg p-2.5 flex justify-between">
        <div className="flex gap-4 items-center">
          <Image
            src={"/avatar.jpg"}
            alt="Avatar"
            width={50}
            height={50}
            className="rounded-sm"
          />
          <div className="flex flex-col gap-0.5">
            <span className="text-xl font-light">{user.name ?? "Guest"}</span>
            <span className="text-base font-thin">{roleLabel[user.role] ?? "User"}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/settings" aria-label="Settings">
            <Settings className="w-5 h-5 stroke-black" />
          </Link>
          <Link href={"/sign-in"} aria-label="Log out">
            <LogOut className="w-5 h-5 stroke-black" />
          </Link>
        </div>
      </div>
    </div>
  );
}
