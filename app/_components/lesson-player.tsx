"use client";

import { useEffect, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { backendFetch, type PlaybackToken } from "@/lib/backend";

type Props = {
  lessonId: string;
  title: string;
  /** Returns a current Supabase access token (web cookie session or Mini App session). */
  getAccessToken: () => Promise<string | null>;
  /** Fill the parent (cropping the video) instead of a 16:9 box. */
  fill?: boolean;
};

/** Fetches a signed playback token for the lesson and plays it with Mux Player. */
export function LessonPlayer({ lessonId, title, getAccessToken, fill = false }: Props) {
  const [playback, setPlayback] = useState<PlaybackToken | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;
    setPlayback(null);
    setError(null);
    (async () => {
      try {
        const accessToken = (await getAccessToken()) ?? undefined;
        const token = await backendFetch<PlaybackToken>(`/api/lessons/${lessonId}/playback-token`, { accessToken, body: {} });
        if (isCurrent) setPlayback(token);
      } catch (e) {
        if (isCurrent) setError((e as Error).message);
      }
    })();
    return () => {
      isCurrent = false;
    };
  }, [lessonId, getAccessToken]);

  return (
    <div className={`flex w-full items-center justify-center bg-[#4a5160] text-white ${fill ? "absolute inset-0" : "aspect-video"}`}>
      {playback ? (
        <MuxPlayer
          className="h-full w-full"
          style={fill ? { "--media-object-fit": "cover" } : undefined}
          playbackId={playback.playbackId}
          tokens={{ playback: playback.token }}
          metadata={{ video_title: title }}
          accentColor="#007AFF"
        />
      ) : (
        <p className="px-6 text-center text-sm">{error ?? "Загружаем видео…"}</p>
      )}
    </div>
  );
}
