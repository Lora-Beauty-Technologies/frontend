"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@telegram-apps/telegram-ui/dist/components/Blocks/Button/Button";
import { IconButton } from "@telegram-apps/telegram-ui/dist/components/Blocks/IconButton/IconButton";
import type { IconButtonProps } from "@telegram-apps/telegram-ui/dist/components/Blocks/IconButton/IconButton";

/*
 * TelegramUI renders its tappable elements through a `Component` prop. Passing
 * next/link there keeps client-side navigation; it has to happen in a client
 * module because a component cannot be serialized from the server.
 */

type LinkButtonProps = {
  href: string;
  children: ReactNode;
};

export function LinkButton({ href, children }: LinkButtonProps) {
  return (
    <Button
      Component={Link}
      href={href}
      mode="filled"
      size="m"
      stretched
      className="forma-link-button"
    >
      {children}
    </Button>
  );
}

type IconLinkProps = {
  href: string;
  label: string;
  children: ReactNode;
};

/** IconButton's types only allow <button>, but it forwards `Component` to its Tappable root. */
type IconButtonAsLinkProps = IconButtonProps & { Component: typeof Link; href: string };

export function IconLink({ href, label, children }: IconLinkProps) {
  const props = { Component: Link, href, mode: "plain", size: "m" } as IconButtonAsLinkProps;
  return (
    <IconButton {...props} aria-label={label} className="forma-icon-button">
      {children}
    </IconButton>
  );
}
