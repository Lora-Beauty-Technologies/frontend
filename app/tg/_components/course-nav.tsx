"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconButton } from "@telegram-apps/telegram-ui/dist/components/Blocks/IconButton/IconButton";
import { Typography } from "@telegram-apps/telegram-ui/dist/components/Typography/Typography";
import { AppHeader } from "./app-header";
import { Eyebrow } from "./eyebrow";
import courseCover from "../_assets/course-cover.png";
import menuIcon from "../_assets/icons/menu.svg";
import closeIcon from "../_assets/icons/close.svg";
import bookIcon from "../_assets/icons/book.svg";
import awardIcon from "../_assets/icons/award.svg";

/** Only what the drawer renders crosses the server/client boundary. */
export type CourseNavItem = {
  href: string;
  title: string;
  summary: string;
  callToAction: string;
  isCurrent: boolean;
};

type CourseNavProps = {
  items: readonly CourseNavItem[];
};

export function CourseNav({ items }: CourseNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <>
      <IconButton
        mode="plain"
        size="m"
        aria-label="Open course navigation"
        aria-expanded={isOpen}
        className="forma-icon-button"
        onClick={() => setIsOpen(true)}
      >
        <Image src={menuIcon} alt="" />
      </IconButton>
      {isOpen ? <CourseNavDrawer items={items} onClose={close} /> : null}
    </>
  );
}

type CourseNavDrawerProps = CourseNavProps & {
  onClose: () => void;
};

function CourseNavDrawer({ items, onClose }: CourseNavDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onEscape = useEffectEvent(onClose);

  useEffect(() => {
    closeButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onEscape();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Course navigation"
      className="fixed inset-y-0 left-1/2 z-10 flex w-full max-w-[480px] -translate-x-1/2 flex-col bg-(--forma-surface)"
    >
      <AppHeader
        leading={
          <IconButton
            ref={closeButtonRef}
            mode="plain"
            size="m"
            aria-label="Close course navigation"
            className="forma-icon-button"
            onClick={onClose}
          >
            <Image src={closeIcon} alt="" />
          </IconButton>
        }
      />
      <div className="flex min-h-0 flex-1">
        <nav aria-label="My courses" className="flex-1 overflow-y-auto px-6 pb-6 leading-[normal]">
          <Eyebrow className="mt-[18px] text-(--forma-accent)">Make room for growth</Eyebrow>
          <Typography Component="h2" weight="1" plain className="mt-[13px] text-[28px] leading-[normal]">
            My courses
          </Typography>
          <p className="mt-2 text-[14px] text-(--forma-muted)">A little progress, every day.</p>

          <ul className="mt-8 flex flex-col gap-4">
            {items.map((item) => (
              <li key={item.href}>
                <CourseCard item={item} onSelect={onClose} />
              </li>
            ))}
          </ul>

          <hr className="mt-[43px] border-(--forma-track)" />
          <Eyebrow className="mt-[26px] text-(--forma-muted)">Your learning</Eyebrow>
          <ul className="mt-[28px] flex flex-col gap-[31px]">
            <li className="flex items-center gap-4 pl-0.5" aria-current="page">
              <Image src={bookIcon} alt="" />
              <span className="text-[15px] font-semibold text-(--forma-accent)">My courses</span>
            </li>
            <li className="flex items-start gap-4 pl-0.5">
              <Image src={awardIcon} alt="" />
              <span className="pt-[3px]">
                <span className="block text-[15px] font-medium text-(--forma-muted)">Certificates</span>
                <span className="mt-[7px] block text-[11px] text-(--forma-muted)">
                  Complete a course to earn one
                </span>
              </span>
            </li>
          </ul>

          <div className="mt-[35px] rounded-xl bg-(--forma-card) px-4 py-[11px]">
            <p className="text-[12px] font-semibold">Small steps. Real skills.</p>
            <p className="mt-1 text-[11px] text-(--forma-muted)">Your next chapter starts here.</p>
          </div>
        </nav>
        <div aria-hidden="true" className="w-5 shrink-0 bg-(--forma-sidebar-edge)" onClick={onClose} />
      </div>
    </div>
  );
}

function CourseCard({ item, onSelect }: { item: CourseNavItem; onSelect: () => void }) {
  return (
    <Link
      href={item.href}
      onClick={onSelect}
      aria-current={item.isCurrent ? "page" : undefined}
      className={`flex h-[108px] items-center gap-3.5 rounded-2xl px-3 ${
        item.isCurrent ? "bg-(--forma-accent-soft)" : "bg-(--forma-card)"
      }`}
    >
      <Image
        src={courseCover}
        alt=""
        sizes="70px"
        className="h-20 w-[70px] shrink-0 rounded-[10px] object-cover"
      />
      <span className="flex flex-col">
        <span className="text-[15px] font-semibold">{item.title}</span>
        <span className="mt-[9px] text-[11px] text-(--forma-muted)">{item.summary}</span>
        <span className="mt-[11px] text-[12px] font-semibold text-(--forma-accent)">
          {item.callToAction}&nbsp;&nbsp;→
        </span>
      </span>
    </Link>
  );
}
