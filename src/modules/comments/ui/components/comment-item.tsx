"use client"

import React from 'react'
import { commentsGetManyOutput } from '../../types'
import Link from 'next/link'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { trpc } from '@/trpc/client'
import { Button } from '@/components/ui/button'
import { MessageSquareIcon, MoreVerticalIcon, Trash2Icon, TrashIcon } from 'lucide-react'
import { useAuth, useClerk } from '@clerk/nextjs'
import {toast} from "sonner"

interface pageProps {
  comment: commentsGetManyOutput["items"][number]
}

const CommentItem = ({ comment }: pageProps) => {

  const utils = trpc.useUtils()
  const clerk = useClerk()

  const { userId: clerkId } = useAuth()

  const remove = trpc.comments.remove.useMutation({
    onSuccess:() =>{
      toast.success("comment deleted")
      utils.comments.getMany.invalidate({ videoId : comment.videoId})
    },
    onError: (error) => {
      toast.error("Something went wrong")

      if(error.data?.code === "UNAUTHORIZED"){
        clerk.openSignIn()
      }
    }
  })

  return (
    <div>
      <div className='flex gap-4'>
        <Link href={`/users/${comment.userId}`}>
          <Avatar>
            <AvatarImage src={comment.user.imageUrl} />
          </Avatar>
        </Link>
        <div className='flex-1 min-h-0'>
          <Link href={`/users/${comment.userId}`}>
            <div className='flex items-center gap-2 mb-0.5'>
              <span className='font-medium text-sm pb-0.5'>
                {comment.user.name}
              </span>
              <span className='text-xs text-muted-foreground '>
                {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
              </span>
            </div>
          </Link>
          <p className='text-sm'>{comment.value}</p>
        </div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => { }}>
              <MessageSquareIcon className='size-4' />
              Reply
            </DropdownMenuItem>
            {comment.user.clerkId === clerkId && <DropdownMenuItem onClick={() => remove.mutate({commentId : comment.id})}>
              <Trash2Icon className='size-4' />
              Delete
            </DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default CommentItem
