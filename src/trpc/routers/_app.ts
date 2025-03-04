import { studioRouter } from '@/modules/studio/server/procedure';
import {  createTRPCRouter } from '../init';
import { categoriesRouter } from '@/modules/categories/server/procedure';
import { videosRouter } from '@/modules/videos/server/procedure';


export const appRouter = createTRPCRouter({
    categories:categoriesRouter,
    studio: studioRouter ,
    videos : videosRouter
});


// export type definition of API
export type AppRouter = typeof appRouter;