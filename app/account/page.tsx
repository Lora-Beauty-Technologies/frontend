import Link from "next/link";
import { Send } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { fetchMyCourses } from "@/lib/backend";
import { serverAccessToken } from "@/lib/supabase/session";
import { CourseCard } from "../_components/course-card";
import { SiteHeader } from "../_components/site-header";
import { UnlockProgress } from "../_components/unlock-progress";
import { WatchInTelegramButton } from "./watch-in-telegram-button";

export default async function AccountPage() {
  const courses = await fetchMyCourses((await serverAccessToken())!);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Мои курсы</h1>
        <p className="mt-2 text-muted-foreground">Выберите курс и продолжите с того места, где остановились.</p>

        {courses.length === 0 ? (
          <Card className="mt-8 items-start p-6">
            <p className="text-muted-foreground">У вас пока нет курсов.</p>
            <Link href="/" className={cn(buttonVariants({ className: "h-11 px-5" }))}>Перейти в каталог</Link>
          </Card>
        ) : (
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {courses.map((course) => {
              const isStarted = course.unlockedLessons > 1;
              return (
                <li key={course.id}>
                  <CourseCard title={course.title} tagline={course.tagline} lessonCount={course.totalLessons}
                    totalSeconds={course.totalDurationSeconds}
                    footer={
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                        <UnlockProgress unlocked={course.unlockedLessons} total={course.totalLessons} />
                        <Link href={`/learn/${course.slug}`}
                          className={cn(buttonVariants({ variant: isStarted ? "default" : "outline", className: "h-11 w-full px-5 sm:h-10 sm:w-auto" }))}>
                          {isStarted ? "Продолжить курс" : "Начать курс"}
                        </Link>
                      </div>
                    } />
                </li>
              );
            })}
          </ul>
        )}

        {courses.length > 0 ? (
          <Card className="mt-6 flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#2AABEE] text-white">
              <Send className="size-5" aria-hidden />
            </span>
            <div className="flex-1">
              <h2 className="font-semibold">Смотрите в Telegram</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Откроется чат с нашим ботом: нажмите «Запустить», и аккаунт будет привязан. Там же мы сообщим о новых уроках.
              </p>
            </div>
            <WatchInTelegramButton />
          </Card>
        ) : null}
      </main>
    </>
  );
}

/** Per-user page: render on request. */
export const instant = false;
