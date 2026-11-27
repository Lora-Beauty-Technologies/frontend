import type { LessonSummary, MyCourse } from "@/lib/backend";
import { formatDuration, formatTotalDuration, formatUnlockDate, lessonsLabel, twoDigits } from "@/lib/format";
import { ChevronIcon, LockIcon, MenuIcon } from "./icons";

type Props = {
  course: MyCourse;
  courseNumber: number;
  onOpenLesson: (lesson: LessonSummary) => void;
  /** Opens the "My courses" drawer; omitted when there is only one course. */
  onOpenCourses?: () => void;
};

/** "My classroom": course summary, unlock progress and lessons grouped by section. */
export function CourseScreen({ course, courseNumber, onOpenLesson, onOpenCourses }: Props) {
  const lessons = course.sections.flatMap((s) => s.lessons);
  const latest = lessons.find((l) => l.status === "latest");
  const isFirstDay = course.unlockedLessons <= 1;

  return (
    <main className="flex flex-col gap-4 px-5 pt-6 pb-10">
      {onOpenCourses ? (
        <button onClick={onOpenCourses} className="flex items-center gap-2 self-start text-[15px] font-medium text-(--app-accent)">
          <MenuIcon /> Мои курсы
        </button>
      ) : null}
      <div>
        <p className="text-[13px] font-semibold uppercase text-(--app-accent)">
          Курс {twoDigits(courseNumber)} · {course.category}
        </p>
        <h2 className="mt-1.5 text-[28px] font-bold leading-tight">{course.title}</h2>
        <p className="mt-1.5 text-[15px] text-(--app-hint)">{course.tagline}</p>
        <p className="mt-1.5 text-[13px] text-(--app-hint)">
          {lessonsLabel(course.totalLessons)} · {formatTotalDuration(course.totalDurationSeconds)} · {course.level}
        </p>
      </div>

      <section className="rounded-2xl bg-(--app-card) p-4">
        <h3 className="text-[17px] font-semibold">{isFirstDay ? "Начните что-то великое" : "Не сбавляйте темп"}</h3>
        <p className="mt-0.5 text-[15px] text-(--app-hint)">
          Открыто {course.unlockedLessons} из {lessonsLabel(course.totalLessons)}
        </p>
        <div className="mt-2.5 h-1 rounded-full bg-(--app-track)">
          <div className="h-1 rounded-full bg-(--app-button)" style={{ width: `${(course.unlockedLessons / course.totalLessons) * 100}%` }} />
        </div>
        {latest ? (
          <button onClick={() => onOpenLesson(latest)}
            className="mt-4 h-[50px] w-full rounded-xl bg-(--app-button) text-[17px] font-semibold text-(--app-button-text)">
            {isFirstDay ? "Начать" : "Смотреть"} урок {latest.position}
          </button>
        ) : null}
      </section>

      {course.sections.map((section) => (
        <section key={section.position} className="overflow-hidden rounded-2xl bg-(--app-card)">
          <h3 className="px-4 pt-4 pb-2 text-[17px] font-semibold">{twoDigits(section.position)} · {section.title}</h3>
          <ol>
            {section.lessons.map((lesson) => (
              <li key={lesson.id}><LessonCell lesson={lesson} onOpen={() => onOpenLesson(lesson)} /></li>
            ))}
          </ol>
        </section>
      ))}
    </main>
  );
}

function LessonCell({ lesson, onOpen }: { lesson: LessonSummary; onOpen: () => void }) {
  const isLocked = lesson.status === "locked";
  const isLatest = lesson.status === "latest";
  const subtitle = isLocked ? `Откроется ${formatUnlockDate(lesson.unlocksAt!)}` : isLatest ? "Следующий" : "Видеоурок";
  return (
    <button onClick={onOpen} disabled={isLocked}
      className={`flex w-full items-center gap-4 pl-4 text-left ${isLatest ? "bg-(--app-highlight)" : ""} ${isLocked ? "opacity-50" : ""}`}>
      <span className={`w-6 text-[15px] font-semibold ${isLatest ? "text-(--app-accent)" : "text-(--app-hint)"}`}>
        {isLocked ? <LockIcon /> : twoDigits(lesson.position)}
      </span>
      <span className="flex flex-1 items-center border-t border-(--app-separator)/50 py-2.5 pr-4">
        <span className="flex-1">
          <span className="block text-[17px]">{lesson.title}</span>
          <span className="block text-[15px] text-(--app-hint)">{formatDuration(lesson.durationSeconds)} · {subtitle}</span>
        </span>
        {isLocked ? null : <span className="text-(--app-accent)"><ChevronIcon /></span>}
      </span>
    </button>
  );
}
