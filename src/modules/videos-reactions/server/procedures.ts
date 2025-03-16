import { db } from "@/db";
import {  videosReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq, or } from "drizzle-orm";
import { z } from "zod";

export const videoReactionsRouter = createTRPCRouter({
  like: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { videoId } = input;

      const [existingVideoReaction] = await db
        .select()
        .from(videosReactions)
        .where(
          and(
            eq(videosReactions.videoId, videoId),
            eq(videosReactions.userId, userId),
            eq(videosReactions.type, "like")
          )
        );

      
      if (existingVideoReaction) {
        const [deletedLike] = await db
          .delete(videosReactions)
          .where(
            and(
              eq(videosReactions.videoId, videoId),
              eq(videosReactions.userId, userId),
              eq(videosReactions.type, "like")
            )
          )
          .returning();

        return deletedLike;
      }

      const [createdLike] = await db
        .insert(videosReactions)
        .values({
          userId,
          videoId,
          type: "like",
        })
        .onConflictDoUpdate({
            target:[videosReactions.userId,videosReactions.videoId],
            set:{ type : "like"}
        })
        .returning();

      if (!createdLike) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return createdLike;
    }),
  dislike: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { videoId } = input;

      const [existingVideoReaction] = await db
        .select()
        .from(videosReactions)
        .where(
          and(
            eq(videosReactions.userId, userId),
            eq(videosReactions.videoId, videoId),
            eq(videosReactions.type, "dislike")
          )
        );


      if (existingVideoReaction) {
        const [deletedDislike] = await db
          .delete(videosReactions)
          .where(
            and(
              eq(videosReactions.userId, userId),
              eq(videosReactions.videoId, videoId),
              eq(videosReactions.type, "dislike")
            )
          )
          .returning();

        return deletedDislike;
      }

      const [createdDislike] = await db
        .insert(videosReactions)
        .values({
          videoId,
          userId,
          type: "dislike",
        })
        .onConflictDoUpdate({
            target: [videosReactions.userId,videosReactions.videoId],
            set : { type : "dislike"}
        })
        .returning();

      return createdDislike;
    }),
});
