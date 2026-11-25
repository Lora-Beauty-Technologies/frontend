import { Typography } from "@telegram-apps/telegram-ui/dist/components/Typography/Typography";

type EyebrowProps = {
  /** Spacing and color utilities. */
  className: string;
  children: string;
};

/** Small uppercase label above a heading. */
export function Eyebrow({ className, children }: EyebrowProps) {
  return (
    <Typography
      Component="p"
      weight="1"
      caps
      plain
      className={`text-[10px] leading-[normal] whitespace-pre ${className}`}
    >
      {children}
    </Typography>
  );
}
