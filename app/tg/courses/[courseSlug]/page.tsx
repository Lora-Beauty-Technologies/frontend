import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseScreen } from "../../_components/course-screen";
import { courses, findCourse } from "../../_data/courses";

type Props = PageProps<"/tg/courses/[courseSlug]">;

export function generateStaticParams() {
  return courses.map((course) => ({ courseSlug: course.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = findCourse((await params).courseSlug);
  return { title: course ? `${course.title} · Forma` : "Forma" };
}

export default function CoursePage({ params }: Props) {
  // Params are URL data: read them inside Suspense so navigation stays instant.
  return (
    <Suspense>
      <CourseContent params={params} />
    </Suspense>
  );
}

async function CourseContent({ params }: Pick<Props, "params">) {
  const course = findCourse((await params).courseSlug);
  if (!course) notFound();

  return <CourseScreen course={course} />;
}
