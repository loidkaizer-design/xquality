import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";

export type Video = { file_code: string; title: string; single_img: string; length: string };

const FOLDER_ID = "1852697"; // "Ace of Spades"

export const getVideos = createServerFn({ method: "GET" }).handler(async (): Promise<Video[]> => {
  const key = process.env.DOOD_API_KEY;
  if (!key) throw new Error("Missing DOOD_API_KEY");
  const res = await fetch(
    `https://doodapi.co/api/file/list?key=${key}&fld_id=${FOLDER_ID}&per_page=200`,
  );
  const json = (await res.json()) as { result?: { files?: Video[] } };
  return (json.result?.files ?? []).map((f) => ({
    file_code: f.file_code,
    title: f.title,
    single_img: f.single_img,
    length: f.length,
  }));
});

export const videosQuery = queryOptions({
  queryKey: ["videos"],
  queryFn: () => getVideos(),
  staleTime: 60_000,
});
