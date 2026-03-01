import { user } from "@/db/schema";
import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text, index } from "drizzle-orm/sqlite-core";

export const intros = sqliteTable(
  "intros",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    youtubeVideoId: text("youtube_video_id").notNull(),
    artistName: text("artist_name").notNull(),
    trackName: text("track_name").notNull(),
    imageUrl: text("image_url").notNull(),
    youtubeUrl: text("youtube_url").notNull(),
    startMs: integer("start_ms").notNull().default(0),
    chorusMs: integer("chorus_ms").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("intros_user_id_idx").on(table.userId),
    index("intros_youtube_video_id_idx").on(table.youtubeVideoId),
  ]
);

export const introsRelations = relations(intros, ({ one }) => ({
  user: one(user, {
    fields: [intros.userId],
    references: [user.id],
  }),
}));
