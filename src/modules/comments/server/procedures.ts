import { db } from "@/db";
import { comments, commentsReactions, users } from "@/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  inArray,
  lt,
  or,
} from "drizzle-orm";
import { z } from "zod";

export const commentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        value: z.string(),
        videoId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { value, videoId } = input;

      const [createdComment] = await db
        .insert(comments)
        .values({
          videoId,
          userId,
          value,
        })
        .returning();

      return createdComment;
    }),
  remove: protectedProcedure
    .input(
      z.object({
        commentId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { commentId } = input;

      const [deletedComment] = await db
        .delete(comments)
        .where(and(eq(comments.id, commentId), eq(comments.userId, userId)))
        .returning();

      if (!deletedComment) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return deletedComment;
    }),
  getMany: baseProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input, ctx }) => {
      const { videoId, cursor, limit } = input;

      const { clerkUserId } = ctx;

      let userId;

      const [user] = await db
        .select()
        .from(users)
        .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []));

      if (user) {
        userId = user.id;
      }

      const viewerReactions = db.$with("viewer_reactions").as(
        db
          .select({
            type: commentsReactions.type,
            commentId: commentsReactions.commentId,
          })
          .from(commentsReactions)
          .where(inArray(commentsReactions.userId, userId ? [userId] : []))
      );

      const [totalComments, fetchedComments] = await Promise.all([
        db
          .select({ count: count() })
          .from(comments)
          .where(eq(comments.videoId, videoId)),
        db
          .with(viewerReactions)
          .select({
            ...getTableColumns(comments),
            user: users,
            likeCount: db.$count(
              commentsReactions,
              and(
                eq(commentsReactions.type, "like"),
                eq(commentsReactions.commentId, comments.id)
              )
            ),
            dislikeCount: db.$count(
              commentsReactions,
              and(
                eq(commentsReactions.type, "dislike"),
                eq(commentsReactions.commentId, comments.id)
              )
            ),
            viewerReaction: viewerReactions.type,
          })
          .from(comments)
          .where(
            and(
              eq(comments.videoId, videoId),
              cursor
                ? or(
                    lt(comments.updatedAt, cursor.updatedAt),
                    and(
                      eq(comments.updatedAt, cursor.updatedAt),
                      lt(comments.id, cursor.id)
                    )
                  )
                : undefined
            )
          )
          .innerJoin(users, eq(comments.userId, users.id))
          .leftJoin(viewerReactions, eq(viewerReactions.commentId, comments.id))
          .orderBy(desc(comments.updatedAt), desc(comments.id))
          .limit(limit + 1),
      ]);

      const hasMore = fetchedComments.length > limit;

      const items = hasMore ? fetchedComments.slice(0, -1) : fetchedComments;

      const lastItem = items[items.length - 1];

      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
          }
        : null;

      return { items, nextCursor, totalComments: totalComments[0].count };
    }),
});
