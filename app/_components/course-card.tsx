import type { ReactNode } from "react";
import { BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatTotalDuration, lessonsLabel } from "@/lib/format";

type Props = {
  title: string;
  tagline: string;
  lessonCount: number;
  totalSeconds: number;
  level?: string;
  /** Progress row and action, e.g. unlock bar + button. */
  footer: ReactNode;
};

export function CourseCard({ title, tagline, lessonCount, totalSeconds, level, footer }: Props) {
  return (
    <Card className="flex h-full flex-col gap-0 p-5 sm:p-6">
      <span className="flex size-9 items-center justify-center rounded-md bg-muted">
        <BookOpen className="size-4" aria-hidden />
      </span>
      <h2 className="mt-5 text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{tagline}</p>
      <p className="mt-4 text-sm text-muted-foreground">
        {lessonsLabel(lessonCount)} · {formatTotalDuration(totalSeconds)}{level ? ` · ${level}` : ""}
      </p>
      <div className="mt-auto pt-5">{footer}</div>
    </Card>
  );
}
