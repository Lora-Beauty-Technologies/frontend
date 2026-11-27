export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function formatTotalDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return hours > 0 ? `${hours} ч ${minutes} мин` : `${minutes} мин`;
}

export function formatUnlockDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { weekday: "short", day: "numeric", month: "long" });
}

/** Russian plural: plural(5, ["урок", "урока", "уроков"]) → "уроков". */
export function plural(n: number, [one, few, many]: [string, string, string]) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

export const lessonsLabel = (n: number) => `${n} ${plural(n, ["урок", "урока", "уроков"])}`;

export const twoDigits = (n: number) => String(n).padStart(2, "0");
