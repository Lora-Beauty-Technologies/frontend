import type { Metadata, Viewport } from "next";
import "./miniapp.css";

export const metadata: Metadata = {
  title: "My classroom",
  description: "Access your purchased courses.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function MiniAppLayout({ children }: LayoutProps<"/tg">) {
  return (
    <div className="miniapp">
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col">{children}</div>
    </div>
  );
}
