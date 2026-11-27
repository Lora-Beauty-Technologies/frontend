"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Step = "email" | "code";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  async function run(action: () => Promise<{ error: { message: string } | null }>, onSuccess: () => void) {
    setIsBusy(true);
    setError(null);
    const { error } = await action();
    setIsBusy(false);
    if (error) setError(authErrorMessage(error.message));
    else onSuccess();
  }

  function sendCode(event: FormEvent) {
    event.preventDefault();
    const supabase = createClient();
    run(
      () => supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } }),
      () => setStep("code"),
    );
  }

  function verifyCode(event: FormEvent) {
    event.preventDefault();
    const supabase = createClient();
    run(
      () => supabase.auth.verifyOtp({ email, token: code, type: "email" }),
      () => {
        router.replace(next);
        router.refresh();
      },
    );
  }

  return step === "email" ? (
    <form onSubmit={sendCode} className="flex flex-col gap-3">
      <label className="text-sm font-medium" htmlFor="email">Электронная почта</label>
      <input id="email" type="email" required autoComplete="email" value={email}
        onChange={(e) => setEmail(e.target.value)} className="rounded-lg border px-3 py-2" />
      <SubmitButton isBusy={isBusy}>Получить код</SubmitButton>
      <ErrorText error={error} />
    </form>
  ) : (
    <form onSubmit={verifyCode} className="flex flex-col gap-3">
      <p className="text-sm text-gray-600">Мы отправили код для входа на {email}.</p>
      <label className="text-sm font-medium" htmlFor="code">Код</label>
      <input id="code" inputMode="numeric" autoComplete="one-time-code" required pattern="[0-9]{6,10}"
        maxLength={10} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        className="rounded-lg border px-3 py-2 tracking-widest" />
      <SubmitButton isBusy={isBusy}>Войти</SubmitButton>
      <button type="button" className="text-sm text-blue-600" onClick={() => { setStep("email"); setCode(""); }}>
        Указать другую почту
      </button>
      <ErrorText error={error} />
    </form>
  );
}

/** Russian texts for the Supabase Auth errors users actually hit. */
function authErrorMessage(message: string) {
  if (/expired|invalid/i.test(message)) return "Код неверный или устарел. Запросите новый.";
  if (/rate limit|security purposes/i.test(message)) return "Слишком много попыток. Подождите минуту и попробуйте снова.";
  return "Не удалось войти. Попробуйте ещё раз.";
}

function SubmitButton({ isBusy, children }: { isBusy: boolean; children: React.ReactNode }) {
  return (
    <button type="submit" disabled={isBusy}
      className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-60">
      {isBusy ? "Подождите…" : children}
    </button>
  );
}

function ErrorText({ error }: { error: string | null }) {
  return error ? <p role="alert" className="text-sm text-red-600">{error}</p> : null;
}
