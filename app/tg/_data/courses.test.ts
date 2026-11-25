import { describe, expect, it } from "vitest";
import {
  type Course,
  courseHref,
  courses,
  findCourse,
  findLesson,
  formatDuration,
  formatLessonNumber,
  lessonHref,
  lessonStatus,
  parseLessonNumber,
  progressPercent,
  totalMinutes,
} from "./courses";

const lesson = (title: string, durationSeconds: number) => ({ title, description: "", durationSeconds });

const course: Course = {
  slug: "test-course",
  title: "Test course",
  tagline: "",
  completedLessons: 1,
  lessons: [lesson("One", 60), lesson("Two", 90), lesson("Three", 59)],
};

describe("findCourse", () => {
  it("returns the course with the given slug", () => {
    expect(findCourse("interface-design")?.title).toBe("Interface design");
  });

  it("returns undefined for an unknown slug", () => {
    expect(findCourse("nope")).toBeUndefined();
  });
});

describe("findLesson", () => {
  it("uses 1-based lesson numbers", () => {
    expect(findLesson(course, 1)?.title).toBe("One");
    expect(findLesson(course, 3)?.title).toBe("Three");
  });

  it.each([0, 4, 1.5, Number.NaN])("returns undefined for %s", (lessonNumber) => {
    expect(findLesson(course, lessonNumber)).toBeUndefined();
  });
});

describe("parseLessonNumber", () => {
  it("parses digit-only strings", () => {
    expect(parseLessonNumber("2")).toBe(2);
  });

  it.each(["", "1.0", "-1", "2abc", " 2"])("rejects %j", (value) => {
    expect(parseLessonNumber(value)).toBeNaN();
  });
});

describe("lessonStatus", () => {
  it("marks finished lessons completed, the following one up next, and the rest locked", () => {
    expect([1, 2, 3].map((n) => lessonStatus(course, n))).toEqual(["completed", "up-next", "locked"]);
  });

  it("puts the first lesson up next when nothing is completed", () => {
    expect(lessonStatus({ ...course, completedLessons: 0 }, 1)).toBe("up-next");
  });
});

describe("progressPercent", () => {
  it("rounds to a whole percentage", () => {
    expect(progressPercent(course)).toBe(33);
    expect(progressPercent({ ...course, completedLessons: 0 })).toBe(0);
    expect(progressPercent({ ...course, completedLessons: 3 })).toBe(100);
  });
});

describe("totalMinutes", () => {
  it("sums lesson durations and rounds down to whole minutes", () => {
    expect(totalMinutes(course)).toBe(3); // 209 seconds
  });

  it("matches the demo course lengths shown in the design", () => {
    expect(courses.map(totalMinutes)).toEqual([46, 53]);
  });
});

describe("formatting", () => {
  it("formats durations as m:ss", () => {
    expect(formatDuration(724)).toBe("12:04");
    expect(formatDuration(59)).toBe("0:59");
  });

  it("pads lesson numbers to two digits", () => {
    expect(formatLessonNumber(3)).toBe("03");
    expect(formatLessonNumber(12)).toBe("12");
  });
});

describe("hrefs", () => {
  it("builds course and lesson paths under /tg", () => {
    expect(courseHref(course)).toBe("/tg/courses/test-course");
    expect(lessonHref(course, 2)).toBe("/tg/courses/test-course/lessons/2");
  });
});
