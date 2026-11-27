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
    throw new ApiError(response.status, problem.type ?? "error", problem.detail ?? "Something went wrong.");
  }
  return response.json();
}

export const fetchMyCourses = (accessToken: string) =>
  backendFetch<{ courses: MyCourse[] }>("/api/me/courses", { accessToken }).then((r) => r.courses);
