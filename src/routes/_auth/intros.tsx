import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getIntrosFn } from "@/server/youtube";
import { IntroCard } from "@/components/IntroCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_auth/intros")({
  loader: async () => {
    return { intros: await getIntrosFn() };
  },
  component: IntrosPage,
});

function IntrosPage() {
  const loaderData = Route.useLoaderData();
  const [intros, setIntros] = useState(loaderData.intros);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);

  function handleDeleted(id: string) {
    setIntros((prev) => prev.filter((intro) => intro.id !== id));
    if (currentlyPlayingId === id) {
      setCurrentlyPlayingId(null);
    }
  }

  if (intros.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center mt-16">
        <p className="text-4xl mb-4">🎵</p>
        <p className="text-gray-300 text-lg font-medium mb-2">
          イントロがまだありません
        </p>
        <p className="text-gray-500 mb-6">
          楽曲を検索してイントロを保存しましょう
        </p>
        <Button asChild className="bg-cyan-500 hover:bg-cyan-600">
          <Link to="/search">
            楽曲を検索する
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">イントロ一覧</h1>
        <Button asChild size="sm" className="bg-cyan-500 hover:bg-cyan-600">
          <Link to="/search">
            + 追加
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {intros.map((intro) => (
          <IntroCard
            key={intro.id}
            intro={intro}
            onPlay={() => setCurrentlyPlayingId(intro.id)}
            onStop={() => setCurrentlyPlayingId(null)}
            onDeleted={() => handleDeleted(intro.id)}
          />
        ))}
      </div>
    </div>
  );
}
