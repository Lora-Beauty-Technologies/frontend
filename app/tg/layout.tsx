import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AppRoot } from "@telegram-apps/telegram-ui/dist/components/Service/AppRoot/AppRoot";
import "./forma.css";

const inter = Inter({
  variable: "--font-forma",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Forma · Telegram Mini App demo",
  description: "Demo of the course player as a Telegram Mini App. Static content, no API.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function TelegramLayout({ children }: LayoutProps<"/tg">) {
  return (
    <AppRoot appearance="light" className={`forma-theme ${inter.variable}`}>
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col">{children}</div>
    </AppRoot>
  );
}
