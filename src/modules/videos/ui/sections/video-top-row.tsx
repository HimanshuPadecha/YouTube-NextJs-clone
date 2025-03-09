import React, { useMemo } from 'react'

import { VideoGetOneOutput } from '../../types'
import VideoOwner from '../components/video-owner'
import { format , formatDistanceToNow } from "date-fns"
import VideoMenu from '../components/video-menu'
import VideoReactions from '../components/video-reactions'
import VideoDescription from '../components/video-description'

interface pageProps {
    video: VideoGetOneOutput
}

const VideoTopRow = ({ video }: pageProps) => {

    const compactViwes = useMemo(() => {
        return Intl.NumberFormat("en",{
            notation:"compact"
        }).format(video.viewCount)
    },[video.viewCount])

    const expandedViews = useMemo(() => {
        return Intl.NumberFormat("en",{
            notation:"standard"
        }).format(video.viewCount)
    },[video.viewCount])

    const compactDate = useMemo(() => {
        return formatDistanceToNow(video.createdAt , { addSuffix:true })
    } , [])

    const expandedDate = useMemo(() => {
        return format(video.createdAt , "d MMM yyyy")
    } , [])

    return (

        <div className='flex flex-col gap-4 mt-4'>
            <h1 className='text-xl font-semibold'>{video.title}</h1>
            <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
                <VideoOwner user={video.user} videoId={video.id} />
                <div className='flex overflow-x-auto sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible pb-2 -mb-2 sm:pb-0 sm:mb-0 gap-2'>
                    <VideoReactions dislikes={video.dislikeCount} viewerReaction={video.viewerReaction} likes={video.likeCount} videoId={video.id} />
                    <VideoMenu 
                    videoId={video.id}
                    varient='secondary'
                    />
                </div>
            </div>
            <VideoDescription
            compactViwes={compactViwes}
            expandedViews={expandedViews}
            compactDate={compactDate}
            expandedDate={expandedDate}
            description={video.description}
            />
        </div>

    )
}

export default VideoTopRow
