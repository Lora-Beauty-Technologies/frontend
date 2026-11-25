import { describe, expect, it } from "vitest";
import { generateStaticParams as courseParams } from "./[courseSlug]/page";
import { generateStaticParams as lessonParams } from "./[courseSlug]/lessons/[lessonNumber]/page";

describe("static params", () => {
  it("prerenders every demo course", () => {
    expect(courseParams()).toEqual([
      { courseSlug: "design-foundations" },
      { courseSlug: "interface-design" },
    ]);
  });

  it("prerenders every lesson of every course", () => {
    const params = lessonParams();
    expect(params).toHaveLength(6);
    expect(params[0]).toEqual({ courseSlug: "design-foundations", lessonNumber: "1" });
    expect(params[5]).toEqual({ courseSlug: "interface-design", lessonNumber: "3" });
  });
});
