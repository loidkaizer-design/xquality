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

function escapeXml(s: string) {
  return s.replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

// Branded red/black cover used when the video service has no usable preview yet.
function fallbackCover(title: string) {
  const t = escapeXml(title.length > 40 ? title.slice(0, 39) + "…" : title);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0a0a"/><stop offset="1" stop-color="#3a0000"/></linearGradient></defs>
<rect width="640" height="360" fill="url(#g)"/>
<circle cx="320" cy="150" r="48" fill="#dc2626"/>
<path d="M305 125 L345 150 L305 175 Z" fill="#000"/>
<text x="320" y="260" fill="#fff" font-family="Arial, sans-serif" font-size="26" font-weight="700" text-anchor="middle">${t}</text>
</svg>`;
  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=300" },
  });
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
          const r = metadata.result?.[0];
          const title = (r as { title?: string } | undefined)?.title ?? "XQuality";
          const urls = [r?.single_img, r?.thumb_img, r?.splash_img].filter(Boolean) as string[];

          for (const candidate of urls.flatMap(getImageCandidates)) {
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

          return fallbackCover(title);
        } catch (error) {
          console.error(`Thumbnail proxy failed for ${code}`, error);
          return fallbackCover("XQuality");
        }
      },
    },
  },
});
