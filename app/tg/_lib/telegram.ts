/** The slice of window.Telegram.WebApp this app uses. */
export type TelegramWebApp = {
  initData: string;
  initDataUnsafe: {
    start_param?: string;
    user?: { first_name?: string; last_name?: string; photo_url?: string };
  };
  ready(): void;
  expand(): void;
  openTelegramLink(url: string): void;
  BackButton: { show(): void; hide(): void; onClick(cb: () => void): void; offClick(cb: () => void): void };
};

declare global {
  interface Window {
    Telegram?: { WebApp: TelegramWebApp };
  }
}

const SCRIPT_URL = "https://telegram.org/js/telegram-web-app.js";

/** Loads Telegram's Mini App script once and returns the WebApp object. */
export function loadTelegramWebApp(): Promise<TelegramWebApp> {
  if (window.Telegram) return Promise.resolve(window.Telegram.WebApp);
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.onload = () => (window.Telegram ? resolve(window.Telegram.WebApp) : reject(new Error("Telegram script failed")));
    script.onerror = () => reject(new Error("Telegram script failed to load"));
    document.head.appendChild(script);
  });
}
