import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

/** Only same-site relative paths are allowed as a post-login target. */
function safeNext(next: string | string[] | undefined) {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/account";
}

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const next = safeNext((await searchParams).next);
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) redirect(next);

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-6">
      <div>
        <h1 className="text-2xl font-bold">Вход и регистрация</h1>
        <p className="mt-1 text-sm text-gray-600">Пароль не нужен: мы отправим одноразовый код на вашу почту.</p>
      </div>
      <LoginForm next={next} />
    </main>
  );
}

/** Per-user page: render on request. */
export const instant = false;
