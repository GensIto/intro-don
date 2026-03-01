import { useState } from "react";
import type { YouTubeVideo } from "@/lib/youtube";
import { saveIntroFn } from "@/server/youtube";

interface Props {
  video: YouTubeVideo;
  onClose: () => void;
  onSaved: () => void;
}

export function SaveIntroDialog({ video, onClose, onSaved }: Props) {
  const [artistName, setArtistName] = useState("");
  const [trackName, setTrackName] = useState(video.title);
  const [startSec, setStartSec] = useState(0);
  const [chorusSec, setChorusSec] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const thumbnail = video.thumbnails.medium?.url ?? video.thumbnails.default?.url;

  async function handleSave() {
    if (!artistName.trim()) {
      setError("アーティスト名を入力してください。");
      return;
    }

    if (!trackName.trim()) {
      setError("曲名を入力してください。");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await saveIntroFn({
        data: {
          youtubeVideoId: video.id,
          artistName: artistName.trim(),
          trackName: trackName.trim(),
          imageUrl: video.thumbnails.high?.url || thumbnail || "",
          youtubeUrl: `https://www.youtube.com/watch?v=${video.id}`,
          startMs: Math.round(startSec * 1000),
          chorusMs: Math.round(chorusSec * 1000),
        },
      });
      onSaved();
    } catch {
      setError("保存に失敗しました。もう一度お試しください。");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl border border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">楽曲情報を入力</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-3">
          {thumbnail && (
            <img
              src={thumbnail}
              alt={video.title}
              className="w-24 h-14 rounded-lg object-cover flex-shrink-0"
            />
          )}
          <div className="min-w-0">
            <p className="text-white font-medium truncate text-sm">{video.title}</p>
            <p className="text-gray-400 text-xs truncate">{video.channelTitle}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-gray-300 text-sm block mb-1">
              アーティスト名 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="例: YOASOBI"
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm block mb-1">
              曲名 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={trackName}
              onChange={(e) => setTrackName(e.target.value)}
              placeholder="例: アイドル"
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm block mb-2">
              開始位置 (Start):{" "}
              <span className="text-cyan-400 font-mono">
                {startSec.toFixed(1)}秒
              </span>
            </label>
            <input
              type="number"
              min={0}
              step={0.1}
              value={startSec}
              onChange={(e) => setStartSec(Math.max(0, Number(e.target.value)))}
              placeholder="例: 0"
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-cyan-500"
            />
            <p className="text-gray-500 text-xs mt-1">
              イントロの開始位置を秒で指定してください
            </p>
          </div>

          <div>
            <label className="text-gray-300 text-sm block mb-2">
              サビ位置 (Chorus):{" "}
              <span className="text-cyan-400 font-mono">
                {chorusSec.toFixed(1)}秒
              </span>
            </label>
            <input
              type="number"
              min={0}
              step={0.1}
              value={chorusSec}
              onChange={(e) => setChorusSec(Math.max(0, Number(e.target.value)))}
              placeholder="例: 45"
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-cyan-500"
            />
            <p className="text-gray-500 text-xs mt-1">
              サビの開始位置を秒で指定してください
            </p>
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
          >
            {isSaving ? "保存中..." : "保存"}
          </button>
        </div>
      </div>
    </div>
  );
}
