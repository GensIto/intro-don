CREATE TABLE `intros` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`youtube_video_id` text NOT NULL,
	`artist_name` text NOT NULL,
	`track_name` text NOT NULL,
	`image_url` text NOT NULL,
	`youtube_url` text NOT NULL,
	`start_ms` integer DEFAULT 0 NOT NULL,
	`chorus_ms` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `intros_user_id_idx` ON `intros` (`user_id`);--> statement-breakpoint
CREATE INDEX `intros_youtube_video_id_idx` ON `intros` (`youtube_video_id`);