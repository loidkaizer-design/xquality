import { Link } from "@tanstack/react-router";
import { useEffect, useId, useState } from "react";
import { Play } from "lucide-react";
import type { Video } from "@/lib/videos.functions";
import logoUrl from "@/assets/logo.png";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4">
        <Link to="/" aria-label="XQuality home" className="flex items-center">
          <img src={logoUrl} alt="XQuality" className="h-8 w-auto" />
        </Link>
      </div>
    </header>
  );
}

declare global {
  interface Window {
    ytrgt?: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}

export function AdBanner({
  label = "Advertisement",
  tall = false,
}: {
  label?: string;
  tall?: boolean;
}) {
  const reactId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const slotId = `ytrgt-bf1d9519394a4c8685049a6b0d846ba4-${reactId}`;
  const idRef = { current: slotId };

  useEffect(() => {
    const w = window;
    if (!w.ytrgt) {
      w.ytrgt = Object.assign(
        (...args: unknown[]) => {
          (w.ytrgt!.q = w.ytrgt!.q || []).push(args);
        },
        { q: [] as unknown[] },
      );
      const js = document.createElement("script");
      js.async = true;
      js.src = "https://static.servestatic.net/js/ytrgt.js";
      document.head.appendChild(js);
    }
    const hide = () => {
      const s = document.getElementById(idRef.current);
      if (s) s.style.display = "none";
    };
    w.ytrgt("hb:on", `#${idRef.current}`, "hb:nobid", hide);
    w.ytrgt("hb:on", `#${idRef.current}`, "hb:error", hide);
    w.ytrgt("hb:load", `#${idRef.current}`, {
      endpoint: "https://collect.rtb.events/hb",
      publisherId: "bf1d9519394a4c8685049a6b0d846ba4",
      sizes: tall ? [[300, 600]] : [[300, 250], [728, 90], [320, 50]],
      tmax: 1000,
      showAdMark: true,
    });
  }, [tall]);

  return (
    <div
      className={`ad-slot flex w-full items-center justify-center rounded-md text-xs uppercase tracking-widest text-muted-foreground ${tall ? "min-h-[600px]" : "min-h-24"}`}
    >
      <div id={idRef.current} className="flex w-full items-center justify-center">
        {label}
      </div>
    </div>
  );
}

export function OutstreamAd({ onDone }: { onDone?: () => void }) {
  const reactId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const slotId = `ytrgt-5e52ee5d29cf4fa58094a944be696373-${reactId}`;
  const idRef = { current: slotId };

  useEffect(() => {
    const w = window;
    if (!w.ytrgt) {
      w.ytrgt = Object.assign(
        (...args: unknown[]) => {
          (w.ytrgt!.q = w.ytrgt!.q || []).push(args);
        },
        { q: [] as unknown[] },
      );
      const js = document.createElement("script");
      js.async = true;
      js.src = "https://static.servestatic.net/js/ytrgt.js";
      document.head.appendChild(js);
    }
    const finish = () => onDone?.();
    w.ytrgt("hb:on", `#${idRef.current}`, "hb:nobid", finish);
    w.ytrgt("hb:on", `#${idRef.current}`, "hb:error", finish);
    w.ytrgt("hb:on", `#${idRef.current}`, "hb:complete", finish);
    w.ytrgt("hb:on", `#${idRef.current}`, "hb:skip", finish);
    w.ytrgt("hb:load", `#${idRef.current}`, {
      endpoint: "https://collect.rtb.events/hb",
      publisherId: "5e52ee5d29cf4fa58094a944be696373",
      video: { mimes: ["video/mp4"], protocols: [2, 3, 5, 6] },
      videoOptions: { muted: "auto", skipDelay: 5, replay: false },
      tmax: 3000,
      showAdMark: true,
    });
    // Safety net: if the ad never reports an end, show the video anyway.
    const timer = setTimeout(finish, 30000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="ad-slot flex w-full items-center justify-center rounded-md text-xs uppercase tracking-widest text-muted-foreground">
      <div id={idRef.current} className="flex w-full items-center justify-center">
        Video advertisement
      </div>
    </div>
  );
}

export function VideoCard({ v }: { v: Video }) {
  const [failed, setFailed] = useState(false);
  return (
    <Link to="/watch/$code" params={{ code: v.file_code }} className="group block">
      <div className="aspect-video overflow-hidden rounded-md bg-card ring-1 ring-border transition group-hover:ring-primary">
        {failed ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-card to-background">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
              <Play className="h-5 w-5 fill-current" />
            </span>
            <span className="px-3 text-center text-xs text-muted-foreground">
              Preview processing…
            </span>
          </div>
        ) : (
          <img
            src={v.thumbnail}
            alt={v.title}
            loading="lazy"
            onError={() => setFailed(true)}
            className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <h3 className="mt-2 line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary">
        {v.title}
      </h3>
    </Link>
  );
}
