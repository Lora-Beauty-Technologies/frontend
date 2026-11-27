"use client";

import { useEffect, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { backendFetch, type PlaybackToken } from "@/lib/backend";

type Props = {
  lessonId: string;
  title: string;
  /** Returns a current Supabase access token (web cookie session or Mini App session). */
  getAccessToken: () => Promise<string | null>;
};

/** Fetches a signed playback token for the lesson and plays it with Mux Player. */
export function LessonPlayer({ lessonId, title, getAccessToken }: Props) {
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
    <div className="flex aspect-video w-full items-center justify-center bg-[#4a5160] text-white">
      {playback ? (
        <MuxPlayer
          className="h-full w-full"
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
