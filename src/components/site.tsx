import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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

// Horizontal responsive AdSense unit (1214689877). The provider script is
// loaded once in the root route head; each unit initializes itself after it
// has a non-zero width so units below the fold / late-laid-out still fill.
export function AdBanner() {
  const insRef = useRef<HTMLElement>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const el = insRef.current;
    if (!el || initialized) return;

    const push = () => {
      if (initialized || el.offsetWidth === 0) return;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // AdSense script not ready yet — retry on next resize.
        return;
      }
      setInitialized(true);
    };

    push();
    if (initialized) return;
    const observer = new ResizeObserver(push);
    observer.observe(el);
    return () => observer.disconnect();
  }, [initialized]);

  return (
    <div className="w-full min-w-0" aria-label="Advertisement">
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9476219866943996"
        data-ad-slot="1214689877"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
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
