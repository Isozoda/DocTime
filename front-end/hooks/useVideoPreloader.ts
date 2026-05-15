"use client";

import { useState, useEffect } from "react";

export interface VideoPreloaderState {
  blobUrl: string | null;
  progress: number;
  isReady: boolean;
}

/**
 * Fetches a video file as a ReadableStream, tracks byte-level progress,
 * and resolves to a blob:// URL for smooth random-access seeking.
 *
 * Falls back to the original src string if fetch fails (e.g., CORS, offline).
 */
export function useVideoPreloader(src: string): VideoPreloaderState {
  const [state, setState] = useState<VideoPreloaderState>({
    blobUrl: null,
    progress: 0,
    isReady: false,
  });

  useEffect(() => {
    if (!src) return;
    let cancelled = false;

    // Hint the browser's preload scanner before JS fetch begins
    const preloadLink = document.createElement("link");
    preloadLink.rel = "preload";
    preloadLink.as = "video";
    preloadLink.href = src;
    preloadLink.setAttribute("type", "video/mp4");
    document.head.appendChild(preloadLink);

    const load = async () => {
      try {
        const res = await fetch(src, { cache: "force-cache" });
        if (!res.ok || !res.body) throw new Error("fetch failed");

        const total = parseInt(res.headers.get("content-length") ?? "0", 10);
        const reader = res.body.getReader();
        const chunks: Uint8Array<ArrayBuffer>[] = [];
        let received = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (cancelled) { reader.cancel(); return; }
          if (done) break;
          chunks.push(value);
          received += value.length;
          // Cap at 97 so the jump to 100 on completion is visible
          const pct = total > 0
            ? Math.min(97, Math.round((received / total) * 100))
            : Math.min(90, Math.round(received / 65536)); // fallback: ~64 KB steps
          setState(s => ({ ...s, progress: pct }));
        }

        if (cancelled) return;

        const blob = new Blob(chunks, { type: "video/mp4" });
        const blobUrl = URL.createObjectURL(blob);
        setState({ blobUrl, progress: 100, isReady: true });
      } catch {
        // Graceful degradation: direct src still works, just no smooth seeking
        if (!cancelled) setState({ blobUrl: src, progress: 100, isReady: true });
      }
    };

    load();

    return () => {
      cancelled = true;
      if (document.head.contains(preloadLink)) document.head.removeChild(preloadLink);
    };
  }, [src]);

  // Free memory when the component unmounts or src changes
  useEffect(() => {
    const url = state.blobUrl;
    return () => {
      if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
    };
  }, [state.blobUrl]);

  return state;
}
