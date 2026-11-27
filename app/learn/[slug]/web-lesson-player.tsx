"use client";

import { LessonPlayer } from "../../_components/lesson-player";
import { browserAccessToken } from "@/lib/supabase/browser-token";

export function WebLessonPlayer({ lessonId, title }: { lessonId: string; title: string }) {
  return <LessonPlayer lessonId={lessonId} title={title} getAccessToken={browserAccessToken} />;
}
