import type { YouTubeVideo } from "@/lib/youtube";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  video: YouTubeVideo;
  onSave: () => void;
}

export function VideoSearchResult({ video, onSave }: Props) {
  const thumbnail = video.thumbnails.medium?.url ?? video.thumbnails.default?.url;

  return (
    <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
      <CardContent className="flex items-center gap-4 p-4">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={video.title}
            className="w-24 h-14 rounded-lg flex-shrink-0 object-cover"
          />
        ) : (
          <div className="w-24 h-14 rounded-lg flex-shrink-0 bg-slate-700 flex items-center justify-center text-slate-500">
            ♪
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium truncate">{video.title}</p>
          <p className="text-gray-400 text-sm truncate">{video.channelTitle}</p>
        </div>
        <Button
          onClick={onSave}
          className="bg-green-600 hover:bg-green-700 flex-shrink-0"
          size="sm"
        >
          保存
        </Button>
      </CardContent>
    </Card>
  );
}
