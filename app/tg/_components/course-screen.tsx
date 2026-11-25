import Image from "next/image";
import Link from "next/link";
import { Progress } from "@telegram-apps/telegram-ui/dist/components/Feedback/Progress/Progress";
import { Typography } from "@telegram-apps/telegram-ui/dist/components/Typography/Typography";
import {
  type Course,
  type LessonStatus,
  courseHref,
  courses,
  formatDuration,
  formatLessonNumber,
  lessonHref,
  lessonStatus,
  progressPercent,
  totalMinutes,
} from "../_data/courses";
import { AppHeader } from "./app-header";
import { CourseNav, type CourseNavItem } from "./course-nav";
import { Eyebrow } from "./eyebrow";
import courseCover from "../_assets/course-cover.png";
import checkIcon from "../_assets/icons/check.svg";
import playIcon from "../_assets/icons/play-thumb.svg";

export function CourseScreen({ course }: { course: Course }) {
  const lessonCount = course.lessons.length;
  const percent = progressPercent(course);

  return (
    <>
      <AppHeader leading={<CourseNav items={courseNavItems(course)} />} />
      <main className="px-6 pb-8 leading-[normal]">
        <Eyebrow className="mt-[15px] text-(--forma-accent)">Your classroom</Eyebrow>
        <Typography Component="h1" weight="1" plain className="mt-[11px] text-[28px] leading-[normal]">
          {course.title}
        </Typography>
        <p className="mt-1.5 text-[13px] text-(--forma-muted)">{course.tagline}</p>

        <div className="relative mt-[18px] h-[152px] overflow-hidden rounded-[18px]">
          <Image
            src={courseCover}
            alt=""
            fill
            preload
            loading="eager"
            sizes="(max-width: 480px) 100vw, 432px"
            className="object-cover"
          />
          <span className="absolute top-3 left-3.5 rounded-[7px] bg-(--forma-card) px-[9px] py-[7px] text-[10px] font-semibold">
            {lessonCount} lessons • {totalMinutes(course)} min
          </span>
        </div>

        <div className="mt-[18px] flex justify-between text-[12px]">
          <span className="font-medium text-(--forma-muted)">
            {course.completedLessons > 0
              ? `${course.completedLessons} of ${lessonCount} lessons complete`
              : "Ready for your first lesson?"}
          </span>
          <span className="font-semibold text-(--forma-accent)">{percent}%</span>
        </div>
        <Progress value={percent} aria-label="Course progress" className="forma-progress mt-[10px]" />

        <div className="mt-[26px] flex items-baseline justify-between">
          <Typography Component="h2" weight="2" plain className="text-[19px] leading-[normal]">
            Course lessons
          </Typography>
          <span className="text-[12px] text-(--forma-muted)">{lessonCount} videos</span>
        </div>

        <ol className="mt-[18px] flex flex-col gap-3">
          {course.lessons.map((lesson, index) => {
            const lessonNumber = index + 1;
            return (
              <li key={lesson.title}>
                <LessonCard
                  href={lessonHref(course, lessonNumber)}
                  lessonNumber={lessonNumber}
                  title={lesson.title}
                  duration={formatDuration(lesson.durationSeconds)}
                  status={lessonStatus(course, lessonNumber)}
                />
              </li>
            );
          })}
        </ol>
      </main>
    </>
  );
}

function courseNavItems(currentCourse: Course): CourseNavItem[] {
  return courses.map((course) => {
    const hasStarted = course.completedLessons > 0;
    return {
      href: courseHref(course),
      title: course.title,
      summary: hasStarted
        ? `${course.completedLessons} of ${course.lessons.length} lessons complete`
        : `${course.lessons.length} lessons · ${totalMinutes(course)} min`,
      callToAction: hasStarted ? "Continue learning" : "Start learning",
      isCurrent: course.slug === currentCourse.slug,
    };
  });
}

const STATUS_STYLES: Record<LessonStatus, { label: string; labelColor: string; card: string }> = {
  completed: {
    label: "Completed",
    labelColor: "text-(--forma-success)",
    card: "bg-(--forma-card) border-transparent",
  },
  "up-next": {
    label: "Up next",
    labelColor: "text-(--forma-accent)",
    card: "bg-(--forma-accent-soft) border-(--forma-accent-border)",
  },
  locked: {
    label: "Lesson",
    labelColor: "text-(--forma-muted)",
    card: "bg-(--forma-card) border-transparent",
  },
};

type LessonCardProps = {
  href: string;
  lessonNumber: number;
  title: string;
  duration: string;
  status: LessonStatus;
};

function LessonCard({ href, lessonNumber, title, duration, status }: LessonCardProps) {
  const styles = STATUS_STYLES[status];
  const isCompleted = status === "completed";

  return (
    <Link
      href={href}
      className={`flex h-[84px] items-center gap-3.5 rounded-[14px] border px-[9px] ${styles.card}`}
    >
      <span className="relative h-16 w-[76px] shrink-0 overflow-hidden rounded-[9px]">
        <Image src={courseCover} alt="" fill sizes="76px" className="object-cover" />
        <span
          className={`absolute top-1/2 left-1/2 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${
            isCompleted ? "bg-(--forma-success)" : "bg-(--forma-accent)"
          }`}
        >
          <Image src={isCompleted ? checkIcon : playIcon} alt="" />
        </span>
      </span>
      <span className="flex flex-col">
        <span className={`text-[9px] font-bold whitespace-pre uppercase ${styles.labelColor}`}>
          {`${formatLessonNumber(lessonNumber)}  ${styles.label}`}
        </span>
        <span className="mt-1.5 text-[13px] font-semibold">{title}</span>
        <span className="mt-2 text-[11px] text-(--forma-muted)">{duration} min</span>
      </span>
    </Link>
  );
}
