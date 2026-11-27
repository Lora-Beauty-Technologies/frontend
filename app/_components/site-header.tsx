import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { Brand } from "./brand";
import { UserMenu } from "./user-menu";

export async function SiteHeader() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims?.email as string | undefined;
  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Brand />
        {email ? (
          <UserMenu email={email} />
        ) : (
          <Link href="/login" className={buttonVariants({ variant: "outline", className: "h-10 px-4" })}>Войти</Link>
        )}
      </div>
    </header>
  );
}
