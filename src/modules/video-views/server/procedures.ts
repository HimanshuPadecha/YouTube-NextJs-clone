import { db } from "@/db";
import { videos, videoViews } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const videoViewsRouter = createTRPCRouter({
    create : protectedProcedure
        .input(
            z.object({
                videoId : z.string().uuid()
            })
        ).mutation(async ({ ctx,input }) => {

            const { id : userId } = ctx.user
            const { videoId } = input

            const [existingVideoView] = await db
                .select()
                .from(videoViews)
                .where(and(
                    eq(videoViews.videoId,videoId),
                    eq(videoViews.userId,userId)
                ))
             
            if(existingVideoView){
                return existingVideoView
            }
            
            const [createdVideoView] = await db
                .insert(videoViews)
                .values({
                    userId,
                    videoId
                }).returning()

            if(!createdVideoView){
                throw new TRPCError({code :"INTERNAL_SERVER_ERROR"})
            }

            return createdVideoView
        })
})


