import type { YouTubeVideo } from "@/lib/youtube";

interface Props {
  video: YouTubeVideo;
  onSave: () => void;
}

export function VideoSearchResult({ video, onSave }: Props) {
  const thumbnail = video.thumbnails.medium?.url ?? video.thumbnails.default?.url;

  return (
    <div className="flex items-center gap-4 bg-slate-800 rounded-xl p-4 hover:bg-slate-750 transition-colors border border-slate-700">
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
      <button
        onClick={onSave}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0"
      >
        保存
      </button>
    </div>
  );
}
