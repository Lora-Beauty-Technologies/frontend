import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderInApp } from "../_test/render";
import { LessonScreen } from "./lesson-screen";
import { courses } from "../_data/courses";

const [designFoundations] = courses;

describe("LessonScreen", () => {
  it("shows the lesson with its position in the course", () => {
    renderInApp(<LessonScreen course={designFoundations} lessonNumber={2} />);

    expect(screen.getByText("Design foundations / 02")).toBeDefined();
    expect(screen.getByText("Lesson 02 of 03")).toBeDefined();
    expect(screen.getByRole("heading", { level: 1, name: "Seeing like a designer" })).toBeDefined();
    expect(screen.getByText("0:00 / 18:32")).toBeDefined();
  });

  it("links back to the course", () => {
    renderInApp(<LessonScreen course={designFoundations} lessonNumber={2} />);

    expect(screen.getByRole("link", { name: "Back to lessons" }).getAttribute("href")).toBe(
      "/tg/courses/design-foundations",
    );
  });

  it("highlights the current lesson and links the others", () => {
    renderInApp(<LessonScreen course={designFoundations} lessonNumber={2} />);

    const rows = within(screen.getByRole("list")).getAllByRole("listitem");
    const current = rows[1].firstElementChild;
    expect(current?.getAttribute("aria-current")).toBe("page");
    expect(current?.tagName).not.toBe("A");
    expect(within(rows[0]).getByRole("link").getAttribute("href")).toBe("/tg/courses/design-foundations/lessons/1");
    expect(within(rows[2]).getByRole("link").getAttribute("href")).toBe("/tg/courses/design-foundations/lessons/3");
  });

  it("offers the next lesson", () => {
    renderInApp(<LessonScreen course={designFoundations} lessonNumber={2} />);

    expect(screen.getByRole("link", { name: /Next lesson/ }).getAttribute("href")).toBe(
      "/tg/courses/design-foundations/lessons/3",
    );
  });

  it("returns to the course after the last lesson", () => {
    renderInApp(<LessonScreen course={designFoundations} lessonNumber={3} />);

    expect(screen.queryByRole("link", { name: /Next lesson/ })).toBeNull();
    expect(screen.getByRole("link", { name: "Back to course" }).getAttribute("href")).toBe(
      "/tg/courses/design-foundations",
    );
  });

  it("shows the video controls as unavailable in the demo", () => {
    renderInApp(<LessonScreen course={designFoundations} lessonNumber={1} />);

    const player = screen.getByRole("figure", { name: "Lesson video" });
    const controls = within(player).getAllByRole("button");
    expect(controls).toHaveLength(4);
    expect(controls.every((button) => button.hasAttribute("disabled"))).toBe(true);
  });
});
