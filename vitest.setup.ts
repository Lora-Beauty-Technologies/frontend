import { createElement, type ComponentProps } from "react";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(cleanup);

type StaticImage = string | { src: string };
type ImageProps = Pick<ComponentProps<"img">, "alt" | "className" | "width" | "height"> & {
  src: StaticImage;
};

const toSrc = (src: StaticImage) => (typeof src === "string" ? src : src.src);

// next/image needs the Next.js image pipeline; tests only care about the rendered <img>.
vi.mock("next/image", () => ({
  default: ({ src, alt, className }: ImageProps) => createElement("img", { src: toSrc(src), alt, className }),
  getImageProps: ({ src, alt, width, height }: ImageProps) => ({
    props: { src: toSrc(src), srcSet: undefined, alt, width, height },
  }),
}));
