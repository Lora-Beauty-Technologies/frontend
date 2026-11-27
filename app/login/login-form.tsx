"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Mail, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

/** Must match "Email OTP Length" in Supabase Auth settings. */
const CODE_LENGTH = 8;
const RESEND_COOLDOWN_SECONDS = 60;

type Step = "email" | "code";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function sendCode() {
    setIsBusy(true);
    setError(null);
    const { error } = await createClient().auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    setIsBusy(false);
    if (error) {
      setError(authErrorMessage(error.message));
      return;
    }
    setStep("code");
    setCode("");
    setCooldown(RESEND_COOLDOWN_SECONDS);
  }

  async function verify(token: string) {
    setIsBusy(true);
    setError(null);
    const { error } = await createClient().auth.verifyOtp({ email, token, type: "email" });
    if (error) {
      setIsBusy(false);
      setError(authErrorMessage(error.message));
      return;
    }
    router.replace(next);
    router.refresh();
  }

  if (step === "email") {
    return (
      <form onSubmit={(e: FormEvent) => { e.preventDefault(); sendCode(); }} className="flex flex-col">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">С возвращением</h2>
        <p className="mt-3 text-muted-foreground">
          Ваша следующая глава начинается здесь. Мы отправим код для входа на вашу почту.
        </p>
        <Label htmlFor="email" className="mt-8">Электронная почта</Label>
        <Input id="email" type="email" required autoComplete="email" inputMode="email" placeholder="you@example.com"
          value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 h-11 text-base sm:text-sm" />
        <Button type="submit" disabled={isBusy} className="mt-5 h-11">
          <Mail aria-hidden /> {isBusy ? "Отправляем…" : "Получить код"}
        </Button>
        <ErrorText error={error} />
        <p className="mt-5 text-center text-sm font-medium">Пароль не нужен.</p>
        <p className="mt-1 text-center text-sm text-muted-foreground">Одноразовый код придёт прямо на почту.</p>
      </form>
    );
  }

  const half = CODE_LENGTH / 2;
  return (
    <form onSubmit={(e: FormEvent) => { e.preventDefault(); verify(code); }} className="flex flex-col">
      <span className="flex size-10 items-center justify-center rounded-lg bg-muted"><MailCheck className="size-5" aria-hidden /></span>
      <h2 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">Введите код подтверждения</h2>
      <p className="mt-3 text-muted-foreground">Мы отправили {CODE_LENGTH}-значный код на</p>
      <p className="font-medium break-all">{email}</p>

      <Label htmlFor="code" className="mt-8">Код подтверждения</Label>
      <InputOTP id="code" maxLength={CODE_LENGTH} value={code} onChange={setCode} autoFocus inputMode="numeric"
        pattern="^[0-9]+$" onComplete={verify} disabled={isBusy} containerClassName="mt-2 gap-2">
        <InputOTPGroup>
          {Array.from({ length: half }, (_, i) => <InputOTPSlot key={i} index={i} className="h-11 w-9 text-base sm:w-10" />)}
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          {Array.from({ length: half }, (_, i) => <InputOTPSlot key={i} index={half + i} className="h-11 w-9 text-base sm:w-10" />)}
        </InputOTPGroup>
      </InputOTP>
      <p className="mt-3 text-sm text-muted-foreground">Код действует 1 час.</p>

      <Button type="submit" disabled={isBusy || code.length < CODE_LENGTH} className="mt-5 h-11">
        {isBusy ? "Проверяем…" : "Подтвердить"}
      </Button>
      <ErrorText error={error} />

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 text-sm">
        <span className="text-muted-foreground">Не получили код?</span>
        <Button type="button" variant="link" className="h-10 px-1" disabled={cooldown > 0 || isBusy} onClick={sendCode}>
          {cooldown > 0 ? `Отправить ещё раз через ${cooldown} с` : "Отправить ещё раз"}
        </Button>
      </div>
      <Button type="button" variant="ghost" className="h-10 self-center" onClick={() => { setStep("email"); setError(null); }}>
        Указать другую почту
      </Button>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Проверьте папку «Спам» или запросите новый код. Действует только последний код.
      </p>
    </form>
  );
}

/** Russian texts for the Supabase Auth errors users actually hit. */
function authErrorMessage(message: string) {
  if (/expired|invalid/i.test(message)) return "Код неверный или устарел. Запросите новый.";
  if (/rate limit|security purposes/i.test(message)) return "Слишком много попыток. Подождите минуту и попробуйте снова.";
  return "Не удалось войти. Попробуйте ещё раз.";
}

function ErrorText({ error }: { error: string | null }) {
  return error ? <p role="alert" className="mt-3 text-sm text-destructive">{error}</p> : null;
}
