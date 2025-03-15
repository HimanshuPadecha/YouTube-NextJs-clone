import VideoView from '@/modules/videos/views/video-view'
import { HydrateClient, trpc } from '@/trpc/server'
import React from 'react'

export const dynamic = "force-dynamic"

interface pageProps {
  params: Promise<{ videoId: string }>
}

const Page = async ({ params }: pageProps) => {

  const { videoId } = await params

  void trpc.videos.getOne.prefetch({ videoId })
  void trpc.comments.getMany.prefetchInfinite({videoId, limit : 5})

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  )
}

export default Page
