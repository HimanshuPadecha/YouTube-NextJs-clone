import { cn } from '@/lib/utils'
import {  ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import React, { useState } from 'react'


interface pageProps {
    compactViwes: string
    expandedViews: string
    expandedDate: string
    compactDate: string
    description?: string | null
}


const VideoDescription = ({
    compactDate,
    compactViwes,
    expandedDate,
    expandedViews,
    description
}: pageProps) => {

    const [isExpended, setIsExpended] = useState(false)
    return (
        <div
            onClick={() => setIsExpended(!isExpended)}
            className='bg-secondary/50 rounded-xl p-3 cursor-pointer hover:bg-secondary/70 transition'
        >
            <div className='flex gap-2 text-sm mb-2 '>
                <span className='font-medium'>
                    {isExpended ? expandedViews : compactViwes} views
                </span>
                <span className='font-medium'>
                    {isExpended ? expandedDate : compactDate}
                </span>
            </div>
            <div className='relative'>
                <p className={cn("text-sm whitespace-pre-wrap", isExpended && "line-clamp-2")}>
                    {description || "No Description"}
                </p>
                <div className='flex items-center gap-1 mt-4 font-medium text-sm '>
                    {isExpended ?
                        (<>
                            Show less <ChevronUpIcon className='size-4'/>
                        </>)
                        :
                        (<>
                            Show more <ChevronDownIcon className="size-4" />
                        </>)
                    }
                </div>
            </div>
        </div>
    )
}

export default VideoDescription
