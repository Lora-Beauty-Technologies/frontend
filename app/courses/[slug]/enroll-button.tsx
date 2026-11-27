"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { backendFetch } from "@/lib/backend";
import { browserAccessToken } from "@/lib/supabase/browser-token";

export function EnrollButton({ courseId, slug }: { courseId: string; slug: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  async function enroll() {
    const accessToken = await browserAccessToken();
    if (!accessToken) {
      router.push(`/login?next=/courses/${slug}`);
      return;
    }
    setIsBusy(true);
    try {
      await backendFetch("/api/enrollments", { accessToken, body: { courseId } });
      router.push(`/learn/${slug}`);
    } catch (e) {
      setError((e as Error).message);
      setIsBusy(false);
    }
  }

  return (
    <div>
      <button onClick={enroll} disabled={isBusy}
        className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-60">
        {isBusy ? "Enrolling…" : "Enroll for free (demo)"}
      </button>
      {error ? <p role="alert" className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
