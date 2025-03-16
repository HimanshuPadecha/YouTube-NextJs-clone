import { db } from "@/db";
import {  commentsReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const commentoReactionsRouter = createTRPCRouter({
  like: protectedProcedure
    .input(
      z.object({
        commentId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { commentId } = input;

      const [existingCommentReaction] = await db
        .select()
        .from(commentsReactions)
        .where(
          and(
            eq(commentsReactions.commentId, commentId),
            eq(commentsReactions.userId, userId),
            eq(commentsReactions.type, "like")
          )
        );

      
      if (existingCommentReaction) {
        const [deletedLike] = await db
          .delete(commentsReactions)
          .where(
            and(
              eq(commentsReactions.commentId, commentId),
              eq(commentsReactions.userId, userId),
              eq(commentsReactions.type, "like")
            )
          )
          .returning();

        return deletedLike;
      }

      const [createdLike] = await db
        .insert(commentsReactions)
        .values({
          userId,
          commentId,
          type: "like",
        })
        .onConflictDoUpdate({
            target:[commentsReactions.userId,commentsReactions.commentId],
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
        commentId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { commentId } = input;

      const [existingCommentoReaction] = await db
        .select()
        .from(commentsReactions)
        .where(
          and(
            eq(commentsReactions.userId, userId),
            eq(commentsReactions.commentId, commentId),
            eq(commentsReactions.type, "dislike")
          )
        );


      if (existingCommentoReaction) {
        const [deletedDislike] = await db
          .delete(commentsReactions)
          .where(
            and(
              eq(commentsReactions.userId, userId),
              eq(commentsReactions.commentId, commentId),
              eq(commentsReactions.type, "dislike")
            )
          )
          .returning();

        return deletedDislike;
      }

      const [createdDislike] = await db
        .insert(commentsReactions)
        .values({
          commentId,
          userId,
          type: "dislike",
        })
        .onConflictDoUpdate({
            target: [commentsReactions.userId,commentsReactions.commentId],
            set : { type : "dislike"}
        })
        .returning();

      return createdDislike;
    }),
});
