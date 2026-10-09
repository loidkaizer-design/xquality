import { Link } from "@tanstack/react-router";
import type { Video } from "@/lib/videos.functions";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4">
        <Link to="/" className="font-display text-2xl tracking-wider text-foreground">
          <span className="text-primary">X</span>QUALITY
        </Link>
      </div>
    </header>
  );
}

export function AdBanner({ label = "Advertisement", tall = false }: { label?: string; tall?: boolean }) {
  return (
    <div
      className={`ad-slot flex w-full items-center justify-center rounded-md text-xs uppercase tracking-widest text-muted-foreground ${tall ? "h-[600px]" : "h-24"}`}
    >
      {label}
    </div>
  );
}

export function VideoCard({ v }: { v: Video }) {
  return (
    <Link to="/watch/$code" params={{ code: v.file_code }} className="group block">
      <div className="aspect-video overflow-hidden rounded-md bg-card ring-1 ring-border transition group-hover:ring-primary">
        <img src={v.single_img} alt={v.title} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
      </div>
      <h3 className="mt-2 line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary">{v.title}</h3>
    </Link>
  );
}
