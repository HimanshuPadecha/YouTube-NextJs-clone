import { formateDuration } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

interface VideoThumbnailProps{
  imageUrl? : string | null
  previewUrl? :string | null
  title:string
  duration:number
}

const VideoThumbnail = ({
  imageUrl,
  previewUrl,
  title,
  duration
}:VideoThumbnailProps) => {
  return (
    <div className='relative group'>
      <div className='relative w-full overflow-hidden aspect-video rounded-xl'>
        <Image 
        src={imageUrl ?? "/placeholder.svg"}
        alt='thumbnail'
        fill
        className='w-full h-full object-cover group-hover:opacity-0'
        />
        <Image 
        src={previewUrl ?? "/placeholder.svg"}
        alt='thumbnail'
        fill
        className='w-full h-full object-cover opacity-0 group-hover:opacity-100'
        />
      </div>

      <div className='absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium'>
      {formateDuration(duration)}
      </div>
    </div>
  )
}

export default VideoThumbnail
