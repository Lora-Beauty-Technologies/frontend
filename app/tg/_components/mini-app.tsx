"use client";

import { useEffect, useState } from "react";
import type { LessonSummary } from "@/lib/backend";
import { useMiniAppSession } from "../_lib/use-mini-app-session";
import { CourseScreen } from "./course-screen";
import { CoursesDrawer } from "./courses-drawer";
import { LessonScreen } from "./lesson-screen";
import { StatusScreen } from "./status-screen";

const supportBot = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;

export function MiniApp() {
  const { state, getAccessToken } = useMiniAppSession();
  const [courseSlug, setCourseSlug] = useState<string | null>(null);
  const [lesson, setLesson] = useState<LessonSummary | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const webApp = state.kind === "ready" ? state.webApp : null;
  useEffect(() => {
    if (!webApp) return;
    const back = () => setLesson(null);
    if (lesson) {
      webApp.BackButton.show();
      webApp.BackButton.onClick(back);
    } else {
      webApp.BackButton.hide();
    }
    return () => webApp.BackButton.offClick(back);
  }, [webApp, lesson]);

  switch (state.kind) {
    case "loading":
      return <StatusScreen title="Загружаем ваши курсы…" />;
    case "outside-telegram":
      return <StatusScreen title="Откройте в Telegram" message="Эта страница работает внутри приложения Telegram." />;
    case "not-linked":
      return <StatusScreen title="Аккаунт ещё не привязан"
        message="Откройте свой аккаунт на сайте и нажмите «Смотреть в Telegram»." />;
    case "error":
      return <StatusScreen title="Что-то пошло не так" message={state.message} />;
  }

  const { courses } = state;
  if (courses.length === 0) {
    return <StatusScreen title="Курсов пока нет" message="Здесь появятся курсы, на которые вы запишетесь на сайте." />;
  }
  const courseIndex = Math.max(0, courses.findIndex((c) => c.slug === courseSlug));
  const course = courses[courseIndex];

  if (lesson) {
    return (
      // Back is Telegram's own header button (wired above).
      <LessonScreen course={course} lesson={lesson} getAccessToken={getAccessToken} />
    );
  }

  return (
    <>
      <CourseScreen course={course} courseNumber={courseIndex + 1} onOpenLesson={setLesson}
        onOpenCourses={courses.length > 1 ? () => setIsDrawerOpen(true) : undefined} />
      {courses.length > 1 ? (
        <CoursesDrawer isOpen={isDrawerOpen} courses={courses} currentSlug={course.slug}
          onSelect={(slug) => { setCourseSlug(slug); setIsDrawerOpen(false); }}
          onClose={() => setIsDrawerOpen(false)}
          onSupport={supportBot ? () => state.webApp.openTelegramLink(`https://t.me/${supportBot}`) : undefined} />
      ) : null}
    </>
  );
}
