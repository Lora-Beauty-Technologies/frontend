import type { ReactNode } from "react";
import type { TelegramWebApp } from "../_lib/telegram";

type Props = { leading: ReactNode; title: string; webApp: TelegramWebApp };

/** In-app header under Telegram's own header: leading control, title, user photo. */
export function AppBar({ leading, title, webApp }: Props) {
  const user = webApp.initDataUnsafe.user;
  const initials = `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}` || "•";
  return (
    <header className="sticky top-0 z-10 flex h-[60px] items-center gap-3 bg-(--app-header-bg) px-5">
      <div className="text-(--app-accent)">{leading}</div>
      <h1 className="flex-1 text-[17px] font-semibold">{title}</h1>
      {user?.photo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.photo_url} alt="" className="size-10 rounded-full object-cover" />
      ) : (
        <span className="flex size-10 items-center justify-center rounded-full bg-(--app-highlight) text-sm font-semibold text-(--app-accent)">{initials}</span>
      )}
    </header>
  );
}
