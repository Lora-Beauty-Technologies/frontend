import type { ReactNode } from "react";
import { getImageProps } from "next/image";
import { Avatar } from "@telegram-apps/telegram-ui/dist/components/Blocks/Avatar/Avatar";
import { Typography } from "@telegram-apps/telegram-ui/dist/components/Typography/Typography";
import profilePhoto from "../_assets/profile-photo.png";

const AVATAR_SIZE = 40;

// Optimized via the Next.js image loader once per module, not per render.
const { props: avatarImage } = getImageProps({
  src: profilePhoto,
  alt: "Your profile",
  width: AVATAR_SIZE,
  height: AVATAR_SIZE,
});

type AppHeaderProps = {
  /** Icon button on the left: menu, back or close. */
  leading: ReactNode;
};

export function AppHeader({ leading }: AppHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center bg-(--forma-card) pr-5 pl-4">
      {leading}
      <Typography
        Component="span"
        weight="1"
        plain
        className="ml-3 text-[23px] leading-[normal] text-(--forma-ink)"
      >
        forma
      </Typography>
      <Avatar
        size={AVATAR_SIZE}
        src={avatarImage.src}
        srcSet={avatarImage.srcSet}
        alt={avatarImage.alt}
        className="forma-avatar ml-auto"
      />
    </header>
  );
}
