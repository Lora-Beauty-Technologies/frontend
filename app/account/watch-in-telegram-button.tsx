"use client";

import { useState } from "react";
import { backendFetch, type TelegramLink } from "@/lib/backend";
import { browserAccessToken } from "@/lib/supabase/browser-token";

/** Creates a one-time link token and opens the Mini App, which links this account. */
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
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div>
      <button onClick={open} disabled={isBusy}
        className="rounded-xl bg-[#2AABEE] px-5 py-3 font-semibold text-white disabled:opacity-60">
        {isBusy ? "Opening Telegram…" : "Watch in Telegram"}
      </button>
      {error ? <p role="alert" className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
