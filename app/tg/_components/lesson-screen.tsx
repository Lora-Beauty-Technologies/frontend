import Image from "next/image";
import Link from "next/link";
import { Typography } from "@telegram-apps/telegram-ui/dist/components/Typography/Typography";
import {
  type Course,
  courseHref,
  formatDuration,
  formatLessonNumber,
  lessonHref,
} from "../_data/courses";
import { AppHeader } from "./app-header";
import { Eyebrow } from "./eyebrow";
import { IconLink, LinkButton } from "./tappable-links";
import { VideoPlayer } from "./video-player";
import backIcon from "../_assets/icons/back.svg";
import playIcon from "../_assets/icons/play-small.svg";

type LessonScreenProps = {
  course: Course;
  /** 1-based and known to exist in the course. */
  lessonNumber: number;
};

export function LessonScreen({ course, lessonNumber }: LessonScreenProps) {
  const lesson = course.lessons[lessonNumber - 1];
  const lessonCount = course.lessons.length;
  const isLastLesson = lessonNumber === lessonCount;
  const number = formatLessonNumber(lessonNumber);

  return (
    <>
      <AppHeader
        leading={
          <IconLink href={courseHref(course)} label="Back to lessons">
            <Image src={backIcon} alt="" />
          </IconLink>
        }
      />
      <main className="pb-8 leading-[normal]">
        <Eyebrow className="mx-6 mt-[18px] text-(--forma-accent)">{`${course.title}  /  ${number}`}</Eyebrow>
        <div className="mt-[18px]">
          <VideoPlayer duration={formatDuration(lesson.durationSeconds)} />
        </div>

        <div className="px-6">
          <Eyebrow className="mt-[21px] text-(--forma-muted)">
            {`Lesson ${number} of ${formatLessonNumber(lessonCount)}`}
          </Eyebrow>
          <Typography Component="h1" weight="1" plain className="mt-[11px] text-[24px] leading-[normal]">
            {lesson.title}
          </Typography>
          <p className="mt-[34px] text-[13px] text-(--forma-muted)">{lesson.description}</p>

          <div className="mt-[30px] flex items-baseline justify-between">
            <Typography Component="h2" weight="2" plain className="text-[18px] leading-[normal]">
              In this course
            </Typography>
            <span className="pr-2 text-[11px] text-(--forma-muted)">{lessonCount} lessons</span>
          </div>

          <ol className="mt-3.5 flex flex-col gap-1.5 text-[12px]">
            {course.lessons.map((item, index) => {
              const itemNumber = index + 1;
              const rowNumber = formatLessonNumber(itemNumber);
              return (
                <li key={item.title}>
                  {itemNumber === lessonNumber ? (
                    <div
                      aria-current="page"
                      className="flex h-[45px] items-center rounded-[10px] bg-(--forma-accent-soft) pr-[15px] pl-[13px] font-semibold"
                    >
                      <span className="w-[35px] text-(--forma-accent)">{rowNumber}</span>
                      <span>{item.title}</span>
                      <Image src={playIcon} alt="" className="ml-auto" />
                    </div>
                  ) : (
                    <Link
                      href={lessonHref(course, itemNumber)}
                      className="flex h-[45px] items-center rounded-[10px] bg-(--forma-card) pl-[13px]"
                    >
                      <span className="w-[35px] font-semibold text-(--forma-muted)">{rowNumber}</span>
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>

          <div className="mt-[15px]">
            {isLastLesson ? (
              <LinkButton href={courseHref(course)}>Back to course</LinkButton>
            ) : (
              <LinkButton href={lessonHref(course, lessonNumber + 1)}>Next lesson&nbsp;&nbsp;→</LinkButton>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
