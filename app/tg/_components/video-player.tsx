import Image from "next/image";
import lessonStill from "../_assets/course-cover.png";
import playLargeIcon from "../_assets/icons/play-large.svg";
import playControlsIcon from "../_assets/icons/play-controls.svg";
import volumeIcon from "../_assets/icons/volume.svg";
import expandIcon from "../_assets/icons/expand.svg";

const DEMO_NOTICE = "Video playback is not part of this demo";

/**
 * Static stand-in for the lesson player. The demo has no video provider, so
 * the controls are shown but disabled.
 */
export function VideoPlayer({ duration }: { duration: string }) {
  return (
    <figure
      aria-label="Lesson video"
      className="relative h-[226px] overflow-hidden bg-(--forma-player-bg)"
      title={DEMO_NOTICE}
    >
      <Image src={lessonStill} alt="" fill preload loading="eager" sizes="(max-width: 480px) 100vw, 480px" className="object-cover" />
      <div className="absolute inset-0 bg-(--forma-player-tint) opacity-[0.22]" />

      <button
        type="button"
        disabled
        aria-label="Play video"
        className="absolute top-[78px] left-1/2 flex size-14 -translate-x-1/2 items-center justify-center rounded-full bg-white"
      >
        <Image src={playLargeIcon} alt="" />
      </button>

      <div className="absolute inset-x-4 bottom-[46px] h-[3px] rounded-[2px] bg-(--forma-player-timeline)">
        <div className="h-full w-[5px] rounded-[2px] bg-(--forma-accent)" />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex h-[46px] items-center bg-(--forma-player-controls) pr-[18px] pl-[17px]">
        <button type="button" disabled aria-label="Play">
          <Image src={playControlsIcon} alt="" />
        </button>
        <span className="ml-[11px] text-[10px] font-medium text-white">0:00 / {duration}</span>
        <button type="button" disabled aria-label="Volume" className="ml-auto">
          <Image src={volumeIcon} alt="" />
        </button>
        <button type="button" disabled aria-label="Full screen" className="ml-[21px]">
          <Image src={expandIcon} alt="" />
        </button>
      </div>
    </figure>
  );
}
