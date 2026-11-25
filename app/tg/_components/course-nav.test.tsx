import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderInApp } from "../_test/render";
import userEvent from "@testing-library/user-event";
import { CourseNav, type CourseNavItem } from "./course-nav";

const items: CourseNavItem[] = [
  {
    href: "/tg/courses/a",
    title: "Course A",
    summary: "1 of 3 lessons complete",
    callToAction: "Continue learning",
    isCurrent: true,
  },
  {
    href: "/tg/courses/b",
    title: "Course B",
    summary: "3 lessons · 53 min",
    callToAction: "Start learning",
    isCurrent: false,
  },
];

async function openDrawer() {
  const user = userEvent.setup();
  renderInApp(<CourseNav items={items} />);
  await user.click(screen.getByRole("button", { name: "Open course navigation" }));
  return { user, dialog: screen.getByRole("dialog", { name: "Course navigation" }) };
}

describe("CourseNav", () => {
  it("starts closed", () => {
    renderInApp(<CourseNav items={items} />);

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("button", { name: "Open course navigation" }).getAttribute("aria-expanded")).toBe(
      "false",
    );
  });

  it("opens a drawer listing the courses and marks the current one", async () => {
    const { dialog } = await openDrawer();

    const links = within(dialog).getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual(["/tg/courses/a", "/tg/courses/b"]);
    expect(links.map((link) => link.getAttribute("aria-current"))).toEqual(["page", null]);
    expect(within(links[1]).getByText("Start learning", { exact: false })).toBeDefined();
  });

  it("moves focus to the close button when opened", async () => {
    await openDrawer();

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Close course navigation" }));
  });

  it("closes with the close button", async () => {
    const { user } = await openDrawer();

    await user.click(screen.getByRole("button", { name: "Close course navigation" }));

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes with Escape", async () => {
    const { user } = await openDrawer();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes when a course is chosen", async () => {
    const { user, dialog } = await openDrawer();
    // jsdom cannot follow the link; only the drawer behaviour matters here.
    dialog.addEventListener("click", (event) => event.preventDefault());

    await user.click(within(dialog).getByRole("link", { name: /Course B/ }));

    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
