import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Brand } from "../_components/brand";
import { LoginForm } from "./login-form";

const supportUrl = "https://t.me/lora_demo_bot";
const benefits = ["Учитесь в своём темпе", "Продолжайте с того места, где остановились", "Применяйте каждый урок на практике"];

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
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="hidden flex-col bg-neutral-900 p-10 text-white lg:flex xl:p-12">
        <Brand inverted />
        <p className="mt-20 text-sm uppercase tracking-wide text-neutral-400">Учитесь на своих условиях</p>
        <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">Немного прогресса.<br />Большая разница.</h1>
        <p className="mt-8 max-w-md text-neutral-300">
          Освободите место для нового. Практичные курсы, которые помогают расти — по одному уроку в день.
        </p>
        <ul className="mt-16 flex flex-col gap-5">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-3 text-neutral-200"><Check className="size-5" aria-hidden /> {benefit}</li>
          ))}
        </ul>
        <div className="mt-auto border-t border-white/15 pt-10">
          <p className="text-xl font-semibold">Навыки, которые остаются с вами.</p>
          <p className="mt-10 text-sm text-neutral-400">© 2026 Forma Academy</p>
        </div>
      </aside>

      <main className="flex flex-col px-4 py-5 sm:px-8 lg:px-12 lg:py-10">
        <div className="flex items-center justify-between">
          <Brand className="lg:invisible" />
          <a href={supportUrl} className="rounded-md px-2 py-2 text-sm font-medium hover:bg-muted">Поддержка</a>
        </div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <LoginForm next={next} />
        </div>
        <p className="mx-auto max-w-xs text-center text-xs text-muted-foreground">
          Продолжая, вы соглашаетесь с Условиями использования и Политикой конфиденциальности.
        </p>
      </main>
    </div>
  );
}

export const instant = false;
