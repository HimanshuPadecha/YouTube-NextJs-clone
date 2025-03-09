"use client"
import { trpc } from '@/trpc/client'
import { ErrorBoundary } from 'react-error-boundary'
import React, { Suspense } from 'react'
import { cn } from '@/lib/utils'
import VideoPlayer from '../components/video-player'
import VideoBanner from './video-banner'
import VideoTopRow from './video-top-row'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'

interface pageProps {
    videoId: string
}


const VideoSection = ({ videoId }: pageProps) => {

    const {isSignedIn} = useAuth()
    const utils = trpc.useUtils()
    const [video] = trpc.videos.getOne.useSuspenseQuery({ videoId })
    const createView = trpc.videoViews.create.useMutation({
        onSuccess:() => {
            utils.videos.getOne.invalidate({videoId})
        },
        onError:(error) =>{
            toast.error(error.message)
            console.log(error);
            
        }
    })

    const handlePlay = () =>{
        if(!isSignedIn) return

        console.log("handlePlay:");
        
        createView.mutate({ videoId })
    }

    return (
        <Suspense fallback={<p>Loading ... </p>}>
            <ErrorBoundary fallback={<p>Error ... </p>}>

                <div className={cn("aspect-video bg-black rounded-xl overflow-hidden relative", video.muxStatus !== "ready" && "rounded-b-none")}>
                    <VideoPlayer 
                    onPlay={handlePlay}
                    playbackId={video.muxPlaybackId}
                    thumbnailUrl={video.thumbnailUrl}
                    />
                </div>
                <VideoBanner status={video.muxStatus} />
                <VideoTopRow video={video} />

            </ErrorBoundary>
        </Suspense>
    )
}

export default VideoSection
