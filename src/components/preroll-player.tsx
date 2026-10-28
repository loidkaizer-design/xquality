import { useEffect, useState } from "react";
import { FOLTYN_BASE } from "@/lib/videos.functions";

const SOCIAL_AD_DOCUMENT = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body { width: 100%; height: 100%; margin: 0; background: transparent; overflow: hidden; }
    </style>
  </head>
  <body>
    <script data-cfasync="false" src="https://brijmohan.org/14/c158b034e52cf31be5b18fc04c625c5b"></script>
  </body>
</html>`;

const SKIP_DELAY_SECONDS = 5;

export function PreRollPlayer({ code, title }: { code: string; title: string }) {
  const [secondsLeft, setSecondsLeft] = useState(SKIP_DELAY_SECONDS);
  const [videoUnlocked, setVideoUnlocked] = useState(false);

  useEffect(() => {
    if (videoUnlocked || secondsLeft === 0) return;

    const timeoutId = window.setTimeout(() => {
      setSecondsLeft((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [secondsLeft, videoUnlocked]);

  return (
    <div className="relative aspect-video overflow-hidden rounded-md bg-[#202124] ring-1 ring-primary/40">
      {videoUnlocked ? (
        <iframe
          src={`${FOLTYN_BASE}/api/e/${encodeURIComponent(code)}`}
          className="absolute inset-0 h-full w-full border-0"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          title={title}
        />
      ) : (
        <>
          <div className="absolute inset-0 z-0 bg-[#202124]" />
          <iframe
            srcDoc={SOCIAL_AD_DOCUMENT}
            title="Adsterra Social Bar"
            sandbox="allow-scripts"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 z-10 h-full w-full border-0 bg-transparent"
          />
          <p className="absolute left-5 top-5 z-20 text-sm font-semibold text-white/70">Ads</p>
          <button
            type="button"
            disabled={secondsLeft > 0}
            onClick={() => setVideoUnlocked(true)}
            className="absolute bottom-4 right-4 z-[2147483647] rounded-xl border-2 border-white bg-black/80 px-5 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-100 sm:px-8 sm:py-4 sm:text-xl"
            aria-label={
              secondsLeft > 0 ? `Skip ad in ${secondsLeft} seconds` : "Skip ad and watch video"
            }
          >
            {secondsLeft > 0 ? `Skip ad in ${secondsLeft}s` : "Skip ad"}
          </button>
        </>
      )}
    </div>
  );
}
