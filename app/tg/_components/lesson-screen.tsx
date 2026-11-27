import type { LessonSummary, MyCourse } from "@/lib/backend";
import { twoDigits } from "@/lib/format";
import { LessonPlayer } from "../../_components/lesson-player";

type Props = { course: MyCourse; lesson: LessonSummary; getAccessToken: () => Promise<string | null> };

/** "Now learning": lesson title over the Mux player. */
export function LessonScreen({ course, lesson, getAccessToken }: Props) {
  return (
    <main className="flex flex-1 flex-col bg-[#4a5160] text-white">
      <div className="px-7 pt-10 pb-6">
        <p className="text-[13px] font-semibold uppercase">
          Lesson {twoDigits(lesson.position)} of {twoDigits(course.totalLessons)}
        </p>
        <h2 className="mt-3 text-[24px] font-bold">{lesson.title}</h2>
        <p className="mt-2 text-[15px] text-white/70">{lesson.description}</p>
      </div>
      <div className="flex flex-1 items-center">
        <LessonPlayer lessonId={lesson.id} title={lesson.title} getAccessToken={getAccessToken} />
      </div>
    </main>
  );
}
