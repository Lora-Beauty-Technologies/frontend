/** Types and fetch helper for the Spring Boot API (see backend openapi.yaml). */

export type LessonStatus = "unlocked" | "latest" | "locked";

export type LessonSummary = {
  id: string;
  position: number;
  title: string;
  description: string;
  durationSeconds: number;
  status: LessonStatus;
  unlocksAt?: string;
};

export type CourseSection = { position: number; title: string; lessons: LessonSummary[] };

export type MyCourse = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  level: string;
  startedAt: string;
  totalLessons: number;
  unlockedLessons: number;
  totalDurationSeconds: number;
  sections: CourseSection[];
};

export type PlaybackToken = { playbackId: string; token: string; expiresAt: string };
export type TelegramLink = { deepLink: string; expiresAt: string };
export type Session = { accessToken: string; refreshToken: string; expiresIn: number };

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

/** Server side calls the backend directly; the browser goes through the /api rewrite. */
export async function backendFetch<T>(
  path: string,
  { accessToken, body }: { accessToken?: string; body?: unknown } = {},
): Promise<T> {
  const base = typeof window === "undefined" ? process.env.BACKEND_URL : "";
  const response = await fetch(`${base}${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  if (!response.ok) {
    const problem = await response.json().catch(() => ({}));
    const code = problem.type ?? "error";
    throw new ApiError(response.status, code, errorMessages[code] ?? "Что-то пошло не так. Попробуйте ещё раз.");
  }
  return response.json();
}

/** Russian texts for the backend's problem codes. */
const errorMessages: Record<string, string> = {
  course_not_found: "Курс не найден.",
  lesson_not_found: "Урок не найден.",
  not_enrolled: "Вы не записаны на этот курс.",
  lesson_locked: "Этот урок ещё не открыт.",
  video_not_ready: "Видео для этого урока ещё не загружено.",
  invalid_init_data: "Не удалось проверить данные Telegram. Откройте приложение заново.",
  not_linked: "Этот аккаунт Telegram ещё не привязан.",
  telegram_already_linked: "Этот аккаунт Telegram уже привязан к другому пользователю.",
  link_token_invalid: "Ссылка устарела или уже использована. Нажмите «Смотреть в Telegram» на сайте ещё раз.",
  no_email: "Аккаунты без email пока не поддерживаются.",
};

export const fetchMyCourses = (accessToken: string) =>
  backendFetch<{ courses: MyCourse[] }>("/api/me/courses", { accessToken }).then((r) => r.courses);
