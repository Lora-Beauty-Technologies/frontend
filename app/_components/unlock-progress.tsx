import { lessonsLabel } from "@/lib/format";

/** Thin progress bar of unlocked lessons with a caption (drip unlocks, not watch progress). */
export function UnlockProgress({ unlocked, total }: { unlocked: number; total: number }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="h-1.5 rounded-full bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={unlocked}
        aria-label="Открытые уроки">
        <div className="h-1.5 rounded-full bg-primary" style={{ width: `${(unlocked / total) * 100}%` }} />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">Открыто {unlocked} из {lessonsLabel(total)}</p>
    </div>
  );
}
