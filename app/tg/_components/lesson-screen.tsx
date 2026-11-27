import type { LessonSummary, MyCourse } from "@/lib/backend";
import { twoDigits } from "@/lib/format";
import { LessonPlayer } from "../../_components/lesson-player";

type Props = { course: MyCourse; lesson: LessonSummary; getAccessToken: () => Promise<string | null> };

/** "Now learning": lesson title over the Mux player. */
export function LessonScreen({ course, lesson, getAccessToken }: Props) {
  return (
    <main className="relative flex-1 bg-[#4a5160] text-white">
      <LessonPlayer lessonId={lesson.id} title={lesson.title} getAccessToken={getAccessToken} fill />
      {/* Overlay; pointer-events-none keeps the player's own controls usable underneath. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/60 to-transparent px-7 pt-10 pb-16">
        <p className="text-[13px] font-semibold uppercase">
          Урок {twoDigits(lesson.position)} из {twoDigits(course.totalLessons)}
        </p>
        <h2 className="mt-3 text-[24px] font-bold">{lesson.title}</h2>
        <p className="mt-2 text-[15px] text-white/80">{lesson.description}</p>
      </div>
    </main>
  );
}
