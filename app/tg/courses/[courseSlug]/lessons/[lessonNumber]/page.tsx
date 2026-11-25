import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonScreen } from "../../../../_components/lesson-screen";
import { courses, findCourse, findLesson, parseLessonNumber } from "../../../../_data/courses";

type Props = PageProps<"/tg/courses/[courseSlug]/lessons/[lessonNumber]">;

export function generateStaticParams() {
  return courses.flatMap((course) =>
    course.lessons.map((_, index) => ({
      courseSlug: course.slug,
      lessonNumber: String(index + 1),
    })),
  );
}

async function resolveLesson(params: Props["params"]) {
  const { courseSlug, lessonNumber } = await params;
  const course = findCourse(courseSlug);
  const number = parseLessonNumber(lessonNumber);
  const lesson = course ? findLesson(course, number) : undefined;
  return course && lesson ? { course, lesson, number } : undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await resolveLesson(params);
  return { title: resolved ? `${resolved.lesson.title} · Forma` : "Forma" };
}

export default function LessonPage({ params }: Props) {
  // Params are URL data: read them inside Suspense so navigation stays instant.
  return (
    <Suspense>
      <LessonContent params={params} />
    </Suspense>
  );
}

async function LessonContent({ params }: Pick<Props, "params">) {
  const resolved = await resolveLesson(params);
  if (!resolved) notFound();

  return <LessonScreen course={resolved.course} lessonNumber={resolved.number} />;
}
