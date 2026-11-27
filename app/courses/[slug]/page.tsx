import { notFound } from "next/navigation";
import { catalogClient } from "@/lib/supabase/catalog";
import { formatDuration, formatTotalDuration, lessonsLabel, twoDigits } from "@/lib/format";
import { SiteHeader } from "../../_components/site-header";
import { EnrollButton } from "./enroll-button";

export default async function CoursePage({ params }: PageProps<"/courses/[slug]">) {
  const { slug } = await params;
  const { data: course } = await catalogClient()
    .from("courses")
    .select("id, slug, title, tagline, category, level, course_sections(position, title, lessons(position, title, description, duration_seconds))")
    .eq("slug", slug)
    .maybeSingle();
  if (!course) notFound();

  const sections = [...course.course_sections].sort((a, b) => a.position - b.position);
  const lessons = sections.flatMap((s) => s.lessons);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-6 py-12">
        <p className="text-sm font-semibold uppercase text-blue-600">{course.category}</p>
        <h1 className="mt-1 text-3xl font-bold">{course.title}</h1>
        <p className="mt-2 text-gray-600">{course.tagline}</p>
        <p className="mt-2 text-sm text-gray-500">
          {lessonsLabel(lessons.length)} · {formatTotalDuration(lessons.reduce((sum, l) => sum + l.duration_seconds, 0))} · {course.level} · каждый день открывается новый урок
        </p>
        <div className="mt-8"><EnrollButton courseId={course.id} slug={course.slug} /></div>
        {sections.map((section) => (
          <section key={section.position} className="mt-10">
            <h2 className="font-semibold">{twoDigits(section.position)} · {section.title}</h2>
            <ol className="mt-3 divide-y rounded-2xl border bg-white">
              {[...section.lessons].sort((a, b) => a.position - b.position).map((lesson) => (
                <li key={lesson.position} className="flex gap-4 px-5 py-4">
                  <span className="w-6 text-sm font-semibold text-gray-400">{twoDigits(lesson.position)}</span>
                  <div>
                    <p className="font-medium">{lesson.title}</p>
                    <p className="text-sm text-gray-500">{formatDuration(lesson.duration_seconds)} · {lesson.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </main>
    </>
  );
}

export const instant = false;
