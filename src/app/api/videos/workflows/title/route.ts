import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";
import { model } from "@/lib/gemini";

interface InputType {
  userId: string;
  videoId: string;
}

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;

  const { videoId, userId } = input;

  const video = await context.run("get-video", async () => {
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!existingVideo) {
      throw new Error("NO video found");
    }

    return existingVideo;
  });

  const transcript = await context.run("get-transcript",async () => {
    const url = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`

    const response = await fetch(url)

    const text =  response.text()

    if(!text){
        throw new Error("bad request")
    }

    return text
  })

  const generatedTitle = await context.run("generate-title",async () => {

    const prompt = `Generate a concise and compelling title for the following transcript. Return ONLY the title, with no additional text or explanations.
    
    Transcript: ${transcript}`

    const result = await model.generateContent(prompt)

    const title =  result.response.text()

    if(!title){
        throw new Error("Internal server error")
    }

    return title
  })


  const updatedVideo = await context.run("change-title", async () => {
    const [updatedVideo] = await db
      .update(videos)
      .set({
        title : generatedTitle || video.title
      })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)))
      .returning();

    return updatedVideo;
  });

  console.log(updatedVideo);
});
