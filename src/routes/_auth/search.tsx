import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { searchVideosFn } from "@/server/youtube";
import type { YouTubeVideo } from "@/lib/youtube";
import { VideoSearchResult } from "@/components/TrackSearchResult";
import { SaveIntroDialog } from "@/components/SaveIntroDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_auth/search")({
  component: SearchPage,
});

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<YouTubeVideo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    setError(null);
    try {
      const videos = await searchVideosFn({ data: query.trim() });
      setResults(videos);
      if (videos.length === 0) {
        setError(
          "動画が見つかりませんでした。別のキーワードで試してください。",
        );
      }
    } catch {
      setError("検索に失敗しました。もう一度お試しください。");
    } finally {
      setIsSearching(false);
    }
  }

  function handleSaved() {
    if (selectedVideo) {
      setSavedIds((prev) => new Set([...prev, selectedVideo.id]));
    }
    setSelectedVideo(null);
  }

  return (
    <div className='max-w-3xl mx-auto p-6'>
      <h1 className='text-3xl font-bold text-white mb-6'>YouTube動画検索</h1>

      <form onSubmit={handleSearch} className='flex gap-3 mb-8'>
        <Input
          type='text'
          placeholder='アーティスト名・曲名・YouTube URLで検索...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className='flex-1 bg-slate-800 text-white border-slate-600 focus:border-cyan-500 placeholder:text-slate-400'
        />
        <Button
          type='submit'
          disabled={isSearching || !query.trim()}
          className='bg-cyan-500 hover:bg-cyan-600'
        >
          {isSearching ? "検索中..." : "検索"}
        </Button>
      </form>

      <div className="text-sm text-gray-400 mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <p className="font-semibold mb-2">検索のヒント:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>アーティスト名と曲名で検索（例: YOASOBI アイドル）</li>
          <li>YouTube動画URLを直接入力（例: https://www.youtube.com/watch?v=VIDEO_ID）</li>
          <li>動画IDを直接入力（例: dQw4w9WgXcQ）</li>
        </ul>
      </div>

      {error && <p className='text-gray-400 text-center mb-6'>{error}</p>}

      <div className='space-y-3'>
        {results.map((video) => (
          <div key={video.id} className='relative'>
            <VideoSearchResult
              video={video}
              onSave={() => setSelectedVideo(video)}
            />
            {savedIds.has(video.id) && (
              <Badge className='absolute top-2 right-2 bg-green-800 text-green-300 hover:bg-green-800'>
                保存済み
              </Badge>
            )}
          </div>
        ))}
      </div>

      {selectedVideo && (
        <SaveIntroDialog
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
