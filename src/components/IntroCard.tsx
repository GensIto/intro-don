import { useState } from "react";
import { deleteIntroFn } from "@/server/youtube";
import { useYouTubePlayer } from "@/lib/youtube-player";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Loader2 } from "lucide-react";

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
  const [loadingType, setLoadingType] = useState<'start' | 'chorus' | null>(null);
  const youtubePlayer = useYouTubePlayer();

  const startSec = intro.startMs / 1000;
  const chorusSec = intro.chorusMs / 1000;

  async function playFrom(ms: number, type: 'start' | 'chorus') {
    if (!youtubePlayer.isReady) {
      console.error("YouTube player not ready");
      return;
    }

    setLoadingType(type);
    try {
      await youtubePlayer.play(intro.youtubeVideoId, ms / 1000);
      setIsPlaying(true);
      onPlay();
    } catch (error) {
      console.error("YouTube playback error:", error);
    } finally {
      setLoadingType(null);
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
    <Card className='bg-slate-800 border-slate-700'>
      <CardContent className='p-4'>
        <div className='flex items-center gap-4 mb-4'>
          {intro.imageUrl ? (
            <img
              src={intro.imageUrl}
              alt={intro.trackName}
              className='w-16 h-16 rounded-lg object-cover shrink-0'
            />
          ) : (
            <div className='w-16 h-16 rounded-lg shrink-0 bg-slate-700 flex items-center justify-center text-slate-400 text-2xl'>
              ♪
            </div>
          )}
          <div className='flex-1 min-w-0'>
            <p className='text-white font-semibold truncate'>
              {intro.trackName}
            </p>
            <p className='text-gray-400 text-sm truncate'>{intro.artistName}</p>
            <p className='text-gray-500 text-xs mt-0.5'>
              Start: {startSec.toFixed(1)}秒 | Chorus: {chorusSec.toFixed(1)}秒
            </p>
          </div>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            variant='ghost'
            size='icon'
            className='shrink-0 text-slate-500 hover:text-red-400'
            title='削除'
          >
            {isDeleting ? "..." : <Trash2 className='h-5 w-5' />}
          </Button>
        </div>

        <div className='space-y-3'>
          {youtubePlayer.isReady && (
            <Badge
              variant='outline'
              className='bg-green-900/20 text-green-400 border-green-800'
            >
              ✓ YouTube Player準備完了
            </Badge>
          )}

          <div className='flex gap-2 flex-wrap'>
            <Button
              onClick={() => playFrom(intro.startMs, 'start')}
              disabled={!youtubePlayer.isReady || loadingType !== null}
              size='sm'
              className='bg-blue-600 hover:bg-blue-700'
            >
              {loadingType === 'start' ? (
                <>
                  <Loader2 className='h-4 w-4 mr-1 animate-spin' />
                  読み込み中...
                </>
              ) : (
                `▶ Start (${startSec.toFixed(1)}s)`
              )}
            </Button>
            <Button
              onClick={() => playFrom(intro.chorusMs, 'chorus')}
              disabled={!youtubePlayer.isReady || loadingType !== null}
              size='sm'
              className='bg-cyan-600 hover:bg-cyan-700'
            >
              {loadingType === 'chorus' ? (
                <>
                  <Loader2 className='h-4 w-4 mr-1 animate-spin' />
                  読み込み中...
                </>
              ) : (
                `▶ サビ (${chorusSec.toFixed(1)}s)`
              )}
            </Button>
            {isPlaying && (
              <Button
                onClick={pause}
                disabled={!youtubePlayer.isReady}
                variant='outline'
                size='sm'
              >
                ⏸ 停止
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
