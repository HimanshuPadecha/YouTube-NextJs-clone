import React from 'react'

import { VideoGetOneOutput } from '../../types'
import { AlertTriangleIcon } from 'lucide-react'

interface pageProps {
    status: VideoGetOneOutput["muxStatus"]
}

const VideoBanner = ({ status }: pageProps) => {

    if(status === "ready") return null

    return (
        <div className='bg-yellow-500 py-3 px-4 rounded-b-xl flex items-center gap-2'>
            <AlertTriangleIcon  className='size-4 text-black shrink-0'/>
            <p className='text-sm md:text-sm font-medium text-balance line-clamp-1'>This video is still being processed</p>
        </div>
    )
}

export default VideoBanner
