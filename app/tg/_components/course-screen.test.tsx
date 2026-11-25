import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderInApp } from "../_test/render";
import { CourseScreen } from "./course-screen";
import { courses } from "../_data/courses";

const [designFoundations, interfaceDesign] = courses;

describe("CourseScreen", () => {
  it("shows the course summary and progress", () => {
    renderInApp(<CourseScreen course={designFoundations} />);

    expect(screen.getByRole("heading", { level: 1, name: "Design foundations" })).toBeDefined();
    expect(screen.getByText("3 lessons • 46 min")).toBeDefined();
    expect(screen.getByText("1 of 3 lessons complete")).toBeDefined();
    expect(screen.getByText("33%")).toBeDefined();
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("33");
  });

  it("links every lesson card to its lesson page with its status", () => {
    renderInApp(<CourseScreen course={designFoundations} />);

    const cards = within(screen.getByRole("list")).getAllByRole("link");
    expect(cards.map((card) => card.getAttribute("href"))).toEqual([
      "/tg/courses/design-foundations/lessons/1",
      "/tg/courses/design-foundations/lessons/2",
      "/tg/courses/design-foundations/lessons/3",
    ]);
    expect(cards.map((card) => card.textContent)).toEqual([
      "01  CompletedWelcome to the course12:04 min",
      "02  Up nextSeeing like a designer18:32 min",
      "03  LessonYour first moodboard16:10 min",
    ]);
  });

  it("invites the learner to start a course without progress", () => {
    renderInApp(<CourseScreen course={interfaceDesign} />);

    expect(screen.getByText("Ready for your first lesson?")).toBeDefined();
    expect(screen.getByText("0%")).toBeDefined();
  });
});
