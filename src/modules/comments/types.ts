import { inferRouterOutputs } from "@trpc/server";

import { AppRouter } from "@/trpc/routers/_app";

export type commentsGetManyOutput = 
    inferRouterOutputs<AppRouter>["comments"]["getMany"]