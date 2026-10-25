import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";

// Foltyn CDN — the site's own video host (see Foltyn CDN API docs).
export const FOLTYN_BASE = "https://v0-foltyn-cdn.vercel.app";

export type Video = { file_code: string; title: string; thumbnail: string; length: string };

type FoltynListVideo = {
  id: string;
  title?: string;
  filename?: string;
  uploaded?: string;
  status?: string;
};

// Hand-picked thumbnails keyed by video ID — never replaced by automation.
const THUMB_OVERRIDES: Record<string, string> = {
  x3cq6njcp5yu: "https://imgds.net/splash/ccarsm7xsqnuoa9g.jpg",
};

function displayTitle(v: FoltynListVideo) {
  const raw = v.title ?? v.filename ?? "Untitled";
  return raw.replace(/\.(mp4|mkv|mov|webm|avi)$/i, "");
}

export const getVideos = createServerFn({ method: "GET" }).handler(async (): Promise<Video[]> => {
  const response = await fetch(`${FOLTYN_BASE}/api/videos`, {
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    throw new Error(`Foltyn CDN list request failed with ${response.status}`);
  }

  const list = (await response.json()) as FoltynListVideo[];
  return list
    .filter((v) => v.id && (!v.status || v.status === "Ready"))
    .map((v) => ({
      file_code: v.id,
      title: displayTitle(v),
      thumbnail: THUMB_OVERRIDES[v.id] ?? `${FOLTYN_BASE}/api/thumbnail/${v.id}`,
      length: "",
    }));
});

export const videosQuery = queryOptions({
  queryKey: ["videos"],
  queryFn: () => getVideos(),
  staleTime: 60_000,
});
