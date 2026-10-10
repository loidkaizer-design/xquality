import { createFileRoute } from "@tanstack/react-router";

type DoodImageResponse = {
  status?: number;
  result?: Array<{
    thumb_img?: string;
    single_img?: string;
    splash_img?: string;
  }>;
};

function isValidFileCode(code: string) {
  return /^[a-z0-9]+$/i.test(code);
}

function getImageCandidates(url: string) {
  const candidates = [url];
  if (url.includes("imgds.net")) {
    candidates.push(url.replace("imgds.net", "img.doodcdn.io"));
  } else if (url.includes("img.doodcdn.io")) {
    candidates.push(url.replace("img.doodcdn.io", "imgds.net"));
  }
  return [...new Set(candidates)];
}

export const Route = createFileRoute("/api/thumbnail/$code")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const code = params.code;
        const key = process.env["DOOD_API_KEY"];
        if (!key) return new Response("Missing DOOD_API_KEY", { status: 500 });
        if (!code || !isValidFileCode(code))
          return new Response("Invalid file code", { status: 400 });

        const apiUrl = new URL("https://doodapi.co/api/file/image");
        apiUrl.searchParams.set("key", key);
        apiUrl.searchParams.set("file_code", code);

        try {
          const metadataResponse = await fetch(apiUrl, { signal: AbortSignal.timeout(10_000) });
          if (!metadataResponse.ok) {
            return new Response("Unable to load thumbnail metadata", { status: 502 });
          }

          const metadata = (await metadataResponse.json()) as DoodImageResponse;
          const imageUrl = metadata.result?.[0]?.single_img ?? metadata.result?.[0]?.thumb_img;
          if (!imageUrl) return new Response("Thumbnail not found", { status: 404 });

          for (const candidate of getImageCandidates(imageUrl)) {
            try {
              const imageResponse = await fetch(candidate, {
                signal: AbortSignal.timeout(8_000),
                headers: {
                  Accept: "image/avif,image/webp,image/apng,image/jpeg,image/*,*/*;q=0.8",
                  Referer: "https://doodstream.com/",
                  "User-Agent": "Mozilla/5.0 XQuality thumbnail proxy",
                },
              });
              const contentType = imageResponse.headers.get("content-type") ?? "";
              if (!imageResponse.ok || !contentType.startsWith("image/")) continue;

              return new Response(imageResponse.body, {
                headers: {
                  "Cache-Control": "public, max-age=3600, s-maxage=86400",
                  "Content-Type": contentType,
                  "X-Content-Type-Options": "nosniff",
                },
              });
            } catch (error) {
              console.warn(`Thumbnail candidate failed for ${code}`, error);
            }
          }

          return new Response("Thumbnail image unavailable", { status: 502 });
        } catch (error) {
          console.error(`Thumbnail proxy failed for ${code}`, error);
          return new Response("Thumbnail proxy failed", { status: 502 });
        }
      },
    },
  },
});
