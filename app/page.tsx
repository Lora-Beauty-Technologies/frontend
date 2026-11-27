import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { catalogClient } from "@/lib/supabase/catalog";
import { CourseCard } from "./_components/course-card";
import { SiteHeader } from "./_components/site-header";

export default async function HomePage() {
  const { data: courses } = await catalogClient()
    .from("courses")
    .select("id, slug, title, tagline, category, level, lessons(id, duration_seconds)")
    .order("created_at");

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Учитесь в своём темпе</p>
        <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">Один новый урок каждый день.</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">Записывайтесь на сайте, смотрите здесь или в Telegram.</p>
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {(courses ?? []).map((course) => (
            <li key={course.id}>
              <CourseCard title={course.title} tagline={course.tagline} level={course.level}
                lessonCount={course.lessons.length}
                totalSeconds={course.lessons.reduce((sum, l) => sum + l.duration_seconds, 0)}
                footer={
                  <Link href={`/courses/${course.slug}`} className={cn(buttonVariants({ variant: "outline", className: "h-11 w-full px-5 sm:h-10 sm:w-auto" }))}>
                    Подробнее о курсе
                  </Link>
                } />
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}

export const instant = false;
