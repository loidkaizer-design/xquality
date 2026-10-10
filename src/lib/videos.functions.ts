import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";

export type Video = { file_code: string; title: string; thumbnail: string; length: string };

type DoodListFile = {
  file_code: string;
  title: string;
  single_img?: string;
  length?: string;
};

type DoodListResponse = { result?: { files?: DoodListFile[] } };
type DoodStatusResponse = {
  status?: number;
  result?: Array<{ status?: string; filecode?: string }>;
};
type DoodImageResponse = {
  status?: number;
  result?: Array<{ thumb_img?: string; single_img?: string }>;
};

const FOLDER_ID = "1852697"; // "Ace of Spades"

async function doodFetch<T>(
  endpoint: string,
  key: string,
  fileCode?: string,
  extra?: Record<string, string>,
): Promise<T> {
  const params = new URLSearchParams({ key });
  if (fileCode) params.set("file_code", fileCode);
  if (extra) {
    for (const [name, value] of Object.entries(extra)) params.set(name, value);
  }

  const response = await fetch(`https://doodapi.co/api/${endpoint}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`DoodStream ${endpoint} request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

async function getActiveVideo(key: string, file: DoodListFile): Promise<Video | null> {
  try {
    const [status, image] = await Promise.all([
      doodFetch<DoodStatusResponse>("file/check", key, file.file_code),
      doodFetch<DoodImageResponse>("file/image", key, file.file_code),
    ]);

    // Status is intentionally used only to keep inactive files out of the listing;
    // it is not exposed as a video-validity indicator in the UI.
    const isActive = status.status === 200 && status.result?.[0]?.status === "Active";
    if (!isActive) return null;

    const thumbnail =
      image.result?.[0]?.thumb_img ?? image.result?.[0]?.single_img ?? file.single_img;
    if (!thumbnail) return null;

    return {
      file_code: file.file_code,
      title: file.title,
      thumbnail,
      length: file.length ?? "",
    };
  } catch (error) {
    console.error(`Unable to load DoodStream metadata for ${file.file_code}`, error);
    return null;
  }
}

export const getVideos = createServerFn({ method: "GET" }).handler(async (): Promise<Video[]> => {
  const key = process.env["DOOD_API_KEY"];
  if (!key) throw new Error("Missing DOOD_API_KEY");

  const json = await doodFetch<DoodListResponse>("file/list", key, undefined, {
    fld_id: FOLDER_ID,
    per_page: "200",
  });
  const files = json.result?.files ?? [];
  const videos = await Promise.all(files.map((file) => getActiveVideo(key, file)));

  return videos.filter((video): video is Video => video !== null);
});

export const videosQuery = queryOptions({
  queryKey: ["videos"],
  queryFn: () => getVideos(),
  staleTime: 60_000,
});
