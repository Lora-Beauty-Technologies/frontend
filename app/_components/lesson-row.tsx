import Link from "next/link";
import { Check, Lock, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDuration, formatUnlockDate, twoDigits } from "@/lib/format";
import type { LessonStatus } from "@/lib/backend";

type Props = {
  position: number;
  title: string;
  durationSeconds: number;
  /** Omit for catalog rows (no enrollment). */
  status?: LessonStatus;
  unlocksAt?: string;
  isCurrent?: boolean;
  href?: string;
};

/** One lesson in a list: status icon, title, duration and state. Whole row is the tap target. */
export function LessonRow({ position, title, durationSeconds, status, unlocksAt, isCurrent = false, href }: Props) {
  const isLocked = status === "locked";
  const caption = isCurrent ? "Сейчас смотрите" : isLocked ? `Откроется ${formatUnlockDate(unlocksAt!)}` : status === "latest" ? "Новый урок" : null;
  const content = (
    <span className={cn("flex min-h-14 items-center gap-4 rounded-lg px-3 py-2.5", isCurrent && "bg-muted", href && !isCurrent && "hover:bg-muted/60")}>
      <span className={cn("flex w-5 shrink-0 justify-center text-sm", isLocked ? "text-muted-foreground/60" : "text-muted-foreground")} aria-hidden>
        {isCurrent ? <Play className="size-4 fill-current text-foreground" /> : isLocked ? <Lock className="size-4" />
          : status === "unlocked" ? <Check className="size-4" /> : twoDigits(position)}
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("block text-sm font-medium", isLocked && "text-muted-foreground")}>{title}</span>
        <span className="block text-sm text-muted-foreground">
          {formatDuration(durationSeconds)}{caption ? ` · ${caption}` : ""}
        </span>
      </span>
    </span>
  );
  return href && !isLocked ? (
    <Link href={href} aria-current={isCurrent ? "page" : undefined} className="block rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50">{content}</Link>
  ) : content;
}
