import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { videosQuery, FOLTYN_BASE } from "@/lib/videos.functions";
import { AdBanner, Header, VideoCard } from "@/components/site";

export const Route = createFileRoute("/watch/$code")({
  head: () => ({
    meta: [
      { title: "Watch — XQuality" },
      { name: "description", content: "Watch this video on XQuality." },
      { property: "og:title", content: "Watch — XQuality" },
      { property: "og:description", content: "Watch this video on XQuality." },
      { property: "og:type", content: "video.other" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(videosQuery),
  component: Watch,
});

function Watch() {
  const { code } = Route.useParams();
  const { data } = useSuspenseQuery(videosQuery);
  const video = data.find((v) => v.file_code === code);
  const others = data.filter((v) => v.file_code !== code);
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <section className="min-w-0 flex-1">
            {/* Top of the video */}
            <AdBanner />
            <div className="mt-4 aspect-video overflow-hidden rounded-md bg-card ring-1 ring-primary/40">
              <iframe src={`${FOLTYN_BASE}/api/e/${code}`} className="h-full w-full" allowFullScreen allow="autoplay; fullscreen; picture-in-picture" title={video?.title ?? "Video"} />
            </div>
            <h1 className="mt-4 text-xl font-semibold">{video?.title ?? "Video"}</h1>
            <div className="mt-6"><AdBanner /></div>
          </section>
          <aside className="w-full shrink-0 lg:w-[340px]">
            <div className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
              <h2 className="font-display mb-3 text-xl tracking-wide text-primary">Up Next</h2>
              <div className="flex flex-col gap-4">
                {others.map((v) => <VideoCard key={v.file_code} v={v} />)}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
