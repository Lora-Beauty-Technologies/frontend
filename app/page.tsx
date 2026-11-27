import Link from "next/link";
import { catalogClient } from "@/lib/supabase/catalog";
import { formatTotalDuration } from "@/lib/format";
import { SiteHeader } from "./_components/site-header";

export default async function HomePage() {
  const { data: courses } = await catalogClient()
    .from("courses")
    .select("id, slug, title, tagline, category, level, lessons(id, duration_seconds)")
    .order("created_at");

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Learn at your pace</p>
        <h1 className="mt-2 text-3xl font-bold">One new lesson every day.</h1>
        <p className="mt-2 text-gray-600">Enroll on the website, watch here or in Telegram.</p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {(courses ?? []).map((course) => (
            <li key={course.id}>
              <Link href={`/courses/${course.slug}`} className="block rounded-2xl border bg-white p-6 hover:border-blue-400">
                <p className="text-xs font-semibold uppercase text-blue-600">{course.category}</p>
                <h2 className="mt-1 text-xl font-semibold">{course.title}</h2>
                <p className="mt-1 text-sm text-gray-600">{course.tagline}</p>
                <p className="mt-4 text-xs text-gray-500">
                  {course.lessons.length} lessons · {formatTotalDuration(course.lessons.reduce((sum, l) => sum + l.duration_seconds, 0))} · {course.level}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}

export const instant = false;
