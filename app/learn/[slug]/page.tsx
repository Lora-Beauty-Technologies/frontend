import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";
import { fetchMyCourses } from "@/lib/backend";
import { formatTotalDuration, formatUnlockDate, lessonsLabel, twoDigits } from "@/lib/format";
import { serverAccessToken } from "@/lib/supabase/session";
import { LessonRow } from "../../_components/lesson-row";
import { SiteHeader } from "../../_components/site-header";
import { UnlockProgress } from "../../_components/unlock-progress";
import { WebLessonPlayer } from "./web-lesson-player";

export default async function LearnPage({ params, searchParams }: PageProps<"/learn/[slug]">) {
  const { slug } = await params;
  const { lesson: lessonParam } = await searchParams;
  const courses = await fetchMyCourses((await serverAccessToken())!);
  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();

  const lessons = course.sections.flatMap((s) => s.lessons);
  const current = lessons.find((l) => l.position === Number(lessonParam) && l.status !== "locked")
    ?? lessons.find((l) => l.status === "latest")
    ?? lessons[0];
  const lessonLabel = `Урок ${twoDigits(current.position)} / ${twoDigits(course.totalLessons)}`;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 pt-4 pb-12 sm:px-6 sm:pt-6">
        <nav aria-label="Навигация" className="flex min-w-0 items-center gap-4 text-sm">
          <Link href="/account" className="-ml-2 flex h-10 shrink-0 items-center gap-2 rounded-md px-2 font-medium hover:bg-muted">
            <ArrowLeft className="size-4" aria-hidden /> Все курсы
          </Link>
          <span className="truncate text-muted-foreground">{course.title}</span>
        </nav>

        <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section>
            <div className="relative overflow-hidden rounded-xl bg-neutral-900">
              {current.status === "locked" ? (
                <div className="flex aspect-video flex-col items-center justify-center gap-2 text-neutral-300">
                  <Lock className="size-6" aria-hidden />
                  Откроется {formatUnlockDate(current.unlocksAt!)}
                </div>
              ) : (
                <WebLessonPlayer lessonId={current.id} title={current.title} />
              )}
              {/* Title over the video on larger screens; pointer-events-none keeps the controls usable. */}
              <div className="pointer-events-none absolute inset-x-0 top-0 hidden bg-gradient-to-b from-black/60 to-transparent p-8 pb-16 text-white sm:block">
                <p className="text-sm font-medium uppercase">{lessonLabel}</p>
                <h1 className="mt-3 text-2xl font-semibold tracking-tight">{current.title}</h1>
              </div>
            </div>
            <div className="mt-4 sm:hidden">
              <p className="text-xs font-medium uppercase text-muted-foreground">{lessonLabel}</p>
              <h1 className="mt-1 text-xl font-semibold tracking-tight">{current.title}</h1>
            </div>
            <p className="mt-3 text-muted-foreground sm:mt-5">{current.description}</p>
          </section>

          <aside aria-labelledby="lessons-heading">
            <h2 id="lessons-heading" className="font-semibold">Уроки курса</h2>
            <p className="mt-1 text-sm text-muted-foreground">{lessonsLabel(course.totalLessons)} · {formatTotalDuration(course.totalDurationSeconds)}</p>
            <div className="mt-3"><UnlockProgress unlocked={course.unlockedLessons} total={course.totalLessons} /></div>
            {course.sections.map((section) => (
              <section key={section.position} className="mt-5">
                <h3 className="px-3 text-xs font-medium uppercase text-muted-foreground">{twoDigits(section.position)} · {section.title}</h3>
                <ol className="mt-1">
                  {section.lessons.map((lesson) => (
                    <li key={lesson.id}>
                      <LessonRow position={lesson.position} title={lesson.title} durationSeconds={lesson.durationSeconds}
                        status={lesson.status} unlocksAt={lesson.unlocksAt} isCurrent={lesson.id === current.id}
                        href={`/learn/${course.slug}?lesson=${lesson.position}`} />
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </aside>
        </div>
      </main>
    </>
  );
}

export const instant = false;
