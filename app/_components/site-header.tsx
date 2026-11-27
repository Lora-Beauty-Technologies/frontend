import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold">Lora</Link>
        <Link href={data?.claims ? "/account" : "/login"} className="text-sm font-medium text-blue-600">
          {data?.claims ? "Мои курсы" : "Войти"}
        </Link>
      </div>
    </header>
  );
}
