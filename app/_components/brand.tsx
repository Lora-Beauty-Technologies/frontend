import Link from "next/link";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

/** Forma Academy logo: dark tile with an open book, plus the name. */
export function Brand({ inverted = false, className }: { inverted?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 font-semibold", className)}>
      <span className={cn("flex size-7 items-center justify-center rounded-md", inverted ? "bg-white text-neutral-900" : "bg-neutral-900 text-white")}>
        <BookOpen className="size-4" aria-hidden />
      </span>
      Forma Academy
    </Link>
  );
}
