import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { catalogClient } from "@/lib/supabase/catalog";
import { formatTotalDuration, lessonsLabel, twoDigits } from "@/lib/format";
import { LessonRow } from "../../_components/lesson-row";
import { SiteHeader } from "../../_components/site-header";
import { EnrollButton } from "./enroll-button";

export default async function CoursePage({ params }: PageProps<"/courses/[slug]">) {
  const { slug } = await params;
  const { data: course } = await catalogClient()
    .from("courses")
    .select("id, slug, title, tagline, category, level, course_sections(position, title, lessons(position, title, duration_seconds))")
    .eq("slug", slug)
    .maybeSingle();
  if (!course) notFound();

  const sections = [...course.course_sections].sort((a, b) => a.position - b.position);
  const lessons = sections.flatMap((s) => s.lessons);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 pt-4 pb-28 sm:px-6 sm:pt-6 lg:pb-16">
        <Link href="/" className="-ml-2 inline-flex h-10 items-center gap-2 rounded-md px-2 text-sm font-medium hover:bg-muted">
          <ArrowLeft className="size-4" aria-hidden /> Каталог
        </Link>
        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">{course.category}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{course.title}</h1>
            <p className="mt-3 text-lg text-muted-foreground">{course.tagline}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              {lessonsLabel(lessons.length)} · {formatTotalDuration(lessons.reduce((sum, l) => sum + l.duration_seconds, 0))} · {course.level}
            </p>

            <h2 className="mt-10 font-semibold">Программа курса</h2>
            {sections.map((section) => (
              <section key={section.position} className="mt-4">
                <h3 className="px-3 text-xs font-medium uppercase text-muted-foreground">{twoDigits(section.position)} · {section.title}</h3>
                <ol className="mt-1">
                  {[...section.lessons].sort((a, b) => a.position - b.position).map((lesson) => (
                    <li key={lesson.position}>
                      <LessonRow position={lesson.position} title={lesson.title} durationSeconds={lesson.duration_seconds} />
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>

          {/* Desktop: sticky side card. Mobile: fixed bottom bar so the action is always in reach. */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card className="hidden gap-4 p-6 lg:flex">
              <p className="font-semibold">Бесплатно в демо-режиме</p>
              <p className="text-sm text-muted-foreground">Первый урок откроется сразу, затем — по одному новому уроку каждый день.</p>
              <EnrollButton courseId={course.id} slug={course.slug} />
            </Card>
            <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
              <EnrollButton courseId={course.id} slug={course.slug} />
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

export const instant = false;
