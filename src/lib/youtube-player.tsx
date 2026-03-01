import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";

interface YouTubePlayerContextType {
  isReady: boolean;
  play: (videoId: string, startSeconds?: number) => Promise<void>;
  pause: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number) => void;
}

const YouTubePlayerContext = createContext<
  YouTubePlayerContextType | undefined
>(undefined);

export function useYouTubePlayer() {
  const context = useContext(YouTubePlayerContext);
  if (!context) {
    throw new Error(
      "useYouTubePlayer must be used within YouTubePlayerProvider"
    );
  }
  return context;
}

interface Props {
  children: ReactNode;
}

export function YouTubePlayerProvider({ children }: Props) {
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // YouTube IFrame APIスクリプトを読み込む
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // APIの準備ができたら呼び出される
    window.onYouTubeIframeAPIReady = () => {
      initializePlayer();
    };

    // 既にAPIが読み込まれている場合
    if (window.YT && window.YT.Player) {
      initializePlayer();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  function initializePlayer() {
    // 非表示のプレイヤーコンテナを作成
    if (!containerRef.current) {
      const div = document.createElement("div");
      div.id = "youtube-player-container";
      div.style.position = "fixed";
      div.style.top = "-9999px";
      div.style.left = "-9999px";
      document.body.appendChild(div);
      containerRef.current = div;
    }

    const player = new window.YT.Player("youtube-player-container", {
      height: "360",
      width: "640",
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        fs: 0,
        modestbranding: 1,
        playsinline: 1,
      },
      events: {
        onReady: () => {
          console.log("YouTube Player ready");
          setIsReady(true);
        },
        onError: (event) => {
          console.error("YouTube Player error:", event.data);
        },
      },
    });

    playerRef.current = player;
  }

  async function play(videoId: string, startSeconds: number = 0) {
    if (!playerRef.current || !isReady) {
      throw new Error("YouTube player not ready");
    }

    return new Promise<void>((resolve) => {
      const player = playerRef.current!;

      // 動画を読み込んで再生
      player.loadVideoById(videoId, startSeconds);

      // 再生が開始されるまで待つ
      const checkPlaying = setInterval(() => {
        const state = player.getPlayerState();
        if (state === window.YT.PlayerState.PLAYING) {
          clearInterval(checkPlaying);
          resolve();
        }
      }, 100);

      // タイムアウト（5秒）
      setTimeout(() => {
        clearInterval(checkPlaying);
        resolve();
      }, 5000);
    });
  }

  function pause() {
    if (playerRef.current && isReady) {
      playerRef.current.pauseVideo();
    }
  }

  function getCurrentTime(): number {
    if (!playerRef.current || !isReady) return 0;
    return playerRef.current.getCurrentTime();
  }

  function getDuration(): number {
    if (!playerRef.current || !isReady) return 0;
    return playerRef.current.getDuration();
  }

  function seekTo(seconds: number) {
    if (playerRef.current && isReady) {
      playerRef.current.seekTo(seconds, true);
    }
  }

  return (
    <YouTubePlayerContext.Provider
      value={{
        isReady,
        play,
        pause,
        getCurrentTime,
        getDuration,
        seekTo,
      }}
    >
      {children}
    </YouTubePlayerContext.Provider>
  );
}
