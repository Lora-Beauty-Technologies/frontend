"use client";

import { useEffect, useState } from "react";
import type { LessonSummary } from "@/lib/backend";
import { useMiniAppSession } from "../_lib/use-mini-app-session";
import { AppBar } from "./app-bar";
import { CourseScreen } from "./course-screen";
import { CoursesDrawer } from "./courses-drawer";
import { BackIcon, MenuIcon } from "./icons";
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
      <>
        <AppBar webApp={state.webApp} title="Сейчас изучаем"
          leading={<button onClick={() => setLesson(null)} aria-label="Назад к урокам" className="flex"><BackIcon /></button>} />
        <LessonScreen course={course} lesson={lesson} getAccessToken={getAccessToken} />
      </>
    );
  }

  return (
    <>
      <AppBar webApp={state.webApp} title="Мой класс"
        leading={<button onClick={() => setIsDrawerOpen(true)} aria-label="Открыть мои курсы" className="flex"><MenuIcon /></button>} />
      <CourseScreen course={course} courseNumber={courseIndex + 1} onOpenLesson={setLesson} />
      {isDrawerOpen ? (
        <CoursesDrawer courses={courses} currentSlug={course.slug}
          onSelect={(slug) => { setCourseSlug(slug); setIsDrawerOpen(false); }}
          onClose={() => setIsDrawerOpen(false)}
          onSupport={supportBot ? () => state.webApp.openTelegramLink(`https://t.me/${supportBot}`) : undefined} />
      ) : null}
    </>
  );
}
