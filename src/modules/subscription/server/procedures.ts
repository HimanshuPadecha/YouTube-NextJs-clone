import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq, or } from "drizzle-orm";
import { z } from "zod";

export const subscriptionsRouter = createTRPCRouter({
    create : protectedProcedure
        .input(
            z.object({
                userId : z.string().uuid()
            })
        ).mutation(async ({ ctx , input}) => {
            const {userId} = input

            if(userId === ctx.user.id){
                throw new TRPCError({code:"BAD_REQUEST"})
            }

            const [createdSubscription] = await db
                .insert(subscriptions)
                .values({
                    viewerId : ctx.user.id,
                    createrId : userId
                }).returning()

            return createdSubscription
        }),
        remove : protectedProcedure
        .input(
            z.object({
                userId : z.string().uuid()
            })
        ).mutation(async ({ ctx , input}) => {
            const {userId} = input

            if(userId === ctx.user.id){
                throw new TRPCError({code:"BAD_REQUEST"})
            }

            const [deletedSubscription] = await db
                .delete(subscriptions)
                .where(
                    and(
                        eq(subscriptions.viewerId,ctx.user.id),
                        eq(subscriptions.createrId,userId)
                    )
                ).returning()

            return deletedSubscription
        })

})