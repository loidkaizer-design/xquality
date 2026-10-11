import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { videosQuery } from "@/lib/videos.functions";
import { AdBanner, Header, VideoCard } from "@/components/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "XQuality — Watch Videos" },
      { name: "description", content: "Watch the latest videos on XQuality." },
      { property: "og:title", content: "XQuality — Watch Videos" },
      { property: "og:description", content: "Watch the latest videos on XQuality." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(videosQuery),
  component: Index,
});

function Index() {
  const { data } = useSuspenseQuery(videosQuery);
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <AdBanner />
        <div className="mt-6 flex gap-6">
          <section className="flex-1">
            <h1 className="font-display mb-4 text-3xl tracking-wide">Latest Videos</h1>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((v) => <VideoCard key={v.file_code} v={v} />)}
            </div>
            {data.length === 0 && <p className="text-muted-foreground">No videos yet.</p>}
          </section>
        </div>
        <div className="mt-8"><AdBanner /></div>
      </main>
    </div>
  );
}
