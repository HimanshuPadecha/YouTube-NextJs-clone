import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { ListPlus, MoreVerticalIcon, ShareIcon, TrashIcon } from 'lucide-react'
import { toast } from 'sonner'

interface pageProps {
  videoId: string
  varient?: "ghost" | "secondary"
  onRemove?: () => void
}

const VideoMenu = ({
  onRemove,
  videoId,
  varient
}: pageProps) => {

  const onShare = () => {
    const fullUrl = `${process.env.VERCEL_URL || "http:localhost:3000"}/videos/${videoId}`

    navigator.clipboard.writeText(fullUrl)
    toast.success("Link copied to clipboard")
  }


  return (

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={varient} size={"icon"} className='rounded-full'>
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={onShare} >
          <ShareIcon className='mr-2 size-4'/>
          share
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}} >
          <ListPlus className='mr-2 size-4'/>
          Add to playlist
        </DropdownMenuItem>
        {onRemove && (
          <DropdownMenuItem onClick={() => {}} >
          <TrashIcon className='mr-2 size-4'/>
          Remove
        </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default VideoMenu
