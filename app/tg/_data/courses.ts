/**
 * Static demo content for the Telegram Mini App demo under /tg.
 * There is no API integration: everything the demo shows comes from here.
 */

export type Lesson = {
  title: string;
  description: string;
  durationSeconds: number;
};

export type Course = {
  slug: string;
  title: string;
  tagline: string;
  completedLessons: number;
  lessons: readonly Lesson[];
};

export type LessonStatus = "completed" | "up-next" | "locked";

export const courses: readonly Course[] = [
  {
    slug: "design-foundations",
    title: "Design foundations",
    tagline: "Build your eye. Find your creative voice.",
    completedLessons: 1,
    lessons: [
      {
        title: "Welcome to the course",
        description:
          "A fresh perspective starts here. Meet your course and discover what you’ll create.",
        durationSeconds: 12 * 60 + 4,
      },
      {
        title: "Seeing like a designer",
        description:
          "Learn to notice balance, contrast and rhythm in the design all around you.",
        durationSeconds: 18 * 60 + 32,
      },
      {
        title: "Your first moodboard",
        description:
          "Collect visual inspiration and bring your ideas together in a clear creative direction.",
        durationSeconds: 16 * 60 + 10,
      },
    ],
  },
  {
    slug: "interface-design",
    title: "Interface design",
    tagline: "Turn good ideas into great interfaces.",
    completedLessons: 0,
    lessons: [
      {
        title: "Designing with grids",
        description:
          "Create structure and balance with a flexible grid for your next interface.",
        durationSeconds: 14 * 60 + 20,
      },
      {
        title: "Type that works",
        description:
          "Make confident typography choices with a simple, readable type scale.",
        durationSeconds: 16 * 60 + 45,
      },
      {
        title: "Building your first screen",
        description:
          "Bring layout, type and hierarchy together in your first polished interface.",
        durationSeconds: 22 * 60 + 10,
      },
    ],
  },
];

const coursesBySlug = new Map(courses.map((course) => [course.slug, course]));

export function findCourse(slug: string): Course | undefined {
  return coursesBySlug.get(slug);
}

/** Lesson numbers in URLs and UI are 1-based. */
export function findLesson(course: Course, lessonNumber: number): Lesson | undefined {
  return Number.isInteger(lessonNumber) ? course.lessons[lessonNumber - 1] : undefined;
}

export function parseLessonNumber(value: string): number {
  return /^\d+$/.test(value) ? Number(value) : Number.NaN;
}

export function lessonStatus(course: Course, lessonNumber: number): LessonStatus {
  if (lessonNumber <= course.completedLessons) return "completed";
  if (lessonNumber === course.completedLessons + 1) return "up-next";
  return "locked";
}

export function progressPercent(course: Course): number {
  return Math.round((course.completedLessons / course.lessons.length) * 100);
}

export function totalMinutes(course: Course): number {
  const seconds = course.lessons.reduce((sum, lesson) => sum + lesson.durationSeconds, 0);
  return Math.floor(seconds / 60);
}

/** 724 → "12:04" */
export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/** 7 → "07" */
export function formatLessonNumber(lessonNumber: number): string {
  return String(lessonNumber).padStart(2, "0");
}

export function courseHref(course: Course): string {
  return `/tg/courses/${course.slug}`;
}

export function lessonHref(course: Course, lessonNumber: number): string {
  return `${courseHref(course)}/lessons/${lessonNumber}`;
}
