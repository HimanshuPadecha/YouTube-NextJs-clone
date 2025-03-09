"use client"
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { trpc } from '@/trpc/client'
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'
import { VideoGetOneOutput } from '../../types'
import { useClerk } from '@clerk/nextjs'

interface VideoReactionsProps {
  likes: VideoGetOneOutput["likeCount"],
  dislikes: VideoGetOneOutput["dislikeCount"]
  videoId: VideoGetOneOutput["id"]
  viewerReaction: VideoGetOneOutput["viewerReaction"]
}

const VideoReactions = ({ likes, dislikes, videoId, viewerReaction }: VideoReactionsProps) => {

  const utils = trpc.useUtils()

  const clerk = useClerk()

  const createLike = trpc.videoReactions.like.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ videoId })
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn()
      }
      toast.error(error.message)
      console.log(error);
    }
  })

  const createDislike = trpc.videoReactions.dislike.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ videoId })
    },
    onError: (error) => {

      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn()
      }
      toast.error("something went wrong")
    }
  })


  return (
    <div className='flex text-center flex-none '>
      <Button className='rounded-l-full rounded-r-none pr-4' disabled={createLike.isPending || createDislike.isPending} variant={"secondary"} onClick={() => createLike.mutate({ videoId })}>
        <ThumbsUpIcon className={cn("size-5", viewerReaction === "like" && "fill-black")} />
        {likes}
      </Button>
      <Separator orientation='vertical' className='h-7' />
      <Button className='rounded-l-none rounded-r-full pl-3' disabled={createLike.isPending || createDislike.isPending} variant={"secondary"} onClick={() => createDislike.mutate({ videoId })}>
        <ThumbsDownIcon className={cn("size-5", viewerReaction === "dislike" && "fill-black")} />
        {dislikes}
      </Button>
    </div>
  )
}

export default VideoReactions
