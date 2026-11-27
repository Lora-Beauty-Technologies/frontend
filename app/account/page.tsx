import Link from "next/link";
import { fetchMyCourses } from "@/lib/backend";
import { lessonsLabel } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { serverAccessToken } from "@/lib/supabase/session";
import { signOut } from "../auth-actions";
import { SiteHeader } from "../_components/site-header";
import { WatchInTelegramButton } from "./watch-in-telegram-button";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims?.email as string | undefined;
  const courses = await fetchMyCourses((await serverAccessToken())!);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Мои курсы</h1>
            <p className="text-sm text-gray-500">Вы вошли как {email}</p>
          </div>
          <form action={signOut}>
            <button type="submit" className="text-sm text-blue-600">Выйти</button>
          </form>
        </div>

        {courses.length === 0 ? (
          <p className="text-gray-600">
            Курсов пока нет. <Link href="/" className="text-blue-600">Перейти в каталог</Link>.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {courses.map((course) => (
              <li key={course.id}>
                <Link href={`/learn/${course.slug}`} className="block rounded-2xl border bg-white p-6 hover:border-blue-400">
                  <p className="text-xs font-semibold uppercase text-blue-600">{course.category}</p>
                  <h2 className="mt-1 text-xl font-semibold">{course.title}</h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Открыто {course.unlockedLessons} из {lessonsLabel(course.totalLessons)}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-blue-600">Продолжить обучение →</p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {courses.length > 0 ? (
          <section className="rounded-2xl border bg-white p-6">
            <h2 className="font-semibold">Смотрите на телефоне</h2>
            <p className="mt-1 mb-4 text-sm text-gray-600">
              Откроется чат с нашим ботом: нажмите «Запустить», и ваш аккаунт будет привязан. В этом чате мы будем сообщать о новых уроках.
            </p>
            <WatchInTelegramButton />
          </section>
        ) : null}
      </main>
    </>
  );
}

/** Per-user page: render on request. */
export const instant = false;
