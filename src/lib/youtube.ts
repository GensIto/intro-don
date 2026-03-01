export interface YouTubeVideo {
  id: string;
  title: string;
  channelTitle: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
  };
}

/**
 * YouTube動画IDをURLから抽出
 * 対応フォーマット:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - VIDEO_ID (直接ID)
 */
export function extractVideoId(input: string): string | null {
  if (!input) return null;

  // URLの場合は抽出を試みる
  try {
    const url = new URL(input);

    // youtube.com形式
    if (url.hostname.includes("youtube.com")) {
      return url.searchParams.get("v");
    }

    // youtu.be形式
    if (url.hostname === "youtu.be") {
      return url.pathname.slice(1);
    }
  } catch {
    // URLでない場合は、そのまま返す（動画IDの可能性）
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
      return input;
    }
  }

  return null;
}

/**
 * YouTube Data API v3で動画を検索
 */
export async function searchYouTubeVideos(
  query: string,
  apiKey: string,
  maxResults: number = 10,
): Promise<YouTubeVideo[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  // クエリがURLまたは動画IDの場合は、動画情報を直接取得
  const videoId = extractVideoId(query.trim());
  if (videoId) {
    return await getVideoById(videoId, apiKey);
  }

  // 検索APIを使用
  const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
  searchUrl.searchParams.set("part", "snippet");
  searchUrl.searchParams.set("q", query.trim());
  searchUrl.searchParams.set("type", "video");
  searchUrl.searchParams.set("videoCategoryId", "10"); // 音楽カテゴリ
  searchUrl.searchParams.set("maxResults", maxResults.toString());
  searchUrl.searchParams.set("key", apiKey);

  console.log("YouTube search query:", query);
  console.log("YouTube search URL:", searchUrl.toString());

  const resp = await fetch(searchUrl.toString());

  if (!resp.ok) {
    const errorBody = await resp.text();
    console.error("YouTube search error:", resp.status, errorBody);
    throw new Error(`YouTube search failed: ${resp.status} - ${errorBody}`);
  }

  const data = (await resp.json()) as any;
  console.log("YouTube search results:", data.items?.length || 0, "videos");

  return (data.items || []).map((item: any) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    channelTitle: item.snippet.channelTitle,
    thumbnails: item.snippet.thumbnails,
  }));
}

/**
 * 動画IDから動画情報を取得
 */
async function getVideoById(
  videoId: string,
  apiKey: string,
): Promise<YouTubeVideo[]> {
  const videoUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
  videoUrl.searchParams.set("part", "snippet");
  videoUrl.searchParams.set("id", videoId);
  videoUrl.searchParams.set("key", apiKey);

  const resp = await fetch(videoUrl.toString());

  if (!resp.ok) {
    const errorBody = await resp.text();
    console.error("YouTube video fetch error:", resp.status, errorBody);
    throw new Error(
      `YouTube video fetch failed: ${resp.status} - ${errorBody}`,
    );
  }

  const data = (await resp.json()) as any;

  if (!data.items || data.items.length === 0) {
    return [];
  }

  return data.items.map((item: any) => ({
    id: item.id,
    title: item.snippet.title,
    channelTitle: item.snippet.channelTitle,
    thumbnails: item.snippet.thumbnails,
  }));
}
