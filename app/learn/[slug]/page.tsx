import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchMyCourses } from "@/lib/backend";
import { formatDuration, formatUnlockDate, twoDigits } from "@/lib/format";
import { serverAccessToken } from "@/lib/supabase/session";
import { SiteHeader } from "../../_components/site-header";
import { WebLessonPlayer } from "./web-lesson-player";

export default async function LearnPage({ params, searchParams }: PageProps<"/learn/[slug]">) {
  const { slug } = await params;
  const { lesson: lessonParam } = await searchParams;
  const courses = await fetchMyCourses((await serverAccessToken())!);
  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();

  const lessons = course.sections.flatMap((s) => s.lessons);
  const current = lessons.find((l) => l.position === Number(lessonParam))
    ?? lessons.find((l) => l.status === "latest")
    ?? lessons[0];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-6 py-8">
        <Link href="/account" className="text-sm text-blue-600">← My courses</Link>
        <p className="mt-4 text-xs font-semibold uppercase text-blue-600">
          {course.category} · Lesson {twoDigits(current.position)} of {twoDigits(course.totalLessons)}
        </p>
        <h1 className="mt-1 text-2xl font-bold">{current.title}</h1>
        <div className="mt-4 overflow-hidden rounded-2xl">
          {current.status === "locked" ? (
            <div className="flex aspect-video items-center justify-center bg-gray-200 text-gray-600">
              Unlocks on {formatUnlockDate(current.unlocksAt!)}
            </div>
          ) : (
            <WebLessonPlayer lessonId={current.id} title={current.title} />
          )}
        </div>
        <p className="mt-3 text-gray-600">{current.description}</p>

        {course.sections.map((section) => (
          <section key={section.position} className="mt-8">
            <h2 className="font-semibold">{twoDigits(section.position)} · {section.title}</h2>
            <ol className="mt-3 divide-y rounded-2xl border bg-white">
              {section.lessons.map((lesson) => {
                const row = (
                  <div className="flex gap-4 px-5 py-4">
                    <span className="w-6 text-sm font-semibold text-gray-400">{twoDigits(lesson.position)}</span>
                    <div>
                      <p className="font-medium">{lesson.title}</p>
                      <p className="text-sm text-gray-500">
                        {formatDuration(lesson.durationSeconds)} ·{" "}
                        {lesson.status === "locked" ? `Unlocks ${formatUnlockDate(lesson.unlocksAt!)}` : lesson.status === "latest" ? "Up next" : "Video lesson"}
                      </p>
                    </div>
                  </div>
                );
                return (
                  <li key={lesson.id} className={lesson.id === current.id ? "bg-blue-50" : lesson.status === "locked" ? "opacity-50" : ""}>
                    {lesson.status === "locked" ? row : <Link href={`/learn/${course.slug}?lesson=${lesson.position}`}>{row}</Link>}
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </main>
    </>
  );
}

export const instant = false;
