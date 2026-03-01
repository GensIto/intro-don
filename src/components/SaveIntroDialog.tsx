import { useState } from "react";
import type { YouTubeVideo } from "@/lib/youtube";
import { saveIntroFn } from "@/server/youtube";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>楽曲情報を入力</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3 py-3">
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

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="artistName" className="text-gray-300">
              アーティスト名 <span className="text-red-400">*</span>
            </Label>
            <Input
              id="artistName"
              type="text"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="例: YOASOBI"
              className="bg-slate-700 border-slate-600 text-white focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trackName" className="text-gray-300">
              曲名 <span className="text-red-400">*</span>
            </Label>
            <Input
              id="trackName"
              type="text"
              value={trackName}
              onChange={(e) => setTrackName(e.target.value)}
              placeholder="例: アイドル"
              className="bg-slate-700 border-slate-600 text-white focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startSec" className="text-gray-300">
              開始位置 (Start):{" "}
              <span className="text-cyan-400 font-mono">
                {startSec.toFixed(1)}秒
              </span>
            </Label>
            <Input
              id="startSec"
              type="number"
              min={0}
              step={0.1}
              value={startSec}
              onChange={(e) => setStartSec(Math.max(0, Number(e.target.value)))}
              placeholder="例: 0"
              className="bg-slate-700 border-slate-600 text-white focus:border-cyan-500"
            />
            <p className="text-gray-500 text-xs">
              イントロの開始位置を秒で指定してください
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chorusSec" className="text-gray-300">
              サビ位置 (Chorus):{" "}
              <span className="text-cyan-400 font-mono">
                {chorusSec.toFixed(1)}秒
              </span>
            </Label>
            <Input
              id="chorusSec"
              type="number"
              min={0}
              step={0.1}
              value={chorusSec}
              onChange={(e) => setChorusSec(Math.max(0, Number(e.target.value)))}
              placeholder="例: 45"
              className="bg-slate-700 border-slate-600 text-white focus:border-cyan-500"
            />
            <p className="text-gray-500 text-xs">
              サビの開始位置を秒で指定してください
            </p>
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <DialogFooter className="gap-2">
          <Button
            onClick={onClose}
            variant="secondary"
            className="bg-slate-700 hover:bg-slate-600"
          >
            キャンセル
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-cyan-500 hover:bg-cyan-600"
          >
            {isSaving ? "保存中..." : "保存"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
