import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { and, desc, eq } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { auth } from "@/lib/auth";
import { searchYouTubeVideos } from "@/lib/youtube";
import { db } from "@/db";
import { intros } from "@/db/intros";

async function requireSession() {
  const request = getRequest();
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) throw new Error("Unauthorized");
  return session;
}

export const searchVideosFn = createServerFn({ method: "GET" })
  .inputValidator((query: string) => query)
  .handler(async ({ data: query }) => {
    await requireSession();
    console.log("YouTube API Key exists:", !!env.YOUTUBE_API_KEY);
    return await searchYouTubeVideos(
      query,
      env.YOUTUBE_API_KEY,
      10
    );
  });

export interface SaveIntroInput {
  youtubeVideoId: string;
  artistName: string;
  trackName: string;
  imageUrl: string;
  youtubeUrl: string;
  startMs: number;
  chorusMs: number;
}

export const saveIntroFn = createServerFn({ method: "POST" })
  .inputValidator((data: SaveIntroInput) => data)
  .handler(async ({ data }) => {
    const session = await requireSession();
    const id = crypto.randomUUID();
    await db.insert(intros).values({
      id,
      userId: session.user.id,
      youtubeVideoId: data.youtubeVideoId,
      artistName: data.artistName,
      trackName: data.trackName,
      imageUrl: data.imageUrl,
      youtubeUrl: data.youtubeUrl,
      startMs: data.startMs,
      chorusMs: data.chorusMs,
    });
    return { id };
  });

export const getIntrosFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await requireSession();
    return await db.query.intros.findMany({
      where: eq(intros.userId, session.user.id),
      orderBy: [desc(intros.createdAt)],
    });
  }
);

export const deleteIntroFn = createServerFn({ method: "POST" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const session = await requireSession();
    await db
      .delete(intros)
      .where(and(eq(intros.id, id), eq(intros.userId, session.user.id)));
    return { ok: true };
  });
