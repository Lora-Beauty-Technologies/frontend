"use client";

import Link from "next/link";
import { LibraryBig, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "../auth-actions";

export function UserMenu({ email }: { email: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Меню аккаунта" className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
        <Avatar className="size-9">
          <AvatarFallback className="bg-neutral-900 font-medium text-white">{email[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate font-normal text-muted-foreground">{email}</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/account" />}>
          <LibraryBig /> Мои курсы
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut /> Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
