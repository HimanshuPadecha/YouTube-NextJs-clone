import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const reactionType = pgEnum("reaction_type", ["like", "dislike"]);


export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: text("clerk_id").unique().notNull(),
    name: text("name").notNull(),
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)]
);

export const subscriptions = pgTable("subscriptions",{
  viewerId:uuid("viewer_id").references(() => users.id,{ onDelete: "cascade"}).notNull(),
  createrId:uuid("creater_id").references(() => users.id,{ onDelete: "cascade"}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
},(t) => [
  primaryKey({
    name:"subscriptions_pk",
    columns:[t.viewerId,t.createrId]
  })
])

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("name_inx").on(t.name)]
);

export const videoVisibility = pgEnum("video_visibility", [
  "private",
  "public",
]);

export const videos = pgTable("videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  muxStatus: text("mux_status"),
  muxAssetId: text("mux_asset_id").unique(),
  muxUploadId: text("mux_upload_id").unique(),
  muxPlaybackId: text("mux_playback_id").unique(),
  muxTrackId: text("mux_track_id").unique(),
  muxTrackStatus: text("mux_track_status"),
  thumbnailUrl: text("thumbnail_url"),
  thumbnailKey: text("thumbnail_key"),
  visibility: videoVisibility("visibility").default("private").notNull(),
  previewUrl: text("preview_url"),
  previewKey: text("preview_key"),
  duration: integer("duration").notNull().default(0),
  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const videoInsterSchema = createInsertSchema(videos);
export const videoUpdateSchema = createUpdateSchema(videos);
export const videoSelectSchema = createUpdateSchema(videos);

export const comments = pgTable("comments",{
  id: uuid("id").primaryKey().defaultRandom(),
  videoId : uuid("video_id").references(() => videos.id , {onDelete : "cascade"}).notNull(),
  userId : uuid("user_id").references(() => users.id , {onDelete : "cascade"}).notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})


export const commentsInsertSchema = createInsertSchema(comments);
export const commentsUpdateSchema = createUpdateSchema(comments);
export const commentsSelectSchema = createUpdateSchema(comments);

export const commentsReactions = pgTable("comments_reactions", { 
  userId : uuid("user_id").references(() => users.id , {onDelete : "cascade"}).notNull(),
  commentId : uuid("comment_id").references(() => comments.id , {onDelete : "cascade"}).notNull(),
  type : reactionType("type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
},(t) => [
  primaryKey({
    columns: [t.commentId,t.userId],
    name:"comment_reactions_pk"
  })
])

export const videoViews = pgTable(
  "video_views",
  {
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    videoId: uuid("video_id")
      .references(() => videos.id, {
        onDelete: "cascade",
      })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      name: "video_views_pk",
      columns: [t.userId, t.videoId],
    }),
  ]
);

export const videoViewsSelectionSchema = createSelectSchema(videoViews);
export const videoViewsInsertSchema = createInsertSchema(videoViews);
export const videoViewsUpdateSchema = createUpdateSchema(videoViews);


export const videosReactions = pgTable(
  "videos_reactions",
  {
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    videoId: uuid("video_id")
      .references(() => videos.id, { onDelete: "cascade" })
      .notNull(),
    type: reactionType("type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      columns: [t.userId, t.videoId],
      name: "video_reactions_pk",
    }),
  ]
);

export const videoReactionsSelectSchema = createSelectSchema(videosReactions);
export const videoReactionsInsertSchema = createInsertSchema(videosReactions);
export const videoReactionsUpdateSchema = createUpdateSchema(videosReactions);
