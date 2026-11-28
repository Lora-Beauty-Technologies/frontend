"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, backendFetch, fetchMyCourses, type MyCourse, type Session } from "@/lib/backend";
import { loadTelegramWebApp, type TelegramWebApp } from "./telegram";

export type MiniAppState =
  | { kind: "loading" }
  | { kind: "outside-telegram" }
  | { kind: "not-linked" }
  | { kind: "error"; message: string }
  | { kind: "ready"; webApp: TelegramWebApp; session: Session; courses: MyCourse[] };

/**
 * Signs in with Telegram initData (no login form in the Mini App). A "link_<token>" start
 * parameter from "Watch in Telegram" links the account first.
 */
export function useMiniAppSession() {
  const [state, setState] = useState<MiniAppState>({ kind: "loading" });

  useEffect(() => {
    let isMounted = true;
    startMiniApp().then((next) => {
      if (isMounted) setState(next);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const accessToken = state.kind === "ready" ? state.session.accessToken : null;
  const getAccessToken = useCallback(async () => accessToken, [accessToken]);

  return { state, getAccessToken };
}

/** One sign-in per page load, even if the component mounts twice: parallel requests would invalidate each other. */
let startup: Promise<MiniAppState> | null = null;

function startMiniApp(): Promise<MiniAppState> {
  startup ??= (async (): Promise<MiniAppState> => {
    try {
      const webApp = await loadTelegramWebApp();
      webApp.ready();
      webApp.expand();
      if (!webApp.initData) return { kind: "outside-telegram" };
      const startParam = webApp.initDataUnsafe.start_param;
      const linkToken = startParam?.startsWith("link_") ? startParam : undefined;
      const session = await signIn(webApp.initData, linkToken);
      const courses = await fetchMyCourses(session.accessToken);
      return { kind: "ready", webApp, session, courses };
    } catch (e) {
      startup = null; // allow a retry on the next mount
      if (e instanceof ApiError && e.code === "not_linked") return { kind: "not-linked" };
      return { kind: "error", message: (e as Error).message };
    }
  })();
  return startup;
}

async function signIn(initData: string, linkToken?: string): Promise<Session> {
  try {
    return await backendFetch<Session>("/api/telegram/session", { body: { initData, linkToken } });
  } catch (e) {
    // An old or reused link is fine if this Telegram account is already linked.
    if (linkToken && e instanceof ApiError && e.code === "link_token_invalid") {
      return backendFetch<Session>("/api/telegram/session", { body: { initData } });
    }
    throw e;
  }
}
