import { studioRouter } from "@/modules/studio/server/procedure";
import { createTRPCRouter } from "../init";
import { categoriesRouter } from "@/modules/categories/server/procedure";
import { videosRouter } from "@/modules/videos/server/procedure";
import { videoViewsRouter } from "@/modules/video-views/server/procedures";
import { videoReactionsRouter } from "@/modules/videos-reactions/server/procedures";
import { subscriptionsRouter } from "@/modules/subscription/server/procedures";
import { commentsRouter } from "@/modules/comments/server/procedures";
import { commentoReactionsRouter } from "@/modules/comments-reaction/server/procedures";

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  studio: studioRouter,
  videos: videosRouter,
  videoViews : videoViewsRouter,
  videoReactions : videoReactionsRouter,
  subscription : subscriptionsRouter,
  comments : commentsRouter,
  commentReaction : commentoReactionsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
