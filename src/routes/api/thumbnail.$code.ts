import { createFileRoute } from "@tanstack/react-router";
import { FOLTYN_BASE } from "@/lib/videos.functions";

function isValidVideoId(code: string) {
  return /^\d{1,12}$/.test(code);
}

function escapeXml(s: string) {
  return s.replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

// Branded red/black cover used when the CDN has no thumbnail for a video yet.
function fallbackCover() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0a0a"/><stop offset="1" stop-color="#3a0000"/></linearGradient></defs>
<rect width="640" height="360" fill="url(#g)"/>
<circle cx="320" cy="150" r="48" fill="#dc2626"/>
<path d="M305 125 L345 150 L305 175 Z" fill="#000"/>
<text x="320" y="260" fill="#fff" font-family="Arial, sans-serif" font-size="26" font-weight="700" text-anchor="middle">XQuality</text>
</svg>`;
  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=300" },
  });
}

// Proxies the Foltyn CDN thumbnail so missing thumbnails fall back to the
// branded cover instead of a broken image.
export const Route = createFileRoute("/api/thumbnail/$code")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const code = params.code;
        if (!code || !isValidVideoId(code))
          return new Response("Invalid video ID", { status: 400 });

        try {
          const upstream = await fetch(`${FOLTYN_BASE}/api/thumbnail/${code}`, {
            signal: AbortSignal.timeout(10_000),
          });

          const contentType = upstream.headers.get("content-type") ?? "";
          if (!upstream.ok || !contentType.startsWith("image/")) {
            return fallbackCover();
          }

          return new Response(upstream.body, {
            headers: {
              "Cache-Control": "public, max-age=86400, s-maxage=31536000",
              "Content-Type": contentType,
              "X-Content-Type-Options": "nosniff",
            },
          });
        } catch (error) {
          console.error(`Thumbnail proxy failed for ${code}`, error);
          return fallbackCover();
        }
      },
    },
  },
});
