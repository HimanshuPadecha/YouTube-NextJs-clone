import React from 'react'
import VideoSection from '../sections/video-section'

const StudioView = () => {
    
  return (
    <div className='flex flex-col gap-y-6 pt-2.5'>
      <div className='px-4'>
      <h1 className='text-2xl font-bold'>Channel Content</h1>
      <p className='text-xs text-muted-foreground'>Manage Your channel content and Videos</p>
      </div>
      <VideoSection />
    </div>
  )
}

export default StudioView
