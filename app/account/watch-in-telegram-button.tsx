"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { backendFetch, type TelegramLink } from "@/lib/backend";
import { browserAccessToken } from "@/lib/supabase/browser-token";

/** Creates a one-time link token and opens the bot chat, where START links this account. */
export function WatchInTelegramButton() {
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  async function open() {
    setIsBusy(true);
    setError(null);
    try {
      const accessToken = (await browserAccessToken()) ?? undefined;
      const link = await backendFetch<TelegramLink>("/api/telegram/link-tokens", { accessToken, body: {} });
      window.location.href = link.deepLink;
    } catch (e) {
      setError((e as Error).message);
      setIsBusy(false);
    }
  }

  return (
    <div className="w-full sm:w-auto">
      <Button onClick={open} disabled={isBusy} className="h-11 w-full bg-[#2AABEE] px-5 text-white hover:bg-[#229ED9] sm:h-10 sm:w-auto">
        {isBusy ? "Открываем Telegram…" : "Смотреть в Telegram"}
      </Button>
      {error ? <p role="alert" className="mt-2 text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
