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
      return <StatusScreen title="Loading your courses…" />;
    case "outside-telegram":
      return <StatusScreen title="Open in Telegram" message="This page works inside the Telegram app." />;
    case "not-linked":
      return <StatusScreen title="Your account isn't linked yet"
        message="Open your account on the website and tap Watch in Telegram." />;
    case "error":
      return <StatusScreen title="Something went wrong" message={state.message} />;
  }

  const { courses } = state;
  if (courses.length === 0) {
    return <StatusScreen title="No courses yet" message="Courses you enroll in on the website appear here." />;
  }
  const courseIndex = Math.max(0, courses.findIndex((c) => c.slug === courseSlug));
  const course = courses[courseIndex];

  if (lesson) {
    return (
      <>
        <AppBar webApp={state.webApp} title="Now learning"
          leading={<button onClick={() => setLesson(null)} aria-label="Back to lessons" className="flex"><BackIcon /></button>} />
        <LessonScreen course={course} lesson={lesson} getAccessToken={getAccessToken} />
      </>
    );
  }

  return (
    <>
      <AppBar webApp={state.webApp} title="My classroom"
        leading={<button onClick={() => setIsDrawerOpen(true)} aria-label="Open my courses" className="flex"><MenuIcon /></button>} />
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
