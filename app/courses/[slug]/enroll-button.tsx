"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
      <Button onClick={enroll} disabled={isBusy} className="h-11 w-full">
        {isBusy ? "Записываем…" : "Записаться бесплатно"}
      </Button>
      {error ? <p role="alert" className="mt-2 text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
