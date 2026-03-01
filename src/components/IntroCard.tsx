import { useState } from "react";
import { deleteIntroFn } from "@/server/youtube";
import { useYouTubePlayer } from "@/lib/youtube-player";

interface Intro {
  id: string;
  artistName: string;
  trackName: string;
  imageUrl: string;
  youtubeUrl: string;
  startMs: number;
  chorusMs: number;
  youtubeVideoId: string;
}

interface Props {
  intro: Intro;
  onPlay: () => void;
  onStop: () => void;
  onDeleted: () => void;
}

export function IntroCard({ intro, onPlay, onStop, onDeleted }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const youtubePlayer = useYouTubePlayer();

  const startSec = intro.startMs / 1000;
  const chorusSec = intro.chorusMs / 1000;

  async function playFrom(ms: number) {
    if (!youtubePlayer.isReady) {
      console.error("YouTube player not ready");
      return;
    }

    try {
      await youtubePlayer.play(intro.youtubeVideoId, ms / 1000);
      setIsPlaying(true);
      onPlay();
    } catch (error) {
      console.error("YouTube playback error:", error);
    }
  }

  function pause() {
    if (youtubePlayer.isReady && isPlaying) {
      youtubePlayer.pause();
      setIsPlaying(false);
      onStop();
    }
  }

  async function handleDelete() {
    if (!confirm(`「${intro.trackName}」を削除しますか？`)) return;
    setIsDeleting(true);
    try {
      await deleteIntroFn({ data: intro.id });
      onDeleted();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className='bg-slate-800 rounded-xl p-4 border border-slate-700'>
      <div className='flex items-center gap-4 mb-4'>
        {intro.imageUrl ? (
          <img
            src={intro.imageUrl}
            alt={intro.trackName}
            className='w-16 h-16 rounded-lg object-cover flex-shrink-0'
          />
        ) : (
          <div className='w-16 h-16 rounded-lg flex-shrink-0 bg-slate-700 flex items-center justify-center text-slate-400 text-2xl'>
            ♪
          </div>
        )}
        <div className='flex-1 min-w-0'>
          <p className='text-white font-semibold truncate'>{intro.trackName}</p>
          <p className='text-gray-400 text-sm truncate'>{intro.artistName}</p>
          <p className='text-gray-500 text-xs mt-0.5'>
            Start: {startSec.toFixed(1)}秒 | Chorus: {chorusSec.toFixed(1)}秒
          </p>
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className='p-2 text-slate-500 hover:text-red-400 transition-colors disabled:opacity-50 flex-shrink-0'
          title='削除'
        >
          {isDeleting ? "..." : "🗑"}
        </button>
      </div>

      <div className='space-y-3'>
        {youtubePlayer.isReady && (
          <div className='flex items-center gap-2 text-xs text-green-400 bg-green-900/20 px-3 py-1.5 rounded-lg'>
            <span>✓ YouTube Player準備完了</span>
          </div>
        )}

        <div className='flex gap-2 flex-wrap'>
          <button
            onClick={() => playFrom(intro.startMs)}
            disabled={!youtubePlayer.isReady}
            className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50'
          >
            ▶ Start ({startSec.toFixed(1)}s)
          </button>
          <button
            onClick={() => playFrom(intro.chorusMs)}
            disabled={!youtubePlayer.isReady}
            className='px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50'
          >
            ▶ サビ ({chorusSec.toFixed(1)}s)
          </button>
          {isPlaying && (
            <button
              onClick={pause}
              disabled={!youtubePlayer.isReady}
              className='px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50'
            >
              ⏸ 停止
            </button>
          )}
          <a
            href={intro.youtubeUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors'
          >
            YouTubeで開く ↗
          </a>
        </div>
      </div>
    </div>
  );
}
