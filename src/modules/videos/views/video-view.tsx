import React from 'react'
import VideoSection from '../ui/sections/video-section'
import SuggestionsSection from '../ui/sections/suggestions-section'
import CommentSection from '../ui/sections/comment-section'

interface pageProps {
    videoId: string
}

const VideoView = ({ videoId }: pageProps) => {
    return (
        <div className='flex flex-col max-w-[1700px] mx-auto pt-2.5 mb-10'>
            <div className='flex flex-col xl:flex-row gap-6'>
                <div className='flex-1 min-w-0'>
                    <VideoSection videoId={videoId} />
                    <div className='xl:hidden block mt-4'>
                        <SuggestionsSection />
                    </div>
                    <CommentSection videoId={videoId} />
                </div>
                <div className='hidden xl:block w-full xl:w-[380px] 2xl:w-[480px] shrink-1'>
                    <SuggestionsSection />
                </div>
            </div>
        </div>
    )
}

export default VideoView
