import { Link } from "@tanstack/react-router";
import { useState } from "react";
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

export function AdBanner({
  label = "Advertisement",
  tall = false,
}: {
  label?: string;
  tall?: boolean;
}) {
  return (
    <div
      className={`ad-slot flex w-full items-center justify-center rounded-md text-xs uppercase tracking-widest text-muted-foreground ${tall ? "h-[600px]" : "h-24"}`}
    >
      {label}
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
